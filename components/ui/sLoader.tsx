import { colors } from "@/config";
import { SyncLoader } from "react-spinners";

export default function SLoader() {
  return (
    <>
      <SyncLoader color={colors[0]} />
    </>
  );
}
