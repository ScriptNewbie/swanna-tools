import { useEffect, useState } from "react";
import { getLiturgia } from "./getLiturgia";

interface LiturgyDay {
  date: Date;
  description: string;
}

export interface Liturgy {
  [isoDateString: string]: string;
}

export const useLiturgia = () => {
  const [liturgia, setLiturgia] = useState<LiturgyDay[]>([]);

  useEffect(() => {
    getLiturgia().then((res) => {
      setLiturgia(res.map((day) => ({ ...day, date: new Date(day.date) })));
    });
  }, []);

  const liturgyObject = {} as Liturgy;

  liturgia.forEach((item) => {
    const isoDateString = new Date(item.date).toISOString().split("T")[0];
    liturgyObject[isoDateString] = item.description;
  });

  return liturgyObject;
};
