import { useSurahs } from "@/hooks/use-quran";
import { useProgress } from "@/hooks/use-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useState, useMemo } from "react";

export default function Explore() {
  const { data: surahs, isLoading } = useSurahs();
  const { state } = useProgress();
  const [search, setSearch] = useState("");

  const filteredSurahs = useMemo(() => {
    if (!surahs) return [];
    if (!search.trim()) return surahs;
    const q = search.toLowerCase();
    return surahs.filter(
      (s) =>
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.number.toString() === q ||
        s.name.includes(search)
    );
  }, [surahs, search]);

  const getSurahProgress = (surahNum: number, totalAyahs: number) => {
    const readCount = state.readAyahs.filter(
      (a) => a.split(":")[0] === String(surahNum)
    ).length;
    return Math.round((readCount / totalAyahs) * 100);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-foreground" data-testid="text-explore-title">Explore the Quran</h2>
        <p className="text-muted-foreground text-sm mt-1">Browse all 114 surahs</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          placeholder="Search surahs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-card"
          data-testid="input-search-surahs"
        />
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))
        ) : filteredSurahs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">No surahs found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        ) : (
          filteredSurahs.map((surah) => {
            const progress = getSurahProgress(surah.number, surah.numberOfAyahs);
            return (
              <Link key={surah.number} href={`/explore/${surah.number}`} className="block">
                <Card className="hover-elevate cursor-pointer border-border transition-all hover:border-primary/50 group" data-testid={`card-surah-${surah.number}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                      {surah.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-foreground truncate">{surah.englishName}</h3>
                        <span className="font-arabic text-primary text-lg shrink-0" dir="rtl">{surah.name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">{surah.englishNameTranslation}</span>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {surah.revelationType === "Meccan" ? "Makki" : "Madani"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{surah.numberOfAyahs} ayahs</span>
                      </div>
                      {progress > 0 && (
                        <div className="mt-2">
                          <ProgressBar value={progress} className="h-1.5" />
                        </div>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
