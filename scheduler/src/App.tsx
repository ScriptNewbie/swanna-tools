import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Liturgy, useLiturgia } from "./useLiturgia";
import { Box, Button, Flex, Heading, useToast } from "@chakra-ui/react";
import Day from "./components/day";
import { Mass, MassSchedule, getNewMass } from "./utils/massUtils";
import MassComponent from "./components/mass";
import { addDaysToDate, getDaysArray, getNextSunday } from "./utils/daysUtils";
import { exportToJson, importFromJson } from "./utils/exportImportUtil";
import { saveAs } from "file-saver";
import { ocr } from "./utils/ocr";
import Announcement, { Annoucments } from "./components/announcement";

import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

function App() {
  const [startingSunday, setStartingSunday] = useState(getNextSunday());
  const liturgy = useLiturgia();
  const [liturgyOverride, setLiturgyOverride] = useState<Liturgy>({});
  const [massSchedule, setMassSchedule] = useState<MassSchedule>({});
  const [announcements, setAnnouncements] = useState<Annoucments>({});

  const toast = useToast();
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const ocrInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      Object.keys(liturgyOverride).length > 0 ||
      Object.keys(massSchedule).length > 0 ||
      Object.keys(announcements).length > 0
    ) {
      const data = exportToJson(massSchedule, liturgyOverride, announcements);
      localStorage.setItem("data", data);
    }
  }, [liturgyOverride, massSchedule, announcements]);

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
    const day = massSchedule[date.toISOString()];
    if (day) {
      updateDay(
        date,
        day.filter((mass) => mass.id !== massId)
      );
    }
  };

  const handleMassPropertyChange = (
    date: Date,
    massId: number,
    propertyName: string,
    newValue: string | boolean
  ) => {
    const day = massSchedule[date.toISOString()];
    if (day) {
      const dayCopy = [...day];
      const massToEditIndex = dayCopy.findIndex((mass) => mass.id === massId);
      dayCopy[massToEditIndex] = {
        ...dayCopy[massToEditIndex],
        [propertyName]: newValue,
      };

      updateDay(date, dayCopy);
    }
  };

  const handleOcrChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const promise = ocr(file);

    toast.promise(promise, {
      success: {
        title: "Udało się",
        description: "Pomyślnie odczytano tekst ze zdjęcia",
      },
      error: {
        title: "Błąd",
        description: "Coś poszło nie tak",
      },
      loading: { title: "Ładowanie danych!" },
    });

    const result = await promise;
    if (result) handleAnnouncementAdd(result);
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            const { schedule, liturgy, announcements } = importFromJson(data);
            setLiturgyOverride(liturgy);
            setMassSchedule(schedule);
            setAnnouncements(announcements);
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

  const updateThisWeekAnnouncments = (newAnnouncementsArray: string[]) => {
    const announcementsCopy = { ...announcements };
    announcementsCopy[startingSunday.toISOString()] = newAnnouncementsArray;
    setAnnouncements(announcementsCopy);
  };

  const handleAnnouncementAdd = (announcementsToAdd?: string[]) => {
    const announcementsArray = announcements[startingSunday.toISOString()];

    let announcementsArrayCopy = [] as string[];
    if (announcementsArray) announcementsArrayCopy = [...announcementsArray];
    if (announcementsToAdd)
      announcementsArrayCopy = [
        ...announcementsArrayCopy,
        ...announcementsToAdd,
      ];
    else announcementsArrayCopy.push("");

    updateThisWeekAnnouncments(announcementsArrayCopy);
  };

  const handleAnnouncementDeletion = (index: number) => {
    const announcementsArray = announcements[startingSunday.toISOString()];
    if (announcementsArray) {
      const announcementsArrayCopy = [...announcementsArray];
      announcementsArrayCopy.splice(index, 1);
      updateThisWeekAnnouncments(announcementsArrayCopy);
    }
  };

  const handleAnnouncementChange = (index: number, newValue: string) => {
    const announcementsArray = announcements[startingSunday.toISOString()];
    if (announcementsArray) {
      const announcementsArrayCopy = [...announcementsArray];
      announcementsArrayCopy[index] = newValue;
      updateThisWeekAnnouncments(announcementsArrayCopy);
    }
  };

  const handleAnnouncementMoveUp = (index: number) => {
    const announcementsArray = announcements[startingSunday.toISOString()];
    if (announcementsArray && index > 0 && index < announcementsArray.length) {
      const announcementsArrayCopy = [...announcementsArray];
      const a = announcementsArrayCopy[index - 1];
      announcementsArrayCopy[index - 1] = announcementsArrayCopy[index];
      announcementsArrayCopy[index] = a;
      updateThisWeekAnnouncments(announcementsArrayCopy);
    }
  };

  const handleAnnouncementMoveDown = (index: number) => {
    const announcementsArray = announcements[startingSunday.toISOString()];
    if (
      announcementsArray &&
      index >= 0 &&
      index < announcementsArray.length - 1
    ) {
      const announcementsArrayCopy = [...announcementsArray];
      const a = announcementsArrayCopy[index + 1];
      announcementsArrayCopy[index + 1] = announcementsArrayCopy[index];
      announcementsArrayCopy[index] = a;
      updateThisWeekAnnouncments(announcementsArrayCopy);
    }
  };

  const handleAnnouncementSplit = (index: number) => {
    const announcementsArray = announcements[startingSunday.toISOString()];
    if (announcementsArray) {
      const splitedElement = announcementsArray[index].split("\n\n");

      updateThisWeekAnnouncments([
        ...announcementsArray.slice(0, index),
        ...splitedElement,
        ...announcementsArray.slice(index + 1),
      ]);
    }
  };

  return (
    <Box m={2}>
      <Flex gap={2}>
        <Button onClick={prevWeek}>
          <ArrowLeftIcon />
        </Button>
        <Button onClick={nextWeek}>
          <ArrowRightIcon />
        </Button>
        <Button
          onClick={() => {
            const data = localStorage.getItem("data");
            if (data) {
              console.log(data);
              const { schedule, liturgy, announcements } = importFromJson(data);
              setLiturgyOverride(liturgy);
              setMassSchedule(schedule);
              setAnnouncements(announcements);
            }
          }}
        >
          Załaduj ostatnią wersję
        </Button>
        <Button
          onClick={() => {
            const blob = new Blob(
              [exportToJson(massSchedule, liturgyOverride, announcements)],
              {
                type: "application/json",
              }
            );
            saveAs(blob, startingSunday.toISOString() + ".json");
          }}
        >
          Zapisz w JSONie
        </Button>
        <Button
          onClick={() => {
            if (jsonInputRef.current) {
              jsonInputRef.current.click();
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
          ref={jsonInputRef}
          style={{ display: "none" }}
          onChange={handleJsonChange}
        />
      </Flex>
      <Heading mt={3}>Porządek nabożeństw</Heading>
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
      <Heading mt={3}>Ogłoszenia parafialne</Heading>
      {announcements[startingSunday.toISOString()]?.map(
        (announcement, index) => (
          <Announcement
            key={index}
            onDelete={handleAnnouncementDeletion}
            onChange={handleAnnouncementChange}
            onMoveUp={handleAnnouncementMoveUp}
            onMoveDown={handleAnnouncementMoveDown}
            onSplit={handleAnnouncementSplit}
            announcement={announcement}
            index={index}
          />
        )
      )}
      <Flex mt={2} gap={2} justifyContent="flex-end">
        <Button
          onClick={() => {
            if (ocrInputRef.current) {
              ocrInputRef.current.click();
            }
          }}
        >
          OCR
        </Button>
        <input
          key={
            Object.keys(liturgyOverride).length +
            Object.keys(massSchedule).length
          }
          type="file"
          accept="image/*"
          ref={ocrInputRef}
          style={{ display: "none" }}
          onChange={handleOcrChange}
        />
        <Button onClick={() => handleAnnouncementAdd()}>+</Button>
      </Flex>
    </Box>
  );
}

export default App;
