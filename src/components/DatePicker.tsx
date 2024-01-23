import { Flex, Input, Text } from "@chakra-ui/react";

interface Props {
  date: Date;
  onDateChange: (date: Date) => void;
}

function DatePicker({ date, onDateChange }: Props) {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  const days = [
    "Niedziela",
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota",
  ];

  return (
    <Flex alignItems="center" gap={2}>
      <Input
        minWidth={"13rem"}
        width="auto"
        type="datetime-local"
        value={`${year}-${month}-${day}T${hours}:${minutes}`}
        onChange={({ target: { value } }) => {
          onDateChange(new Date(value));
        }}
      />
      <Text align="right" width={"10rem"}>
        {`${days[date.getDay()]} - ${hours}:${minutes}`}
      </Text>
    </Flex>
  );
}

export default DatePicker;
