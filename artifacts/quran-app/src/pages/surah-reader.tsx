import { useSurahDetail } from "@/hooks/use-quran";
import { useProgress } from "@/hooks/use-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Check, Bookmark, BookmarkCheck, Play, Pause } from "lucide-react";
import { Link, useParams } from "wouter";
import { useState, useRef, useCallback } from "react";

export default function SurahReader() {
  const params = useParams<{ id: string }>();
  const surahNum = Number(params.id);
  const { data, isLoading } = useSurahDetail(surahNum);
  const { state, markAyahRead, isAyahRead, toggleBookmark, isBookmarked } = useProgress();
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const readCount = state.readAyahs.filter(
    (a) => a.split(":")[0] === String(surahNum)
  ).length;
  const totalAyahs = data?.arabic.numberOfAyahs || 0;
  const progress = totalAyahs > 0 ? Math.round((readCount / totalAyahs) * 100) : 0;

  const playAudio = useCallback(async (surah: number, ayah: number) => {
    if (playingAyah === ayah) {
      audioRef.current?.pause();
      setPlayingAyah(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(
      `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${data?.arabic.ayahs.find(a => a.numberInSurah === ayah)?.number}.mp3`
    );
    audioRef.current = audio;
    setPlayingAyah(ayah);

    audio.onended = () => setPlayingAyah(null);
    audio.onerror = () => setPlayingAyah(null);
    audio.play().catch(() => setPlayingAyah(null));
  }, [playingAyah, data]);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start gap-4">
        <Link href="/explore">
          <Button variant="ghost" size="icon" className="shrink-0 mt-1" data-testid="button-back-explore">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">{data.arabic.englishName}</h2>
            <span className="font-arabic text-primary text-xl" dir="rtl">{data.arabic.name}</span>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {data.arabic.englishNameTranslation} · {data.arabic.numberOfAyahs} ayahs · {data.arabic.revelationType === "Meccan" ? "Makki" : "Madani"}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <ProgressBar value={progress} className="h-2 flex-1" />
            <span className="text-sm font-medium text-primary">{progress}%</span>
          </div>
        </div>
      </div>

      {surahNum !== 9 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-6 text-center">
            <p className="font-arabic text-2xl text-primary leading-loose" dir="rtl">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>
            <p className="text-sm text-muted-foreground mt-2 italic">
              In the name of God, the Most Gracious, the Most Merciful
            </p>
          </CardContent>
        </Card>
      )}

      <ScrollArea className="h-auto">
        <div className="space-y-4">
          {data.arabic.ayahs.map((ayah, index) => {
            const translation = data.translation.ayahs[index];
            const read = isAyahRead(surahNum, ayah.numberInSurah);
            const bookmarked = isBookmarked(surahNum, ayah.numberInSurah);
            const isPlaying = playingAyah === ayah.numberInSurah;

            return (
              <Card
                key={ayah.numberInSurah}
                className={`border transition-all ${read ? "border-primary/30 bg-primary/5" : "border-border"}`}
                data-testid={`card-ayah-${ayah.numberInSurah}`}
              >
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {ayah.numberInSurah}
                    </Badge>
                    {read && (
                      <Badge className="bg-primary/20 text-primary border-none text-[10px]">
                        <Check size={10} className="mr-1" /> Read
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => playAudio(surahNum, ayah.numberInSurah)}
                      data-testid={`button-play-${ayah.numberInSurah}`}
                    >
                      {isPlaying ? <Pause size={16} className="text-primary" /> : <Play size={16} className="text-muted-foreground" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        toggleBookmark({
                          surah: surahNum,
                          ayah: ayah.numberInSurah,
                          text: ayah.text,
                          translation: translation?.text || "",
                          surahName: data.arabic.englishName,
                        })
                      }
                      data-testid={`button-bookmark-${ayah.numberInSurah}`}
                    >
                      {bookmarked ? (
                        <BookmarkCheck size={16} className="text-secondary fill-secondary" />
                      ) : (
                        <Bookmark size={16} className="text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-arabic text-2xl leading-[2.5] text-right text-foreground" dir="rtl">
                    {ayah.text}
                  </p>
                  <div className="border-t border-border pt-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {translation?.text}
                    </p>
                  </div>
                  {!read && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => markAyahRead(surahNum, ayah.numberInSurah)}
                      data-testid={`button-mark-read-${ayah.numberInSurah}`}
                    >
                      <Check size={14} /> Mark as Read (+10 XP)
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
