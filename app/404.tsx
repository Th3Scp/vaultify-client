"use client";

import { useTranslation } from "react-i18next";

export default function Error() {
  const { t } = useTranslation();
  return <>
  <div className="w-full h-full mid">{t("404")}</div>
  </>;
}
