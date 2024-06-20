import { Box, Button, Flex } from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon, UpDownIcon } from "@chakra-ui/icons";
import Autocomplete from "./Autocomplete";

interface Props {
  announcement: string;
  index: number;
  autocompleteData: string[];
  onDelete: (index: number) => void;
  onChange: (index: number, newValue: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onSplit: (index: number) => void;
}

export interface Annoucments {
  [isoDateString: string]: string[];
}

function Announcement({
  announcement,
  index,
  autocompleteData,
  onDelete,
  onChange,
  onMoveDown,
  onMoveUp,
  onSplit,
}: Props) {
  return (
    <Flex alignItems="center" mt={2} gap={2}>
      <Box textAlign="right" minWidth={"1.5rem"}>
        {index + 1 + ". "}
      </Box>
      <Autocomplete
        data={autocompleteData}
        value={announcement}
        onChange={(value) => {
          onChange(index, value);
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
      <Button
        onClick={() => {
          onSplit(index);
        }}
      >
        <UpDownIcon />
      </Button>
    </Flex>
  );
}

export default Announcement;
