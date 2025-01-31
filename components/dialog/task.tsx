import { useContext, useEffect, useRef, useState } from "react";
import {
  AddSvg,
  CalendarEventSvg,
  CloseSvg,
  EditSvg,
  EyeSparkSvg,
  TrashSvg,
} from "../svg/main";
import { Button } from "../ui/button";
import MyDialog from "../ui/dialog";
import { CirclePicker } from "react-color";
import { Input, Textarea } from "@headlessui/react";
import clsx from "clsx";
import { DayType } from "../ui/datepicker";
import DatePickerDialog from "./datepicker";
import { AppContext, Task as TaskType } from "../context";
import { toast } from "react-toastify";
import moment from "jalali-moment";
import Tooltip from "../ui/tooltip";
import EmptySvg from "../svg/empty";
import { useRouter } from "next/navigation";

export function NewTask() {
  const { tasks, changeTasks } = useContext(AppContext);

  const [open, setOpen] = useState(false);

  const openHandler = () => setOpen(true);
  const closeHandler = () => setOpen(false);
  //   =========================
  const [color, setColor] = useState<string | undefined>();
  const [datePicked, setDatePicked] = useState<DayType[]>([]);
  const [weekDay, setWeekDay] = useState<number[]>([]);

  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);

  const dateChangeHandler = (data: DayType[]) => {
    weekDay.length !== 0 && setWeekDay([]);
    setDatePicked(data);
  };

  const weekDayChangeHandler = (i: number) => {
    if (weekDay.includes(i)) {
      setWeekDay((g) => g.filter((e) => e !== i));
    } else {
      setWeekDay((g) => [...g, i]);
    }
  };
  const cancelDatePicked = () => {
    setDatePicked([]);
  };

  const createHandler = () => {
    if (nameRef.current!.value.length === 0) {
      toast.warn("لطفا فیلد موضوع تسک را پر کنید");
    } else {
      const time = new Date().getTime();
      const up: TaskType = {
        name: nameRef.current!.value,
        desc: descRef.current!.value,
        color: color,
        weekdays: weekDay.length === 0 ? false : weekDay,
        dates: datePicked.length === 0 ? false : datePicked,
        created: time,
        checked: [],
        id: time,
      };
      changeTasks([...tasks(), up]);
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!open) {
      setColor(undefined);
      setDatePicked([]);
      setWeekDay([]);
    }
  }, [open]);

  return (
    <>
      <Button onClick={openHandler} className="mid">
        <div className="colored">
          <AddSvg />
        </div>
      </Button>
      <MyDialog
        isOpen={open}
        setIsOpen={setOpen}
        leftBtns={
          <button onClick={closeHandler} className="absolute left-3 opacity-75">
            <CloseSvg />
          </button>
        }
        title={<>ساخت تسک جدید</>}
      >
        <div className="mid w-full pt-4 pb-10">
          <div className="w-10/12 row">
            <div className="lg:w-[160px] w-full mb-8 lg:mb-0">
              <CirclePicker
                color={color}
                onChange={(e) => setColor(e.hex)}
                width="100%"
                colors={[
                  "red",
                  "blue",
                  "green",
                  "yellow",
                  "orange",
                  "purple",
                  "pink",
                  "cyan",
                  "magenta",
                  "brown",
                  "gray",
                  "white",
                  "teal",
                  "navy",
                  "lime",
                  "violet",
                  "gold",
                  "coral",
                ]}
              />
            </div>
            <div className="lg:w-[calc(100%-160px)] w-full">
              <div className="text-xl flex">
                <div
                  className="mx-1 w-3 h-3 rounded-full mt-2"
                  style={{ background: color }}
                ></div>
                موضوع تسک
              </div>
              <Input
                ref={nameRef}
                className={clsx(
                  "mt-3 block w-full rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                )}
              />
              <div className="text-xl mt-2 ms-5">توضیحات</div>
              <Textarea
                ref={descRef}
                className={clsx(
                  "mt-3 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                )}
                rows={4}
              />
            </div>
            <div className="mt-3 w-full row justify-center items-center">
              <div className="mid-c">
                <div className="text-xl">روز های هفته</div>
                <div className="mid">
                  {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((e, i) => (
                    <Button
                      onClick={() => weekDayChangeHandler(i === 0 ? 6 : i - 1)}
                      className={`w-10 h-10 rounded-full mid m-1 ${
                        weekDay.includes(i === 0 ? 6 : i - 1) &&
                        "bg-colored text-white bg-hover-colored"
                      }
                        ${datePicked.length !== 0 && "opacity-60"}
                        `}
                      disabled={datePicked.length !== 0 ? true : false}
                      key={i}
                    >
                      {e}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="mid-c mx-auto mt-8 lg:mt-0">
                <DatePickerDialog
                  onChange={dateChangeHandler}
                  defaultValue={datePicked}
                />
                <div className="mt-1">
                  {datePicked.length !== 0 && (
                    <div className="mid p-2 rounded-lg border-2 border-white/10">
                      <button
                        className="me-auto text-red-600/60 hover:text-red-600/100 transition-all"
                        onClick={cancelDatePicked}
                      >
                        <TrashSvg />
                      </button>
                      <div className="mx-1">{datePicked.length}</div>
                      زمان انتخاب شده
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full mid mt-4">
              <Button
                onClick={createHandler}
                className="text-xl w-10/12 lg:w-6/12 px-12"
              >
                ساختن
              </Button>
            </div>
          </div>
        </div>
      </MyDialog>
    </>
  );
}
export function TaskShow({
  id,
  setId,
}: {
  id: number | undefined;
  setId: (e: number | undefined) => void;
}) {
  const { tasks, setMainDialogData, changeTasks } = useContext(AppContext);

  const [open, setOpen] = useState(false);
  const [item, setItem] = useState<TaskType | undefined>();
  const [edit, setEdit] = useState(false);

  const closeHandler = () => {
    setOpen(false);
    setId(undefined);
    setEdit(false);
  };
  const removeHandler = () => {
    setMainDialogData({
      open: true,
      onClose: () => {},
      onConfirm: () => {
        changeTasks(tasks().filter((g: TaskType) => g.id !== item!.id));
        closeHandler();
      },
      title: "حذف تسک",
      children: (
        <>
          <div className="text-3xl">آیا مطمئن هستید؟</div>
        </>
      ),
    });
  };
  const editHandler = () => {
    setEdit((g) => !g);
    setItem(tasks().filter((g: TaskType) => g.id === id)[0]);
  };
  const Day = ({ i }: { i: number }) => {
    const itemDateCreated = new Date(item!.created);
    const dayDate = new Date();
    dayDate.setDate(dayDate.getDate() - i);
    const dayMoment = moment()
      .subtract(i, "days")
      .locale("fa")
      .format("YYYY/M/D");
    // ================
    const isAfterCreated = dayDate > itemDateCreated;
    // ================
    const isWeekDay =
      item!.weekdays !== false && item!.weekdays.includes(dayDate.getDay());
    // ================
    let isDates = false;
    if (item!.dates !== false) {
      const checkDate = dayMoment.split("/");
      item!.dates.forEach((e) => {
        if (
          e.day === Number(checkDate[2]) &&
          e.month === Number(checkDate[1]) &&
          e.year === Number(checkDate[0])
        ) {
          isDates = true;
        }
      });
    }
    // ================
    const bg = () => {
      if (!isAfterCreated) return "bg-black/20 dark:bg-white/5";
      if (item!.checked.includes(dayMoment)) return "bg-green-600";
      if (item!.weekdays !== false && isWeekDay)
        return "bg-black/50 dark:bg-white/30";
      if (item!.dates !== false && isDates)
        return "bg-black/50 dark:bg-white/30";
      if (item!.weekdays !== false || item!.dates !== false)
        return "bg-black/20 dark:bg-white/5";
      return "bg-black/50 dark:bg-white/30";
    };
    return (
      <>
        <Tooltip content={dayMoment}>
          <div
            className={`w-5 h-5 m-1 rounded ${
              bg()
              // !isAfterCreated
              //   ? "bg-white/5"
              //   : !item!.checked.includes(dayMoment)
              //   ? item!.weekdays !== false
              //     ? isWeekDay
              //       ? "bg-white/30"
              //       : "bg-white/5"
              //     : item!.dates !== false
              //     ? isDates
              //       ? "bg-white/30"
              //       : "bg-white/5"
              //     : "bg-white/30"
              //   : "bg-green-600"
            }`}
          ></div>
        </Tooltip>
      </>
    );
  };
  useEffect(() => {
    if (id !== undefined) {
      setOpen(true);
      setItem(tasks().filter((g: TaskType) => g.id === id)[0]);
    }
  }, [id]);

  return (
    <>
      <MyDialog
        isOpen={open}
        setIsOpen={(e) => closeHandler()}
        leftBtns={
          <button onClick={closeHandler} className="absolute left-3 opacity-75">
            <CloseSvg />
          </button>
        }
        rightBtns={
          <>
            <button
              onClick={editHandler}
              className="bg-zinc-700/20 h-full px-4 group"
            >
              <div className="group-hover:rotate-6 transition-all colored">
                <EditSvg />
              </div>
            </button>
            <button
              onClick={removeHandler}
              className="bg-zinc-700/20 h-full px-4 group"
            >
              <div className="group-hover:rotate-6 transition-all text-yellow-600">
                <TrashSvg />
              </div>
            </button>
          </>
        }
        title={<>تسک</>}
      >
        {item &&
          (edit ? (
            <Edit close={editHandler} id={item.id} />
          ) : (
            <div className="pb-5 pt-5">
              <div className="text-2xl flex">
                <div
                  className="w-4 h-4 rounded mx-1 mt-1"
                  style={{ background: item.color }}
                ></div>
                {item.name}
              </div>
              <div className="opacity-75 mt-2">{item.desc}</div>
              <div className="text-3xl text-center mt-5 mb-2 mid">
                <div className="me-2">
                  <CalendarEventSvg />
                </div>
                روز ها
                <div className="row ms-4">
                  {item.weekdays !== false &&
                    ["ش", "ی", "د", "س", "چ", "پ"].map((e, i) =>
                      (item.weekdays as number[]).includes(
                        i === 0 ? 6 : i - 1
                      ) ? (
                        <Button
                          className="w-10 h-10 rounded-full mid m-1 bg-colored text-white bg-hover-colored text-lg pointer-events-none
                        "
                          key={i}
                        >
                          {e}
                        </Button>
                      ) : (
                        ""
                      )
                    )}
                </div>
              </div>
              <div className="w-full mid">
                <div className="row w-full px-9">
                  {Array.from({ length: 105 }, (_, i) => (
                    <Day i={i} key={i} />
                  ))}
                </div>
              </div>
              {item.dates !== false && (
                <div className="mt-4 mid-c">
                  <div className="text-2xl text-center mb-2">
                    روز های انتخاب شده
                  </div>
                  <div className="row mid w-8/12">
                    {(item.dates as DayType[]).map((e, i) => (
                      <div
                        className="p-2 border-2 border-white/10 bg-gray-200 dark:bg-neutral-950 rounded-lg m-1"
                        key={i}
                      >
                        {e.year}/{e.month}/{e.day}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
      </MyDialog>
    </>
  );
}
function Edit({ id, close }: { id: number; close: () => void }) {
  const { tasks, changeTasks } = useContext(AppContext);

  const item: TaskType = tasks().filter((g: TaskType) => g.id === id)[0];
  const [color, setColor] = useState<string | undefined>(item.color);
  const [datePicked, setDatePicked] = useState<DayType[]>(
    item.dates !== false ? item.dates : []
  );
  const [weekDay, setWeekDay] = useState<number[]>(
    item.weekdays !== false ? item.weekdays : []
  );

  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);

  const dateChangeHandler = (data: DayType[]) => {
    weekDay.length !== 0 && setWeekDay([]);
    setDatePicked(data);
  };

  const weekDayChangeHandler = (i: number) => {
    if (weekDay.includes(i)) {
      setWeekDay((g) => g.filter((e) => e !== i));
    } else {
      setWeekDay((g) => [...g, i]);
    }
  };
  const cancelDatePicked = () => {
    setDatePicked([]);
  };
  const editHandler = () => {
    if (nameRef.current!.value.length === 0) {
      toast.warn("لطفا فیلد موضوع تسک را پر کنید");
    } else {
      const up = tasks().filter((g: TaskType) => g.id !== item.id);
      const ed: TaskType = {
        ...item,
        name: nameRef.current!.value,
        desc: descRef.current!.value,
        color: color,
        weekdays: weekDay.length === 0 ? false : weekDay,
        dates: datePicked.length === 0 ? false : datePicked,
      };
      changeTasks([...up, ed]);
      close();
    }
  };

  return (
    <>
      <div className="mid w-full pt-4 pb-10">
        <div className="w-10/12 row">
          <div className="lg:w-[160px] w-full mb-8 lg:mb-0">
            <CirclePicker
              color={color}
              onChange={(e) => setColor(e.hex)}
              width="100%"
              colors={[
                "red",
                "blue",
                "green",
                "yellow",
                "orange",
                "purple",
                "pink",
                "cyan",
                "magenta",
                "brown",
                "gray",
                "white",
                "teal",
                "navy",
                "lime",
                "violet",
                "gold",
                "coral",
              ]}
            />
          </div>
          <div className="lg:w-[calc(100%-160px)] w-full">
            <div className="text-xl flex">
              <div
                className="mx-1 w-3 h-3 rounded-full mt-2"
                style={{ background: color }}
              ></div>
              موضوع تسک
            </div>
            <Input
              ref={nameRef}
              defaultValue={item.name}
              className={clsx(
                "mt-3 block w-full rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
            />
            <div className="text-xl mt-2 ms-5">توضیحات</div>
            <Textarea
              ref={descRef}
              defaultValue={item.desc}
              className={clsx(
                "mt-3 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
              rows={4}
            />
          </div>
          <div className="mid mt-3 w-full row justify-center items-center">
            <div className="mid-c">
              <div className="text-xl">روز های هفته</div>
              <div className="mid">
                {["ش", "ی", "د", "س", "چ", "پ", "ج"].map((e, i) => (
                  <Button
                    onClick={() => weekDayChangeHandler(i === 0 ? 6 : i - 1)}
                    className={`w-10 h-10 rounded-full mid m-1 ${
                      weekDay.includes(i === 0 ? 6 : i - 1) &&
                      "bg-colored text-white bg-hover-colored"
                    }
                        ${datePicked.length !== 0 && "opacity-60"}
                        `}
                    disabled={datePicked.length !== 0 ? true : false}
                    key={i}
                  >
                    {e}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mid-c mx-auto mt-8 lg:mt-0">
              <DatePickerDialog
                onChange={dateChangeHandler}
                defaultValue={datePicked}
              />
              <div className="mt-1">
                {datePicked.length !== 0 && (
                  <div className="mid p-2 rounded-lg border-2 border-white/10">
                    <button
                      className="me-auto text-red-600/60 hover:text-red-600/100 transition-all"
                      onClick={cancelDatePicked}
                    >
                      <TrashSvg />
                    </button>
                    <div className="mx-1">{datePicked.length}</div>
                    زمان انتخاب شده
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full mid mt-4">
            <Button onClick={editHandler} className="text-xl w-10/12 lg:w-6/12 px-12">
              تغییر دادن
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
export function TasksShow() {
  const { tasks } = useContext(AppContext);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<TaskType[]>([]);
  const [search, setSearch] = useState("");

  const closeHandler = () => {
    setOpen(false);
    setSearch("");
    setItems([]);
  };
  const openHandler = () => {
    setOpen(true);
    setItems(tasks());
  };
  const showHandler = (id: number) => {
    router.push(`?taskShow=${id}`);
  };

  useEffect(() => {
    setItems(
      tasks().filter((g: TaskType) =>
        g.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      )
    );
  }, [search]);

  return (
    <>
      <Button onClick={openHandler} className="mid">
        <div className="colored">
          <EyeSparkSvg />
        </div>
      </Button>
      <MyDialog isOpen={open} setIsOpen={(e) => closeHandler()}>
        <div className="h-10 mid border-b border-white/20 relative">
          <button onClick={closeHandler} className="absolute left-3 opacity-75">
            <CloseSvg />
          </button>
          <div className="flex mb-1">
            <div className="text-xl">تسک ها</div>
          </div>
        </div>
        <div className="overflow-scroll h-full relative p-4">
          <div className="w-full mid mb-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              placeholder="جستوجو"
              className={clsx(
                "mt-3 block w-7/12 rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-black dark:text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
            />
          </div>
          <div className="row w-full justify-center px-3">
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
                      <div className="text-hidden me-auto text-lg">
                        {e.name}
                      </div>
                    </div>
                    <div className="opacity-75 ms-2">{e.desc.slice(0, 30)}</div>
                  </div>
                </button>
              ))
            ) : (
              <div className="w-56 mt-10">
                <EmptySvg />
              </div>
            )}
          </div>
        </div>
      </MyDialog>
    </>
  );
}
