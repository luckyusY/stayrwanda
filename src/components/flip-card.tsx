"use client";

import { useState } from "react";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

export function FlipCard({ front, back, className = "" }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flip-card ${className}`}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(!flipped)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setFlipped((current) => !current);
        }
      }}
    >
      <div className={`flip-card-inner relative h-full w-full ${flipped ? "[transform:rotateY(180deg)]" : ""}`}>
        <div className="flip-card-front absolute inset-0 h-full w-full [backface-visibility:hidden]">
          {front}
        </div>
        <div className="flip-card-back absolute inset-0 h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {back}
        </div>
      </div>
    </div>
  );
}
