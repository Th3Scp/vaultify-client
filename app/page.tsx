import Navbar from "./layout/navbar";
import Password from "@/components/dialog/password";
import Websites from "@/components/dialog/websites";
import Note from "@/components/side/note";
import PinedWebsites from "@/components/side/pinedWebsites";
import Task from "@/components/side/task";

export default function Home() {
  return (
    <>
      <Navbar />

      <div className="p-5 row">
        <div className="p-3 row lg:w-72 w-full">
          <div className="w-full md:w-6/12 lg:w-full p-1">
            <Password />
          </div>
          <div className="w-full md:w-6/12 lg:w-full p-1">
            <Websites />
          </div>
          <div className="w-full lg:h-[calc(100vh-285px)] overflow-y-scroll no-scroller bg-white/[1%] p-3 rounded-xl">
            <PinedWebsites />
          </div>
        </div>
        <div className="w-full lg:w-[calc(100%-288px)] p-1 max-h-[calc(100vh-140px)] row">
          <div className="w-full lg:w-6/12 p-1 lg:h-full min-h-[300px]">
            <Task />
          </div>
          <div className="w-full lg:w-6/12 p-1 lg:h-full min-h-[300px]">
            <Note />
          </div>
        </div>
      </div>
    </>
  );
}
