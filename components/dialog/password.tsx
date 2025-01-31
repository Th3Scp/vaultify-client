"use client";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import MyDialog from "../ui/dialog";
import { Input } from "@headlessui/react";
import { clsx } from "clsx";
import { AppContext, Password as PassType } from "../context";
import { matchURL } from "../global/regex";
import extractDomain from "../global/extractDomin";
import { toast } from "react-toastify";
import EmptySvg from "../svg/empty";
import Img from "../ui/img";
import Link from "next/link";
import { faviconApi } from "@/config";
import {
  AddSvg,
  CloseSvg,
  CodeSvg,
  CopySvg,
  EditSvg,
  EmailSvg,
  EyeSvg,
  KeySvg,
  LinkSvg,
  TrashSvg,
  UserSvg,
} from "../svg/main";

export default function Password() {
  const { changePasswords, passwords, setMainDialogData } =
    useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [create, setCreate] = useState(false);
  const [selected, setSelected] = useState<number | undefined>();
  const [editing, setEditing] = useState<number | undefined>();

  const closeDialogHandler = () => setOpen(false);
  const closeInHandler = () => {
    editing !== undefined ? setEditing(undefined) : setSelected(undefined);
  };
  const editHandler = () => {
    setEditing(selected);
  };
  const removeHandler = () => {
    setMainDialogData({
      open: true,
      onClose: () => {},
      onConfirm: () => {
        changePasswords(passwords().filter((g: PassType) => g.id !== selected));
        setSelected(undefined);
      },
      title: "حذف پسورد",
      children: (
        <>
          <div className="text-3xl">آیا مطمئن هستید؟</div>
        </>
      ),
    });
  };

  const addHandler = () => setCreate((g) => !g);
  const editPassFunc = () => setEditing(undefined);
  const createPassFunc = () => setCreate(false);

  useEffect(() => {
    if (open === false) {
      setCreate(false);
      setSelected(undefined);
      setEditing(undefined);
    }
  }, [open]);

  return (
    <>
      <Button className="mid w-full mb-2" onClick={() => setOpen(true)}>
        <div className="colored">
          <KeySvg />
        </div>
        <div className="text-lg mx-2">پسورد ها</div>
      </Button>
      <MyDialog
        isOpen={open}
        setIsOpen={setOpen}
        leftBtns={
          <button
            onClick={closeDialogHandler}
            className="absolute left-3 opacity-75"
          >
            <CloseSvg />
          </button>
        }
        rightBtns={
          selected !== undefined ? (
            <>
                <button
                  onClick={closeInHandler}
                  className="bg-zinc-700/20 h-full px-4 group"
                >
                  <div className="group-hover:rotate-6 transition-all text-red-600">
                    <CloseSvg />
                  </div>
                </button>
                {editing === undefined && (
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
                )}
            </>
          ) : (
            <button
              onClick={addHandler}
              className="bg-zinc-700/20 h-full px-4 group"
            >
              <div className="group-hover:rotate-180 transition-all colored">
                <AddSvg />
              </div>
            </button>
          )
        }
        title={<>پسورد ها</>}
      >
        <div className="pt-5 pb-16">
          {editing !== undefined ? (
            <EditPassword passId={editing} close={editPassFunc} />
          ) : selected !== undefined ? (
            <SelectedPassword passId={selected} />
          ) : create ? (
            <CreatePassword close={createPassFunc} />
          ) : (
            <PasswordsShow setSelected={setSelected} />
          )}
        </div>
      </MyDialog>
    </>
  );
}

