import { useState } from "react";
import "./App.css";
import { useLiturgia } from "./useLiturgia";

function App() {
  const now = new Date();
  const dayDurationInMs = 24 * 60 * 60 * 1000;
  const toSundayDayOffset = 7 - now.getDay();
  const nextSunday = new Date(
    now.getTime() + toSundayDayOffset * dayDurationInMs
  );

  const [startingSunday, setStartingSunday] = useState(nextSunday);
  const liturgia = useLiturgia(startingSunday);

  const nextWeek = () =>
    setStartingSunday(new Date(startingSunday.getTime() + 7 * dayDurationInMs));

  const prevWeek = () =>
    setStartingSunday(new Date(startingSunday.getTime() - 7 * dayDurationInMs));

  const days = [
    "Niedziela",
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota",
  ];

  console.log(liturgia);
  return (
    <div>
      {liturgia.map((day) => (
        <tr>
          <td>{new Date(day.date).toLocaleDateString()}</td>
          <td>{days[new Date(day.date).getDay()]}</td>{" "}
          <td>{day.description}</td>
          <td>
            <button
              onClick={() => {
                navigator.clipboard.writeText(day.description);
              }}
            >
              Kopiuj
            </button>
          </td>
        </tr>
      ))}
      <button onClick={prevWeek}>{"<-"}</button>{" "}
      <button onClick={nextWeek}>{"->"}</button>
    </div>
  );
}

export default App;
