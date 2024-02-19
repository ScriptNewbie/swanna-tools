import { Annoucments } from "../components/announcement";
import { Liturgy } from "../useLiturgia";
import { MassSchedule } from "./massUtils";

const keepLatestEntries = (
  object: Record<string, any>,
  limit: number
): Record<string, any> => {
  const keys = Object.keys(object);
  const sortedKeys = keys.sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );
  const latestKeys = sortedKeys.slice(0, limit);

  const filteredObject: Record<string, any> = {};

  for (const key of latestKeys) {
    filteredObject[key] = object[key];
  }

  return filteredObject;
};

export const exportToJson = (
  schedule: MassSchedule,
  liturgy: Liturgy,
  announcements: Annoucments
) => {
  const filteredSchedule = keepLatestEntries(schedule, 50);
  const filteredLiturgy = keepLatestEntries(liturgy, 50);
  const filteredAnnouncements = keepLatestEntries(announcements, 7);

  return JSON.stringify({
    schedule: filteredSchedule,
    liturgy: filteredLiturgy,
    announcements: filteredAnnouncements,
  });
};

export const importFromJson = (
  json: string
): { schedule: MassSchedule; liturgy: Liturgy; announcements: Annoucments } => {
  return JSON.parse(json);
};
