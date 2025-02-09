import Image from "next/image";
import { TeamType } from "../actions/team";
import { useRouter } from "next/navigation";
import { MouseEvent, useContext } from "react";
import { Button } from "./button";
import { MoreSvg, UsersSvg } from "../svg/main";
import { useTranslation } from "react-i18next";
import { AppContext } from "../context";
import CheckPerm from "../global/checkPerm";

export function TeamCard({ data }: { data: TeamType }) {
  const { user } = useContext(AppContext);
  const { t } = useTranslation();
  const router = useRouter();

  const clickHandler = () => {
    router.push(`/team/s/${data.uuid}`);
  };

  const projectHandler = (id: string, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    router.push(`/team/p/${id}`);
  };

  const moreHandler = () => {};

  return (
    <>
      <button
        onClick={clickHandler}
        className="p-3 rounded-xl border-2 border-white dark:border-white/5 bg-gray-300 dark:bg-white/[3%] backdrop-blur-lg w-full hover:scale-105 transition-all"
        suppressHydrationWarning
      >
        <div className="mid w-full">
          <div className="mid">
            <Image
              src={data.avatar}
              alt=""
              width={30}
              height={30}
              className="rounded-full"
            />
            <div className="text-xl ms-2">{data.name}</div>
          </div>
          <div className="mid ms-auto border-2 border-white/10 bg-white/5 rounded-3xl px-3 py-1">
            <Image
              src={data.owner.avatar}
              alt=""
              width={24}
              height={24}
              className="rounded-full"
            />
            <div className="text-lg ms-1">{data.owner.email.split("@")[0]}</div>
          </div>
          {data.owner.email === user.email ||
            (CheckPerm(data.perms, user.email, data.uuid) && (
              <Button className="scale-75" onClick={moreHandler}>
                <MoreSvg />
              </Button>
            ))}
        </div>

        <div className="row w-full max-h-24 overflow-y-autod mt-2">
          {data.projects.length === 0 ? (
            <>
              <div className="">{t("There are no projects yet.")}</div>
            </>
          ) : (
            data.projects.map((e, i) => (
              <button
                onClick={(event) => projectHandler(e.name, event)}
                className="mid border-2 border-white/10 bg-white/5 rounded-xl px-3 py-1 mx-1"
                key={i}
              >
                <Image
                  src={e.avatar}
                  alt=""
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <div className="text-lg ms-1">{e.name}</div>
              </button>
            ))
          )}
        </div>
        <div className="mt-1 opacity-50 w-full mid">
          <div className="me-auto mt-6">
            {data.created.getFullYear()}/{data.created.getDate()}/
            {data.created.getMonth() + 1}
          </div>
          <div className="mid p-2 rounded-lg border-2 border-white/5 bg-white/[3%]">
            <div className="me-1">{data.users[0]._count.teamMembers}</div>
            <UsersSvg />
          </div>
        </div>
      </button>
    </>
  );
}
