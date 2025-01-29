"use client";
import { MouseEvent, useContext, useEffect, useState } from "react";
import { NewTask, TaskShow, TasksShow } from "../dialog/task";
import {
  Box,
  BoxChecked,
  BoxCheckedFilled,
  CaretTopSvg,
  ListCheckSvg,
} from "../svg/main";
import moment from "jalali-moment";
import { AppContext, Task as TaskType } from "../context";
import EmptySvg from "../svg/empty";
import getParameter from "../global/getParameter";
import { useRouter, useSearchParams } from "next/navigation";

export default function Task() {
  const { tasks, changeTasks, reload } = useContext(AppContext);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [items, setItems] = useState<TaskType[]>([]);
  const [show, setShow] = useState<number | undefined>();

  const getToday = () => moment().locale("fa").format("YYYY/M/D");

  const showHandler = (id: number) => {
    setShow(id);
  };

  const updateTasks = () => {
    let is: TaskType[] = [];
    tasks().forEach((e: TaskType) => {
      if (e.weekdays === false && e.dates === false) {
        is.push(e);
      } else {
        if (e.weekdays !== false && e.weekdays.includes(new Date().getDay())) {
          is.push(e);
        } else if (e.dates !== false) {
          const today = getToday().split("/");
          e.dates.forEach((g) => {
            if (
              g.day === Number(today[2]) &&
              g.month === Number(today[1]) &&
              g.year === Number(today[0])
            ) {
              is.push(e);
            }
          });
        }
      }
    });
    setItems(
      is.sort((a, b) => {
        const aChecked = isChecked(a);
        const bChecked = isChecked(b);

        if (!aChecked && bChecked) return -1;
        if (aChecked && !bChecked) return 1;
        return a.created - b.created;
      })
    );
  };

  const isChecked = (e: TaskType) => {
    return e.checked.includes(getToday());
  };

  const checkHandler = (e: TaskType, event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    if (isChecked(e)) {
      changeTasks([
        ...tasks().filter((g: TaskType) => g.id !== e.id),
        {
          ...e,
          checked: e.checked.filter((g) => g !== getToday()),
        },
      ]);
      updateTasks();
    } else {
      changeTasks([
        ...tasks().filter((g: TaskType) => g.id !== e.id),
        {
          ...e,
          checked: [e.checked, getToday()],
        },
      ]);
      updateTasks();
    }
  };

  useEffect(() => {
    updateTasks();
  }, [reload]);

  useEffect(() => {
    const q = getParameter("taskShow");
    if (q) {
      setShow(Number(q));
      router.push("/");
    }
  }, [searchParams]);

  return (
    <>
      <TaskShow id={show} setId={(e) => setShow(e)} />
      <div className="w-full h-full rounded-xl border-4 border-white/[1%] bg-slate-500/5 overflow-hidden relative">
        <div className="w-full h-10 dark:bg-neutral-950 bg-gray-200 border-b-2 border-white/[1%] mid font-bold letter-1">
          <div className="opacity-80 mid">
            <div className="me-1 colored">
              <ListCheckSvg />
            </div>
            تسک های امروز
          </div>
        </div>
        <div className="pe-2 h-full overflow-y-scroll pb-24 no-scroller">
          {items.length !== 0 ? (
            items.map((e, i) => (
              <button
                className="rounded-lg overflow-hidden m-2 p-[2px] bg-white/[3%] hover:bg-white/15 transition-all relative mid  w-[98%]"
                onClick={() => showHandler(e.id)}
                key={i}
              >
                {e.color && (
                  <div
                    className="absolute right-0 w-40 h-full transition-all"
                    style={{
                      background: `linear-gradient(to left,${e.color},transparent)`,
                    }}
                  ></div>
                )}
                <div className="py-3 px-3 border-2 border-white/10 rounded-lg relative text-right w-full h-full z-30 bg-gray-200 dark:bg-neutral-950">
                  <div className="mid w-full">
                    <div className="text-hidden me-auto text-lg">{e.name}</div>
                    <span
                      role="button"
                      onClick={(event) => checkHandler(e, event)}
                      className=""
                    >
                      {isChecked(e) ? (
                        <div className="opacity-100 hover:opacity-75 transition-all colored">
                          <BoxCheckedFilled />
                        </div>
                      ) : (
                        <div className="relative mid group">
                          <Box />
                          <div className="absolute opacity-0 group-hover:opacity-100 transition-all">
                            <BoxChecked />
                          </div>
                        </div>
                      )}
                    </span>
                  </div>
                  <div className="opacity-75 ms-2">{e.desc.slice(0, 120)}</div>
                </div>
              </button>
            ))
          ) : (
            <div className="w-full h-full mid">
              <div className="w-56">
                <EmptySvg />
              </div>
            </div>
          )}
        </div>
        <div className="absolute right-4 bottom-4 mid z-50">
          <NewTask />
          <div className="mx-1"></div>
          <TasksShow />
        </div>
      </div>
    </>
  );
}
