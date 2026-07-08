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
import { cn } from "@/lib/utils";
import { REFERENCE_INTRO, REFERENCE_SECTIONS } from "@/data/nutritionReference";

export function ReferenceDialog() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <Dialog onOpenChange={(open) => !open && setIsFullscreen(false)}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Памятка по источникам БЖУ"
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
            Памятка по источникам БЖУ
          </DialogTitle>
          <DialogDescription className="sr-only">
            Справочник продуктов, сгруппированных по содержанию белков, жиров и углеводов
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

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {REFERENCE_INTRO}
          </p>

          {REFERENCE_SECTIONS.map((section) => (
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
