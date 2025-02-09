import { colors } from "@/config";
import { useTranslation } from "react-i18next";
import { SyncLoader } from "react-spinners";
export default function Loader() {
  const { t } = useTranslation();
  return (
    <>
      <div className="w-full h-[100vh] mid-c">
        <div className="text-3xl font-extrabold mb-5">{t("Loading")}</div>
        <SyncLoader color={colors[0]} />
      </div>
    </>
  );
}
