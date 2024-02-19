import { Box, Button, Flex, Textarea } from "@chakra-ui/react";

interface Props {
  announcement: string;
  index: number;
  onDelete: (index: number) => void;
  onChange: (index: number, newValue: string) => void;
}

function Announcement({ announcement, index, onDelete, onChange }: Props) {
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
    </Flex>
  );
}

export default Announcement;
