"use client";

import { useEffect } from "react";

export function TempoInit() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_TEMPO) {
      const { TempoDevtools } = require("tempo-devtools");
      TempoDevtools.init();
    }
  }, []);

  return null;
}
