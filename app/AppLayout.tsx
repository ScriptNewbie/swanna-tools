"use client";

import { Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./Providers";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
      <Flex id="menu" m={3} justify="flex-end" gap={2}>
        <Link href="/liturgy">
          <Button>Ogłoszenia parafialne</Button>
        </Link>
        <Link href="/koleda">
          <Button>Kolęda</Button>
        </Link>
      </Flex>
      {children}
    </Providers>
  );
};
