"use client";
import { useEffect, useState } from "react";
export function IstClock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const update = () => setTime(format.format(new Date()));
    update();
    const timer = setInterval(update, 30000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span>
      Bengaluru · {time ? <time>{time} IST</time> : "IST (UTC+05:30)"}
    </span>
  );
}
