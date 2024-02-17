import axios from "axios";
import { useEffect, useState } from "react";

interface Day {
  date: Date;
  description: string;
}

export const useLiturgia = (date: Date) => {
  const [liturgia, setLiturgia] = useState<Day[]>([]);

  useEffect(() => {
    axios.get<Day[]>("http://localhost:3000/").then((res) => {
      setLiturgia(
        res.data.map((day) => ({ ...day, date: new Date(day.date) }))
      );
    });
  }, []);

  return liturgia.filter((day) => {
    const dayDurationInMs = 24 * 60 * 60 * 1000;
    return (
      day.date > date &&
      day.date < new Date(date.getTime() + 8 * dayDurationInMs)
    );
  });
};
