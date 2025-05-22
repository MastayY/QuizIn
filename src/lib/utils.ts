import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetchQuizData = async (category: string) => {
  const res = await fetch(
    `https://opentdb.com/api.php?amount=10&category=${category}&type=multiple`
  )
  const data = await res.json();
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  const options = data.results.map((question: any) => {
    const allOptions = [...question.incorrect_answers, question.correct_answer]
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5)
    return {
      question: question.question,
      correct_answer: question.correct_answer,
      allOptions: shuffledOptions,
    }
  })

  return options
}
