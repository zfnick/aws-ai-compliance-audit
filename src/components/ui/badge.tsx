import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#5C4632] text-white hover:bg-[#463322]",
        secondary: "border-transparent bg-[#e0d9d2] text-[#5C4632] hover:bg-[#d4cdc3]",
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline: "text-[#5C4632] border-[#e0d9d2]",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600",
        critical: "border-transparent bg-red-500 text-white hover:bg-red-600",
        muted: "border-transparent bg-[#f5f2ed] text-[#5C4632]/70 hover:bg-[#ede8e0]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };