import { useState } from "react";
import "./App.css";
import { LiturgyDay, useLiturgia } from "./useLiturgia";
import { Button } from "@chakra-ui/react";
import Day from "./components/day";
import { isSameDay } from "./utils/isSameDay";

function App() {
  const today = new Date();
  const dayDurationInMs = 24 * 60 * 60 * 1000;
  const toSundayDayOffset = 7 - today.getDay();
  const nextSunday = new Date(
    today.getTime() + toSundayDayOffset * dayDurationInMs
  );

  const [startingSunday, setStartingSunday] = useState(nextSunday);
  const liturgy = useLiturgia();
  const [liturgyOverride, setLiturgyOverride] = useState<LiturgyDay[]>([]);

  const daysArray = Array.from(
    { length: 8 },
    (_, index) => new Date(startingSunday.getTime() + index * dayDurationInMs)
  );

  const nextWeek = () =>
    setStartingSunday(new Date(startingSunday.getTime() + 7 * dayDurationInMs));

  const prevWeek = () =>
    setStartingSunday(new Date(startingSunday.getTime() - 7 * dayDurationInMs));

  const handleLiturgyDescriptionChange = (date: Date, description: string) => {
    const liturgyOverrideCopy = [...liturgyOverride];
    const modifiedDay = liturgyOverrideCopy.find((liturgyDay) =>
      isSameDay(liturgyDay.date, date)
    );
    if (modifiedDay) modifiedDay.description = description;
    else liturgyOverrideCopy.push({ date, description });

    setLiturgyOverride(liturgyOverrideCopy);
  };

  return (
    <div>
      {daysArray.map((day) => (
        <Day
          key={day.toISOString()}
          day={day}
          liturgy={liturgy}
          liturgyOverride={liturgyOverride}
          onLiturgyDescritpionChange={handleLiturgyDescriptionChange}
        />
      ))}
      <Button onClick={prevWeek}>{"<-"}</Button>{" "}
      <Button onClick={nextWeek}>{"->"}</Button>
    </div>
  );
}

export default App;
