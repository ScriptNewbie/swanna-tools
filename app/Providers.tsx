"use client";
import { ChakraProvider } from "@chakra-ui/react";
import { MantineProvider } from "@mantine/core";
import React, { PropsWithChildren } from "react";

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ChakraProvider>
      <MantineProvider>{children}</MantineProvider>
    </ChakraProvider>
  );
};
