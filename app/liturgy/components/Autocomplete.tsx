import { Box, Textarea } from "@chakra-ui/react";
import { Autocomplete as MantineAuto } from "@mantine/core";
import { useResizeObserver } from "@mantine/hooks";

interface Props {
  data: string[];
  value: string;
  highlight?: boolean;
  onChange: (value: string) => void;
}

function Autocomplete({ data, value, onChange, highlight }: Props) {
  const [ref, rect] = useResizeObserver();
  return (
    <Box
      ref={ref}
      display="block"
      overflow="scroll"
      resize="vertical"
      flexGrow={1}
    >
      <MantineAuto
        data={data}
        value={value}
        component={Textarea}
        styles={{
          input: {
            backgroundColor: highlight ? "#99d6ff" : undefined,
            height: rect.height,
          },
        }}
        onChange={onChange}
      />
    </Box>
  );
}

export default Autocomplete;
