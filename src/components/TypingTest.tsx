import React, { useState, useRef } from "react";

const SAMPLE_TEXT = "The quick brown fox jumps over the lazy dog";

const TypingTest: React.FC = () => {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setTypedText] = useState("");
  const [, setWpm] = useState(0);
  const [, setAccuracy] = useState(100);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    setTypedText(input);

    const now = Date.now();
    const timeElapsed = (now - (startTime ?? now)) / 1000 / 60; // in minutes

    const correctChars = input
      .split("")
      .filter((char, idx) => char === SAMPLE_TEXT[idx]).length;
    const accuracyCalc =
      input.length === 0 ? 100 : (correctChars / input.length) * 100;
    const wpmCalc = timeElapsed > 0 ? correctChars / 5 / timeElapsed : 0;

    setAccuracy(Number(accuracyCalc.toFixed(2)));
    setWpm(Math.round(wpmCalc));
    if (!startTime) {
      setStartTime(Date.now());
    }
    setInput(e.target.value);
  };

  const handleSubmit = () => {
    setEndTime(Date.now());
  };

  const getWPM = () => {
    if (!startTime || !endTime) return 0;
    const words = input.trim().split(" ").length;
    const timeInMinutes = (endTime - startTime) / 60000;
    return Math.round(words / timeInMinutes);
  };

  const getAccuracy = () => {
    const inputWords = input.trim().split(" ");
    const sampleWords = SAMPLE_TEXT.split(" ");
    let correct = 0;

    inputWords.forEach((word, i) => {
      if (word === sampleWords[i]) correct++;
    });

    return Math.round((correct / sampleWords.length) * 100);
  };

  return (
    <div className="text-center p-4">
      <h2 className="text-xl mb-2">Typing Speed Test</h2>
      <p className="mb-4 text-gray-600">{SAMPLE_TEXT}</p>
      <input
        ref={inputRef}
        value={input}
        onChange={handleChange}
        placeholder="Start typing here..."
        className="border p-2 w-full max-w-md"
        disabled={!!endTime}
      />
      <div className="mt-4">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!!endTime}
        >
          Submit
        </button>
      </div>
      {endTime && (
        <div className="mt-4">
          <p>WPM: {getWPM()}</p>
          <p>Accuracy: {getAccuracy()}%</p>
        </div>
      )}
    </div>
  );
};

export default TypingTest;
