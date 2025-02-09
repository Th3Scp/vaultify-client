"use client";
import { getTeams, TeamType } from "@/components/actions/team";
import { CookGet } from "@/components/global/cookie";
import { AddSvg } from "@/components/svg/main";
import {
  MotionMXFade,
  MotionMYFade,
  MotionXFade,
  MotionYFade,
} from "@/components/ui/animation";
import { Button } from "@/components/ui/button";
import { TeamCard } from "@/components/ui/card";
import SLoader from "@/components/ui/sLoader";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Page() {
  const { t } = useTranslation();
  const router = useRouter();

  const [teams, setTeams] = useState<TeamType[]>();

  const createHandler = () => {
    router.push("/team/create");
  };

  useEffect(() => {
    async function fetch() {
      const res = await getTeams({ jwt: CookGet("jwt")! });
        setTeams(res.data);
    }
    fetch();
  }, []);

  return (
    <>
      <div className="w-full h-full mid-c">
        {teams === undefined ? (
          <SLoader />
        ) : teams.length === 0 ? (
          <>
            <MotionYFade delay={0.3}>
              <Image src="/team.svg" alt="" width={130} height={130} />
            </MotionYFade>
            <MotionXFade delay={0.6}>
              <div className="text-2xl mt-3">
                {t("Not currently a member of any team")}
              </div>
            </MotionXFade>
            <MotionMXFade delay={0.8}>
              <div className="text-lg opacity-90 mb-4">
                {t("Join a team or create your own.")}
              </div>
            </MotionMXFade>
            <MotionMYFade delay={1.1}>
              <Button className="mid-c py-5 px-12" onClick={createHandler}>
                <div className="scale-150 mb-3 colored">
                  <AddSvg />
                </div>
                <div className="text-2xl">{t("Create")}</div>
              </Button>
            </MotionMYFade>
          </>
        ) : (
          <>
            <div className="container row justify-center">
              {teams.map((e, i) => (
                <div className="w-full md:w-6/12 lg:w-4/12 p-2" key={i}>
                  <MotionMYFade delay={i * 2}>
                    <TeamCard data={e} />
                  </MotionMYFade>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
