import { useEffect, useMemo, useRef, useState } from "react";
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
import PdfRenderer from "./components/pdfRenderer";
import Additional from "./components/additional";
import LastWeekAnnouncement from "./components/lastWeekAnnouncement";

export interface Additional {
  [isoDateString: string]: string;
}

function App() {
  const [startingSunday, setStartingSunday] = useState(getNextSunday());
  const liturgy = useLiturgia();
  const [liturgyOverride, setLiturgyOverride] = useState<Liturgy>({});
  const [massSchedule, setMassSchedule] = useState<MassSchedule>({});
  const [announcements, setAnnouncements] = useState<Annoucments>({});
  const [additional, setAdditional] = useState<Additional>({});
  const [imported, setImported] = useState(0);

  const intentionsAutocompleteData = useMemo(() => {
    return Array.from(
      new Set(
        Object.values(massSchedule)
          .flat()
          .flatMap((value) => value?.intention)
          .filter((a) => a)
      )
    );
  }, [imported]);

  const announcementsAutocompleteData = useMemo(() => {
    return Array.from(new Set(Object.values(announcements).flat()));
  }, [imported]);

  document.title = startingSunday
    .toISOString()
    .split("T")[0]
    .split("-")
    .reverse()
    .join("-");

  const toast = useToast();
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const ocrInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (
      Object.keys(liturgyOverride).length > 0 ||
      Object.keys(massSchedule).length > 0 ||
      Object.keys(announcements).length > 0 ||
      Object.keys(additional).length > 0
    ) {
      const data = exportToJson(
        massSchedule,
        liturgyOverride,
        announcements,
        additional
      );
      localStorage.setItem("data", data);
    }
  }, [liturgyOverride, massSchedule, announcements, additional]);

  const nextWeek = () => setStartingSunday(addDaysToDate(startingSunday, 7));
  const prevWeek = () => setStartingSunday(addDaysToDate(startingSunday, -7));

  const handleLiturgyDescriptionChange = (date: Date, description: string) => {
    const liturgyOverrideCopy = { ...liturgyOverride };
    liturgyOverrideCopy[date.toISOString().split("T")[0]] = description;
    setLiturgyOverride(liturgyOverrideCopy);
  };

  const updateDay = (day: Date, daySchedule: Mass[]) => {
    daySchedule.sort((a, b) => {
      const aValue = parseInt(a.hour.replace(":", ""));
      const bValue = parseInt(b.hour.replace(":", ""));

      return aValue - bValue;
    });

    const massScheduleCopy = { ...massSchedule };
    massScheduleCopy[day.toISOString().split("T")[0]] = daySchedule;
    setMassSchedule(massScheduleCopy);
  };

  const handleMassAdd = (date: Date) => {
    const day = massSchedule[date.toISOString().split("T")[0]];
    let dayCopy = [] as Mass[];
    if (day) dayCopy = [...day];
    dayCopy.push(getNewMass(date, dayCopy));

    updateDay(date, dayCopy);
  };

  const handleMassDelete = (date: Date, massId: number) => {
    const day = massSchedule[date.toISOString().split("T")[0]];
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
    const day = massSchedule[date.toISOString().split("T")[0]];
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
            const { schedule, liturgy, announcements, additional } =
              importFromJson(data);
            setLiturgyOverride(liturgy);
            setMassSchedule(schedule);
            setAnnouncements(announcements);
            setAdditional(additional);
            setImported(imported + 1);
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
    announcementsCopy[startingSunday.toISOString().split("T")[0]] =
      newAnnouncementsArray;
    setAnnouncements(announcementsCopy);
  };

  const handleAnnouncementAdd = (announcementsToAdd?: string[]) => {
    const announcementsArray =
      announcements[startingSunday.toISOString().split("T")[0]];

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
    const announcementsArray =
      announcements[startingSunday.toISOString().split("T")[0]];
    if (announcementsArray) {
      const announcementsArrayCopy = [...announcementsArray];
      announcementsArrayCopy.splice(index, 1);
      updateThisWeekAnnouncments(announcementsArrayCopy);
    }
  };

  const handleAnnouncementChange = (index: number, newValue: string) => {
    const announcementsArray =
      announcements[startingSunday.toISOString().split("T")[0]];
    if (announcementsArray) {
      const announcementsArrayCopy = [...announcementsArray];
      announcementsArrayCopy[index] = newValue;
      updateThisWeekAnnouncments(announcementsArrayCopy);
    }
  };

  const handleAnnouncementMoveUp = (index: number) => {
    const announcementsArray =
      announcements[startingSunday.toISOString().split("T")[0]];
    if (announcementsArray && index > 0 && index < announcementsArray.length) {
      const announcementsArrayCopy = [...announcementsArray];
      const a = announcementsArrayCopy[index - 1];
      announcementsArrayCopy[index - 1] = announcementsArrayCopy[index];
      announcementsArrayCopy[index] = a;
      updateThisWeekAnnouncments(announcementsArrayCopy);
    }
  };

  const handleAnnouncementMoveDown = (index: number) => {
    const announcementsArray =
      announcements[startingSunday.toISOString().split("T")[0]];
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
    const announcementsArray =
      announcements[startingSunday.toISOString().split("T")[0]];
    if (announcementsArray) {
      const splitedElement = announcementsArray[index].split("\n\n");

      updateThisWeekAnnouncments([
        ...announcementsArray.slice(0, index),
        ...splitedElement,
        ...announcementsArray.slice(index + 1),
      ]);
    }
  };

  const handleAdditionalChange = (newValue: string) => {
    const additionalCopy = { ...additional };
    additionalCopy[startingSunday.toISOString().split("T")[0]] = newValue;
    setAdditional(additionalCopy);
    console.log(additional);
  };

  return (
    <>
      <Box id="program" m={2}>
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
                const { schedule, liturgy, announcements, additional } =
                  importFromJson(data);
                setLiturgyOverride(liturgy);
                setMassSchedule(schedule);
                setAnnouncements(announcements);
                setAdditional(additional);
                setImported(imported + 1);
              }
            }}
          >
            Załaduj ostatnią wersję
          </Button>
          <Button
            onClick={() => {
              const blob = new Blob(
                [
                  exportToJson(
                    massSchedule,
                    liturgyOverride,
                    announcements,
                    additional
                  ),
                ],
                {
                  type: "application/json",
                }
              );
              saveAs(
                blob,
                startingSunday.toISOString().split("T")[0] + ".json"
              );
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
          <Box key={day.toISOString().split("T")[0]}>
            <Day
              day={day}
              liturgy={liturgy}
              liturgyOverride={liturgyOverride}
              onLiturgyDescritpionChange={handleLiturgyDescriptionChange}
              onMassAdd={handleMassAdd}
            />
            {massSchedule[day.toISOString().split("T")[0]]?.map((mass) => (
              <MassComponent
                autocompleteData={intentionsAutocompleteData as string[]}
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
        {announcements[startingSunday.toISOString().split("T")[0]]?.map(
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
              autocompleteData={announcementsAutocompleteData}
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
        <Box textAlign="right" mt={3} mr={3}>
          Kopiuj z zeszłego tygodnia:
        </Box>
        {announcements[
          addDaysToDate(startingSunday, -7).toISOString().split("T")[0]
        ]?.map((announcement, index) => {
          return announcements[
            startingSunday.toISOString().split("T")[0]
          ]?.includes(announcement) ? null : (
            <LastWeekAnnouncement
              key={index}
              onCopy={(a) => {
                handleAnnouncementAdd([a]);
              }}
              announcement={announcement}
              index={index}
            />
          );
        })}
        <Heading mt={3}>Dodatkowe informacje</Heading>

        <Flex my={2} gap={2}>
          <Button
            colorScheme="green"
            isDisabled={
              !additional[
                addDaysToDate(startingSunday, -7).toISOString().split("T")[0]
              ]
            }
            onClick={() =>
              handleAdditionalChange(
                additional[
                  addDaysToDate(startingSunday, -7).toISOString().split("T")[0]
                ]
              )
            }
          >
            Kopiuj z poprzedniego tygodnia
          </Button>
          <Button
            onClick={() =>
              handleAdditionalChange(`:::center
**Zapowiedzi**
:br :br
Jan Kowalski, wolny, zam. Tarnowskie Góry:br
Anna Nowak, wolna, zam. Tarnowskie Góry
:::`)
            }
          >
            Zapowiedzi
          </Button>
          <Button onClick={() => handleAdditionalChange("")}>Wyczyść</Button>
        </Flex>
        <Additional
          value={additional[startingSunday.toISOString().split("T")[0]] || ""}
          onChange={handleAdditionalChange}
        />
        <Heading mt={3} mb={3}>
          Podgląd wydruku
        </Heading>
      </Box>
      <PdfRenderer
        startingSunday={startingSunday}
        massSchedule={massSchedule}
        announcements={announcements}
        liturgy={liturgy}
        liturgyOverride={liturgyOverride}
        additional={additional}
      />
    </>
  );
}

export default App;
