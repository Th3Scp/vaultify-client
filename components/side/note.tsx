"use client";
import { useContext, useMemo, useState } from "react";
import { NoteSvg } from "../svg/main";
import { AppContext, Note as NoteType } from "../context";
import moment from "jalali-moment";
import { NoteCreate, NoteEdit } from "../dialog/note";
import EmptySvg from "../svg/empty";

export default function Note() {
  const { notes, reload } = useContext(AppContext);

  const [show, setShow] = useState<number | undefined>();

  const showHandler = (id: number) => {
    setShow(id);
  };

  const items = useMemo(() => {
    return notes().length !== 0 ? (
      notes().map((e: NoteType, i: number) => (
        <div className="xl:w-6/12 lg:w-full md:w-6/12 w-full p-1" key={i}>
          <button
            onClick={() => showHandler(e.id)}
            className="dark:bg-neutral-950/50 bg-white/20 pwshh rounded-xl w-full h-52 transition-all p-2 relative overflow-hidden flex flex-col"
          >
            <div className="opacity-80 w-full mid">
              {moment(e.updated).locale("fa").format("HH:mm:ss")}
              <div className="ms-auto">
                {moment(e.updated).locale("fa").format("jYYYY/jMM/jDD")}
              </div>
            </div>
            <div className="mt-2 opacity-40">{e.text.slice(0, 220)}</div>
          </button>
        </div>
      ))
    ) : (
      <div className="w-full h-full mid">
        <div className="w-56">
          <EmptySvg />
        </div>
      </div>
    );
  }, [reload]);

  return (
    <>
      <NoteEdit id={show} close={() => setShow(undefined)} />
      <div className="w-full h-full rounded-xl border-4 border-white/[1%] bg-slate-500/5 overflow-hidden relative">
        <div className="w-full h-10 bg-gray-200 dark:bg-neutral-950 border-b-2 border-white/[1%] mid font-bold letter-1">
          <div className="opacity-80 mid">
            <div className="me-1 colored">
              <NoteSvg />
            </div>
            یادداشت ها
          </div>
        </div>
        <div className="p-2 h-full overflow-y-scroll pb-28 no-scroller row">
          {items}
        </div>
        <div className="absolute bottom-4 right-4 z-50">
          <NoteCreate />
        </div>
      </div>
    </>
  );
}
