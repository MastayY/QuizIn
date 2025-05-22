import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { useNavigate } from "react-router-dom";

function App() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md">
                <CardContent className="p-6">
                    <h1 className="text-3xl font-bold text-center mb-6">
                        Welcome to QuizIn
                    </h1>
                    <p className="text-gray-600 text-center mb-8 text-sm">
                        QuizIn is a fun and interactive quiz application that
                        allows you to test your knowledge on various topics. Get
                        ready to challenge yourself and learn something new!
                    </p>
                    <div className="flex justify-center">
                        <Button
                            onClick={() => navigate("/quiz")}
                            className="w-full max-w-xs"
                            size="lg"
                        >
                            Start Quiz
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default App;
