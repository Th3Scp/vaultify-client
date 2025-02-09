"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { DayType } from "./ui/datepicker";

export type Password = {
  id: number;
  name: string;
  color: string;
  password: string;
  email: string;
  username: string;
  icon: string;
};
export type Website = {
  id: number;
  name: string;
  link: string;
  pin: boolean;
};
export type Task = {
  id: number;
  name: string;
  desc: string;
  color: undefined | string;
  weekdays: false | number[];
  dates: false | DayType[];
  created: number;
  checked: string[];
};
export type Note = {
  id: number;
  text: string;
  updated: number;
};
export type MainDialog =
  | {
      open: true;
      onClose: () => void;
      onConfirm: () => void;
      title: string;
      children: ReactNode;
    }
  | {
      open: false;
    };

export const AppContext = createContext<any>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [reload, setReload] = useState(false);
  const [mainDialogData, setMainDialogData] = useState<MainDialog>({
    open: false,
  });

  // ======
  const [isLogin, setIsLogin] = useState(false);
  const [user,setUser]=useState({
    email:"",
  })
  // ======

  function changePasswords(pass: Password[]) {
    localStorage.setItem("passwords", JSON.stringify(pass));
  }

  function passwords(): Password[] {
    if (localStorage.passwords) {
      return JSON.parse(localStorage.passwords);
    } else {
      localStorage.setItem("passwords", JSON.stringify([]));
      return [];
    }
  }

  function changeWebsites(web: Website[]) {
    localStorage.setItem("websites", JSON.stringify(web));
    setReload((g) => !g);
  }

  function websites(): Website[] {
    if (localStorage.websites !== undefined) {
      return JSON.parse(localStorage.websites);
    } else {
      localStorage.setItem("websites", JSON.stringify([]));
      return [];
    }
  }

  function changeTasks(tasks: Task[]) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    setReload((g) => !g);
  }

  function tasks(): Task[] {
    if (localStorage.tasks !== undefined) {
      return JSON.parse(localStorage.tasks);
    } else {
      localStorage.setItem("tasks", JSON.stringify([]));
      return [];
    }
  }

  function changeNotes(notes: Note[]) {
    localStorage.setItem("notes", JSON.stringify(notes));
    setReload((g) => !g);
  }

  function notes(): Note[] {
    if (localStorage.notes !== undefined) {
      return JSON.parse(localStorage.notes).sort(
        (a: Note, b: Note) => b.updated - a.updated
      );
    } else {
      localStorage.setItem("notes", JSON.stringify([]));
      return [];
    }
  }

  // useEffect(() => {
  //   localStorage.setItem("tasks", JSON.stringify([]));
  //   localStorage.setItem("websites", JSON.stringify([]));
  //   localStorage.setItem("passwords", JSON.stringify([]));
  // });

  return (
    <AppContext.Provider
      value={{
        isLogin: isLogin,
        setIsLogin: setIsLogin,
        //
        user: user,
        setUser: setUser,
        //
        reload: reload,
        setReload: setReload,
        //
        mainDialogData: mainDialogData,
        setMainDialogData: setMainDialogData,
        //
        passwords: passwords,
        changePasswords: changePasswords,
        //
        websites: websites,
        changeWebsites: changeWebsites,
        //
        tasks: tasks,
        changeTasks: changeTasks,
        //
        notes: notes,
        changeNotes: changeNotes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
