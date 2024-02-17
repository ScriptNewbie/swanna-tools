import { Flex, Input, Box } from "@chakra-ui/react";
import { Liturgy } from "../useLiturgia";

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
  liturgy: Liturgy,
  liturgyOverride: Liturgy
) => {
  const overridenLiturgy = liturgyOverride[day.toISOString()];
  const scrapedLiturgy = liturgy[day.toISOString()];

  return overridenLiturgy ?? (scrapedLiturgy || "");
};

interface Props {
  day: Date;
  liturgy: Liturgy;
  liturgyOverride: Liturgy;
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
