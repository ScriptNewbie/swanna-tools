import { ScheduleEntry } from "../page";
import paths from "../paths";

interface ImportEntry {
  date: string;
  pathId: number;
  reversed: boolean;
}

export const exportSchedule = (schedule: ScheduleEntry[]) => {
  const dataToExport: ImportEntry[] = schedule.map((entry) => {
    return {
      date: entry.date.toISOString(),
      pathId: entry.path.id,
      reversed: entry.reversed,
    };
  });
  return JSON.stringify(dataToExport);
};

export const importSchedule = (
  data: string,
  setSchedule: (schedule: ScheduleEntry[]) => void
) => {
  const input = JSON.parse(data);
  const schedule: ScheduleEntry[] = [];
  input.forEach((entry: ImportEntry) => {
    const path = paths.find((path) => path.id === entry.pathId);
    if (path)
      schedule.push({
        date: new Date(entry.date),
        path,
        reversed: entry.reversed,
      });
  });
  setSchedule(schedule);
};
