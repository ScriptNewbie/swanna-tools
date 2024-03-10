import { Box, Button, Flex } from "@chakra-ui/react";

interface Props {
  announcement: string;
  index: number;
  onCopy: (value: string) => void;
}

export interface Annoucments {
  [isoDateString: string]: string[];
}

function LastWeekAnnouncement({ announcement, index, onCopy }: Props) {
  return (
    <Flex alignItems="center" mt={2} gap={2}>
      <Box textAlign="right" minWidth={"1.5rem"}>
        {index + 1 + ". "}
      </Box>
      <Box
        padding={2}
        border={"solid 1px; border-color: #E2E8F0; border-radius: 0.375rem"}
        flexGrow={1}
        children={announcement}
      />
      <Button
        colorScheme="green"
        onClick={() => {
          onCopy(announcement);
        }}
      >
        +
      </Button>
    </Flex>
  );
}

export default LastWeekAnnouncement;
