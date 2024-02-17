import { Flex, Input, Box, Button } from "@chakra-ui/react";
import { Liturgy } from "../useLiturgia";
import { days, getLiturgyForDay } from "../utils/daysUtils";

interface Props {
  day: Date;
  liturgy: Liturgy;
  liturgyOverride: Liturgy;
  onLiturgyDescritpionChange: (day: Date, description: string) => void;
  onMassAdd: (day: Date) => void;
}

function Day({
  day,
  liturgy,
  liturgyOverride,
  onMassAdd,
  onLiturgyDescritpionChange,
}: Props) {
  return (
    <Flex grow={1} gap={2} mt={2} alignItems="center">
      <Box minWidth={"6.5rem"}>{day.toLocaleDateString()}</Box>
      <Box textAlign={"center"} minWidth={"6rem"}>
        {days[day.getDay()]}
      </Box>
      <Input
        onChange={(e) => {
          onLiturgyDescritpionChange(day, e.target.value);
        }}
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
  );
}

export default Day;
