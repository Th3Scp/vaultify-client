import { CSSProperties, ReactNode } from "react";

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
