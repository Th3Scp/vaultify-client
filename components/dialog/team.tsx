import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import getParameter from "../global/getParameter";

export default function TeamSettingDialog() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<string>();

  useEffect(() => {
    const q = getParameter("team");
    if (q) {
      setOpen(true);
      setId(q);
      router.push(pathname);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!open) {
      setId(undefined);
    }
  }, [open]);

  useEffect(()=>{
    if(id !== undefined){
        
    }
  },[])

  return <></>;
}
