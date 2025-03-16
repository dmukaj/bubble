"use client";

import { useState, useEffect } from "react";

const TypingAnimation = ({ text, speed = 100, className }) => {
  // const [modelText, setModelText] = useState("");

  useEffect(() => {
    let i = 0;

    const typingAnimation = () => {
      if (i < text.length) {
        // setModelText((prev) => prev + text[i]);
        i++;
        setTimeout(typingAnimation, speed);
      }
    };
    // setModelText("");
    typingAnimation();

    return () => {
      i = text.length;
    };
  }, [text, speed, className]);

  return (
    <div className={className} speed={speed}>
      <h1>{text}</h1>
    </div>
  );
};

export default TypingAnimation;
