import { ScheduleEntry as ScheduleEntryType } from "../App";
import PathPicker from "./PathPicker";
import { Button, Flex } from "@chakra-ui/react";
import DatePicker from "./datePicker";
import { Path } from "../paths";

interface Props {
  scheduleEntry: ScheduleEntryType;
  availablePaths: Path[];
  onPathChange: (source: ScheduleEntryType, path: Path | null) => void;
  onDateChange: (source: ScheduleEntryType, date: Date) => void;
  onDelete: (source: ScheduleEntryType) => void;
}
function ScheduleEntry({
  scheduleEntry,
  availablePaths,
  onPathChange,
  onDateChange,
  onDelete,
}: Props) {
  return (
    <Flex gap={2}>
      <DatePicker
        date={scheduleEntry.date}
        onDateChange={(date) => {
          onDateChange(scheduleEntry, date);
        }}
      />
      <PathPicker
        date={scheduleEntry.date}
        currentPath={scheduleEntry.path}
        availablePaths={availablePaths}
        onPathChange={(path: Path | null) => {
          onPathChange(scheduleEntry, path);
        }}
      />
      <Button
        width={"5rem"}
        onClick={() => {
          onDelete(scheduleEntry);
        }}
        colorScheme="red"
      >
        Usuń
      </Button>
    </Flex>
  );
}

export default ScheduleEntry;
