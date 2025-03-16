"use client";

import { getTeamPage, TeamPage } from "@/components/actions/team";
import { AppContext } from "@/components/context";
import CheckPerm, { checkIsAdmin } from "@/components/global/checkPerm";
import { CookGet } from "@/components/global/cookie";
import { convertTime } from "@/components/global/tims";
import {
  AddSvg,
  AdminSvg,
  CrownSvg,
  FolderGearSvg,
  MoreSvg,
  ProjectSvg,
  SubTaskSvg,
  TaskSvg,
  UserGearSvg,
  UserSvg,
} from "@/components/svg/main";
import { MotionXFade } from "@/components/ui/animation";
import { Button } from "@/components/ui/button";
import SLoader from "@/components/ui/sLoader";
import Tooltip from "@/components/ui/tooltip";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function Page() {
  const { user, setTeamDialog } = useContext(AppContext);
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const uuid = pathname.split("/")[3];

  const [team, setTeam] = useState<TeamPage>();

  const userClickHandler = (email: string) => {
    setTeamDialog({
      uuid: uuid,
      user: email,
    });
  };

  const userManageClickHandler = () => {
    setTeamDialog({
      uuid: uuid,
      users: true,
    });
  };

  const projectManageClickHandler = () => {
    setTeamDialog({
      uuid: uuid,
      projects: true,
    });
  };

  const projectAddClickHandler = () => {
    setTeamDialog({
      uuid: uuid,
      createProject: true,
    });
  };

  const moreClickHandler = () => {
    setTeamDialog({
      uuid: uuid,
    });
  };

  const fetch = async () => {
    const res = await getTeamPage({ jwt: CookGet("jwt")!, uuid: uuid });
    if (res.status === 201) {
      toast.warn(t("Not allowed"));
      router.push("/team");
    } else {
      setTeam(res.data);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      {team === undefined ? (
        <SLoader />
      ) : (
        <>
          <div className="container row w-full h-full">
            <div className="w-full md:w-6/12 lg:w-7/12 xl:w-8/12 p-2">
              <div className="rounded-xl border-2 border-white/[3%] bg-gray-200 dark:bg-neutral-950 p-3 relative">
                <div className="ms-auto row justify-center mb-2">
                  <Tooltip content={t("Users")}>
                    <div className="border-2 border-white/[5%] p-2 rounded-lg mid mx-1 relative transition-all hover:scale-[120%] hover:mx-2 scale-100 group">
                      <div className="me-1 group-hover:scale-150 scale-100 transition-all">
                        {team.users.length}
                      </div>
                      <div className="colored">
                        <UserSvg />
                      </div>
                    </div>
                  </Tooltip>
                  <Tooltip content={t("Projects")}>
                    <div className="border-2 border-white/[5%] p-2 rounded-lg mid mx-1 relative transition-all hover:scale-[120%] hover:mx-2 scale-100 group">
                      <div className="me-1 group-hover:scale-150 scale-100 transition-all">
                        {team.projects.length}
                      </div>
                      <div className="colored">
                        <ProjectSvg />
                      </div>
                    </div>
                  </Tooltip>

                  <Tooltip content={t("Task")}>
                    <div className="border-2 border-white/[5%] p-2 rounded-lg mid mx-1 relative transition-all hover:scale-[120%] hover:mx-2 scale-100 group">
                      <div className="me-1 group-hover:scale-150 scale-100 transition-all">
                        {team._count.tasks}
                      </div>
                      <div className="colored">
                        <TaskSvg />
                      </div>
                    </div>
                  </Tooltip>

                  <Tooltip content={t("Sub task")}>
                    <div className="border-2 border-white/[5%] p-2 rounded-lg mid mx-1 relative transition-all hover:scale-[120%] hover:mx-2 scale-100 group">
                      <div className="me-1 group-hover:scale-150 scale-100 transition-all">
                        {team._count.sub_tasks}
                      </div>
                      <div className="colored">
                        <SubTaskSvg />
                      </div>
                    </div>
                  </Tooltip>

                  {team.owner.email === user.email ||
                  CheckPerm(team.perms, user.email, "") ? (
                    <Tooltip content={t("Manage team")}>
                      <Button onClick={moreClickHandler}>
                        <MoreSvg />
                      </Button>
                    </Tooltip>
                  ) : (
                    ""
                  )}
                </div>
                <div className="row">
                  <div className="">
                    <div className="flex mb-2 ">
                      <Image
                        src={team.avatar}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="text-2xl ms-2 text-hidden mt-1 first-letter:uppercase">
                        {team.name}
                      </div>
                    </div>
                    <div className="mt-2 oapcity-80 flex">
                      <div className="oapcity-50 uppercase text-sm me-1">
                        {t("Created")} :
                      </div>
                      {convertTime(team.created)}
                    </div>
                  </div>
                  <div className="opacity-90">{team.description}</div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-white/[3%] bg-gray-200 dark:bg-neutral-950 p-3 relative mt-3">
                <div className="absolute top-1 right-0">
                  {team.owner.email === user.email ||
                  CheckPerm(team.perms, user.email, "") ? (
                    <Tooltip content={t("Manage users")}>
                      <Button
                        onClick={userManageClickHandler}
                        className="rounded-lg"
                      >
                        <UserGearSvg />
                      </Button>
                    </Tooltip>
                  ) : (
                    ""
                  )}
                </div>

                <div className="flex me-auto mb-4">
                  <div className="colored">
                    <UserSvg />
                  </div>
                  <div className="ms-2">{t("Users")}</div>
                </div>

                <div className="row w-full">
                  {team.users.map((e, i) => (
                    <MotionXFade delay={0.2 * i} key={i}>
                      <button
                        onClick={() => userClickHandler(e.email)}
                        className="mid bg-white/[3%] hover:bg-white/[5%] transition-all py-2 px-4 rounded-3xl m-1"
                      >
                        <Image
                          src={e.avatar}
                          alt=""
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                        <div className="ms-2">{e.email.split("@")[0]}</div>
                        {user.email === team.owner.email ? (
                          <div className="text-yellow-400 ms-2">
                            <CrownSvg />
                          </div>
                        ) : checkIsAdmin(team.perms, user.email) ? (
                          <div className="text-orange-400 ms-2">
                            <AdminSvg />
                          </div>
                        ) : (
                          ""
                        )}
                      </button>
                    </MotionXFade>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border-2 border-white/[3%] bg-gray-200 dark:bg-neutral-950 p-3 relative mt-3">
                <div className="flex absolute top-1 right-0">
                  {team.owner.email === user.email ||
                  CheckPerm(team.perms, user.email, "") ? (
                    <>
                      <Tooltip content={t("Manage projects")}>
                        <Button
                          onClick={projectManageClickHandler}
                          className="rounded-lg"
                        >
                          <FolderGearSvg />
                        </Button>
                      </Tooltip>
                      <Tooltip content={t("Create")}>
                        <Button
                          onClick={projectAddClickHandler}
                          className="rounded-lg me-1"
                        >
                          <div className="colored">
                            <AddSvg />
                          </div>
                        </Button>
                      </Tooltip>
                    </>
                  ) : (
                    ""
                  )}
                </div>

                <div className="flex me-auto mb-4">
                  <div className="colored">
                    <ProjectSvg />
                  </div>
                  <div className="ms-2">{t("Projects")}</div>
                </div>

                <div className="row w-full">
                  {team.projects.length === 0 ? (
                    <>{t("There are no projects yet.")}</>
                  ) : (
                    team.projects.map((e, i) => <div key={i}>{e.name}</div>)
                  )}
                </div>
              </div>
            </div>

            <div className="w-full md:w-6/12 lg:w-5/12 xl:w-4/12 p-2"></div>
          </div>
        </>
      )}
    </>
  );
}
