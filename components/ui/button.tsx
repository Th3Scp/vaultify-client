import { cn } from "@/lib/utils";
import React, { CSSProperties, MouseEvent, ReactNode, useEffect, useState } from "react";

export const Button = ({
  children,
  onClick,
  disabled = false,
  className = "",
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={style}
    className={`p-2 rounded-xl bg-slate-500/10 transition-all text-gray-700 dark:text-gray-500 relative hover:scale-90 mx-1 border-2 ${
      !disabled
        ? "active:scale-[0.8] dark:hover:text-gray-200 hover:text-gray-900 hover:bg-slate-500/30 border-white/0"
        : "border-red-600/20"
    } ${className}`}
  >
    {children}
  </button>
);

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, icon, ...props }, ref) => {
  return (
    <button
    dir="ltr"
      ref={ref}
      className={cn(
        "group relative w-full cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-6 text-center font-semibold dark:bg-gray-800 dark:border-gray-700",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary transition-all duration-300 group-hover:scale-[100.8] dark:bg-colored"></div>
        <div className="w-full mid">
          <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 dark:text-gray-100">
            {children}
          </span>
        </div>
      </div>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-primary-foreground opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100 dark:text-gray-100">
        <span>{children}</span>
        {icon}
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";

