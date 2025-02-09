"use client";

import { createTeam } from "@/components/actions/team";
import { CookGet } from "@/components/global/cookie";
import { matchURL } from "@/components/global/regex";
import { AddSvg, TeamSvg } from "@/components/svg/main";
import {
  MotionMXFade,
  MotionXFade,
  MotionYFade,
} from "@/components/ui/animation";
import { InteractiveHoverButton } from "@/components/ui/button";
import { avatarGlassApi } from "@/config";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function Page() {
  const { t } = useTranslation();
  const router = useRouter();

  const nameRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const createHandler = async () => {
    const name = nameRef.current!.value;
    let avatar = avatarRef.current!.value;

    if (name.length < 5) {
      toast.warn(t("Team name must be at least 5 characters long"));
      return;
    }
    if (avatar.length === 0) {
      avatar = avatarGlassApi(name);
    } else if (!matchURL(avatar)) {
      {
        toast.warn(t("Please enter a valid url"));
        return;
      }
    }

    const res = await createTeam({
      jwt: CookGet("jwt")!,
      name: name,
      avatar: avatar,
    });
    if(res.status === 200){
router.push("/team");
    }else {
      toast.warn(t("0E"));
    }
  };

  return (
    <>
      <div className="w-96 px-4 py-5 rounded-2xl border-2 border-white dark:border-white/10 dark:bg-white/[3%] bg-gray-100">
        <div className="flex">
          <MotionXFade>
            <h2 className="text-2xl font-bold mb-6">{t("Team")}</h2>
          </MotionXFade>
          <div className="ms-auto colored">
            <MotionMXFade delay={1}>
              <TeamSvg />
            </MotionMXFade>
          </div>
        </div>
        <MotionXFade>
          <label className="block text-sm font-medium mb-2">{t("Name")}</label>
        </MotionXFade>
        <MotionXFade delay={0.6}>
          <input
            ref={nameRef}
            className="w-full p-2 border rounded-lg dark:bg-white/10 dark:border-white/20 mb-4"
            placeholder={t("Enter your team name")}
          />
        </MotionXFade>
        <MotionXFade>
          <label className="block text-sm font-medium mb-2">
            {t("Avatar")}
          </label>
        </MotionXFade>
        <MotionXFade delay={0.6}>
          <input
            ref={avatarRef}
            className="w-full p-2 border rounded-lg dark:bg-white/10 dark:border-white/20"
            placeholder={t("Enter your team avatar link (optional)")}
          />
        </MotionXFade>
        <MotionYFade delay={0.8}>
          <div className="mt-5 w-full mid">
            <InteractiveHoverButton
              onClick={createHandler}
              icon={<AddSvg />}
              className="w-1/2"
            >
              {t("Create")}
            </InteractiveHoverButton>
          </div>
        </MotionYFade>
      </div>
    </>
  );
}
