"use client";

import { useState, useEffect } from "react";

interface PoolCountdownProps {
  expiresAt: number;
  /** Show a compact inline version */
  compact?: boolean;
}

function getTimeLeft(expiresAt: number) {
  const diff = Math.max(0, expiresAt - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  const secs = Math.floor((diff % 60_000) / 1_000);
  return { diff, days, hours, mins, secs };
}

export function isEndingSoon(expiresAt: number): boolean {
  const diff = expiresAt - Date.now();
  return diff > 0 && diff < 86_400_000; // less than 24h
}

export default function PoolCountdown({ expiresAt, compact = false }: PoolCountdownProps) {
  const [time, setTime] = useState(() => getTimeLeft(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeLeft(expiresAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (time.diff <= 0) {
    return (
      <span className="text-neon-pink font-semibold text-xs">Expired</span>
    );
  }

  const ending = isEndingSoon(expiresAt);

  if (compact) {
    return (
      <span
        className={`font-mono text-xs tabular-nums ${
          ending ? "text-neon-pink font-semibold" : "text-text-secondary"
        }`}
      >
        {time.days > 0 && `${time.days}d `}
        {String(time.hours).padStart(2, "0")}:{String(time.mins).padStart(2, "0")}:{String(time.secs).padStart(2, "0")}
      </span>
    );
  }

  // Full countdown display
  return (
    <div className="flex items-center gap-1.5">
      {ending && (
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-pink opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-pink" />
        </span>
      )}
      <div className="flex items-center gap-1 font-mono tabular-nums">
        {time.days > 0 && (
          <>
            <TimeUnit value={time.days} label="d" urgent={ending} />
            <span className={ending ? "text-neon-pink/60" : "text-text-dim"}>:</span>
          </>
        )}
        <TimeUnit value={time.hours} label="h" urgent={ending} />
        <span className={ending ? "text-neon-pink/60" : "text-text-dim"}>:</span>
        <TimeUnit value={time.mins} label="m" urgent={ending} />
        <span className={ending ? "text-neon-pink/60" : "text-text-dim"}>:</span>
        <TimeUnit value={time.secs} label="s" urgent={ending} />
      </div>
    </div>
  );
}

function TimeUnit({ value, label, urgent }: { value: number; label: string; urgent: boolean }) {
  return (
    <span className={`text-xs ${urgent ? "text-neon-pink font-semibold" : "text-text-secondary"}`}>
      {String(value).padStart(2, "0")}
      <span className={urgent ? "text-neon-pink/60" : "text-text-dim"}>{label}</span>
    </span>
  );
}

/** Badge shown on pool cards when ending soon */
export function EndingSoonBadge({ expiresAt }: { expiresAt: number }) {
  const [show, setShow] = useState(() => isEndingSoon(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(isEndingSoon(expiresAt));
    }, 10_000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!show) return null;

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-neon-pink/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neon-pink animate-pulse">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-pink opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon-pink" />
      </span>
      Ending Soon
    </span>
  );
}
