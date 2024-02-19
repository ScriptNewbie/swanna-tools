import { addDaysToDate } from "./daysUtils";

interface MassPrototype {
  hour: string;
  intention: string;
  chapel: boolean;
}

export interface Mass extends MassPrototype {
  id: number;
}

export interface MassSchedule {
  [isoDateString: string]: Mass[] | undefined;
}

const datesAreSame = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const getEasterDate = (year: number) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
};

const getService = (day: number, serviceName: string, hour?: string) => {
  hour = hour || (day === 7 ? "15:00" : day === 4 ? "16:30" : "17:30");
  return {
    hour,
    intention: serviceName,
    chapel: day === 4,
  };
};

const getSpecialEventsForDay = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = ((date.getDay() + 6) % 7) + 1;
  const specialEvents = [] as MassPrototype[];

  if (month === 5) specialEvents.push(getService(day, "Nabożeństwo majowe"));

  if (month === 6 && day === 7)
    specialEvents.push(getService(day, "Nabożeństwo czerwcowe"));

  if (month === 10) {
    specialEvents.push(getService(day, "Nabożeństwo różańcowe"));
  }
  //Wielki post
  const greatFastingEnd = getEasterDate(year);
  const greatFastingBegin = addDaysToDate(greatFastingEnd, -46);
  if (date > greatFastingBegin && date < greatFastingEnd) {
    const goodFriday = addDaysToDate(greatFastingEnd, -2);
    const holySaturday = addDaysToDate(greatFastingEnd, -1);

    if (datesAreSame(goodFriday, date)) {
      specialEvents.push(getService(day, "Droga krzyżowa", "08:00"));
      specialEvents.push(
        getService(day, "Liturgia na cześć Męki Pańskiej", "17:00")
      );
    } else if (datesAreSame(holySaturday, date)) {
      specialEvents.push(
        getService(day, "Wigilia Paschalna w Wielką Noc", "19:00")
      );
    } else {
      if (day === 5) specialEvents.push(getService(day, "Droga krzyżowa"));
      if (day === 7) specialEvents.push(getService(day, "Gorzkie żale"));
    }
  }

  //Boże Narodzenie
  if (month === 12 && date.getDate() === 25) {
    specialEvents.push(getService(day, "Pasterka - Za Parafian", "00:00"));
    specialEvents.push(getService(day, "Nieszpory kolędowe", "16:00"));
  }
  return specialEvents;
};

const isEasterMonday = (date: Date) =>
  datesAreSame(addDaysToDate(getEasterDate(date.getFullYear()), 1), date);

const isChristmas = (day: number, month: number) =>
  month === 12 && (day === 25 || day === 26);

const isOrthodoxChristmas = (day: number, month: number) =>
  month === 1 && day === 6;

export const getNewMass = (date: Date, alreadyPresent: Mass[]) => {
  const month = date.getMonth() + 1;
  const day = ((date.getDay() + 6) % 7) + 1;
  const dayOfMonth = date.getDate();

  const mostCommonMassesForDay =
    day === 7 ||
    isEasterMonday(date) ||
    isChristmas(dayOfMonth, month) ||
    isOrthodoxChristmas(dayOfMonth, month)
      ? [
          { hour: "08:00", intention: "Za Parafian", chapel: true },
          { hour: "10:00", intention: "Za Parafian", chapel: false },
          { hour: "12:00", intention: "Za Parafian", chapel: false },
          ...getSpecialEventsForDay(date),
          {
            hour: "15:00",
            intention: "Nabożeństwo popołudniowe",
            chapel: false,
          },
        ]
      : day === 2
      ? [{ hour: "07:30", intention: "Za Parafian", chapel: true }]
      : day === 4
      ? [
          ...getSpecialEventsForDay(date),
          { hour: "17:00", intention: "Za Parafian", chapel: true },
          { hour: "16:30", intention: "Nabożeństwo", chapel: true },
        ]
      : [
          ...getSpecialEventsForDay(date),
          { hour: "18:00", intention: "Za Parafian", chapel: false },
          { hour: "08:00", intention: "Za Parafian", chapel: true },
          { hour: "17:30", intention: "Nabożeństwo", chapel: false },
        ];

  for (let i = 0; i < mostCommonMassesForDay.length; ++i) {
    const potentialMass = mostCommonMassesForDay[i];
    if (
      !alreadyPresent.find(
        (presentMass) => potentialMass.hour === presentMass.hour
      )
    )
      return {
        id: alreadyPresent.reduce((a, b) => Math.max(a, b.id), 0) + 1,
        ...potentialMass,
      };
  }
  return {
    id: alreadyPresent.reduce((a, b) => Math.max(a, b.id), 0) + 1,
    hour: "00:00",
    intention: "Za Parafian",
    chapel: false,
  };
};
