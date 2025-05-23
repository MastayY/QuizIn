import { Card, CardContent } from "./ui/card";

interface QuizCardPropsTypes {
    question: string;
    options: string[];
    showAnswer: boolean;
    correctAnswer: string;
    selectedChoice: string | null;
    onAnswerSelect: (answer: string) => void;
}

const QuizCard = (props: QuizCardPropsTypes) => {
    const {
        question,
        options,
        showAnswer,
        correctAnswer,
        selectedChoice,
        onAnswerSelect,
    } = props;

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardContent className="p-6">
                <h2
                    className="text-xl font-semibold mb-6"
                    dangerouslySetInnerHTML={{ __html: question }}
                />

                <div className="grid gap-4">
                    {options.map((option) => {
                        const isCorrect =
                            showAnswer && option === correctAnswer;
                        const isWrong =
                            showAnswer &&
                            option === selectedChoice &&
                            option !== correctAnswer;

                        return (
                            <button
                                key={option}
                                disabled={showAnswer}
                                onClick={() => onAnswerSelect(option)}
                                className={`p-4 rounded-md border w-full mb-2 text-left
                    ${isCorrect ? "bg-green-200 border-green-600" : ""}
                    ${isWrong ? "bg-red-200 border-red-600" : ""}
                    ${!isCorrect && !isWrong ? "hover:bg-gray-100" : ""}
                `}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};

export default QuizCard;
