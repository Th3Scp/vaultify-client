import { useContext, useEffect, useRef, useState } from "react";
import { AppContext, Note as NoteType } from "../context";
import { Button } from "../ui/button";
import MyDialog from "../ui/dialog";
import { AddSvg, CloseSvg, TrashSvg } from "../svg/main";
import { Textarea } from "@headlessui/react";
import clsx from "clsx";

export function NoteEdit({
  id,
  close,
}: {
  id: number | undefined;
  close: () => void;
}) {
  const { notes, changeNotes, setMainDialogData } = useContext(AppContext);

  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<NoteType>();

  const textRef = useRef<HTMLTextAreaElement>(null);

  const closeHandler = () => {
    const time = new Date().getTime();
    changeNotes([
      ...notes().filter((g: NoteType) => g.id !== id),
      {
        ...item,
        updated: time,
        text: textRef.current!.value,
      },
    ]);
    setOpen(false);
    close();
  };
  const openHandler = () => {
    setOpen(true);
  };

  const removeHandler = () => {
    setMainDialogData({
      open: true,
      onClose: () => {},
      onConfirm: () => {
        changeNotes(notes().filter((g: NoteType) => g.id !== id));
        close();
        setOpen(false);
      },
      title: "حذف یادداشت",
      children: (
        <>
          <div className="text-3xl">آیا مطمئن هستید؟</div>
        </>
      ),
    });
  };
  useEffect(() => {
    if (id) {
      setItem(notes().filter((g: NoteType) => g.id === id)[0]);
      setOpen(true);
    }
  }, [id]);

  return (
    <>
      <MyDialog isOpen={open} setIsOpen={(e) => closeHandler()}>
        <div className="h-10 mid border-b border-white/20 relative">
          <button onClick={closeHandler} className="absolute left-3 opacity-75">
            <CloseSvg />
          </button>
          <div className="flex mb-1">
            <div className="text-xl">یادداشت</div>
          </div>
          <button
            onClick={removeHandler}
            className="bg-zinc-700/20 h-full px-4 group absolute right-0 top-0"
          >
            <div className="group-hover:rotate-6 transition-all text-yellow-600">
              <TrashSvg />
            </div>
          </button>
        </div>
        {item && (
          <Textarea
            defaultValue={item.text}
            ref={textRef}
            placeholder="نوشتن ..."
            className={clsx(
              "block w-full resize-none rounded-b-3xl border-none bg-white/5 py-1.5 px-3 text-sm/6 text-black dark:text-white h-[360px]",
              "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
            )}
            rows={3}
          />
        )}
      </MyDialog>
    </>
  );
}
export function NoteCreate() {
  const { changeNotes, notes } = useContext(AppContext);

  const [open, setOpen] = useState(false);

  const textRef = useRef<HTMLTextAreaElement>(null);

  const closeHandler = () => {
    const time = new Date().getTime();
    changeNotes([
      ...notes(),
      {
        id: time,
        updated: time,
        text: textRef.current!.value,
      },
    ]);
    setOpen(false);
  };

  const openHandler = () => {
    setOpen(true);
  };

  return (
    <>
      <Button onClick={openHandler}>
        <div className="colored">
          <AddSvg />
        </div>
      </Button>

      <MyDialog isOpen={open} setIsOpen={(e) => closeHandler()}>
        <div className="h-10 mid border-b border-white/20 relative">
          <button onClick={closeHandler} className="absolute left-3 opacity-75">
            <CloseSvg />
          </button>
          <div className="flex mb-1">
            <div className="text-xl">یادداشت</div>
          </div>
        </div>
        <Textarea
          ref={textRef}
          placeholder="نوشتن ..."
          className={clsx(
            "block w-full resize-none rounded-b-3xl border-none bg-white/5 py-1.5 px-3 text-sm/6 text-black dark:text-white h-[360px]",
            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
          )}
          rows={3}
        />
      </MyDialog>
    </>
  );
}
