"use client";
import { useContext } from "react";
import MyDialog from "../ui/dialog";
import { AppContext } from "../context";
import { Button } from "../ui/button";

export default function MainDialog() {
  const { mainDialogData, setMainDialogData } = useContext(AppContext)!;
  const closeDialogHandler = () => {
    mainDialogData.onClose();
    setMainDialogData({ open: false });
  };
  const confirmHandler = () => {
    mainDialogData.onConfirm();
    setMainDialogData({ open: false });
  };
  return (
    <MyDialog
      isOpen={mainDialogData.open}
      setIsOpen={(e) => closeDialogHandler}
    >
      {mainDialogData.open !== false && (
        <>
          <div className="h-10 mid border-b border-white/20 relative">
            <div className="text-xl">{mainDialogData.title}</div>
          </div>
          <div className="mid-c pb-16 h-full">
            {mainDialogData.children}
            <div className="mid mt-4">
              <Button onClick={confirmHandler} className="ms-1 w-24">
                تایید
              </Button>
              <Button
                onClick={closeDialogHandler}
                className="bg-red-600/10 text-red-600 w-24"
              >
                لفو
              </Button>
            </div>
          </div>
        </>
      )}
    </MyDialog>
  );
}
