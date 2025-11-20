import { Bench } from 'tinybench';
import classNames from 'classnames';
import clsx from 'clsx';
import { cx } from '../src/cx';
import { mergeCx } from '../src/merge';

const bench = new Bench({ time: 1000 });

console.log('🚀 Running benchmarks...\n');

// Scenario 1: Simple strings
bench.add('cx - simple strings', () => {
    cx('foo', 'bar', 'baz');
});

bench.add('clsx - simple strings', () => {
    clsx('foo', 'bar', 'baz');
});

bench.add('classnames - simple strings', () => {
    classNames('foo', 'bar', 'baz');
});

// Scenario 2: Objects
bench.add('cx - objects', () => {
    cx({ foo: true, bar: false, baz: true, qux: false });
});

bench.add('clsx - objects', () => {
    clsx({ foo: true, bar: false, baz: true, qux: false });
});

bench.add('classnames - objects', () => {
    classNames({ foo: true, bar: false, baz: true, qux: false });
});

// Scenario 3: Arrays
bench.add('cx - arrays', () => {
    cx(['foo', 'bar', ['baz', 'qux']]);
});

bench.add('clsx - arrays', () => {
    clsx(['foo', 'bar', ['baz', 'qux']]);
});

bench.add('classnames - arrays', () => {
    classNames(['foo', 'bar', ['baz', 'qux']]);
});

// Scenario 4: Mixed inputs
bench.add('cx - mixed', () => {
    cx('base', ['foo', { bar: true, baz: false }], 'end');
});

bench.add('clsx - mixed', () => {
    clsx('base', ['foo', { bar: true, baz: false }], 'end');
});

bench.add('classnames - mixed', () => {
    classNames('base', ['foo', { bar: true, baz: false }], 'end');
});

// Scenario 5: React component pattern
bench.add('cx - React pattern', () => {
    const isActive = true;
    const size = 'large';
    cx('button', 'button-primary', {
        'button-active': isActive,
        'button-large': size === 'large',
        'button-small': size === 'small',
    });
});

bench.add('clsx - React pattern', () => {
    const isActive = true;
    const size = 'large';
    clsx('button', 'button-primary', {
        'button-active': isActive,
        'button-large': size === 'large',
        'button-small': size === 'small',
    });
});

bench.add('classnames - React pattern', () => {
    const isActive = true;
    const size = 'large';
    classNames('button', 'button-primary', {
        'button-active': isActive,
        'button-large': size === 'large',
        'button-small': size === 'small',
    });
});

// Scenario 6: Tailwind merge (unique to cx-utils)
bench.add('mergeCx - Tailwind merge', () => {
    mergeCx('px-4 py-2 text-sm', 'px-6 text-lg');
});

await bench.run();

console.log('\n📊 Benchmark Results:\n');

// Group results by scenario
const scenarios = [
    { name: 'Simple Strings', pattern: 'simple strings' },
    { name: 'Objects', pattern: 'objects' },
    { name: 'Arrays', pattern: 'arrays' },
    { name: 'Mixed Inputs', pattern: 'mixed' },
    { name: 'React Pattern', pattern: 'React pattern' },
];

for (const scenario of scenarios) {
    console.log(`\n${scenario.name}:`);
    console.log('─'.repeat(60));

    const results = bench.tasks
        .filter((task) => task.name.includes(scenario.pattern))
        .sort((a, b) => (b.result?.hz || 0) - (a.result?.hz || 0));

    for (const task of results) {
        const opsPerSec = task.result?.hz?.toLocaleString('en-US', {
            maximumFractionDigits: 0,
        });
        const margin = task.result?.rme?.toFixed(2);
        console.log(`  ${task.name.padEnd(35)} ${opsPerSec} ops/sec ±${margin}%`);
    }
}

// Tailwind merge (unique feature)
console.log('\n\nTailwind Merge (unique to @cx-utils/core):');
console.log('─'.repeat(60));
const mergeTask = bench.tasks.find((task) => task.name.includes('Tailwind merge'));
if (mergeTask?.result) {
    const opsPerSec = mergeTask.result.hz?.toLocaleString('en-US', {
        maximumFractionDigits: 0,
    });
    const margin = mergeTask.result.rme?.toFixed(2);
    console.log(`  ${mergeTask.name.padEnd(35)} ${opsPerSec} ops/sec ±${margin}%`);
}

// Summary
console.log('\n\n📈 Summary:');
console.log('─'.repeat(60));

const cxAvg =
    bench.tasks
        .filter((task) => task.name.startsWith('cx -'))
        .reduce((sum, task) => sum + (task.result?.hz || 0), 0) /
    bench.tasks.filter((task) => task.name.startsWith('cx -')).length;

const clsxAvg =
    bench.tasks
        .filter((task) => task.name.startsWith('clsx -'))
        .reduce((sum, task) => sum + (task.result?.hz || 0), 0) /
    bench.tasks.filter((task) => task.name.startsWith('clsx -')).length;

const classNamesAvg =
    bench.tasks
        .filter((task) => task.name.startsWith('classnames -'))
        .reduce((sum, task) => sum + (task.result?.hz || 0), 0) /
    bench.tasks.filter((task) => task.name.startsWith('classnames -')).length;

console.log(`  @cx-utils/core avg:  ${cxAvg.toLocaleString('en-US', { maximumFractionDigits: 0 })} ops/sec`);
console.log(`  clsx avg:            ${clsxAvg.toLocaleString('en-US', { maximumFractionDigits: 0 })} ops/sec`);
console.log(`  classnames avg:      ${classNamesAvg.toLocaleString('en-US', { maximumFractionDigits: 0 })} ops/sec`);

const vsClsx = ((cxAvg / clsxAvg - 1) * 100).toFixed(1);
const vsClassNames = ((cxAvg / classNamesAvg - 1) * 100).toFixed(1);

console.log(`\n  @cx-utils/core is ${vsClsx}% ${Number(vsClsx) >= 0 ? 'faster' : 'slower'} than clsx`);
console.log(`  @cx-utils/core is ${vsClassNames}% ${Number(vsClassNames) >= 0 ? 'faster' : 'slower'} than classnames`);

console.log('\n✨ Unique features of @cx-utils/core:');
console.log('  • Tailwind CSS merge support (mergeCx)');
console.log('  • Variant composition (composeClasses)');
console.log('  • Strong TypeScript generics (no any)');
console.log('  • Tree-shakable ESM + CJS builds\n');
