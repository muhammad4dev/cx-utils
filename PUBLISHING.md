# Publishing to npm

## Manual Publishing (First Time)

### 1. Create npm Account
1. Go to https://www.npmjs.com/signup
2. Create an account
3. Verify your email

### 2. Login to npm
```bash
npm login
```
Enter your username, password, and email.

### 3. Check Package Name Availability
```bash
npm search @cx-utils/core
```

If the name is taken, you'll need to change it in `package.json`.

### 4. Prepare for Publishing
```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build

# Check what will be published
npm pack --dry-run
```

### 5. Publish
```bash
# For scoped packages, you need to make it public
npm publish --access public
```

### 6. Verify
```bash
npm view @cx-utils/core
```

---

## Automated Publishing with GitHub Actions

### Step 1: Get npm Token

1. Login to https://npmjs.com
2. Click your profile → **Access Tokens**
3. Click **Generate New Token** → **Classic Token**
4. Select **Automation** type
5. Copy the token (starts with `npm_...`)

### Step 2: Add Token to GitHub

1. Go to your GitHub repository
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm token
6. Click **Add secret**

### Step 3: Create GitHub Workflow

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Publish to npm
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Step 4: Create a Release

#### Option A: Via GitHub UI
1. Go to your repository on GitHub
2. Click **Releases** → **Create a new release**
3. Click **Choose a tag** → Type `v1.0.0` → **Create new tag**
4. Title: `v1.0.0`
5. Description: Release notes
6. Click **Publish release**

#### Option B: Via Command Line
```bash
# Create and push a tag
git tag v1.0.0
git push origin v1.0.0

# Then create release on GitHub UI
```

The GitHub Action will automatically:
- ✅ Run tests
- ✅ Build the package
- ✅ Publish to npm

---

## Advanced: Automated Version Bumping

### Create `.github/workflows/version-bump.yml`:

```yaml
name: Version Bump

on:
  push:
    branches:
      - main
    paths:
      - 'src/**'
      - 'package.json'

jobs:
  bump-version:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Configure Git
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
      
      - name: Bump version
        run: npm version patch -m "chore: bump version to %s"
      
      - name: Push changes
        run: git push --follow-tags
```

---

## Best Practices

### 1. Use Semantic Versioning
- **Patch** (1.0.0 → 1.0.1): Bug fixes
- **Minor** (1.0.0 → 1.1.0): New features (backward compatible)
- **Major** (1.0.0 → 2.0.0): Breaking changes

```bash
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
```

### 2. Add .npmignore
Already created, but ensure it excludes:
```
tests/
benchmarks/
examples/
.github/
*.test.ts
tsconfig.json
vitest.config.ts
```

### 3. Test Before Publishing
```bash
# Always run before publishing
npm run prepublishOnly
```

### 4. Use Beta/Alpha Releases
```bash
# Publish beta version
npm version prerelease --preid=beta
npm publish --tag beta

# Install beta version
npm install @cx-utils/core@beta
```

---

## Troubleshooting

### Error: Package name already taken
Change the name in `package.json` or use a scope:
```json
{
  "name": "@your-username/cx-utils"
}
```

### Error: 403 Forbidden
You need to publish scoped packages as public:
```bash
npm publish --access public
```

### Error: No permission to publish
Make sure you're logged in:
```bash
npm whoami
npm login
```

### GitHub Action fails
1. Check `NPM_TOKEN` is set correctly in GitHub Secrets
2. Ensure token has "Automation" permissions
3. Check workflow logs for specific errors

---

## Quick Reference

```bash
# First time setup
npm login
npm publish --access public

# Update and publish
npm version patch
git push --follow-tags
# Then create GitHub release (triggers auto-publish)

# Manual publish
npm run prepublishOnly
npm publish --access public
```

---

## Next Steps After Publishing

1. ✅ Add npm badge to README
2. ✅ Tweet about it / share on social media
3. ✅ Submit to awesome lists
4. ✅ Write a blog post
5. ✅ Monitor npm downloads: https://npmtrends.com/@cx-utils/core
