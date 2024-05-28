"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { TOTP } from "totp-generator";

function getRemainingSec(targetEpoch: number) {
  return Math.floor((targetEpoch - Date.now()) / 1000);
}

export default function Totp() {
  const searchParams = useSearchParams();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [totp, setTOTP] = useState({ otp: "", expires: 0 });
  const [secondsLeft, setSecondsLeft] = useState<number>(
    getRemainingSec(totp.expires)
  );

  const generateTotp = useCallback(() => {
    const secret = searchParams.get("secret");
    if (secret) {
      clearInterval(timeoutRef.current as NodeJS.Timeout);
      setTOTP(TOTP.generate(secret));
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

  useEffect(() => {
    setSecondsLeft(getRemainingSec(totp.expires));
    intervalRef.current = setInterval(() => {
      setSecondsLeft(getRemainingSec(totp.expires));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [totp.expires]);

  return (
    <main>
      <h1
        spellCheck="false"
        onClick={() => {
          navigator.clipboard.writeText(totp.otp);
        }}
        className={secondsLeft < 5 ? "strike" : ""}
      >
        {totp.otp || "Secret?"}
      </h1>
      <h1 className="timer">{secondsLeft > 0 ? secondsLeft : "0"}</h1>
    </main>
  );
}
