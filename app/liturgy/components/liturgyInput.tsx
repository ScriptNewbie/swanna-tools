import { Button, Flex, Input, Tooltip } from "@chakra-ui/react";
import React from "react";

export default function LiturgyInput({
  onLiturgyDescritpionChange,
  value,
}: {
  onLiturgyDescritpionChange: (description: string) => void;

  value: string;
}) {
  if (value.includes("albo")) {
    const values = value.split("albo").map((v) => v.trim());

    return (
      <Flex gap={2} flex={1} direction="row">
        {values.map((value) => {
          const text = value.substring(0, 1).toUpperCase() + value.substring(1);
          return (
            <Tooltip label={text} key={text}>
              <Button
                onClick={() => {
                  onLiturgyDescritpionChange(text);
                }}
              >
                {text.length > 30 ? text.slice(0, 30) + "..." : text}
              </Button>
            </Tooltip>
          );
        })}
      </Flex>
    );
  }

  return (
    <Input
      onChange={(e) => {
        onLiturgyDescritpionChange(e.target.value);
      }}
      value={value}
    />
  );
}
