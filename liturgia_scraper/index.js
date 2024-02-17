const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const express = require("express");
const app = express();
app.use(
  cors({
    origin: "*",
  })
);
const port = 3000;

const appendLeadingZero = (number) => {
  return number < 10 ? "0" + number : number;
};

app.get("/", (req, res) => {
  axios.get("https://niezbednik.niedziela.pl/liturgia").then(({ data }) => {
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
    res.json(months);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
