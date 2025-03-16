import React, { useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  placeholder?: "top" | "bottom";
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placeholder = "top",
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  return (
    <div
      className="relative mid"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {visible && (
        <div
          className={`bg-gray-500 before-border-colored z-[99999999] whitespace-nowrap text-white mid px-2
           dark:bg-neutral-950 border-2 border-white border-opacity-10 rounded-2xl absolute ani-scale 
            before:w-3 before:h-3 before:bg-neutral-800 before:rounded before:rotate-45 before:absolute
             before:border-2 before:border-white before:border-opacity-20 h-10 ${
               placeholder === "top"
                 ? "-top-12 before:bottom-[-6px]"
                 : "-bottom-12 before:top-[-6px]"
             }`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
