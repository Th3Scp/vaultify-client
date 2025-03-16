"use client";
import { getTeamNav, getTeamNavWProject } from "@/components/actions/team";
import { AppContext } from "@/components/context";
import { CookGet } from "@/components/global/cookie";
import { InboxSvg, SwitchSvg } from "@/components/svg/main";
import {
  MotionMXFade,
  MotionXFade,
  MotionYFade,
} from "@/components/ui/animation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Navbar() {
  const { user } = useContext(AppContext);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [navigator, setNavigator] = useState<{
    team: string | false;
    teamAvatar: string;
    project: false | string;
    projectAvatar: string;
  }>({
    team: false,
    teamAvatar: "/",
    project: false,
    projectAvatar: "/",
  });

  const teamClickHandler = () => {
    if (navigator.team) {
      router.push("/team");
    } else {
      router.push(`/team/s/${navigator.team}`);
    }
    setNavigator((g) => ({ ...g, project: false }));
  };
  const projectClickHandler = () => {
    router.push(`/team/${navigator.team}/${navigator.project}`);
  };
  const homeClickHandler = () => {
    router.push("/team");
  };
  const fetchTeam = async () => {
    const res = await getTeamNav({
      jwt: CookGet("jwt")!,
      uuid: pathname.split("/")[3],
    });
    if (res.status === 200) {
      setNavigator({
        team: res.data.name,
        teamAvatar: res.data.avatar,
        project: false,
        projectAvatar: "/",
      });
    }
  };
  const fetchTeamWProject = async () => {
    const res = await getTeamNavWProject({
      jwt: CookGet("jwt")!,
      uuid: pathname.split("/")[3],
    });
    if (res.status === 200) {
      setNavigator({
        team: res.data.name,
        teamAvatar: res.data.avatar,
        project: res.data.project.name,
        projectAvatar: res.data.project.avatar,
      });
    }
  };

  useEffect(() => {
    if (pathname.includes("/team/s/")) {
      fetchTeam();
    } else if (pathname.includes("/team/p/")) {
      fetchTeamWProject();
    } else {
      setNavigator({
        team: false,
        teamAvatar: "/",
        project: false,
        projectAvatar: "/",
      });
    }
  }, [searchParams]);

  return (
    <>
      <div className="w-full h-16 fixed top-0 left-0 z-50 mid border-b-2 border-white/5 backdrop-blur-xl">
        <div className="container flex items-center h-full px-2 py-2 relative">
          <MotionXFade>
            <button onClick={homeClickHandler} className="none md:n-none">
              <Image
                src="/logo.svg"
                alt=""
                width={50}
                height={50}
                className="rounded-xl mt-2"
              />
            </button>
          </MotionXFade>
          <MotionXFade delay={0.5}>
            <div className="text-5xl mb-3 mx-2 none md:n-none md:opacity-30">
              /
            </div>
          </MotionXFade>
          <MotionYFade delay={0.8}>
            <button className="text-xl mid" onClick={teamClickHandler}>
              {navigator.team === false ? (
                <>
                  <Image
                    src={user.avatar}
                    alt=""
                    width={30}
                    height={30}
                    className="rounded-full bg-colored me-1"
                  />
                  {user.email}
                  <div className="ms-2 text-sm bg-white rounded-lg dark:bg-white/10 py-1 px-2">
                    اصلی
                  </div>
                </>
              ) : (
                <>
                  {navigator.teamAvatar === "/" ? (
                    <div className="w-[30px] h-[30px] bg-colored rounded-full uppercase font-extrabold mid relative">
                      <div className="text-lg absolute">
                        {navigator.team[0]}
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={navigator.teamAvatar}
                      alt=""
                      width={30}
                      height={30}
                      className="rounded-full bg-colored"
                    />
                  )}
                  <div className="none lg:n-none ms-2 first-letter:uppercase">
                    {navigator.team}
                  </div>
                </>
              )}
            </button>
          </MotionYFade>
          {navigator.project !== false && (
            <>
              <MotionXFade>
                <div className="text-5xl mb-3 mx-2 opacity-30">/</div>
              </MotionXFade>
              <MotionYFade delay={1}>
                <button className="text-xl" onClick={projectClickHandler}>
                  {navigator.project}
                </button>
              </MotionYFade>
            </>
          )}
          <div className="ms-auto lg:ms-0">
            <MotionYFade delay={1.3}>
              <Button className="mx-2" onClick={() => {}}>
                <SwitchSvg />
              </Button>
            </MotionYFade>
          </div>
          <div className="lg:ms-auto">
            <MotionMXFade>
              <Inbox />
            </MotionMXFade>
          </div>
        </div>
      </div>
    </>
  );
}
type InboxItem = {
  seen: boolean;
};
function Inbox() {
  const [items, setItems] = useState<InboxItem[]>([]);
  return (
    <>
      <Button className="relative" onClick={() => {}}>
        {items.filter((g) => g.seen === true).length !== 0 && (
          <div className="absolute bg-red-600 w-2 h-2 top-0 right-0 rounded-full"></div>
        )}
        <InboxSvg />
      </Button>
    </>
  );
}
