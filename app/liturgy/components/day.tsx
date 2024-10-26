import { Flex, Box, Button, Text } from "@chakra-ui/react";
import { Liturgy } from "../useLiturgia";
import { days, getLiturgyForDay } from "../utils/daysUtils";
import LiturgyInput from "./liturgyInput";
import { Mass } from "../utils/massUtils";

interface Props {
  day: Date;
  liturgy: Liturgy;
  liturgyOverride: Liturgy;
  onLiturgyDescritpionChange: (day: Date, description: string) => void;
  onMassAdd: (day: Date) => void;
  scheduleForDay?: Mass[];
}

function Day({
  day,
  liturgy,
  liturgyOverride,
  onMassAdd,
  onLiturgyDescritpionChange,
  scheduleForDay,
}: Props) {
  const massesMissing = (() => {
    const isTuesday = day.getDay() === 2;
    const isSunday = day.getDay() === 0;
    const expectedMasses = isSunday
      ? ["08:00", "10:00", "12:00"]
      : isTuesday
      ? ["07:30"]
      : ["18:00"];
    return expectedMasses.filter(
      (mass) => !scheduleForDay?.find((m) => m.hour === mass)
    );
  })();

  return (
    <Flex direction="column">
      <Flex grow={1} gap={2} mt={2} alignItems="center">
        <Box minWidth={"6.5rem"}>{day.toLocaleDateString()}</Box>
        <Box textAlign={"center"} minWidth={"6rem"}>
          {days[day.getDay()]}
        </Box>
        <LiturgyInput
          onLiturgyDescritpionChange={(value) =>
            onLiturgyDescritpionChange(day, value)
          }
          value={getLiturgyForDay(day, liturgy, liturgyOverride)}
        />
        <Button
          onClick={() => {
            onMassAdd(day);
          }}
        >
          {"+"}
        </Button>
      </Flex>
      {massesMissing.length > 0 && (
        <Text color="red">
          Wygląda na to, że brakuje Mszy o godzinie {massesMissing.join(", ")}
        </Text>
      )}
    </Flex>
  );
}

export default Day;
