import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import NewPathAdder from "./components/newPathAdder";
import ScheduleEntry from "./components/ScheduleEntry";
import paths, { Path } from "./paths";
import { saveAs } from "file-saver";
import { exportSchedule, importSchedule } from "./tools/exportImport";
import "./App.css";
import PdfRender from "./components/PdfRender";

export interface ScheduleEntry {
  date: Date;
  path: Path;
  reversed: boolean;
}

function App() {
  const toast = useToast();
  const [schedule, setSchedule] = useState<ScheduleEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addEntryToSchedule = (scheduleEntry: ScheduleEntry) => {
    setSchedule([...schedule, scheduleEntry]);
  };

  const getAvailablePaths = () => {
    const alreadyPicked = schedule.map((scheduleEntry) => scheduleEntry.path);
    return paths.filter((path) => !alreadyPicked.includes(path));
  };

  const handlePathChange = (source: ScheduleEntry, path: Path | null) => {
    if (path === null) return;
    const newEntry = { ...source, path };
    setSchedule(
      schedule.map((scheduleEntry) =>
        scheduleEntry === source ? newEntry : scheduleEntry
      )
    );
  };

  const handleDateChange = (source: ScheduleEntry, date: Date) => {
    const newEntry = { ...source, date };
    setSchedule(
      schedule.map((scheduleEntry) =>
        scheduleEntry === source ? newEntry : scheduleEntry
      )
    );
  };

  const handleDirectionChange = (source: ScheduleEntry) => {
    const newEntry = { ...source, reversed: !source.reversed };
    setSchedule(
      schedule.map((scheduleEntry) =>
        scheduleEntry === source ? newEntry : scheduleEntry
      )
    );
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
            importSchedule(data, setSchedule);
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

  const handleDelete = (source: ScheduleEntry) => {
    setSchedule(schedule.filter((element) => element !== source));
  };

  useEffect(() => {
    if (schedule.length > 0) {
      const data = exportSchedule(schedule);
      localStorage.setItem("schedule", data);
    }
  }, [schedule]);

  return (
    <>
      <Box id="program">
        <Flex margin={10} gap={2} direction="column">
          <Flex gap={2}>
            <Button
              onClick={() => {
                const schedule = localStorage.getItem("schedule");
                if (schedule) {
                  importSchedule(schedule, setSchedule);
                  return toast({
                    title: "Udało się",
                    description: "Załadowano ostatnią wersję",
                    status: "success",
                    isClosable: true,
                  });
                }
                toast({
                  title: "Błąd",
                  description: "Nie istnieje poprzednia wersja",
                  status: "error",
                  isClosable: true,
                });
              }}
            >
              Ładuj ostatnią wersję
            </Button>
            <Button
              onClick={() => {
                const blob = new Blob([exportSchedule(schedule)], {
                  type: "application/json",
                });
                saveAs(blob, "koleda.json");
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
            <Button
              colorScheme="red"
              onClick={() => {
                setSchedule([]);
              }}
            >
              Wyczyść
            </Button>
            <Button
              colorScheme="green"
              onClick={() => {
                window.print();
              }}
            >
              Drukuj
            </Button>
            <input
              key={schedule.length}
              type="file"
              accept=".json"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Flex>
          {schedule.map((scheduleEntry, index) => (
            <ScheduleEntry
              key={index}
              availablePaths={getAvailablePaths()}
              scheduleEntry={scheduleEntry}
              onPathChange={handlePathChange}
              onDateChange={handleDateChange}
              onDelete={handleDelete}
              onDirectionChange={handleDirectionChange}
            />
          ))}
          <NewPathAdder
            key={schedule.length}
            lastAddedDate={schedule[schedule.length - 1]?.date}
            availablePaths={getAvailablePaths()}
            onAdd={addEntryToSchedule}
          />
        </Flex>
      </Box>
      <PdfRender schedule={schedule} />
    </>
  );
}

export default App;
