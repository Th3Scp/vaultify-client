import { cn } from "@/lib/utils";
import clsx from "clsx";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <input
      ref={ref}
        className={clsx(
          "mt-[1px] block w-full rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
          "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
          className
        )}
        {...props}
      />
    );
  }
);
