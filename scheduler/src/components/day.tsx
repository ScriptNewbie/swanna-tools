import { Flex, Input, Box } from "@chakra-ui/react";
import { LiturgyDay } from "../useLiturgia";
import { isSameDay } from "../utils/isSameDay";

const days = [
  "Niedziela",
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
];

const getLiturgyForDay = (
  day: Date,
  liturgy: LiturgyDay[],
  liturgyOverride: LiturgyDay[]
) => {
  const overridenLiturgy = liturgyOverride.find((element) =>
    isSameDay(element.date, day)
  )?.description;

  const scrapedLiturgy = liturgy
    .map((element: LiturgyDay) =>
      element.description !== "Dzień Powszedni"
        ? element
        : { ...element, description: "" }
    )
    .find((element) => isSameDay(element.date, day))?.description;

  return overridenLiturgy ?? (scrapedLiturgy || "");
};

interface Props {
  day: Date;
  liturgy: LiturgyDay[];
  liturgyOverride: LiturgyDay[];
  onLiturgyDescritpionChange: (day: Date, description: string) => void;
}

function Day({
  day,
  liturgy,
  liturgyOverride,
  onLiturgyDescritpionChange,
}: Props) {
  return (
    <Flex gap={2} mt={2} alignItems="center">
      <Box>{day.toLocaleDateString()}</Box>
      <Box>{days[day.getDay()]}</Box>
      <Input
        onChange={(e) => {
          onLiturgyDescritpionChange(day, e.target.value);
        }}
        value={getLiturgyForDay(day, liturgy, liturgyOverride)}
      />
    </Flex>
  );
}

export default Day;
