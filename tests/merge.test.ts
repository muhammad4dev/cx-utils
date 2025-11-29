import { describe, it, expect } from "vitest";
import { mergeCx } from "../src/merge";

describe("mergeCx()", () => {
  describe("basic merging", () => {
    it("should combine non-conflicting classes", () => {
      expect(mergeCx("foo", "bar")).toBe("foo bar");
    });

    it("should work like cx() for non-Tailwind classes", () => {
      expect(mergeCx("custom-class", { active: true, disabled: false })).toBe(
        "custom-class active"
      );
    });
  });

  describe("padding conflicts", () => {
    it("should resolve px conflicts", () => {
      expect(mergeCx("px-4", "px-6")).toBe("px-6");
    });

    it("should resolve py conflicts", () => {
      expect(mergeCx("py-2", "py-4")).toBe("py-4");
    });

    it("should resolve p conflicts", () => {
      expect(mergeCx("p-4", "p-6")).toBe("p-6");
    });

    it("should keep non-conflicting padding", () => {
      expect(mergeCx("px-4 py-2", "px-6")).toBe("px-6 py-2");
    });

    it("should handle pt, pr, pb, pl", () => {
      expect(mergeCx("pt-4 pr-2", "pt-6")).toBe("pt-6 pr-2");
    });
  });

  describe("margin conflicts", () => {
    it("should resolve mx conflicts", () => {
      expect(mergeCx("mx-4", "mx-auto")).toBe("mx-auto");
    });

    it("should resolve negative margins", () => {
      expect(mergeCx("-mx-4", "-mx-6")).toBe("-mx-6");
    });

    it("should keep non-conflicting margins", () => {
      expect(mergeCx("mx-4 my-2", "mx-6")).toBe("mx-6 my-2");
    });
  });

  describe("sizing conflicts", () => {
    it("should resolve width conflicts", () => {
      expect(mergeCx("w-full", "w-1/2")).toBe("w-1/2");
    });

    it("should resolve height conflicts", () => {
      expect(mergeCx("h-screen", "h-full")).toBe("h-full");
    });

    it("should resolve min/max width", () => {
      expect(mergeCx("min-w-0", "min-w-full")).toBe("min-w-full");
      expect(mergeCx("max-w-sm", "max-w-lg")).toBe("max-w-lg");
    });

    it("should resolve size conflicts (v4)", () => {
      expect(mergeCx("size-4", "size-8")).toBe("size-8");
      expect(mergeCx("w-4 h-4", "size-8")).toBe("w-4 h-4 size-8");
    });

    it("should resolve inset conflicts (v4)", () => {
      expect(mergeCx("inset-0", "inset-4")).toBe("inset-4");
    });

    it("should resolve positioning conflicts", () => {
      expect(mergeCx("top-0", "top-4")).toBe("top-4");
      expect(mergeCx("left-0", "left-4")).toBe("left-4");
    });
  });

  describe("typography conflicts", () => {
    it("should resolve font size conflicts", () => {
      expect(mergeCx("text-sm", "text-lg")).toBe("text-lg");
    });

    it("should resolve font weight conflicts", () => {
      expect(mergeCx("font-normal", "font-bold")).toBe("font-bold");
    });

    it("should resolve text alignment conflicts", () => {
      expect(mergeCx("text-left", "text-center")).toBe("text-center");
    });

    it("should keep non-conflicting text classes", () => {
      expect(mergeCx("text-sm text-blue-500", "text-lg")).toBe(
        "text-lg text-blue-500"
      );
    });
  });

  describe("background conflicts", () => {
    it("should resolve background color conflicts", () => {
      expect(mergeCx("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });

    it("should resolve background size conflicts", () => {
      expect(mergeCx("bg-cover", "bg-contain")).toBe("bg-contain");
    });
  });

  describe("border conflicts", () => {
    it("should resolve border width conflicts", () => {
      expect(mergeCx("border", "border-2")).toBe("border-2");
    });

    it("should resolve border radius conflicts", () => {
      expect(mergeCx("rounded", "rounded-lg")).toBe("rounded-lg");
    });

    it("should keep non-conflicting border classes", () => {
      expect(mergeCx("border-2 border-red-500", "border-4")).toBe(
        "border-4 border-red-500"
      );
    });
  });

  describe("responsive variants", () => {
    it("should handle responsive padding", () => {
      expect(mergeCx("px-4", "md:px-6")).toBe("px-4 md:px-6");
    });

    it("should resolve conflicts within same breakpoint", () => {
      expect(mergeCx("md:px-4", "md:px-6")).toBe("md:px-6");
    });

    it("should handle multiple breakpoints", () => {
      expect(mergeCx("px-4 md:px-6", "lg:px-8")).toBe("px-4 md:px-6 lg:px-8");
    });

    it("should resolve conflicts in responsive text sizes", () => {
      expect(mergeCx("text-sm md:text-base", "md:text-lg")).toBe(
        "text-sm md:text-lg"
      );
    });
  });

  describe("state variants", () => {
    it("should handle hover variants", () => {
      expect(mergeCx("hover:bg-red-500", "hover:bg-blue-500")).toBe(
        "hover:bg-blue-500"
      );
    });

    it("should handle focus variants", () => {
      expect(mergeCx("focus:ring-2", "focus:ring-4")).toBe("focus:ring-4");
    });

    it("should handle ring width conflicts", () => {
      expect(mergeCx("ring", "ring-2")).toBe("ring-2");
      expect(mergeCx("ring-2", "ring-4")).toBe("ring-4");
    });

    it("should handle ring color conflicts", () => {
      expect(mergeCx("ring-blue-500", "ring-red-500")).toBe("ring-red-500");
    });

    it("should keep non-conflicting ring classes", () => {
      expect(mergeCx("ring-2 ring-blue-500", "ring-4")).toBe(
        "ring-4 ring-blue-500"
      );
    });

    it("should handle ring offset", () => {
      expect(mergeCx("ring-offset-2", "ring-offset-4")).toBe("ring-offset-4");
      expect(mergeCx("ring-offset-blue-500", "ring-offset-red-500")).toBe(
        "ring-offset-red-500"
      );
    });

    it("should keep different state variants", () => {
      expect(mergeCx("hover:bg-red-500", "focus:bg-blue-500")).toBe(
        "hover:bg-red-500 focus:bg-blue-500"
      );
    });
  });

  describe("complex scenarios", () => {
    it("should handle multiple conflicts", () => {
      expect(mergeCx("px-4 py-2 text-sm", "px-6 text-lg")).toBe(
        "px-6 py-2 text-lg"
      );
    });

    it("should work with arrays and objects", () => {
      expect(mergeCx(["px-4", "py-2"], { "px-6": true })).toBe("px-6 py-2");
    });

    it("should handle real-world button example", () => {
      const base = "px-4 py-2 bg-blue-500 text-white rounded";
      const override = "px-6 py-3 bg-red-500";
      expect(mergeCx(base, override)).toBe(
        "px-6 py-3 bg-red-500 text-white rounded"
      );
    });

    it("should preserve custom classes", () => {
      expect(mergeCx("custom-class px-4", "px-6 another-custom")).toBe(
        "px-6 custom-class another-custom"
      );
    });
  });

  describe("edge cases", () => {
    it("should handle empty input", () => {
      expect(mergeCx()).toBe("");
    });

    it("should handle single class", () => {
      expect(mergeCx("px-4")).toBe("px-4");
    });

    it("should handle falsy values", () => {
      expect(mergeCx("px-4", false, null, "px-6")).toBe("px-6");
    });

    it('should handle arbitrary values "later value wins" ', () => {
      expect(mergeCx("px-[10px]", "px-[20px]")).toBe("px-[20px]");
    });

    it("should handle classes with trailing colon", () => {
      expect(mergeCx("hover:")).toBe("hover:");
    });
  });
});
