import { ScheduleEntry } from "../App";
import { Button, Flex, useToast } from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { useState } from "react";
import PathPicker from "./PathPicker";
import DatePicker from "./DatePicker";
import { Path } from "../paths";

interface Props {
  availablePaths: Path[];
  onAdd: (scheduleEntry: ScheduleEntry) => void;
  lastAddedDate: Date | null;
}

function NewPathAdder({ availablePaths, onAdd, lastAddedDate }: Props) {
  const [pickedPath, setPickedPath] = useState<Path | null>(null);
  const [pickedDate, setPickedDate] = useState<Date | null>(null);
  const [reversed, setReversed] = useState(false);

  const defaultDate = lastAddedDate
    ? new Date(new Date(lastAddedDate).getTime() + 24 * 60 * 60 * 1000)
    : new Date(new Date().getFullYear(), 11, 27, 12);
  const date = pickedDate ?? defaultDate;

  if (!pickedDate) {
    if (date.getDay() === 6) date.setHours(13);
    else date.setHours(15);
  }

  const toast = useToast();

  return (
    <Flex gap={2}>
      <DatePicker
        date={date}
        onDateChange={(date: Date) => {
          setPickedDate(date);
        }}
      />
      <PathPicker
        availablePaths={availablePaths}
        onPathChange={setPickedPath}
        date={date}
        reverse={reversed}
      />
      <Button
        onClick={() => {
          setReversed(!reversed);
        }}
      >
        <RepeatIcon />
      </Button>
      <Button
        width={"5rem"}
        onClick={() => {
          if (!pickedPath)
            return toast({
              title: "Musisz wybrać ulicę!",
              status: "error",
              isClosable: true,
            });
          onAdd({ date, path: pickedPath, reversed });
        }}
      >
        Dodaj
      </Button>
    </Flex>
  );
}

export default NewPathAdder;
