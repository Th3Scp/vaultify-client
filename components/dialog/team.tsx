import { useRouter } from "next/navigation";
import {
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppContext, TeamDialog } from "../context";
import MyDialog from "../ui/dialog";
import {
  createProject,
  getTeam,
  TeamAdminData,
  TeamAdminProjectsData,
} from "../actions/team";
import { CookGet } from "../global/cookie";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import {
  AddSvg,
  BackSvg,
  CheckSvg,
  CloseSvg,
  EditSvg,
  MessageSvg,
  ProjectSvg,
  Setting2Svg,
  TrashSvg,
  UsersSvg,
} from "../svg/main";
import {
  MotionMXFade,
  MotionMYFade,
  MotionXFade,
  MotionYFade,
} from "../ui/animation";
import SLoader from "../ui/sLoader";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import Tooltip from "../ui/tooltip";
import { Input } from "../ui/input";
import MultiSelect from "../ui/multiSelect";
import {
  deleteProject,
  getProjectSetting,
  ProjectSettingData,
} from "../actions/project";

const sets = [
  { key: "main", name: "Global", svg: <Setting2Svg /> },
  { key: "chat", name: "Chat", svg: <MessageSvg /> },
  { key: "projects", name: "Projects", svg: <ProjectSvg /> },
  { key: "users", name: "Users", svg: <UsersSvg /> },
];

type WhType = (typeof sets)[number]["key"];

type ProjectType = {};
type UserType = { email: string; avatar: string };

