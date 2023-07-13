import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const ieCardVariants = cva("", {
  variants: {
    variant:{
      default: "rounded-2xl border bg-card text-card-foreground",
      table: "rounded-lg border bg-card text-card-foreground",
      large: "rounded-2xl border bg-card text-card-foreground",
      test: "rounded-2xl  border-red-200 border-2 bg-red-50 p-6 my-4 text-card-foreground",
    },
    shadow: {
      out: "shadow-lg",
      in: "shadow-inner",
      none: "shadow-none",
      empty: ""
    }
  },
  defaultVariants: {
    variant: "default",
    shadow: "out"
  },
});

export interface IeCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ieCardVariants> {}

const IeCard = React.forwardRef<HTMLDivElement, IeCardProps>(
  ({ className, variant, shadow, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(ieCardVariants({ variant, shadow, className }))}
      {...props}
    />
  )
);
IeCard.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(" flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  ieCardVariants,
  IeCard,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
