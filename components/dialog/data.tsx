import { ChangeEventHandler, useRef, useState } from "react";
import { FileDataSvg } from "../svg/main";
import { Button } from "../ui/button";
import MyDialog from "../ui/dialog";
import { Input } from "@headlessui/react";
import clsx from "clsx";
import CryptoJS from "crypto-js";
import { toast } from "react-toastify";

export default function Data() {
  const [open, setOpen] = useState(false);

  const passERef = useRef<HTMLInputElement>(null);
  const passIRef = useRef<HTMLInputElement>(null);

  const INRef = useRef<HTMLInputElement>(null);
  const ITNRef = useRef<HTMLInputElement>(null);

  const openHandler = () => setOpen(true);
  const closeHandler = () => setOpen(false);

  const handleSaveEnc = (jsonData: Object) => {
    if (passERef.current!.value.length < 8) {
      toast.error("لطفا یک پسورد با حداقل 8 کاراکتر بنویسید");
      return;
    }

    const dataString = JSON.stringify(jsonData, null, 2);

    const encryptedData = CryptoJS.AES.encrypt(
      dataString,
      passERef.current!.value
    ).toString();

    const dataFull = JSON.stringify(
      {
        enc: true,
        data: encryptedData,
      },
      null,
      2
    );

    const blob = new Blob([dataFull], { type: "text/plain" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "vaultify_data.txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = (jsonData: Object) => {
    const jsonString = JSON.stringify(
      {
        enc: false,
        data: jsonData,
      },
      null,
      2
    );

    const blob = new Blob([jsonString], { type: "text/plain" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "vaultify_data.txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDecrypt = (encryptedData: string, password: string) => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, password);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      if (!decryptedData) {
        toast.error("فایل معتبر نمیباشد");
      }
      return JSON.parse(decryptedData);
    } catch (error) {
      toast.error("پسورد معتبر نمیباشد");
    }
  };

  const extractNormal = () => {
    handleSave(localStorage);
  };

  const extractWithPass = () => {
    handleSaveEnc(localStorage);
  };

  const importNormal = () => {
    try {
      const file = INRef.current!.files![0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result) {
          const data = JSON.parse(reader.result.toString());
          if (data.enc !== undefined) {
            if (data.enc === false) {
              localStorage.setItem("clockFont", data.data.clockFont);
              localStorage.setItem("clockIs24", data.data.clockIs24);
              localStorage.setItem("khorshidiShow", data.data.khorshidiShow);
              localStorage.setItem("mainColor", data.data.mainColor);
              localStorage.setItem("mildaiShow", data.data.mildaiShow);
              localStorage.setItem("notes", data.data.notes);
              localStorage.setItem("passwords", data.data.passwords);
              localStorage.setItem("tasks", data.data.tasks);
              localStorage.setItem("theme", data.data.theme);
              localStorage.setItem("websites", data.data.websites);
              localStorage.setItem("font", data.data.font);
              window.location.reload();
            } else toast.error("این فایل رمز گزاری شده است");
          } else toast.error("فایل معتبر نمیباشد");
        }
      };

      reader.readAsText(file);
    } catch (error) {
      console.log(error);
      toast.error("ارور");
    }
  };

  const importWithPass = () => {
    try {
      const file = ITNRef.current!.files![0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        if (reader.result) {
          const json = JSON.parse(reader.result.toString());
          const data = handleDecrypt(json.data, passIRef.current!.value);
          if (json.enc !== undefined) {
            if (json.enc === true) {
              Object.keys(data).forEach((key) => {
                if (data[key] !== undefined) {
                  localStorage.setItem(key, data[key]);
                }
              });
              window.location.reload();
            } else toast.error("این فایل رمز گزاری شده است");
          } else toast.error("فایل معتبر نمیباشد");
        }
      };

      reader.readAsText(file);
    } catch (error) {
      console.log(error);
      toast.error("ارور");
    }
  };

  return (
    <>
      <Button onClick={openHandler}>
        <FileDataSvg />
      </Button>
      <MyDialog isOpen={open} setIsOpen={closeHandler}>
          <div className="">
            <div className="text-xl mb-2">استخراج دیتا ها</div>
            <div className="row w-full">
              <div className="w-full lg:w-6/12 h-40 p-2">
                <Button onClick={extractNormal} className="w-full h-full">
                  بدون رمزگذاری
                </Button>
              </div>
              <div className="w-full lg:w-6/12 h-40 p-2">
                <div className="w-full h-full relative mid">
                  <Button onClick={extractWithPass} className="w-full h-full">
                    <div className="mb-10">با رمزگذاری</div>
                  </Button>
                  <Input
                    ref={passERef}
                    placeholder="پسورد"
                    className={clsx(
                      "block absolute bottom-4 w-10/12 rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                    )}
                  />
                </div>
              </div>
            </div>
            {/* ============================================== */}
            <div className="text-xl mb-2 mt-8">وارد کردن دیتا ها</div>
            <div className="row w-full">
              <div className="w-full lg:w-6/12 h-40 p-2">
                <input
                  type="file"
                  id="noencfile"
                  className="opacity-0 -z-50 pointer-events-none absolute"
                  onChange={importNormal}
                  ref={INRef}
                  accept=".txt"
                />
                <label
                  htmlFor="noencfile"
                  className="p-2 rounded-xl block mid bg-slate-500/10 transition-all text-gray-700 dark:text-gray-500 relative hover:scale-90 mx-1 w-full h-full active:scale-[0.8] dark:hover:text-gray-200 hover:text-gray-900 hover:bg-slate-500/30 border-white/0 cursor-pointer"
                >
                  رمزگذاری نشده
                </label>
              </div>

              <div className="w-full lg:w-6/12 h-40 p-2">
                <div className="w-full h-full relative mid">
                  <input
                    type="file"
                    id="encfile"
                    className="opacity-0 -z-50 pointer-events-none absolute"
                    onChange={importWithPass}
                    ref={ITNRef}
                    accept=".txt"
                  />
                  <label
                    htmlFor="encfile"
                    className="p-2 rounded-xl block mid bg-slate-500/10 transition-all text-gray-700 dark:text-gray-500 relative hover:scale-90 mx-1 w-full h-full active:scale-[0.8] dark:hover:text-gray-200 hover:text-gray-900 hover:bg-slate-500/30 border-white/0 cursor-pointer"
                  >
                    <div className="mb-10">رمزگذاری شده</div>
                  </label>
                  <Input
                    ref={passIRef}
                    placeholder="پسورد"
                    className={clsx(
                      "block absolute bottom-4 w-10/12 rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
      </MyDialog>
    </>
  );
}
