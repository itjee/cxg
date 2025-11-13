import * as React from "react";
import { cn } from "@/lib/utils";

const ButtonGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("inline-flex rounded-lg shadow-sm", className)}
      role="group"
      {...props}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;

        // Type assertion for child props
        const childElement = child as React.ReactElement<{ className?: string }>;

        return React.cloneElement(childElement, {
          className: cn(
            childElement.props.className,
            // Remove individual rounded corners
            "rounded-none",
            // Add border radius to first and last elements
            isFirst && "rounded-l-lg",
            isLast && "rounded-r-lg",
            // Remove double borders between buttons
            !isLast && "border-r-0"
          ),
        });
      })}
    </div>
  );
});

ButtonGroup.displayName = "ButtonGroup";

export { ButtonGroup };
