"use client";

import { Suspense } from "react";
import Totp from "./Totp";

export default function Home() {
  return (
    <Suspense>
      <Totp />
    </Suspense>
  );
}
