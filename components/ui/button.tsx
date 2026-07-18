import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white hover:bg-blue-700",

        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200",

        outline:
          "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",

        destructive:
          "bg-red-600 text-white hover:bg-red-700",

        ghost:
          "hover:bg-slate-100",

        link:
          "text-blue-600 underline-offset-4 hover:underline",
      },

      size: {
        default: "h-10 min-w-[88px] px-4",
        sm: "h-9 min-w-[72px] px-3",
        lg: "h-11 min-w-[104px] px-6",
        icon: "h-10 w-10 min-w-10",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {}

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({
          variant,
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };