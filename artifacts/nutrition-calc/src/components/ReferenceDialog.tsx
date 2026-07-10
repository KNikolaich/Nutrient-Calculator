import React, { useState } from "react";
import { Library, Maximize2, Minimize2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { REFERENCE_INTRO, REFERENCE_SECTIONS } from "@/data/nutritionReference";
import { CAFE_GUIDE_TITLE, CAFE_GUIDE_PARAGRAPHS } from "@/data/cafeGuide";
import { COUNTING_MISTAKES_TITLE, COUNTING_MISTAKES_PARAGRAPHS } from "@/data/countingMistakes";

// Each tab is a self-contained knowledge-base article. Add new entries here
// as more content becomes available — the UI renders them automatically.
// A tab can render structured `sections` (title + bullet list) and/or free-form `paragraphs`.
const KNOWLEDGE_TABS = [
  {
    id: "bzhu-sources",
    label: "Источники БЖУ",
    intro: REFERENCE_INTRO,
    sections: REFERENCE_SECTIONS,
  },
  {
    id: "cafe-guide",
    label: "Кафе и рестораны",
    intro: CAFE_GUIDE_TITLE,
    paragraphs: CAFE_GUIDE_PARAGRAPHS,
  },
  {
    id: "counting-mistakes",
    label: "5 ошибок",
    intro: COUNTING_MISTAKES_TITLE,
    paragraphs: COUNTING_MISTAKES_PARAGRAPHS,
  },
] as const;

export function ReferenceDialog() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (KNOWLEDGE_TABS.length === 0) return null;

  return (
    <Dialog onOpenChange={(open) => !open && setIsFullscreen(false)}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="База знаний"
          data-testid="button-reference-dialog"
          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <Library className="w-[18px] h-[18px]" />
        </button>
      </DialogTrigger>
      <DialogContent
        data-testid="dialog-reference"
        className={cn(
          "flex flex-col gap-0 p-0 overflow-hidden transition-[max-width,max-height,width,height]",
          isFullscreen
            ? "w-[100vw] h-[100dvh] max-w-none max-h-none rounded-none sm:rounded-none top-0 left-0 translate-x-0 translate-y-0"
            : "w-[calc(100vw-2rem)] max-w-xl max-h-[85dvh]"
        )}
      >
        <DialogHeader className="flex-row items-center justify-between gap-3 px-5 py-4 border-b bg-muted/30 space-y-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Library className="w-[18px] h-[18px] text-primary" aria-hidden="true" />
            База знаний
          </DialogTitle>
          <DialogDescription className="sr-only">
            Справочные материалы по питанию, разбитые по темам
          </DialogDescription>
          <button
            type="button"
            onClick={() => setIsFullscreen((v) => !v)}
            aria-label={isFullscreen ? "Свернуть окно" : "Развернуть на весь экран"}
            data-testid="button-reference-toggle-fullscreen"
            className="mr-6 shrink-0 w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </DialogHeader>

        <Tabs
          defaultValue={KNOWLEDGE_TABS[0].id}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="px-5 pt-3 border-b bg-muted/30">
            <TabsList>
              {KNOWLEDGE_TABS.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} data-testid={`tab-reference-${tab.id}`}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {KNOWLEDGE_TABS.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="flex-1 overflow-y-auto px-5 py-4 space-y-5 mt-0"
            >
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tab.intro}
              </p>

              {"sections" in tab &&
                tab.sections.map((section) => (
                  <div key={section.title}>
                    <h3 className="text-sm font-bold text-primary mb-1.5">
                      {section.title}
                    </h3>
                    <ul className="space-y-1">
                      {section.items.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-foreground/90 leading-snug pl-3.5 relative before:content-['—'] before:absolute before:left-0 before:text-muted-foreground"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

              {"paragraphs" in tab && (
                <div className="space-y-3">
                  {tab.paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm text-foreground/90 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
