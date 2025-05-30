"use client";

import { useEffect } from "react";

export function TempoInit() {
  useEffect(() => {
    // Only initialize Tempo Devtools in development
    if (
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_TEMPO
    ) {
      const { TempoDevtools } = require("tempo-devtools");
      TempoDevtools.init();
    }
  }, []);

  return null;
}
