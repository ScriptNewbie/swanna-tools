import axios from "axios";
import { useEffect, useState } from "react";

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
    axios.get<LiturgyDay[]>("http://localhost:3000/").then((res) => {
      setLiturgia(
        res.data.map((day) => ({ ...day, date: new Date(day.date) }))
      );
    });
  }, []);

  const liturgyObject = {} as Liturgy;

  liturgia.forEach((item) => {
    const isoDateString = new Date(item.date).toISOString();
    liturgyObject[isoDateString] = item.description;
  });

  return liturgyObject;
};