import { useProgress } from "@/hooks/use-progress";
import { useSurahs } from "@/hooks/use-quran";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Target, Trophy, Zap, ArrowRight, RotateCcw, BookOpen } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { Link } from "wouter";

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

type QuizState = "intro" | "playing" | "result";

export default function Quiz() {
  const { state, addQuizResult } = useProgress();
  const { data: surahs } = useSurahs();
  const [quizState, setQuizState] = useState<QuizState>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const readSurahNums = useMemo(() => {
    const nums = new Set(state.readAyahs.map((a) => Number(a.split(":")[0])));
    return Array.from(nums);
  }, [state.readAyahs]);

  const canTakeQuiz = readSurahNums.length >= 2 && surahs && surahs.length > 0;

  const generateQuestions = useCallback(() => {
    if (!surahs || readSurahNums.length < 2) return [];

    const qs: Question[] = [];
    const readSurahs = surahs.filter((s) => readSurahNums.includes(s.number));
    const allSurahs = surahs;

    for (let i = 0; i < 5 && readSurahs.length >= 2; i++) {
      const type = Math.floor(Math.random() * 3);
      const targetSurah = readSurahs[Math.floor(Math.random() * readSurahs.length)];

      if (type === 0) {
        const wrongOptions = allSurahs
          .filter((s) => s.number !== targetSurah.number)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        const options = [...wrongOptions.map((s) => s.englishName), targetSurah.englishName].sort(
          () => Math.random() - 0.5
        );
        qs.push({
          question: `Which surah is known as "${targetSurah.englishNameTranslation}"?`,
          options,
          correctIndex: options.indexOf(targetSurah.englishName),
        });
      } else if (type === 1) {
        const correct = targetSurah.numberOfAyahs.toString();
        const wrongs = [
          String(targetSurah.numberOfAyahs + Math.floor(Math.random() * 20) + 1),
          String(Math.max(1, targetSurah.numberOfAyahs - Math.floor(Math.random() * 15) - 1)),
          String(targetSurah.numberOfAyahs + Math.floor(Math.random() * 50) + 10),
        ];
        const options = [correct, ...wrongs].sort(() => Math.random() - 0.5);
        qs.push({
          question: `How many ayahs are in Surah ${targetSurah.englishName}?`,
          options,
          correctIndex: options.indexOf(correct),
        });
      } else {
        const isMeccan = targetSurah.revelationType === "Meccan";
        qs.push({
          question: `Surah ${targetSurah.englishName} was revealed in Makkah.`,
          options: ["True", "False"],
          correctIndex: isMeccan ? 0 : 1,
        });
      }
    }

    return qs;
  }, [surahs, readSurahNums]);

  const startQuiz = () => {
    const qs = generateQuestions();
    setQuestions(qs);
    setCurrentQ(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setQuizState("playing");
  };

  const selectAnswer = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
    setShowFeedback(true);
    if (index === questions[currentQ].correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      const finalScore = selectedAnswer === questions[currentQ].correctIndex ? score : score;
      addQuizResult(finalScore, questions.length);
      setQuizState("result");
    } else {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  if (quizState === "intro") {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-2xl font-bold text-foreground" data-testid="text-quiz-title">Quiz Time</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Test your knowledge and earn XP
          </p>
        </div>

        <Card className="border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-8 text-center space-y-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Target size={40} className="text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Ready for a Challenge?</h3>
              <p className="text-muted-foreground mt-2">
                Answer 5 quick questions about the surahs you've read.
                <br />
                Earn 50 XP for each correct answer!
              </p>
            </div>

            {!canTakeQuiz ? (
              <div className="space-y-4">
                <p className="text-sm text-destructive font-medium">
                  Read at least 2 surahs to unlock quizzes
                </p>
                <Link href="/explore">
                  <Button className="gap-2" data-testid="button-go-explore">
                    <BookOpen size={16} /> Start Reading
                  </Button>
                </Link>
              </div>
            ) : (
              <Button size="lg" className="gap-2 px-8" onClick={startQuiz} data-testid="button-start-quiz">
                <Zap size={18} /> Start Quiz
              </Button>
            )}
          </CardContent>
        </Card>

        {state.quizHistory.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Recent Results</h3>
            <div className="space-y-2">
              {state.quizHistory
                .slice(-5)
                .reverse()
                .map((result, i) => (
                  <Card key={i} className="border-border">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center">
                          <Trophy size={18} className="text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {result.score}/{result.total} correct
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(result.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-mono">
                        +{result.xpEarned} XP
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (quizState === "result") {
    const percentage = Math.round((score / questions.length) * 100);
    const xpEarned = score * 50;
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in duration-500">
        <Card className="border-2 border-secondary/30 overflow-hidden">
          <div className="bg-secondary/10 p-8 text-center space-y-4">
            <div className="h-24 w-24 rounded-full bg-secondary/20 flex items-center justify-center mx-auto">
              <Trophy size={48} className="text-secondary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              {percentage >= 80 ? "Amazing!" : percentage >= 60 ? "Great job!" : "Keep learning!"}
            </h2>
            <p className="text-muted-foreground">
              You got {score} out of {questions.length} correct
            </p>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-xl">
                <p className="text-3xl font-bold text-primary">{percentage}%</p>
                <p className="text-xs text-muted-foreground mt-1">Score</p>
              </div>
              <div className="text-center p-4 bg-secondary/5 rounded-xl">
                <p className="text-3xl font-bold text-secondary">+{xpEarned}</p>
                <p className="text-xs text-muted-foreground mt-1">XP Earned</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1 gap-2" onClick={startQuiz} data-testid="button-retry-quiz">
                <RotateCcw size={16} /> Try Again
              </Button>
              <Link href="/explore" className="flex-1">
                <Button variant="outline" className="w-full gap-2" data-testid="button-back-explore">
                  <BookOpen size={16} /> Keep Reading
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const q = questions[currentQ];
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="font-mono">
          {currentQ + 1} / {questions.length}
        </Badge>
        <Badge variant="secondary" className="font-mono gap-1">
          <Zap size={12} /> {score * 50} XP
        </Badge>
      </div>

      <ProgressBar value={((currentQ + 1) / questions.length) * 100} className="h-2" />

      <Card className="border-2 border-border">
        <CardHeader>
          <CardTitle className="text-lg leading-relaxed" data-testid={`text-question-${currentQ}`}>
            {q.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {q.options.map((option, i) => {
            let variant: "outline" | "default" | "destructive" = "outline";
            let extraClass = "hover:border-primary/50 hover:bg-primary/5";

            if (showFeedback) {
              if (i === q.correctIndex) {
                variant = "default";
                extraClass = "bg-green-600 hover:bg-green-600 text-white border-green-600";
              } else if (i === selectedAnswer && i !== q.correctIndex) {
                variant = "destructive";
                extraClass = "";
              } else {
                extraClass = "opacity-50";
              }
            }

            return (
              <Button
                key={i}
                variant={variant}
                className={`w-full justify-start text-left h-auto py-4 px-5 transition-all ${extraClass}`}
                onClick={() => selectAnswer(i)}
                disabled={showFeedback}
                data-testid={`button-option-${i}`}
              >
                <span className="h-7 w-7 rounded-full border-2 flex items-center justify-center text-sm font-bold mr-3 shrink-0">
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {showFeedback && (
        <div className="flex justify-end animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Button size="lg" className="gap-2" onClick={nextQuestion} data-testid="button-next-question">
            {currentQ + 1 >= questions.length ? "See Results" : "Next"} <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
