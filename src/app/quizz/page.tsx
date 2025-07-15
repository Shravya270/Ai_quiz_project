"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import ProgressBar from "@/components/progressBar";
import {ChevronLeft ,X } from "lucide-react"
import ResultCard from "./ResultCard";


const questions = [
  {
    questionText: "What is JSX?",
    answers: [
      { answerText: "JavaScript XML", isCorrect: true, id: 1 },
      { answerText: "JavaScript", isCorrect: false, id: 2 },
      { answerText: "JavaScript and XML", isCorrect: false, id: 3 },
      { answerText: "JavaScript and HTML", isCorrect: false, id: 4 }
    ]
  },
  {
    questionText: "Which method is used to render React components to the DOM?",
    answers: [
      { answerText: "ReactDOM.render()", isCorrect: true, id: 1 },
      { answerText: "React.render()", isCorrect: false, id: 2 },
      { answerText: "ReactDOM.display()", isCorrect: false, id: 3 },
      { answerText: "render()", isCorrect: false, id: 4 }
    ]
  },
  {
    questionText: "What is a React Hook used for state management?",
    answers: [
      { answerText: "useState()", isCorrect: true, id: 1 },
      { answerText: "useProps()", isCorrect: false, id: 2 },
      { answerText: "setState()", isCorrect: false, id: 3 },
      { answerText: "useEffect()", isCorrect: false, id: 4 }
    ]
  },
  {
    questionText: "Which of the following is NOT a valid React lifecycle method?",
    answers: [
      { answerText: "componentDidMount", isCorrect: false, id: 1 },
      { answerText: "componentWillUnmount", isCorrect: false, id: 2 },
      { answerText: "componentDidUpdate", isCorrect: false, id: 3 },
      { answerText: "componentWillFetch", isCorrect: true, id: 4 }
    ]
  }
];



export default function Home() {
    const [started,setStarted] = useState(false);
    const [currentQuestion,setCurrentQuestion] = useState<number>(0);
    const [score,setScore] = useState<number>(0);
    const [selectedAnswer,setSelectedAnswer] = useState<number|null>(null);
    const [isCorrect,setIsCorrect] = useState<boolean|null>(null);

    const handleNext =()=>{
        if(!started){
            setStarted(true);
            return;
        }

        if(currentQuestion<questions.length - 1){
            setCurrentQuestion(currentQuestion+1);
        }

        setSelectedAnswer(null);
        setIsCorrect(null);
    }

    const handleAnswer=(answer) =>{
        setSelectedAnswer(answer.id);
        const isCurrentCorrect = answer.isCorrect;
        if(isCurrentCorrect){
            setScore(score+1);
        }
        setIsCorrect(isCurrentCorrect);
    }



  return (
    <div className="flex flex-col flex-1">
        <div className="position-sticky top-0 z-10 shadow-md py-4 w-full">
            <header className="grid grid-cols-[auto,1fr,auto] grid-flow-col items-center justify-between py-2 gap-2">
                <Button size="icon" variant="outline"><ChevronLeft/></Button>
                <ProgressBar value={(currentQuestion/questions.length)*100}/>
                <Button size="icon" variant="outline"><X/></Button>

            </header>
        </div>
    <main className="flex justify-center flex-1">
        {!started ?
      <h1 className="text-6xl font-bold">Welcome to the quiz page👋</h1> : (
        <div>
            <h2 className="text-6xl font-bold">{questions[currentQuestion].questionText}</h2>
            <div className="grid grid-cols-1 gap-6 mt-6">
                {
                    questions[currentQuestion].answers.map(answer=>{
                        return (
                            <Button key={answer.id} variant={"secondary"} onClick={()=> handleAnswer(answer)}>{answer.answerText}</Button>
                        )
                    })
                }
            </div>
        </div>
      )
}
    </main>
    <footer className="footer pb-9 px-6 relative mb-0">
        <ResultCard isCorrect={isCorrect} correctAnswer={questions[currentQuestion].answers.find(answer => answer.isCorrect === true)?.answerText}/>
        <Button onClick={handleNext}>{!started ? 'Start': 'Next'}</Button>
    </footer>
    </div>
  )
}
