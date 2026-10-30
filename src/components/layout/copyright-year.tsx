"use client";

import { useEffect, useState } from "react";

// Next 16 refuses to prerender a clock read, so the year is filled in after mount.
export function CopyrightYear() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <>{year}</>;
}
