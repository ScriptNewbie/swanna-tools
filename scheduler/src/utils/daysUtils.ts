import { Liturgy } from "../useLiturgia";

export const days = [
  "Niedziela",
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
];

export const addDaysToDate = (date: Date, days: number) => {
  const dayDurationInMs = 24 * 60 * 60 * 1000;
  return new Date(date.getTime() + days * dayDurationInMs);
};

export const getLiturgyForDay = (
  day: Date,
  liturgy: Liturgy,
  liturgyOverride: Liturgy
) => {
  const overridenLiturgy = liturgyOverride[day.toISOString()];
  let scrapedLiturgy = liturgy[day.toISOString()];
  scrapedLiturgy = scrapedLiturgy === "Dzień Powszedni" ? "" : scrapedLiturgy;

  return overridenLiturgy ?? (scrapedLiturgy || "");
};

export const getNextSunday = () => {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const toSundayDayOffset = 7 - today.getDay();
  return addDaysToDate(today, toSundayDayOffset);
};

export const getDaysArray = (startingSunday: Date) => {
  return Array.from({ length: 8 }, (_, index) =>
    addDaysToDate(startingSunday, index)
  );
};
