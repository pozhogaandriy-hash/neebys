/**
 * cn — lightweight class-name merger.
 *
 * Filters falsy values and joins the rest with a space, matching the
 * shadcn/ui `cn` contract (clsx + tailwind-merge) for simple cases.
 * No external packages required — clsx and tailwind-merge are not in
 * this project's dependency tree.
 */
export function cn(...inputs: (string | undefined | null | false | 0)[]): string {
  return inputs.filter(Boolean).join(' ');
}
