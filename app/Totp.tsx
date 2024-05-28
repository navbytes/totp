"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { TOTP } from "totp-generator";
import CountdownTimer from "./CountdownTimer";

export default function Totp() {
  const searchParams = useSearchParams();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [totp, setTOTP] = useState({ otp: "", expires: 0 });

  const generateTotp = useCallback(() => {
    const secret = searchParams.get("secret");
    if (secret) {
      clearInterval(timeoutRef.current as NodeJS.Timeout);

      const { otp, expires } = TOTP.generate(secret);
      setTOTP({ otp, expires });
      console.log("otp", otp);
    }
  }, [searchParams]);

  useEffect(() => {
    const ms = totp.expires - Date.now();
    if (ms > 0) {
      timeoutRef.current = setTimeout(() => {
        generateTotp();
      }, ms);
    } else {
      generateTotp();
    }
  }, [generateTotp, totp.expires]);

  return (
    <main>
      <h1
        spellCheck="false"
        onClick={() => {
          navigator.clipboard.writeText(totp.otp);
        }}
      >
        {totp.otp || "Secret?"}
      </h1>
      <CountdownTimer targetEpoch={totp.expires} />
    </main>
  );
}
