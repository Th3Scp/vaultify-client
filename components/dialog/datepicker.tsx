"use client";

import { useState } from "react";
import MyDialog from "../ui/dialog";
import { CloseSvg } from "../svg/main";
import DatePicker, { DayType } from "../ui/datepicker";
import { Button } from "../ui/button";

export default function DatePickerDialog({
  onChange,
  defaultValue,
}: {
  onChange: (e: DayType[]) => void;
  defaultValue?: DayType[];
}) {
  const [open, setOpen] = useState(false);

  const openHandler = () => setOpen(true);
  const closeHandler = () => setOpen(false);
  return (
    <>
      <Button onClick={openHandler}>مشخص کردن زمان</Button>
      <MyDialog
        isOpen={open}
        setIsOpen={setOpen}
        leftBtns={
          <button onClick={closeHandler} className="absolute left-3 opacity-75">
            <CloseSvg />
          </button>
        }
        title={<>انتخاب کردن زمان</>}
      >
        <div className="mid px-3 h-full">
          <DatePicker
            disableBefore={true}
            multiSelect={true}
            toDaySelected={false}
            onChange={onChange}
            defaultValue={defaultValue}
          />
        </div>
      </MyDialog>
    </>
  );
}
