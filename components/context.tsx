"use client";
import { createContext, ReactNode, useState } from "react";
import { DayType } from "./ui/datepicker";

// Define types
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

export type TeamDialog =
  | {
      uuid: string;
      createProject?:boolean;
      projects?:boolean;
      project?:boolean;
      users?:boolean;
      user?:string;
    }
  | undefined;

// Define the shape of the context
export type AppContextType = any;

// Create the context with a default value
export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [reload, setReload] = useState(false);
  const [mainDialogData, setMainDialogData] = useState<MainDialog>({
    open: false,
  });
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({ email: "" });
  const [teamDialog, setTeamDialog] = useState<TeamDialog>();

  // Helper function to get or initialize localStorage data
  const getLocalStorageData = <T,>(key: string, defaultValue: T): T => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  };

  // Helper function to update localStorage data
  const updateLocalStorageData = <T,>(key: string, data: T) => {
    localStorage.setItem(key, JSON.stringify(data));
    setReload((prev) => !prev); // Trigger a re-render
  };

  // Passwords
  const passwords = (): Password[] => {
    return getLocalStorageData<Password[]>("passwords", []);
  };

  const changePasswords = (passwords: Password[]) => {
    updateLocalStorageData("passwords", passwords);
  };

  // Websites
  const websites = (): Website[] => {
    return getLocalStorageData<Website[]>("websites", []);
  };

  const changeWebsites = (websites: Website[]) => {
    updateLocalStorageData("websites", websites);
  };

  // Tasks
  const tasks = (): Task[] => {
    return getLocalStorageData<Task[]>("tasks", []);
  };

  const changeTasks = (tasks: Task[]) => {
    updateLocalStorageData("tasks", tasks);
  };

  // Notes
  const notes = (): Note[] => {
    const notesData = getLocalStorageData<Note[]>("notes", []);
    return notesData.sort((a, b) => b.updated - a.updated); // Sort by updated timestamp
  };

  const changeNotes = (notes: Note[]) => {
    updateLocalStorageData("notes", notes);
  };

  // Provide the context value
  const contextValue: AppContextType = {
    isLogin,
    setIsLogin,
    user,
    setUser,
    teamDialog,
    setTeamDialog,
    reload,
    setReload,
    mainDialogData,
    setMainDialogData,
    passwords,
    changePasswords,
    websites,
    changeWebsites,
    tasks,
    changeTasks,
    notes,
    changeNotes,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}