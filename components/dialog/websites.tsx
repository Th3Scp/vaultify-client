"use client";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../ui/button";
import MyDialog from "../ui/dialog";
import { Input, Switch } from "@headlessui/react";
import { clsx } from "clsx";
import {
  AppContext,
  Website as WebType,
  Password as PassType,
} from "../context";
import { matchURL } from "../global/regex";
import extractDomain from "../global/extractDomin";
import { toast } from "react-toastify";
import EmptySvg from "../svg/empty";
import Img from "../ui/img";
import Link from "next/link";
import { faviconApi } from "@/config";
import { setQueries } from "../global/getQueries";
import { useRouter, useSearchParams } from "next/navigation";
import getParameter from "../global/getParameter";
import {
  AddSvg,
  CloseSvg,
  CopySvg,
  EditSvg,
  LinkSvg,
  TrashSvg,
  GlobalSvg,
  PinSvg,
  TagSvg,
} from "../svg/main";

export default function Websites() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { websites, changeWebsites, setMainDialogData } =
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
  const addHandler = () => setCreate((g) => !g);
  const editPassFunc = () => setEditing(undefined);
  const createPassFunc = () => setCreate(false);
  const removeHandler = () => {
    setMainDialogData({
      open: true,
      onClose: () => {},
      onConfirm: () => {
        changeWebsites(websites().filter((g: WebType) => g.id !== selected));
        setSelected(undefined);
      },
      title: "حذف وبسایت",
      children: (
        <>
          <div className="text-3xl">آیا مطمئن هستید؟</div>
        </>
      ),
    });
  };

  useEffect(() => {
    if (open === false) {
      setCreate(false);
      setSelected(undefined);
      setEditing(undefined);
    }
  }, [open]);

  useEffect(() => {
    const q = getParameter("addWebsite");
    if (q) {
      setOpen(true);
      setCreate(true);
      router.push("/");
    }
  }, [searchParams]);

  return (
    <>
      <Button className="mid w-full mb-2" onClick={() => setOpen(true)}>
        <div className="colored">
          <GlobalSvg />
        </div>
        <div className="text-lg mx-2">وبسایت ها</div>
      </Button>
      <MyDialog isOpen={open} setIsOpen={setOpen}>
        <div className="h-10 mid border-b border-white/20 relative">
          <button
            onClick={closeDialogHandler}
            className="absolute left-3 opacity-75"
          >
            <CloseSvg />
          </button>
          {selected !== undefined ? (
            <>
              <div className="flex absolute right-0 top-0 h-full">
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
              </div>
            </>
          ) : (
            <button
              onClick={addHandler}
              className="bg-zinc-700/20 h-full absolute right-0 top-0 px-4 group"
            >
              <div className="group-hover:rotate-180 transition-all colored">
                <AddSvg />
              </div>
            </button>
          )}
          <div className="flex mb-1">
            <div className="text-xl">وبسایت ها</div>
          </div>
        </div>
        <div className="h-full relative overflow-y-scroll">
          <div className="pt-5 pb-16">
            {editing !== undefined ? (
              <EditWebsite webId={editing} close={editPassFunc} />
            ) : selected !== undefined ? (
              <SelectedWebsite webId={selected} />
            ) : create ? (
              <CreateWebsite close={createPassFunc} />
            ) : (
              <WebsiteShow setSelected={setSelected} />
            )}
          </div>
        </div>
      </MyDialog>
    </>
  );
}

