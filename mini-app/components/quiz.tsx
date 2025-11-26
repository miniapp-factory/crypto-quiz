"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { title, url } from "@/lib/metadata";

type Option = {
  text: string;
  animal: string;
};

type Question = {
  question: string;
  options: Option[];
};

const questions: Question[] = [
  {
    question: "What’s your favorite type of food?",
    options: [
      { text: "Fish", animal: "cat" },
      { text: "Meat", animal: "dog" },
      { text: "Berries", animal: "fox" },
      { text: "Seeds", animal: "hamster" },
    ],
  },
  {
    question: "How do you like to spend your free time?",
    options: [
      { text: "Chasing mice", animal: "cat" },
      { text: "Playing fetch", animal: "dog" },
      { text: "Hunting in the woods", animal: "fox" },
      { text: "Storing food", animal: "hamster" },
    ],
  },
  {
    question: "What’s your personality like?",
    options: [
      { text: "Independent", animal: "cat" },
      { text: "Friendly", animal: "dog" },
      { text: "Clever", animal: "fox" },
      { text: "Curious", animal: "hamster" },
    ],
  },
  {
    question: "Which environment do you prefer?",
    options: [
      { text: "Urban", animal: "cat" },
      { text: "Suburban", animal: "dog" },
      { text: "Forest", animal: "fox" },
      { text: "Barn", animal: "hamster" },
    ],
  },
  {
    question: "What’s your favorite activity?",
    options: [
      { text: "Sleeping", animal: "cat" },
      { text: "Running", animal: "dog" },
      { text: "Hunting", animal: "fox" },
      { text: "Chewing", animal: "hamster" },
    ],
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Quiz() {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    const qs = questions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setShuffledQuestions(qs);
  }, []);

  const handleAnswer = (animal: string) => {
    setScores((prev) => ({
      ...prev,
      [animal]: (prev[animal] ?? 0) + 1,
    }));
    if (current + 1 < shuffledQuestions.length) {
      setCurrent(current + 1);
    } else {
      const best = Object.entries(scores).reduce(
        (a, b) => (b[1] > a[1] ? b : a),
        ["", 0] as [string, number]
      )[0];
      setResult(best);
    }
  };

  const retake = () => {
    setCurrent(0);
    setScores({});
    setResult(null);
  };

  if (!shuffledQuestions.length) return null;

  if (result) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold">You are a {result}!</h2>
        <img
          src={`/${result}.png`}
          alt={result}
          width={512}
          height={512}
          className="size-[512px]"
        />
        <Share text={`${title} - I am a ${result}! ${url}`} />
        <Button onClick={retake}>Retake Quiz</Button>
      </div>
    );
  }

  const q = shuffledQuestions[current];
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold">{q.question}</h2>
      <div className="flex flex-col gap-2">
        {q.options.map((opt) => (
          <Button key={opt.text} onClick={() => handleAnswer(opt.animal)}>
            {opt.text}
          </Button>
        ))}
      </div>
    </div>
  );
}
