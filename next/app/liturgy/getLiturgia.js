"use server";

import axios from "axios";
import cheerio from "cheerio";

const appendLeadingZero = (number) => {
  return number < 10 ? "0" + number : number;
};

export const getLiturgia = async () => {
  const { data } = await axios.get("https://niezbednik.niedziela.pl/liturgia");
  const $ = cheerio.load(data);
  const extractedData = [];
  for (let month = 0; month < 12; ++month) {
    const cards = $("#tab" + appendLeadingZero(month + 1)).find(".card-body");
    extractedData[month] = [
      ...cards.map((index, card) =>
        $(card)
          .children("a")
          .children(".kalendarz-year")
          .children(":nth-child(2)")
          .children(":nth-child(2)")
          .text()
          .replace("\n", "")
          .replace("\n", "")
          .split(" ")
          .filter((str) => str)
          .join(" ")
      ),
    ];
  }
  const months = extractedData
    .map((month, monthIndex) =>
      month.map((day, dayIndex) => ({
        date: new Date(
          `${new Date().getFullYear()}-${appendLeadingZero(
            monthIndex + 1
          )}-${appendLeadingZero(dayIndex + 1)}T12:00:00`
        ),
        description: day,
      }))
    )
    .flat();
  return months;
};
