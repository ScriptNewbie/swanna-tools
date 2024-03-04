import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { Liturgy } from "../useLiturgia";
import {
  days as daysNames,
  getDaysArray,
  getLiturgyForDay,
} from "../utils/daysUtils";
import { MassSchedule } from "../utils/massUtils";
import { Annoucments } from "./announcement";
import { useState } from "react";

interface Props {
  startingSunday: Date;
  massSchedule: MassSchedule;
  liturgy: Liturgy;
  liturgyOverride: Liturgy;
  announcements: Annoucments;
}

const addLeadingZero = (number: number) => {
  if (number < 10) return "0" + number;
  return number;
};

const getFormatedDate = (date: Date) => {
  const day = addLeadingZero(date.getDate());
  const month = addLeadingZero(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${day}.${month}.${year}r.`;
};

function PdfRenderer({
  startingSunday,
  massSchedule,
  liturgy,
  liturgyOverride,
  announcements,
}: Props) {
  const getLiturgyString = (date: Date) => {
    const liturgyForDay = getLiturgyForDay(date, liturgy, liturgyOverride);
    if (liturgyForDay === "Dzień Powszedni") return "";
    return " – " + liturgyForDay;
  };

  const days = getDaysArray(startingSunday);

  const [fontSize, setFontSize] = useState(19);

  return (
    <>
      <Flex id="fontSize" mb={3} justifyContent="center" gap={2}>
        <Input
          maxWidth="4.5rem"
          type="number"
          value={fontSize.toFixed(1)}
          onChange={(e) => setFontSize(parseFloat(e.target.value))}
        />
        <Button onClick={() => setFontSize(fontSize + 0.1)}>+</Button>
        <Button onClick={() => setFontSize(fontSize - 0.1)}>-</Button>
      </Flex>
      <Flex
        fontFamily={"Times New Roman"}
        fontSize={fontSize + "pt"}
        id="print"
        padding={10}
        direction="column"
      >
        <Box fontWeight="bold" textAlign="center">
          Porządek nabożeństw <br />
          {`${getFormatedDate(startingSunday)} – ${getFormatedDate(
            days[days.length - 1]
          )}`}
        </Box>
        <br />
        <Box>
          {days.map((day) => (
            <Box>
              <Box fontWeight="bold">{`${
                daysNames[day.getDay()]
              } – ${getFormatedDate(day)}${getLiturgyString(day)}`}</Box>
              {massSchedule[day.toISOString().split("T")[0]]?.map((mass) => (
                <Flex>
                  <Box style={{ textWrap: "nowrap" }} min-width="auto">
                    {`${mass.hour}${mass.chapel ? " (kaplica)" : ""}`}
                    <Box display="inline" color="white">
                      -
                    </Box>
                  </Box>
                  <Box textAlign="justify">{`${mass.intention}`}</Box>
                </Flex>
              ))}
            </Box>
          ))}
        </Box>
        <br />
        <Box id="announcements">
          <Box textAlign={"center"} fontWeight="bold">
            Ogłoszenia parafialne z dnia {getFormatedDate(startingSunday)}
          </Box>
          <br />
          {announcements[startingSunday.toISOString().split("T")[0]]
            ?.concat(
              "Bóg zapłać za wszystkie złożone ofiary oraz za wszelkie wpłaty na konto naszej parafii."
            )
            .map((announcement, index) => (
              <Flex>
                <Box width="auto">{index + 1 + "."}</Box>
                <Box textAlign="justify">{announcement}</Box>
              </Flex>
            ))}
        </Box>
      </Flex>
    </>
  );
}

export default PdfRenderer;
