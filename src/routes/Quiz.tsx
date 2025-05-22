import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchQuizData } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import QuizCard from "@/components/QuizCard";

interface QuizQuestion {
    question: string;
    correct_answer: string;
    allOptions: string[];
    [key: string]: any;
}

const Quiz = () => {
    const timer = 10;
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(timer);
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [selectedOption, setSelectedOption] = useState<
        Array<{ question: string; selectedOption: string; isCorrect: boolean }>
    >([]);

    const [showResults, setShowResults] = useState(false);

    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

    const [category, setCategory] = useState("9"); // Default category
    const navigate = useNavigate();

    useEffect(() => {
        const savedProgress = localStorage.getItem("quizProgress");
        if (savedProgress) {
            const {
                quizStarted,
                questions,
                currentQuestion,
                selectedOption,
                category,
                timeLeft,
            } = JSON.parse(savedProgress);

            setQuizStarted(quizStarted);
            setQuestions(questions);
            setCurrentQuestion(currentQuestion);
            setSelectedOption(selectedOption);
            setCategory(category);
            setTimeLeft(timeLeft || timer); // fallback
        }
    }, []);

    useEffect(() => {
        if (quizStarted && questions.length > 0) {
            localStorage.setItem(
                "quizProgress",
                JSON.stringify({
                    quizStarted,
                    questions,
                    currentQuestion,
                    selectedOption,
                    category,
                    timeLeft,
                })
            );
        }
    }, [
        quizStarted,
        questions,
        currentQuestion,
        selectedOption,
        category,
        timeLeft,
    ]);

    useEffect(() => {
        if (quizStarted) {
            fetchQuizData(category)
                .then((data) => {
                    setQuestions(data);
                })
                .catch((_error) => {
                    toast.error("Error fetching quiz data", {
                        description: "Please try again later",
                        style: {
                            background: "#FEF2F2",
                            color: "#B91C1C",
                            borderLeft: "4px solid #DC2626",
                        },
                    });
                });
        }
    }, [quizStarted]);

    const clearProgress = () => {
        localStorage.removeItem("quizProgress");
    };

    const quizCategories = [
        { label: "General Knowledge", value: "9" },
        { label: "Books", value: "10" },
        { label: "Film", value: "11" },
        { label: "Music", value: "12" },
        { label: "Video Games", value: "15" },
        { label: "Science & Nature", value: "17" },
        { label: "Science: Computers", value: "18" },
        { label: "Mythology", value: "20" },
        { label: "Sports", value: "21" },
        { label: "Geography", value: "22" },
        { label: "Anime & Manga", value: "31" },
    ];

    console.log(questions);

    const progress = (currentQuestion / questions.length) * 100;

    const handleAnswer = (choice: string) => {
        if (showAnswer) return;

        setTimeLeft(timer);

        const currentQData = questions[currentQuestion];
        const correctAnswer = currentQData.correct_answer;
        const isCorrect = choice === correctAnswer;

        setSelectedChoice(choice);
        setShowAnswer(true); // tampilkan jawaban

        setSelectedOption((prev) => [
            ...prev,
            {
                question: currentQData.question,
                selectedOption: choice,
                isCorrect,
            },
        ]);

        if (isCorrect) {
            toast.success("Correct Answer!", {
                style: {
                    background: "#ECFDF5",
                    color: "#065F46",
                    borderLeft: "4px solid #059669",
                },
            });
        } else {
            toast.error("Wrong Answer!", {
                description: `Correct answer is: ${correctAnswer}`,
                style: {
                    background: "#FEF2F2",
                    color: "#B91C1C",
                    borderLeft: "4px solid #DC2626",
                },
            });
        }

        setTimeout(() => {
            setShowAnswer(false);
            setSelectedChoice(null);
            handleNextQuestion(choice);
        }, 5000);
    };

    const handleNextQuestion = (selectedOption) => {
        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
            setTimeLeft(timer);
        } else {
            clearProgress();
            setShowResults(true);
        }
    };

    const handleTimeout = useCallback(() => {
        toast("Time's up!", {
            style: {
                background: "#FEF2F2",
                color: "#B91C1C",
                borderLeft: "4px solid #DC2626",
            },
        });

        setSelectedOption((prev) => {
            if (
                prev.some(
                    (item) =>
                        item.question === questions[currentQuestion].question
                )
            ) {
                return prev;
            }

            return [
                ...prev,
                {
                    question: questions[currentQuestion].question,
                    selectedOption: null,
                    isCorrect: false,
                },
            ];
        });

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
            setTimeLeft(timer);
        } else {
            toast.success("Quiz Completed!", {
                description: "Check your results!",
                style: {
                    background: "#ECFDF5",
                    color: "#065F46",
                    borderLeft: "4px solid #059669",
                },
            });
        }
    }, [currentQuestion, questions]);

    useEffect(() => {
        if (!quizStarted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizStarted, currentQuestion, handleTimeout]);

    if (showResults) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
                <div className="w-full max-w-2xl">
                    {selectedOption.map((item, index) => (
                        <div key={index} className="mb-4 p-4 border rounded-md">
                            <h3 className="text-lg font-semibold mb-2">
                                Question {index + 1}
                            </h3>
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: item.question,
                                }}
                                className="mb-2"
                            />
                            <p
                                className={`font-medium ${
                                    item.isCorrect
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                Your Answer:{" "}
                                {item.selectedOption || "Time's up!"}
                            </p>
                        </div>
                    ))}
                    <Button onClick={() => {
                        setShowResults(false);
                        setQuizStarted(false);
                        clearProgress();
                        navigate("/");
                    }}>Go to Home</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            {!quizStarted ? (
                <div className="text-center max-w-lg w-full">
                    <h2 className="text-4xl font-bold mb-4">Ready to Start?</h2>
                    {/* instruction box note */}
                    <div className="mb-4 p-4 border rounded-md bg-sky-50 border-sky-200 text-left max-w-lg mx-auto">
                        <p className="text-sm text-sky-700">
                            You have{" "}
                            <strong>{timer} seconds</strong> for each question.
                        </p>
                        <p className="text-sm text-sky-700">
                            Select the correct answer from the options.
                        </p>
                        <p className="text-sm text-sky-700">
                            You can quit the quiz at any time.
                        </p>
                        <p className="text-sm text-sky-700">
                            Your progress will be saved automatically.
                        </p>
                        <p className="text-sm text-sky-700">
                            Good luck and have fun!
                        </p>
                        
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                        Choose a category and start the quiz!
                    </p>
                    <div className="mb-4 w-full">
                        <select
                            className="border border-gray-300 w-full rounded-md p-2"
                            onChange={(e) => {
                                setCategory(e.target.value);
                            }}
                        >
                            {quizCategories.map((category) => (
                                <option
                                    key={category.value}
                                    value={category.value}
                                >
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button onClick={() => setQuizStarted(true)} className="w-full py-5">
                        Start Quiz
                    </Button>
                </div>
            ) : (
                questions.length > 0 && (
                    <div className="w-full max-w-2xl">
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-600">
                                    Question {currentQuestion + 1} of{" "}
                                    {questions.length}
                                </span>
                                <span className="text-sm font-medium">
                                    Time left: {timeLeft}s
                                </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                        </div>

                        <QuizCard
                            question={questions[currentQuestion].question}
                            options={questions[currentQuestion].allOptions}
                            onAnswerSelect={handleAnswer}
                            currentQuestion={currentQuestion + 1}
                            totalQuestions={questions.length}
                            correctAnswer={
                                questions[currentQuestion].correct_answer
                            }
                            selectedChoice={selectedChoice}
                            showAnswer={showAnswer}
                        />

                        <div className="mt-4 text-center">
                            <Button
                                variant="outline"
                                className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                                onClick={() => {
                                    toast(
                                        "Are you sure you want to quit? All progress will be lost.",
                                        {
                                            style: {
                                                background: "#FFFBEB",
                                                color: "#92400E",
                                                borderLeft: "4px solid #F59E0B",
                                            },
                                            action: {
                                                label: "Quit",
                                                onClick: () => {
                                                    setQuizStarted(false);
                                                    setCurrentQuestion(0);
                                                    clearProgress();
                                                    navigate("/");
                                                },
                                                style: {
                                                    background: "#EF4444",
                                                    color: "white",
                                                },
                                            },
                                            cancel: {
                                                label: "Continue",
                                                style: {
                                                    background: "#10B981",
                                                    color: "white",
                                                },
                                            },
                                        }
                                    );
                                }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Quit Quiz
                            </Button>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default Quiz;
