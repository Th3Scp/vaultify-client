"use client";
import React, { ReactNode, useEffect, useState } from "react";
import MyDialog from "./dialog";
import { Input } from "./input";
import { useTranslation } from "react-i18next";
import { Button } from "./button";
import { AddSvg, CloseSvg, RemoveSvg } from "../svg/main";

export default function MultiSelect<T>({
  title,
  items,
  defaultSelected = [],
  onChange,
  renderItems,
  getSearchParameter,
  Btn,
}: {
  title: ReactNode | string;
  items: T[];
  defaultSelected?: T[];
  onChange: (data: T[]) => void;
  renderItems: (data: T) => ReactNode;
  getSearchParameter: (data: T) => string;
  Btn: ReactNode;
}) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [all, setAll] = useState<T[]>(items);
  const [selected, setSelected] = useState<T[]>(defaultSelected);
  const [showSelected, setShowSelected] = useState<T[]>(selected);
  const [search, setSearch] = useState("");

  const addHandler = (e: T) => {
    setSelected((g) => [...g, e]);
    setAll((g) =>
      g.filter((r) => getSearchParameter(r) !== getSearchParameter(e))
    );
  };
  const removeHandler = (e: T) => {
    setSelected((g) =>
      g.filter((r) => getSearchParameter(r) !== getSearchParameter(e))
    );
    setAll((g) => [...g, e]);
  };

  useEffect(() => {
    setAll(() =>
      items.filter(
        (e) =>
          getSearchParameter(e)
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase()) &&
          !selected.some((g) => getSearchParameter(g) === getSearchParameter(e))
      )
    );
    setShowSelected(() =>
      selected.filter((e) =>
        getSearchParameter(e)
          .toLocaleLowerCase()
          .includes(search.toLocaleLowerCase())
      )
    );
  }, [search]);

  useEffect(() => {
    onChange(selected)
    setShowSelected(selected);
  }, [selected]);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{Btn}</Button>
      <MyDialog isOpen={open} setIsOpen={setOpen} title={title} leftBtns={
          <button
            onClick={()=>setOpen(false)}
            className="absolute left-3 opacity-75"
          >
            <CloseSvg />
          </button>
        }>
        <div className="p-2 w-full row justify-center">
          <Input
            placeholder={t("Search")}
            onChange={(e) => setSearch(e.currentTarget.value)}
            className="mb-3"
          />
          {showSelected.length !== 0 && (
            <>
              <div className="w-full text-center uppercase opacity-70">
                {t("Selected")}
              </div>
              {showSelected.map((e, i) => (
                <div className="w-full lg:w-6/12" key={i}>
                  <div className="flex p-2 rounded-lg border-2 border-white dark:border-white/[5%] bg-gray-300 dark:bg-black/[70%] items-center w-full">
                    {renderItems(e)}
                    <div className="ms-auto">
                      <Button onClick={() => removeHandler(e)}>
                        <div className="text-red-600">
                          <RemoveSvg />
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          {all.length !== 0 && (
            <>
              <div className="w-full text-center uppercase opacity-70">{t("All")}</div>
              {all.map((e, i) => (
                <div className="w-full lg:w-6/12" key={i}>
                  <div className="flex p-2 rounded-lg border-2 border-white dark:border-white/[5%] bg-gray-300 dark:bg-black/[70%] items-center w-full">
                    {renderItems(e)}
                    <div className="ms-auto">
                      <Button onClick={() => addHandler(e)}>
                        <div className="text-green-600">
                          <AddSvg />
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </MyDialog>
    </>
  );
}