function EditPassword({
  passId,
  close,
}: {
  passId: number;
  close: () => void;
}) {
  const { passwords, changePasswords } = useContext(AppContext);
  const [pass, setPass] = useState<PassType>(
    passwords().filter((g: PassType) => g.id === passId)[0]
  );
  const colors = ["gray", "red", "green", "blue", "yellow", "purple"];
  const [color, setColor] = useState(pass.color);

  const nameRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  const edit = () => {
    if (
      nameRef.current!.value.length === 0 ||
      passRef.current!.value.length === 0
    ) {
      toast.warn("لطفا فیلد های اجباری را تکمیل نمایید");
    } else if (
      iconRef.current!.value.length !== 0 &&
      !matchURL(iconRef.current!.value)
    ) {
      toast.warn("لطفا برای فیلد آیکون یک لینک وارد کنید");
    } else {
      let passUpdate = passwords().filter((g: PassType) => g.id !== passId);
      passUpdate = [
        ...passUpdate,
        {
          id: passId,
          name: nameRef.current!.value,
          color: color,
          password: passRef.current!.value,
          email: emailRef.current!.value,
          username: usernameRef.current!.value,
          icon: iconRef.current!.value,
        },
      ];
      changePasswords(passUpdate);
      close();
    }
  };

  return (
    <>
      <div className="mid-c">
        <div className="flex w-full">
          <div className="row w-12 mx-3">
            {colors.map((e, i) => (
              <button
                key={i}
                onClick={() => setColor(e)}
                className={`w-4 h-4 rounded m-1 border-2 ${
                  e === color ? "border-white/100" : "border-white/0"
                }`}
                style={{ background: e }}
              ></button>
            ))}
          </div>
          <div className="mb-2 w-[calc(100%-100px)]">
            <div className="opacity-90 flex">
              اسم پسورد یا لینک وبسایت
              <div className="text-red-600 mx-2">*</div>
            </div>
            <Input
              ref={nameRef}
              defaultValue={pass.name}
              className={clsx(
                "mt-3 block w-full rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
            />
          </div>
        </div>
        <div className="row justify-center">
          <div className="mb-2 lg:w-6/12 w-full p-2">
            <div className="opacity-90 flex">
              <CodeSvg />
              <div className="mx-1">پسورد</div>
              <div className="text-red-600 mx-2">*</div>
            </div>
            <Input
              ref={passRef}
              defaultValue={pass.password}
              className={clsx(
                "mt-3 block w-full rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
            />
          </div>
          <div className="mb-2 lg:w-6/12 w-full p-2">
            <div className="opacity-90 flex">
              <EmailSvg />
              <div className="mx-1">ایمیل</div>
            </div>
            <Input
              ref={emailRef}
              defaultValue={pass.email}
              className={clsx(
                "mt-3 block w-full rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
            />
          </div>
          <div className="mb-2 lg:w-6/12 w-full p-2">
            <div className="opacity-90 flex">
              <UserSvg />
              <div className="mx-1">یوزرنیم</div>
            </div>
            <Input
              ref={usernameRef}
              defaultValue={pass.username}
              className={clsx(
                "mt-3 block w-full rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
            />
          </div>
          <div className="mb-2 lg:w-6/12 w-full p-2">
            <div className="opacity-90 flex">
              <UserSvg />
              <div className="mx-1">آیکون</div>
            </div>
            <Input
              ref={iconRef}
              defaultValue={pass.icon}
              className={clsx(
                "mt-3 block w-full rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
            />
          </div>
        </div>
        <div className="mb-2 lg:w-6/12 w-10/12 p-2 mid">
          <Button onClick={edit} className="text-xl w-full">
            تغییر دادن
          </Button>
        </div>
      </div>
    </>
  );
}

function SelectedPassword({ passId }: { passId: number }) {
  const { passwords } = useContext(AppContext);
  const [pass, setPass] = useState<PassType>(
    passwords().filter((g: PassType) => g.id === passId)[0]
  );

  const passRef = useRef<HTMLInputElement>(null);
  const vishowHandler = () => {
    if (passRef.current!.type === "password") {
      passRef.current!.type = "text";
    } else {
      passRef.current!.type = "password";
    }
  };
  const copyHandler = async (str: string) => {
    try {
      await navigator.clipboard.writeText(str);
      console.log("Text copied to clipboard:");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <>
      <div className="px-6">
        <div className="flex">
          {pass.icon.length !== 0 ? (
            <Img src={pass.icon} />
          ) : (
            matchURL(pass.name) && (
              <Img src={faviconApi(extractDomain(pass.name, true))} />
            )
          )}

          {matchURL(pass.name) ? (
            <Link
              href={pass.name}
              className="text-xl mx-1 mt-1 flex group"
              target="_blank"
              rel="noopener"
            >
              {extractDomain(pass.name)}
              <div className="mx-1 opacity-70 group-hover:opacity-100 colored">
                <LinkSvg />
              </div>
            </Link>
          ) : (
            <div className="text-xl mx-1 mt-1">{pass.name}</div>
          )}
        </div>

        <div className="opacity-90 flex mb-1 mt-6">
          <div className="colored">
            <CodeSvg />
          </div>
          <div className="mx-1">پسورد</div>
        </div>
        <div className="rounded-lg dark:bg-white/5 bg-neutral-400 group focus-within:outline focus-within:outline-2 focus-within:outline-white/25 mid overflow-hidden h-12 mb-4">
          <Input
            ref={passRef}
            value={pass.password}
            type="password"
            className={clsx(
              "bg-white/0 block w-full border-none letter-1 text-xl py-1.5 px-3 text-white disabled",
              "focus:outline-none"
            )}
            disabled={true}
          />
          <button
            onClick={() => copyHandler(pass.password)}
            className="p-2 h-full hover:bg-white/5 transition-all text-white/80 hover:text-white/100"
          >
            <CopySvg />
          </button>
          <button
            onClick={vishowHandler}
            className="p-2 h-full hover:bg-white/5 transition-all text-white/80 hover:text-white/100"
          >
            <EyeSvg />
          </button>
        </div>
        {pass.email.length !== 0 && (
          <>
            <div className="opacity-90 flex mb-1">
              <div className="colored">
                <EmailSvg />
              </div>
              <div className="mx-1">ایمیل</div>
            </div>
            <div className="rounded-lg dark:bg-white/5 bg-neutral-400 group focus-within:outline focus-within:outline-2 focus-within:outline-white/25 mid overflow-hidden h-12 mb-4">
              <Input
                value={pass.email}
                type="text"
                className={clsx(
                  "bg-white/0 block w-full border-none letter-1 text-xl py-1.5 px-3 text-white disabled",
                  "focus:outline-none"
                )}
                disabled={true}
              />
              <button
                onClick={() => copyHandler(pass.email)}
                className="p-2 h-full hover:bg-white/5 transition-all text-white/80 hover:text-white/100"
              >
                <CopySvg />
              </button>
            </div>
          </>
        )}
        {pass.username.length !== 0 && (
          <>
            <div className="opacity-90 flex mb-1">
              <div className="colored">
                <UserSvg />
              </div>
              <div className="mx-1">یوزرنیم</div>
            </div>
            <div className="rounded-lg dark:bg-white/5 bg-neutral-400 group focus-within:outline focus-within:outline-2 focus-within:outline-white/25 mid overflow-hidden h-12 mb-4">
              <Input
                value={pass.username}
                type="text"
                className={clsx(
                  "bg-white/0 block w-full border-none letter-1 text-xl py-1.5 px-3 text-white disabled",
                  "focus:outline-none"
                )}
                disabled={true}
              />
              <button
                onClick={() => copyHandler(pass.username)}
                className="p-2 h-full hover:bg-white/5 transition-all text-white/80 hover:text-white/100"
              >
                <CopySvg />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function PasswordsShow({ setSelected }: { setSelected: (i: number) => void }) {
  const { passwords } = useContext(AppContext);
  const [pass, setPass] = useState(passwords());
  const [showPass, setShowPass] = useState<PassType[]>(passwords());
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setShowPass(
      pass.filter((g: PassType) =>
        g.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  useEffect(() => {
    setPass(passwords());
    setShowPass(passwords());
  }, []);

  const Btn = useMemo(() => {
    return function ({ e }: { e: PassType }) {
      const domain = matchURL(e.name) ? extractDomain(e.name, true) : e.name;

      return (
        <div className="lg:w-6/12 w-full p-2">
          <button
            onClick={() => setSelected(e.id)}
            className="rounded-lg w-full h-12 letter-1 bg-neutral-900/20 px-3"
            style={{ border: `3px solid ${e.color}` }}
          >
            <div className="mid">
              <div className="text-hidden text-center">{domain}</div>
              {e.icon.length !== 0 ? (
                <Img src={e.icon} />
              ) : (
                matchURL(e.name) && <Img src={faviconApi(domain)} />
              )}
            </div>
          </button>
        </div>
      );
    };
  }, [pass]);

  return (
    <div className="row justify-center">
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
      {showPass.length === 0 ? (
        <div className="w-56 mt-10">
          <EmptySvg />
        </div>
      ) : (
        showPass.map((e: PassType, i: number) => <Btn e={e} key={i} />)
      )}
    </div>
  );
}

function CreatePassword({ close }: { close: () => void }) {
  const { passwords, changePasswords } = useContext(AppContext);
  const colors = ["gray", "red", "green", "blue", "yellow", "purple"];
  const [color, setColor] = useState(colors[0]);

  const nameRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  const create = () => {
    if (
      nameRef.current!.value.length === 0 ||
      passRef.current!.value.length === 0
    ) {
      toast.warn("لطفا فیلد های اجباری را تکمیل نمایید");
    } else if (
      iconRef.current!.value.length !== 0 &&
      !matchURL(iconRef.current!.value)
    ) {
      toast.warn("لطفا برای فیلد آیکون یک لینک وارد کنید");
    } else {
      changePasswords([
        {
          id: new Date().getTime(),
          name: nameRef.current!.value,
          color: color,
          password: passRef.current!.value,
          email: emailRef.current!.value,
          username: usernameRef.current!.value,
          icon: iconRef.current!.value,
        },
        ...passwords(),
      ]);
      close();
    }
  };

  return (
    <>
      <div className="mid-c">
        <div className="flex w-full">
          <div className="row w-12 mx-3">
            {colors.map((e, i) => (
              <button
                key={i}
                onClick={() => setColor(e)}
                className={`w-4 h-4 rounded m-1 border-2 ${
                  e === color ? "border-white/100" : "border-white/0"
                }`}
                style={{ background: e }}
              ></button>
            ))}
          </div>
          <div className="mb-2 w-[calc(100%-100px)]">
            <div className="opacity-90 flex">
              اسم پسورد یا لینک وبسایت
              <div className="text-red-600 mx-2">*</div>
            </div>
            <Input
              ref={nameRef}
              className={clsx(
                "mt-3 block w-full rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
            />
          </div>
        </div>
        <div className="row justify-center">
          <div className="mb-2 lg:w-6/12 w-full p-2">
            <div className="opacity-90 flex">
              <CodeSvg />
              <div className="mx-1">پسورد</div>
              <div className="text-red-600 mx-2">*</div>
            </div>
            <Input
              ref={passRef}
              className={clsx(
                "mt-3 block w-full rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
            />
          </div>
          <div className="mb-2 lg:w-6/12 w-full p-2">
            <div className="opacity-90 flex">
              <EmailSvg />
              <div className="mx-1">ایمیل</div>
            </div>
            <Input
              ref={emailRef}
              className={clsx(
                "mt-3 block w-full rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
            />
          </div>
          <div className="mb-2 lg:w-6/12 w-full p-2">
            <div className="opacity-90 flex">
              <UserSvg />
              <div className="mx-1">یوزرنیم</div>
            </div>
            <Input
              ref={usernameRef}
              className={clsx(
                "mt-3 block w-full rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
            />
          </div>
          <div className="mb-2 lg:w-6/12 w-full p-2">
            <div className="opacity-90 flex">
              <UserSvg />
              <div className="mx-1">آیکون</div>
            </div>
            <Input
              ref={iconRef}
              className={clsx(
                "mt-3 block w-full rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
            />
          </div>
        </div>
        <div className="mb-2 lg:w-6/12 w-10/12 p-2 mid">
          <Button onClick={create} className="text-xl w-full">
            ساختن
          </Button>
        </div>
      </div>
    </>
  );
}
