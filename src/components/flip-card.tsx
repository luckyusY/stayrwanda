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
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped(!flipped)} // Allows tapping to flip on touch screens
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
