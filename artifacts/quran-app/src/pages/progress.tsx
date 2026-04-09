import { useProgress } from "@/hooks/use-progress";
import { useSurahs } from "@/hooks/use-quran";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Flame, Star, BookOpen, Trophy, Target, Award, Zap, TrendingUp } from "lucide-react";
import { useMemo } from "react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: typeof Trophy;
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "bookworm_50", title: "Bookworm", description: "Read 50 ayahs", icon: BookOpen },
  { id: "streak_7", title: "On Fire", description: "7-day streak", icon: Flame },
  { id: "surahs_5", title: "Explorer", description: "Read from 5 surahs", icon: Award },
  { id: "quiz_master", title: "Quiz Master", description: "Score 100% on a quiz", icon: Target },
];

export default function ProgressPage() {
  const { state } = useProgress();
  const { data: surahs } = useSurahs();

  const xpToNext = 1000 - (state.xp % 1000);
  const xpProgress = ((state.xp % 1000) / 1000) * 100;

  const surahsStarted = useMemo(() => {
    return new Set(state.readAyahs.map((a) => a.split(":")[0])).size;
  }, [state.readAyahs]);

  const surahsCompleted = useMemo(() => {
    if (!surahs) return 0;
    let count = 0;
    for (const surah of surahs) {
      const readInSurah = state.readAyahs.filter(
        (a) => a.split(":")[0] === String(surah.number)
      ).length;
      if (readInSurah >= surah.numberOfAyahs) count++;
    }
    return count;
  }, [surahs, state.readAyahs]);

  const avgQuizScore = useMemo(() => {
    if (state.quizHistory.length === 0) return 0;
    const total = state.quizHistory.reduce(
      (sum, q) => sum + (q.score / q.total) * 100,
      0
    );
    return Math.round(total / state.quizHistory.length);
  }, [state.quizHistory]);

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-foreground" data-testid="text-progress-title">Your Progress</h2>
        <p className="text-muted-foreground text-sm mt-1">Track your learning journey</p>
      </div>

      <Card className="border-2 border-primary/20 overflow-hidden">
        <div className="bg-primary text-primary-foreground p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80 font-medium">Level {state.level}</p>
              <p className="text-4xl font-bold mt-1">{state.xp} XP</p>
            </div>
            <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Star size={32} className="fill-secondary text-secondary" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs opacity-80 mb-1">
              <span>Level {state.level}</span>
              <span>{xpToNext} XP to Level {state.level + 1}</span>
            </div>
            <div className="h-2.5 bg-primary-foreground/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Flame size={20} className="text-primary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{state.streak.count}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-2">
              <BookOpen size={20} className="text-secondary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{state.readAyahs.length}</p>
            <p className="text-xs text-muted-foreground">Ayahs Read</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center mx-auto mb-2">
              <TrendingUp size={20} className="text-accent-foreground" />
            </div>
            <p className="text-2xl font-bold text-foreground">{surahsStarted}</p>
            <p className="text-xs text-muted-foreground">Surahs Started</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-2">
              <Target size={20} className="text-secondary" />
            </div>
            <p className="text-2xl font-bold text-foreground">{avgQuizScore}%</p>
            <p className="text-xs text-muted-foreground">Avg Quiz Score</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Trophy size={20} className="text-secondary" /> Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ALL_ACHIEVEMENTS.map((achievement) => {
            const unlocked = state.achievements.includes(achievement.id);
            const Icon = achievement.icon;
            return (
              <Card
                key={achievement.id}
                className={`border transition-all ${
                  unlocked ? "border-secondary/30 bg-secondary/5" : "border-border opacity-50"
                }`}
                data-testid={`card-achievement-${achievement.id}`}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${
                      unlocked ? "bg-secondary/20 text-secondary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      {unlocked && (
                        <Badge className="bg-secondary text-secondary-foreground text-[10px]">
                          <Zap size={10} className="mr-1" /> Unlocked
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{achievement.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {state.quizHistory.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Quiz History</h3>
          <div className="space-y-2">
            {state.quizHistory
              .slice(-10)
              .reverse()
              .map((result, i) => {
                const pct = Math.round((result.score / result.total) * 100);
                return (
                  <Card key={i} className="border-border">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{pct}%</span>
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
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
