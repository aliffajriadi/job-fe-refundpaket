"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Snowflake {
  id: number;
  left: string;
  delay: number;
  duration: number;
  size: number;
  xDuration: number;
}

export default function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Generate flakes inside effect but avoid synchronous cascading render warning
    const generateFlakes = () => {
      const flakes = Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 10,
        size: 2 + Math.random() * 4,
        xDuration: 2 + Math.random() * 2,
      }));
      setSnowflakes(flakes);
    };

    const timeoutId = setTimeout(generateFlakes, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  if (snowflakes.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-60 overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          className="absolute top-[-10px] bg-white rounded-full opacity-60"
          style={{
            left: flake.left,
            width: flake.size,
            height: flake.size,
            filter: "blur(1px)",
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: "105vh",
            opacity: [0, 0.6, 0.6, 0],
            x: ["-20px", "20px", "-20px"],
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear",
            x: {
              duration: flake.xDuration,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
      ))}
    </div>
  );
}
