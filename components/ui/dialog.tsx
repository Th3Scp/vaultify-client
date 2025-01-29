import { Dialog, DialogPanel } from "@headlessui/react";
import { FontContext } from "../fontSw"; 
import { ReactNode, useContext } from "react";
export default function MyDialog({
  children,
  isOpen,
  setIsOpen,
}: {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { font } = useContext(FontContext);
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div
        className={`fixed inset-0 flex w-screen items-center justify-center p-4 ${font}`}
      >
        <DialogPanel className="w-[700px] bg-neutral-200/50 h-[400px] backdrop-blur-xl rounded-3xl dark:bg-black/50 border-2 border-white/5 overflow-hidden">
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
