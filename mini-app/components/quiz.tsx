"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

type Question = {
  text: string;
  options: { text: string; animal: string }[];
};

const questions: Question[] = [
  {
    text: "What is your favorite type of food?",
    options: [
      { text: "Fish", animal: "cat" },
      { text: "Meat", animal: "dog" },
      { text: "Berries", animal: "fox" },
      { text: "Seeds", animal: "hamster" },
      { text: "Grass", animal: "horse" },
    ],
  },
  {
    text: "How do you prefer to spend your free time?",
    options: [
      { text: "Sleeping", animal: "cat" },
      { text: "Playing fetch", animal: "dog" },
      { text: "Hunting", animal: "fox" },
      { text: "Storing food", animal: "hamster" },
      { text: "Running", animal: "horse" },
    ],
  },
  {
    text: "What is your personality like?",
    options: [
      { text: "Independent", animal: "cat" },
      { text: "Friendly", animal: "dog" },
      { text: "Clever", animal: "fox" },
      { text: "Curious", animal: "hamster" },
      { text: "Strong", animal: "horse" },
    ],
  },
  {
    text: "Which environment do you thrive in?",
    options: [
      { text: "Indoor", animal: "cat" },
      { text: "Outdoor", animal: "dog" },
      { text: "Forest", animal: "fox" },
      { text: "Cage", animal: "hamster" },
      { text: "Pasture", animal: "horse" },
    ],
  },
  {
    text: "What is your favorite activity?",
    options: [
      { text: "Purring", animal: "cat" },
      { text: "Barking", animal: "dog" },
      { text: "Sneaking", animal: "fox" },
      { text: "Nibbling", animal: "hamster" },
      { text: "Galloping", animal: "horse" },
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
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [shuffledOptions, setShuffledOptions] = useState<
    { text: string; animal: string }[]
  >([]);

  useEffect(() => {
    setShuffledOptions(shuffleArray(questions[current].options));
  }, [current]);

  const handleAnswer = (animal: string) => {
    setScores((prev) => ({
      ...prev,
      [animal]: (prev[animal] ?? 0) + 1,
    }));
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    }
  };

  const resetQuiz = () => {
    setCurrent(0);
    setScores({});
  };

  const getResult = () => {
    const maxScore = Math.max(...Object.values(scores));
    const bestAnimals = Object.entries(scores)
      .filter(([, s]) => s === maxScore)
      .map(([a]) => a);
    return bestAnimals[0] ?? "cat";
  };

  if (current < questions.length) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-xl font-semibold">
            Question {current + 1} of {questions.length}
          </h2>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{questions[current].text}</p>
          {shuffledOptions.map((opt, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="w-full mb-2"
              onClick={() => handleAnswer(opt.animal)}
            >
              {opt.text}
            </Button>
          ))}
        </CardContent>
      </Card>
    );
  }

  const resultAnimal = getResult();
  const animalImages: Record<string, string> = {
    cat: "/cat.png",
    dog: "/dog.png",
    fox: "/fox.png",
    hamster: "/hamster.png",
    horse: "/horse.png",
  };

  return (
    <Card className="w-full max-w-md text-center">
      <CardHeader>
        <h2 className="text-2xl font-bold">Your Animal Match!</h2>
      </CardHeader>
      <CardContent>
        <img
          src={animalImages[resultAnimal]}
          alt={resultAnimal}
          width={256}
          height={256}
          className="mx-auto mb-4"
        />
        <p className="mb-4 text-lg">
          You are most similar to a <strong>{resultAnimal}</strong>!
        </p>
        <Share text={`I am a ${resultAnimal}! ${url}`} />
      </CardContent>
      <CardFooter>
        <Button onClick={resetQuiz}>Retake Quiz</Button>
      </CardFooter>
    </Card>
  );
}
