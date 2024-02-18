import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Liturgy, useLiturgia } from "./useLiturgia";
import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import Day from "./components/day";
import { Mass, MassSchedule, getNewMass } from "./utils/massUtils";
import MassComponent from "./components/mass";
import { addDaysToDate, getDaysArray, getNextSunday } from "./utils/daysUtils";
import { exportToJson, importFromJson } from "./utils/exportImportUtil";
import { saveAs } from "file-saver";

function App() {
  const [startingSunday, setStartingSunday] = useState(getNextSunday());
  const liturgy = useLiturgia();
  const [liturgyOverride, setLiturgyOverride] = useState<Liturgy>({});
  const [massSchedule, setMassSchedule] = useState<MassSchedule>({});

  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      Object.keys(liturgyOverride).length > 0 ||
      Object.keys(massSchedule).length > 0
    ) {
      const data = exportToJson(massSchedule, liturgyOverride);
      localStorage.setItem("data", data);
    }
  }, [liturgyOverride, massSchedule]);

  const nextWeek = () => setStartingSunday(addDaysToDate(startingSunday, 7));
  const prevWeek = () => setStartingSunday(addDaysToDate(startingSunday, -7));

  const handleLiturgyDescriptionChange = (date: Date, description: string) => {
    const liturgyOverrideCopy = { ...liturgyOverride };
    liturgyOverrideCopy[date.toISOString()] = description;
    setLiturgyOverride(liturgyOverrideCopy);
  };

  const updateDay = (day: Date, daySchedule: Mass[]) => {
    daySchedule.sort((a, b) => {
      const aValue = parseInt(a.hour.replace(":", ""));
      const bValue = parseInt(b.hour.replace(":", ""));

      return aValue - bValue;
    });

    const massScheduleCopy = { ...massSchedule };
    massScheduleCopy[day.toISOString()] = daySchedule;
    setMassSchedule(massScheduleCopy);
  };

  const handleMassAdd = (date: Date) => {
    const day = massSchedule[date.toISOString()];
    let dayCopy = [] as Mass[];
    if (day) dayCopy = [...day];
    dayCopy.push(getNewMass(date, dayCopy));

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const promise = new Promise((resolve, reject) => {
      const file = e.target.files?.[0];

      if (!file) {
        reject(new Error("No file selected"));
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = event.target?.result;

          if (typeof data === "string") {
            const { schedule, liturgy } = importFromJson(data);
            setLiturgyOverride(liturgy);
            setMassSchedule(schedule);
            resolve("Schedule imported");
          } else {
            reject(new Error("Invalid data type"));
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error("File read error"));
      };

      reader.readAsText(file);
    });

    toast.promise(promise, {
      success: {
        title: "Udało się",
        description: "Dane zostały załadowane z pliku JSON",
      },
      error: {
        title: "Błąd",
        description: "Nie udało się załadować danych z pliku",
      },
      loading: { title: "Ładowanie danych!" },
    });
  };

  return (
    <Box m={2}>
      <Flex gap={2}>
        <Button onClick={prevWeek}>{"<-"}</Button>
        <Button onClick={nextWeek}>{"->"}</Button>
        <Button
          onClick={() => {
            const data = localStorage.getItem("data");
            if (data) {
              console.log(data);
              const { schedule, liturgy } = importFromJson(data);
              setLiturgyOverride(liturgy);
              setMassSchedule(schedule);
            }
          }}
        >
          Załaduj ostatnią wersję
        </Button>
        <Button
          onClick={() => {
            const blob = new Blob(
              [exportToJson(massSchedule, liturgyOverride)],
              {
                type: "application/json",
              }
            );
            saveAs(blob, startingSunday.toISOString());
          }}
        >
          Zapisz w JSONie
        </Button>
        <Button
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
        >
          Ładuj z JSONa
        </Button>
        <input
          key={
            Object.keys(liturgyOverride).length +
            Object.keys(massSchedule).length
          }
          type="file"
          accept=".json"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Flex>
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
