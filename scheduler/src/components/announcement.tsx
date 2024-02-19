import { Box, Button, Flex, Textarea } from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

interface Props {
  announcement: string;
  index: number;
  onDelete: (index: number) => void;
  onChange: (index: number, newValue: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export interface Annoucments {
  [isoDateString: string]: string[];
}

function Announcement({
  announcement,
  index,
  onDelete,
  onChange,
  onMoveDown,
  onMoveUp,
}: Props) {
  return (
    <Flex alignItems="center" mt={2} gap={2}>
      <Box textAlign="right" minWidth={"1.5rem"}>
        {index + 1 + ". "}
      </Box>
      <Textarea
        value={announcement}
        onChange={(e) => {
          onChange(index, e.target.value);
        }}
      />
      <Button
        colorScheme="red"
        onClick={() => {
          onDelete(index);
        }}
      >
        -
      </Button>
      <Button
        onClick={() => {
          onMoveUp(index);
        }}
      >
        <ArrowUpIcon />
      </Button>
      <Button
        onClick={() => {
          onMoveDown(index);
        }}
      >
        <ArrowDownIcon />
      </Button>
    </Flex>
  );
}

export default Announcement;