export default function TeamSettingDialog() {
  const { setTeamDialog, teamDialog, setMainDialogData } =
    useContext(AppContext);
  const { t } = useTranslation();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [wh, setWh] = useState<WhType>("main");
  const [team, setTeam] = useState<TeamAdminData>();

  const closeHandler = () => {
    setOpen(false);
    setTeam(undefined);
    setWh("main");
  };

  const changeWhHandler = (key: WhType) => {
    setWh(key);
    if (teamDialog !== undefined) setTeamDialog(undefined);
  };

  async function fetch(handler?: (data: TeamAdminData) => void, uuid?: string) {
    const res = await getTeam({
      jwt: CookGet("jwt")!,
      uuid: uuid ? uuid : teamDialog.uuid,
    });
    if (res.status === 201) {
      toast.warn(t("Not allowed"));
    } else {
      if (handler !== undefined) {
        handler(res.data);
      } else setTeam(res.data);
    }
  }

  useEffect(() => {
    if (teamDialog !== undefined) {
      setOpen(true);
      fetch();
      if (
        teamDialog.createProject !== undefined ||
        teamDialog.projects !== undefined ||
        teamDialog.project !== undefined
      ) {
        setWh("projects");
      } else if (
        teamDialog.users !== undefined ||
        teamDialog.user !== undefined
      ) {
        setWh("users");
      }
    }
  }, [teamDialog]);

  const Main = () => {
    const [name, setName] = useState(team?.name);
    const [avatar, setAvatar] = useState(team?.avatar);

    return (
      <>
        <div className="text-lg">{t("Team name")}</div>
        <Input value={name} onChange={(e) => setName(e.currentTarget.value)} />
        <div className="text-lg mt-4">{t("Team avatar")}</div>
        <Input
          value={avatar}
          onChange={(e) => setAvatar(e.currentTarget.value)}
        />
      </>
    );
  };

  const ProjectCreate = ({ closeHandler }: { closeHandler: () => void }) => {
    const [users, setUsers] = useState<UserType[]>([]);

    const nameRef = useRef<HTMLInputElement>(null);
    const avatarRef = useRef<HTMLInputElement>(null);

    const createHandler = async () => {
      const name = nameRef.current!.value;
      const avatar = avatarRef.current!.value;

      if (name.length < 3) {
        toast.warn(t("Please enter a name with at least 3 character"));
        return;
      }

      const res = await createProject({
        teamId: team!.uuid,
        jwt: CookGet("jwt")!,
        data: {
          name: name,
          avatar: avatar,
          users: users.map((e) => e.email),
        },
      });
      if (res.status === 201) {
        toast.error(t("Not allowed"));
      } else {
        toast.success(t("Created"));
        closeHandler();
      }
    };

    const addUserHandler = (data: UserType[]) => {
      setUsers(data);
    };

    return (
      <div className="w-full">
        <div className="">{t("Name")}</div>
        <Input placeholder={t("Project name")} ref={nameRef} />

        <div className="mt-2">{t("Avatar")}</div>
        <Input placeholder={t("Project avatar")} ref={avatarRef} />

        <div className="flex w-full mt-3">
          <MultiSelect
            defaultSelected={users}
            items={team!.users as UserType[]}
            onChange={addUserHandler}
            title={
              <div className="mid">
                <div className="colored me-1">
                  <UsersSvg />
                </div>
                {t("Manage users")}
              </div>
            }
            Btn={
              <div className="mid">
                <div className="colored me-1">
                  <UsersSvg />
                </div>
                {t("Manage users")}
              </div>
            }
            getSearchParameter={(data: UserType) => data.email}
            renderItems={(data: UserType) => (
              <>
                <Image
                  src={data.avatar}
                  alt=""
                  width={30}
                  height={30}
                  className="rounded-full"
                />
                <div className="ms-1 text-hidden">{data.email}</div>
              </>
            )}
          />
          <div className="group ms-1 border-2 border-white/[5%] dark:bg-black/[50%] rounded-xl mid p-2">
            <div className="group-hover:scale-125 scale-100 transition-all">
              {users.length}
            </div>{" "}
            <div className="ms-1">{t("users selected")}</div>
          </div>
        </div>

        <div className="w-full mid mt-3">
          <Button onClick={createHandler} className="w-1/2">
            {t("Create")}
          </Button>
        </div>
      </div>
    );
  };

  const ProjectsShow = ({
    clickHandler,
  }: {
    clickHandler: (uuid: string) => void;
  }) => {
    const [items, setItems] = useState<TeamAdminProjectsData[]>();

    useEffect(() => {
      fetch((data: TeamAdminData) => setItems(data.projects), team!.uuid);
    }, []);

    return (
      <>
        <div className="w-full mb-2 row justify-center"></div>
        {items === undefined ? (
          <div className="mid my-10 w-full">
            <SLoader />
          </div>
        ) : items.length === 0 ? (
          <div className="w-full mid my-10">
            {t("There are no projects yet.")}
          </div>
        ) : (
          items.map((e, i) => (
            <MotionMYFade key={i} delay={i * 0.1}>
              <Button onClick={() => clickHandler(e.uuid)} className="mid m-1">
                <Image
                  src={e.avatar}
                  alt=""
                  width={30}
                  height={30}
                  className="me-1 rounded-full"
                />
                {e.name}
              </Button>
            </MotionMYFade>
          ))
        )}
      </>
    );
  };

  const ProjectShow = ({
    uuid,
    closeHandler,
  }: {
    uuid: string;
    closeHandler: () => void;
  }) => {
    const [item, setItem] = useState<ProjectSettingData>();

    const fetchProject = async () => {
      const res = await getProjectSetting({ jwt: CookGet("jwt")!, uuid: uuid });
      if (res.status === 201) {
        toast.error(t("Not allowed"));
        closeHandler();
      } else {
        setItem(res.data);
        console.log(res.data);
      }
    };

    useEffect(() => {
      fetchProject();
    }, []);

    return <></>;
  };

  const ProjectDelete = ({
    uuid,
    closeHandler,
    finishHandler
  }: {
    uuid: string;
    closeHandler: () => void;
    finishHandler:()=>void;
  }) => {
    const project = team!.projects.find((g) => g.uuid === uuid)!;
    const handler = async () => {
      const res = await deleteProject({ jwt: CookGet("jwt")!, uuid: uuid });
      if (res.status === 201) {
        toast.warn(t("An unexpected error occurred. Please try again later."));
      } else {
        toast.warn(t("Successfully deleted."));
        finishHandler();
      }
    };
    return (
      <>
        <div className="mid-c w-full">
          <div className="text-xl opacity-90">{t("Are you sure you want to delete?")}</div>
          <div className="opacity-80 text-lg">
            {t("Project name")} : {project.name}
          </div>
          <div className="mid mt-3">
            <Button className="mx-1" onClick={closeHandler}>
              {t("Cancel")}
            </Button>
            <Button className="border-red-600 mx-1" onClick={handler}>
              <div className="text-red-600">{t("Delete")}</div>
            </Button>
          </div>
        </div>
      </>
    );
  };

  const Projects = () => {
    const [create, setCreate] = useState(false);
    const [edit, setEdit] = useState<string>();
    const [show, setShow] = useState<string>();
    const [deleteP, setDeleteP] = useState<string>();

    const mainClickHandler = () => {
      setCreate(false);
      setEdit(undefined);
      setShow(undefined);
    };

    const clickToShowHandler = (uuid: string) => {
      setShow(uuid);
    };

    const clickToEditHandler = () => {
      setEdit(show);
    };
    const ClickToDeleteHandler = () => {
      setDeleteP(show);
    };

    const createClickHandler = () => {
      setCreate(true);
    };

    const backClickHandler = () => {
      if (create) {
        setCreate(false);
      } else if (edit) {
        setEdit(undefined);
      } else if (show) {
        setShow(undefined);
        setDeleteP(undefined);
      }
    };

    useEffect(() => {
      if (teamDialog !== undefined) {
        if (teamDialog.createProject !== undefined) {
          setCreate(true);
        } else if (teamDialog.project !== undefined) {
          setShow(teamDialog.project);
        }
      }
    }, []);

    const WhShow = () => {
      const Item = ({ text }: { text: string }) => (
        <>
          <MotionXFade>/</MotionXFade>
          <div className="mx-[0.5px]"></div>
          <MotionXFade delay={0.5}>{text}</MotionXFade>
        </>
      );
      return create ? (
        <Item text={t("Create")} />
      ) : edit !== undefined ? (
        <Item text={t("Edit")} />
        ) : deleteP ? 
        <Item text={t("Delete")} />
      : (
        show !== undefined && <Item text={t("Show")} />
      );
    };
    const Btns = () => {
      const Btn = ({
        clickHandler,
        children,
        className,
        delay = 0.3,
        tooltip,
        ref,
      }: {
        children: ReactNode;
        clickHandler?: () => void;
        className?: string;
        delay?: number;
        tooltip: string;
        ref?: RefObject<HTMLButtonElement | null>;
      }) => (
        <Tooltip content={tooltip} placeholder="bottom">
          <MotionMXFade delay={delay}>
            <button
              ref={ref}
              onClick={clickHandler}
              className={cn(
                "aspect-square rounded-lg h-8 colored bg-black/[7%] dark:bg-white/[3%] hover:bg-black/[4%] dark:hover:bg-white/[6%] transition-all mid mx-[1px]",
                className
              )}
            >
              {children}
            </button>
          </MotionMXFade>
        </Tooltip>
      );
      return create ? (
        <>
          <Btn clickHandler={backClickHandler} tooltip={t("Back")}>
            <BackSvg />
          </Btn>
        </>
      ) : edit ? (
        <>
          <Btn clickHandler={backClickHandler} tooltip={t("Back")}>
            <BackSvg />
          </Btn>
        </>
      ) : deleteP ? (
        <>
          <Btn clickHandler={backClickHandler} tooltip={t("Back")}>
            <BackSvg />
          </Btn>
        </>
      ) : show ? (
        <>
          <Btn
            clickHandler={ClickToDeleteHandler}
            className="text-red-600"
            delay={0.7}
            tooltip={t("Delete")}
          >
            <TrashSvg />
          </Btn>
          <Btn
            clickHandler={clickToEditHandler}
            className="text-yellow-600"
            delay={0.5}
            tooltip={t("Edit")}
          >
            <EditSvg />
          </Btn>
          <Btn clickHandler={backClickHandler} tooltip={t("Back")}>
            <BackSvg />
          </Btn>
        </>
      ) : (
        <>
          <Btn clickHandler={createClickHandler} tooltip={t("Create")}>
            <AddSvg />
          </Btn>
        </>
      );
    };
    const TopHolder = useMemo(() => {
      return ({ children }: { children: ReactNode }) => {
        return (
          <MotionYFade>
            <div className="flex w-full bg-black/[5%] dark:bg-black/[20%] h-11 py-2 px-3 rounded-lg border-2 border-white/[2%] mb-3 relative">
              {children}
            </div>
          </MotionYFade>
        );
      };
    }, []);

    return (
      <>
        <TopHolder>
          <button onClick={mainClickHandler} className="mid">
            <MotionXFade delay={0.5}>
              <ProjectSvg />
            </MotionXFade>
            <div className="mx-1">{t("Projects")}</div>
          </button>
          <div className="opacity-50 flex">
            <WhShow />
          </div>
          <div className="ms-auto absolute right-1 top-0 h-full mid">
            <Btns />
          </div>
        </TopHolder>
        <div className="row w-full">
          {create ? (
            <div className="w-full">
              <MotionMYFade>
                <ProjectCreate closeHandler={() => setCreate(false)} />
              </MotionMYFade>
            </div>
          ) : edit ? (
            ""
          ) : deleteP !== undefined ? (
            <ProjectDelete
              uuid={deleteP!}
              closeHandler={() => setDeleteP(undefined)}
              finishHandler={()=> backClickHandler()}
            />
          ) : show !== undefined ? (
            <ProjectShow uuid={show!} closeHandler={() => setShow(undefined)} />
          ) : (
            <ProjectsShow clickHandler={clickToShowHandler} />
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <MyDialog
        isOpen={open}
        setIsOpen={closeHandler}
        leftBtns={
          <button onClick={closeHandler} className="absolute left-3 opacity-75">
            <CloseSvg />
          </button>
        }
        title={
          <div className="mid">
            {team !== undefined && (
              <>
                <Image
                  src={team.avatar}
                  alt=""
                  width={25}
                  height={25}
                  className="rounded-full"
                />
                <div className="ms-2 mt-1">{team.name}</div>
              </>
            )}
          </div>
        }
      >
        <div className="flex">
          <div className="md:w-52 h-full p-2">
            {sets.map((e, i) => (
              <MotionXFade delay={i * 0.3} key={i}>
                <button
                  className={`text-xl py-3 md:py-2 px-3 rounded-md w-full transition-all flex my-1  ${
                    wh === e.key
                      ? "dark:text-white dark:bg-white/10 text-black bg-gray-700/20"
                      : "dark:text-white/50 dark:hover:bg-white/5 text-black/70 hover:bg-gray-700/5"
                  }`}
                  onClick={() => changeWhHandler(e.key)}
                >
                  {e.svg}
                  <div className="mx-1 none md:n-none">{t(e.name)}</div>
                </button>
              </MotionXFade>
            ))}
          </div>
          <div className="w-full overflow-y-scroll h-[calc(90vh-40px)] lg:h-[360px]">
            <div className="py-3 pe-4 ps-4 h-full">
              {team !== undefined ? (
                <>
                  {wh === "main" ? (
                    <Main />
                  ) : wh === "projects" ? (
                    <Projects />
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <div className="w-full h-full mid">
                  <SLoader />
                </div>
              )}
            </div>
          </div>
        </div>
      </MyDialog>
    </>
  );
}
