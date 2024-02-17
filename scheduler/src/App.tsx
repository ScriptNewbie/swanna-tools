import { useState } from "react";
import "./App.css";
import { Liturgy, useLiturgia } from "./useLiturgia";
import { Box, Button } from "@chakra-ui/react";
import Day from "./components/day";
import { Mass, MassSchedule, getMostLikelyNewMass } from "./utils/massUtils";
import MassComponent from "./components/mass";
import { addDaysToDate, getDaysArray, getNextSunday } from "./utils/daysUtils";

function App() {
  const [startingSunday, setStartingSunday] = useState(getNextSunday());
  const liturgy = useLiturgia();
  const [liturgyOverride, setLiturgyOverride] = useState<Liturgy>({});
  const [massSchedule, setMassSchedule] = useState<MassSchedule>({});

  const nextWeek = () => setStartingSunday(addDaysToDate(startingSunday, 7));
  const prevWeek = () => setStartingSunday(addDaysToDate(startingSunday, -7));

  const handleLiturgyDescriptionChange = (date: Date, description: string) => {
    const liturgyOverrideCopy = { ...liturgyOverride };
    liturgyOverrideCopy[date.toISOString()] = description;
    setLiturgyOverride(liturgyOverrideCopy);
  };

  const updateDay = (day: Date, daySchedule: Mass[]) => {
    const massScheduleCopy = { ...massSchedule };
    massScheduleCopy[day.toISOString()] = daySchedule;
    setMassSchedule(massScheduleCopy);
  };

  const handleMassAdd = (date: Date) => {
    const day = massSchedule[date.toISOString()];
    let dayCopy = [] as Mass[];
    if (day) dayCopy = [...day];
    dayCopy.push(getMostLikelyNewMass(date, dayCopy));

    updateDay(date, dayCopy);
  };

  const handleMassDelete = (date: Date, massId: number) => {
    updateDay(
      date,
      massSchedule[date.toISOString()]!.filter((mass) => mass.id !== massId)
    );
  };

  const handleMassPropertyChange = (
    date: Date,
    massId: number,
    propertyName: string,
    newValue: string | boolean
  ) => {
    const dayCopy = [...massSchedule[date.toISOString()]!];
    const massToEditIndex = dayCopy.findIndex((mass) => mass.id === massId);
    dayCopy[massToEditIndex] = {
      ...dayCopy[massToEditIndex],
      [propertyName]: newValue,
    };

    updateDay(date, dayCopy);
  };

  return (
    <Box m={2}>
      <Button onClick={prevWeek}>{"<-"}</Button>{" "}
      <Button onClick={nextWeek}>{"->"}</Button>
      {getDaysArray(startingSunday).map((day) => (
        <Box key={day.toISOString()}>
          <Day
            day={day}
            liturgy={liturgy}
            liturgyOverride={liturgyOverride}
            onLiturgyDescritpionChange={handleLiturgyDescriptionChange}
            onMassAdd={handleMassAdd}
          />
          {massSchedule[day.toISOString()]?.map((mass) => (
            <MassComponent
              key={mass.id}
              onDelete={(massId) => {
                handleMassDelete(day, massId);
              }}
              onPropertyChange={(massId, propertyName, newValue) => {
                handleMassPropertyChange(day, massId, propertyName, newValue);
              }}
              mass={mass}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
}

export default App;
