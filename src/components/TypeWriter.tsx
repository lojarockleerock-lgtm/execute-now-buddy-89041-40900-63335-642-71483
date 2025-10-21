import { useState, useEffect } from "react";

interface TypeWriterProps {
  text: string;
  speed?: number;
  className?: string;
}

const TypeWriter = ({ text, speed = 50, className = "" }: TypeWriterProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayedText}
      {currentIndex < text.length && (
        <span className="inline-block w-1 h-[1em] bg-primary ml-1 animate-pulse" />
      )}
    </span>
  );
};

export default TypeWriter;
