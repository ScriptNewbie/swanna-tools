import { Flex, Heading, Table, Text, Tr, Td } from "@chakra-ui/react";
import { ScheduleEntry } from "../App";

interface Props {
  schedule: ScheduleEntry[];
}
const days = [
  "Niedziela",
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
];

function PdfRender({ schedule }: Props) {
  return (
    <Flex id="print" padding={10} alignItems="center" direction="column">
      <Heading textAlign="center" fontWeight="normal" fontFamily="Hoefler Text">
        Plan Odwiedzin Duszpasterskich
        <br />
        {schedule[0]?.date.getFullYear() || new Date().getFullYear()}/
        {schedule[schedule.length - 1]?.date.getFullYear() ||
          new Date().getFullYear() + 1}
      </Heading>
      <Table fontSize="1.3rem" fontFamily="serif" marginTop={7}>
        {schedule.map((scheduleEntry) => {
          const hours = scheduleEntry.date
            .getHours()
            .toString()
            .padStart(2, "0");
          const minutes = scheduleEntry.date
            .getMinutes()
            .toString()
            .padStart(2, "0");
          const year = scheduleEntry.date.getFullYear();
          const month = (scheduleEntry.date.getMonth() + 1)
            .toString()
            .padStart(2, "0");
          const day = scheduleEntry.date.getDate().toString().padStart(2, "0");
          return (
            <Tr>
              <Td border="solid rgba(0,0,0,0.2) 1px">{`${day}.${month}.${year}`}</Td>
              <Td border="solid rgba(0,0,0,0.2) 1px">
                <Text display="inline" fontWeight="bold">{`${
                  days[scheduleEntry.date.getDay()]
                } - ${hours}:${minutes}`}</Text>{" "}
                <Text display="inline">{scheduleEntry.path.streets}</Text>
              </Td>
            </Tr>
          );
        })}
      </Table>
      <Text fontFamily="Hoefler Text" marginTop={10} fontSize={"2rem"}>
        Na stole biały obrus, krzyż, świece i woda święcona.
      </Text>
    </Flex>
  );
}

export default PdfRender;
