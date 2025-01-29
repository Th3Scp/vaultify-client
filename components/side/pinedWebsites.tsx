"use client";
import { useContext, useMemo } from "react";
import { AppContext, Website } from "../context";
import Image from "next/image";
import { faviconApi } from "@/config";
import extractDomain from "../global/extractDomin";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setQueries } from "../global/getQueries";

const PlusSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-hexagon-plus"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" />
    <path d="M9 12h6" />
    <path d="M12 9v6" />
  </svg>
);

export default function PinedWebsites() {
  const { websites, reload } = useContext(AppContext);
  const router = useRouter();
  const addHandler = () => {
    router.push(`?${setQueries([{ key: "addWebsite", value: "true" }])}`);
  };
  const Websites = useMemo(() => {
    return websites()
      .filter((g: Website) => g.pin)
      .map((e: Website, i: number) => (
        <div className="w-4/12 md:w-2/12 lg:w-6/12 p-2" key={i}>
          <Link
            href={e.link}
            target="_blank"
            rel="noopener"
            className="aspect-square rounded-xl bg-neutral-500/10 mid-c p-3 border-0 hover:border hover:border-b-4  colored-border transition-all pwshh"
          >
            <Image
              src={faviconApi(extractDomain(e.link, true))}
              alt=""
              width="200"
              height="200"
              className="w-10"
            />
            <div className="text-lg text-hidden w-full text-center">
              {e.name}
            </div>
          </Link>
        </div>
      ));
  }, [reload]);
  return (
    <>
      <div className="row justify-center">
        {Websites}
        <div className="w-4/12 md:w-2/12 lg:w-6/12 p-2">
          <button
            onClick={addHandler}
            className="aspect-square rounded-xl w-full bg-neutral-500/10 mid-c p-3 border-0 hover:border hover:border-b-4  colored-border transition-all pwshh colored"
          >
            <PlusSvg />
          </button>
        </div>
      </div>
    </>
  );
}
