import { ScheduleEntry } from "../App";
import paths from "../paths";

interface ImportEntry {
  date: string;
  pathId: number;
}

export const exportSchedule = (schedule: ScheduleEntry[]) => {
  const dataToExport: ImportEntry[] = schedule.map((entry) => {
    return { date: entry.date.toISOString(), pathId: entry.path.id };
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
    if (path) schedule.push({ date: new Date(entry.date), path });
  });
  setSchedule(schedule);
};
