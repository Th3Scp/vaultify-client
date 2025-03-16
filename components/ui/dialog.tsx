import { Dialog, DialogPanel } from "@headlessui/react";
import { FontContext } from "../fontSw";
import { ReactNode, useContext } from "react";
export default function MyDialog({
  children,
  isOpen,
  setIsOpen,
  leftBtns,
  rightBtns,
  title,
  disabled,
}: {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  leftBtns?: ReactNode;
  rightBtns?: ReactNode;
  title?: ReactNode;
  disabled?: boolean;
}) {
  const { font } = useContext(FontContext);
  return (
    <Dialog
      open={isOpen}
      onClose={
        disabled === undefined || disabled === false
          ? () => setIsOpen(false)
          : () => {}
      }
      className={`relative z-50 transiton-all ${disabled === true && "pointer-events-none"}`}
    >
      <div
        className={`fixed inset-0 flex w-screen items-center justify-center p-4 ${font}`}
      >
        <DialogPanel className="w-[700px] bg-neutral-200/50 h-[90vh] lg:h-[400px] backdrop-blur-xl rounded-3xl dark:bg-black/50 border-2 border-white/5 overflow-hidden">
          {disabled === true && <>
          <div className="absolute z-50 h-3 bg-red-600"></div>
          </>}
          {title ? (
            <>
              <div className="h-10 mid border-b border-white/20 relative">
                <div className="absolute left-0 top-0 h-full flex items-center">
                  {leftBtns}
                </div>
                <div className="absolute right-0 top-0 h-full flex">
                  {rightBtns}
                </div>
                <div className="flex mb-1">
                  <div className="text-xl">{title}</div>
                </div>
              </div>
              <div className="lg:h-[360px] h-[calc(90vh-40px)] relative overflow-y-scroll">
                {children}
              </div>
            </>
          ) : (
            <div className="h-full relative overflow-y-scroll">{children}</div>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
