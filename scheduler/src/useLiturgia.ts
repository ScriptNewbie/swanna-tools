import axios from "axios";
import { useEffect, useState } from "react";

export interface LiturgyDay {
  date: Date;
  description: string;
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

  return liturgia;
};
