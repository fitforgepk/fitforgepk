import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Returns the garment fit label for known products based on their name.
// Handles extra suffixes like size in parentheses, trailing spaces, and case.
export function getFitLabelByName(productName: string): string | null {
  if (!productName) return null;

  const baseName = productName
    .replace(/\s*\(.*?\)\s*$/, "")
    .trim()
    .toLowerCase();

  if (
    baseName === "breath of sea" ||
    baseName === "the blacksmith" ||
    baseName === "blacksmith"
  ) {
    return "Regular Fit";
  }

  if (baseName === "afterlight") {
    return "Crop Top";
  }

  if (baseName === "varsity grace") {
    return "Drop Shoulder";
  }

  if (
    baseName === "city eighty" ||
    baseName.includes("vision void") ||
    baseName === "visions" // fallback in case of shorthand
  ) {
    return "Oversized Tee";
  }

  return null;
}
