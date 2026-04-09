import { useProgress } from "@/hooks/use-progress";
import { useRandomAyah } from "@/hooks/use-quran";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Star, BookOpen, ChevronRight, PlayCircle, Target } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { state } = useProgress();
  const { data: randomAyah, isLoading } = useRandomAyah();

  const xpProgress = state.xp % 1000;

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-primary text-primary-foreground border-none overflow-hidden relative group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
          <CardContent className="p-4 flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium opacity-80">Day Streak</p>
              <p className="text-3xl font-bold">{state.streak.count}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Flame className="text-secondary fill-secondary drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" size={28} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary text-secondary-foreground border-none overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10"></div>
          <CardContent className="p-4 flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium opacity-80">Level {state.level}</p>
              <p className="text-3xl font-bold">{state.xp} <span className="text-sm">XP</span></p>
            </div>
            <div className="h-12 w-12 rounded-full bg-background/20 flex items-center justify-center">
              <Star className="text-background fill-background drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" size={28} />
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
            <div className="h-full bg-background" style={{ width: `${(xpProgress / 1000) * 100}%` }} />
          </div>
        </Card>
      </div>

      {/* Daily Verse */}
      <Card className="border-border shadow-sm overflow-hidden border-2 border-t-primary">
        <CardHeader className="bg-muted/50 pb-2 border-b">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-primary">
            <BookOpen size={16} /> Verse of the Day
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading || !randomAyah ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-right">
                <p className="font-arabic text-3xl leading-loose text-primary" dir="rtl">
                  {randomAyah.arabic.text}
                </p>
              </div>
              <div className="border-l-4 border-secondary pl-4">
                <p className="text-muted-foreground text-sm italic mb-2">
                  {randomAyah.surah.englishName} ({randomAyah.surah.number}:{randomAyah.arabic.numberInSurah})
                </p>
                <p className="text-foreground font-medium leading-relaxed">
                  {randomAyah.translation.text}
                </p>
              </div>
              <div className="flex justify-end pt-2">
                <Link href={`/explore/${randomAyah.surah.number}`} className="inline-flex">
                  <Button variant="outline" size="sm" className="gap-2 rounded-full">
                    Read Surah <ChevronRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/explore" className="block">
          <Card className="hover-elevate cursor-pointer border-border transition-colors hover:border-primary group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <PlayCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Continue Reading</h3>
                <p className="text-muted-foreground text-sm">Pick up where you left off</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/quiz" className="block">
          <Card className="hover-elevate cursor-pointer border-border transition-colors hover:border-secondary group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary/10 text-secondary-foreground flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                <Target size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Daily Quiz</h3>
                <p className="text-muted-foreground text-sm">Test your knowledge & earn XP</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

    </div>
  );
}
