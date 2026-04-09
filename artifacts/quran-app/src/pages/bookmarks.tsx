import { useProgress } from "@/hooks/use-progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, BookmarkX, BookOpen } from "lucide-react";
import { Link } from "wouter";

export default function Bookmarks() {
  const { state, toggleBookmark } = useProgress();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-foreground" data-testid="text-bookmarks-title">Saved Verses</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {state.bookmarks.length} verse{state.bookmarks.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {state.bookmarks.length === 0 ? (
        <Card className="border-2 border-dashed border-border">
          <CardContent className="p-12 text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Bookmark size={32} className="text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">No saved verses yet</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Tap the bookmark icon on any verse while reading to save it here
              </p>
            </div>
            <Link href="/explore">
              <Button className="gap-2" data-testid="button-start-reading">
                <BookOpen size={16} /> Start Reading
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {state.bookmarks.map((bookmark, i) => (
            <Card key={`${bookmark.surah}:${bookmark.ayah}`} className="border-border" data-testid={`card-bookmark-${i}`}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {bookmark.surahName} {bookmark.surah}:{bookmark.ayah}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => toggleBookmark(bookmark)}
                  data-testid={`button-remove-bookmark-${i}`}
                >
                  <BookmarkX size={16} />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="font-arabic text-xl leading-[2.5] text-right text-foreground" dir="rtl">
                  {bookmark.text}
                </p>
                <div className="border-t border-border pt-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {bookmark.translation}
                  </p>
                </div>
                <Link href={`/explore/${bookmark.surah}`}>
                  <Button variant="outline" size="sm" className="gap-2" data-testid={`button-read-surah-${i}`}>
                    <BookOpen size={14} /> Read Full Surah
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
