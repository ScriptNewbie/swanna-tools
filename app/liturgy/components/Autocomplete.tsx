import { Flex, Textarea, Text } from "@chakra-ui/react";
import { AutoComplete } from "../utils/autocomplete";
import { useEffect, useRef, useState } from "react";

interface Props {
  autocompleter: AutoComplete;
  value: string;
  highlight?: boolean;
  onChange: (value: string) => void;
}

function Autocomplete({ autocompleter, value, onChange, highlight }: Props) {
  const [pickedAuto, setPickedAuto] = useState(0);
  const ref = useRef<HTMLTextAreaElement>(null);

  const autosugestions = autocompleter?.getSuggestions(value) || [""];
  useEffect(() => {
    setPickedAuto(0);
  }, [autosugestions.length]);

  const insertSuggestion = (index: number) => {
    const suggestion = autosugestions[index];
    const newValue =
      `${value.split(" ").slice(0, -1).join(" ")} ${suggestion} `.trim() + " ";
    onChange(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab" && autosugestions.length > 0) {
      e.preventDefault(); // Prevent the default tab behavior
      insertSuggestion(pickedAuto);
    }
    if (e.metaKey && e.key === "ArrowLeft") {
      e.preventDefault();
      setPickedAuto(Math.max(pickedAuto - 1, 0));
    }

    if (e.metaKey && e.key === "ArrowRight") {
      e.preventDefault();
      setPickedAuto(Math.min(pickedAuto + 1, autosugestions.length - 1));
    }
  };

  return (
    <Flex grow={1} direction="column">
      <Textarea
        ref={ref}
        value={value}
        style={{ backgroundColor: highlight ? "#99d6ff" : undefined }}
        onChange={(e) => onChange(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
      />
      <Flex gap={1}>
        {autosugestions.slice(0, 5).map((s, index) => (
          <Text
            onClick={() => {
              ref.current?.focus();
              insertSuggestion(index);
            }}
            color={index !== pickedAuto ? "gray" : undefined}
            key={s + index}
          >
            {s}
          </Text>
        ))}
      </Flex>
    </Flex>
  );
}

export default Autocomplete;
