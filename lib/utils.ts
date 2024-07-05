import { useGlobalStore } from "@/hooks/useGlobalStore";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args));
};

export const checkFinished = (
  date: string,
  duration: number,
  currentDay?: number
) => {
  if (currentDay && currentDay !== getCurrentDay()) return false;
  const now = new Date();
  const lectureDate = new Date(date);
  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();
  const lectureHours = lectureDate.getHours();
  const lectureMinutes = lectureDate.getMinutes();

  const nowInMinutes = nowHours * 60 + nowMinutes;
  const lectureInMinutes = lectureHours * 60 + lectureMinutes;

  const diffinMinutes = nowInMinutes - lectureInMinutes;

  return diffinMinutes >= duration;
};

export const checkHappening = (
  date: string,
  duration: number,
  currentDay?: number
) => {
  if (currentDay && currentDay !== getCurrentDay()) return false;
  const now = new Date();
  const lectureDate = new Date(date);
  const nowHours = now.getHours();
  const nowMinutes = now.getMinutes();
  const lectureHours = lectureDate.getHours();
  const lectureMinutes = lectureDate.getMinutes();

  const nowInMinutes = nowHours * 60 + nowMinutes;
  const lectureInMinutes = lectureHours * 60 + lectureMinutes;

  const diffInMinutes = nowInMinutes - lectureInMinutes;

  return diffInMinutes >= 0 && diffInMinutes < duration;
};

export const formatTime = (isoDateTime: string): string => {
  const date = new Date(isoDateTime);

  const pad = (num: number): string => num.toString().padStart(2, "0");

  let hours = date.getUTCHours();
  const minutes = pad(date.getUTCMinutes());
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const hoursString = pad(hours);

  return `${hoursString}:${minutes} ${ampm}`;
};

export const getCurrentDay = () => {
  return new Date().getDay();
};

export const getCurrentDayName = (idx?: number) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  if (idx) {
    return days[idx];
  }
  return days[getCurrentDay()];
};

export const checkPresent = (data: any[], id: string) => {
  return data.includes(id);
};