function EditWebsite({ webId, close }: { webId: number; close: () => void }) {
  const { websites, changeWebsites } = useContext(AppContext);
  const [web, setWeb] = useState<WebType>(
    websites().filter((g: WebType) => g.id === webId)[0]
  );
  const [pin, setPin] = useState(web.pin);

  const nameRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);

  const edit = () => {
    if (
      nameRef.current!.value.length === 0 ||
      !matchURL(linkRef.current!.value)
    ) {
      toast.warn("لطفا فیلد های اجباری را تکمیل نمایید");
    } else {
      let webUpdate = websites().filter((g: WebType) => g.id !== webId);
      webUpdate = [
        ...webUpdate,
        {
          id: webId,
          name: nameRef.current!.value,
          link: linkRef.current!.value,
          pin: pin,
        },
      ];
      changeWebsites(webUpdate);
      close();
    }
  };

  return (
    <>
      <div className="mid-c">
        <div className="row justify-center">
          <div className="mb-2 w-6/12 p-2">
            <div className="opacity-90 flex">
              <TagSvg />
              <div className="mx-1">اسم سایت</div>
              <div className="text-red-600 mx-2">*</div>
            </div>
            <Input
              ref={nameRef}
              defaultValue={web.name}
              className={clsx(
                "mt-3 block w-full rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
            />
          </div>
          <div className="mb-2 w-6/12 p-2">
            <div className="opacity-90 flex">
              <LinkSvg />
              <div className="mx-1">لینک سایت</div>
              <div className="text-red-600 mx-2">*</div>
            </div>
            <Input
              ref={linkRef}
              defaultValue={web.link}
              className={clsx(
                "mt-3 block w-full rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
            />
          </div>
          <div className="mid">
            <div
              className={`${pin ? "opacity-100" : "opacity-40"} transition-all`}
            >
              <PinSvg />
            </div>
            <div className="mx-1">پین</div>
            <Switch
              dir="ltr"
              checked={pin}
              onChange={setPin}
              className="group mx-3 relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
              />
            </Switch>
          </div>
        </div>

        <div className="mb-2 w-6/12 p-2 mid">
          <Button onClick={edit} className="text-xl w-full">
            تغییر دادن
          </Button>
        </div>
      </div>
    </>
  );
}

function SelectedWebsite({ webId }: { webId: number }) {
  const router = useRouter();
  const { websites, passwords } = useContext(AppContext);
  const [web, setWeb] = useState<WebType>(
    websites().filter((g: WebType) => g.id === webId)[0]
  );
  const [pass, setPass] = useState<PassType[]>(
    passwords().filter((g: PassType) => g.name === web.link)
  );

  const copyHandler = async (str: string) => {
    try {
      await navigator.clipboard.writeText(str);
      console.log("Text copied to clipboard:");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const Btn = useMemo(() => {
    return function ({ e }: { e: PassType }) {
      const domain = matchURL(e.name) ? extractDomain(e.name, true) : e.name;

      return (
        <div className="w-6/12 p-2">
          <button
            onClick={() => {
              router.push(
                `?${setQueries([
                  {
                    key: "passShow",
                    value: e.id.toString(),
                  },
                ])}`
              );
            }}
            className="rounded-lg w-full h-12 letter-1 bg-neutral-900/20"
            style={{ border: `3px solid ${e.color}` }}
          >
            <div className="mid">
              <div className="">{extractDomain(e.name)}</div>
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
    <>
      <div className="px-6">
        <div className="flex">
          <Img src={faviconApi(extractDomain(web.link, true))} />

          <Link
            href={web.link}
            className="text-xl mx-1 mt-1 flex group"
            target="_blank"
            rel="noopener"
          >
            {web.name}
            <div className="mx-1 opacity-70 group-hover:opacity-100 colored">
              <LinkSvg />
            </div>
          </Link>
          {web.pin && <PinSvg />}
        </div>

        <div className="opacity-90 flex mb-1 mt-6">
          <div className="colored">
            <LinkSvg />
          </div>
          <div className="mx-1">لینک سایت</div>
        </div>
        <div className="rounded-lg dark:bg-white/5 bg-neutral-400 group focus-within:outline focus-within:outline-2 focus-within:outline-white/25 mid overflow-hidden h-12 mb-4">
          <Input
            value={web.link}
            type="text"
            className={clsx(
              "bg-white/0 block w-full border-none letter-1 text-xl py-1.5 px-3 text-white disabled",
              "focus:outline-none"
            )}
            disabled={true}
          />
          <button
            onClick={() => copyHandler(web.link)}
            className="p-2 h-full hover:bg-white/5 transition-all text-white/80 hover:text-white/100"
          >
            <CopySvg />
          </button>
        </div>

        {pass.length !== 0 && (
          <div className="row p-2 my-4 justify-center">
            <div className="text-xl w-full mid">پسورد ها</div>
            {pass.map((e: PassType, i: number) => (
              <Btn e={e} key={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function WebsiteShow({ setSelected }: { setSelected: (i: number) => void }) {
  const { websites } = useContext(AppContext);
  const [web, setWeb] = useState(websites());
  const [showWeb, setShowWeb] = useState<WebType[]>(websites());
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    setShowWeb(
      web.filter(
        (g: WebType) =>
          g.name.toLowerCase().includes(search.toLowerCase()) ||
          g.link.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  useEffect(() => {
    setWeb(websites());
    setShowWeb(websites());
  }, []);

  const Btn = useMemo(() => {
    return function ({ e }: { e: WebType }) {
      return (
        <div className="w-3/12 p-2">
          <button
            onClick={() => setSelected(e.id)}
            className="rounded-lg w-full p-4 letter-1 bg-neutral-900/20 mid-c hover:border-white/10 transition-all border-2 border-white/0 relative"
          >
            {e.pin && (
              <div className="absolute top-1 left-1">
                <PinSvg />
              </div>
            )}
            <Img src={faviconApi(extractDomain(e.link, true))} />
            <div className="w-full text-center text-hidden">{e.name}</div>
          </button>
        </div>
      );
    };
  }, [web]);

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
      {showWeb.length === 0 ? (
        <div className="w-56 mt-10">
          <EmptySvg />
        </div>
      ) : (
        showWeb.map((e: WebType, i: number) => <Btn e={e} key={i} />)
      )}
    </div>
  );
}

function CreateWebsite({ close }: { close: () => void }) {
  const { websites, changeWebsites } = useContext(AppContext);
  const [pin, setPin] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);

  const create = () => {
    if (
      nameRef.current!.value.length === 0 ||
      !matchURL(linkRef.current!.value)
    ) {
      toast.warn("لطفا فیلد های اجباری را تکمیل نمایید");
    } else {
      changeWebsites([
        {
          id:new Date().getTime(),
          name: nameRef.current!.value,
          link: linkRef.current!.value,
          pin: pin,
        },
        ...websites(),
      ]);
      close();
    }
  };

  return (
    <>
      <div className="mid-c">
        <div className="row justify-center">
          <div className="mb-2 w-6/12 p-2">
            <div className="opacity-90 flex">
              <TagSvg />
              <div className="mx-1">اسم سایت</div>
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
          <div className="mb-2 w-6/12 p-2">
            <div className="opacity-90 flex">
              <LinkSvg />
              <div className="mx-1">لینک سایت</div>
              <div className="text-red-600 mx-2">*</div>
            </div>
            <Input
              ref={linkRef}
              className={clsx(
                "mt-3 block w-full rounded-lg border-none dark:bg-white/5 bg-neutral-400 letter-1 text-xl py-1.5 px-3 text-white",
                "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
              )}
            />
          </div>
          <div className="mid">
            <div
              className={`${pin ? "opacity-100" : "opacity-40"} transition-all`}
            >
              <PinSvg />
            </div>
            <div className="mx-1">پین</div>
            <Switch
              dir="ltr"
              checked={pin}
              onChange={setPin}
              className="group mx-3 relative flex h-7 w-14 cursor-pointer rounded-full bg-white/10 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-white/10"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
              />
            </Switch>
          </div>
        </div>

        <div className="mb-2 w-6/12 p-2 mid">
          <Button onClick={create} className="text-xl w-full">
            ساختن
          </Button>
        </div>
      </div>
    </>
  );
}
