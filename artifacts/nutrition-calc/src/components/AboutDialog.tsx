import React from "react";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="О программе"
          data-testid="button-about-dialog"
          className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground/70 hover:text-primary hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <Info className="w-[18px] h-[18px]" />
        </button>
      </DialogTrigger>
      <DialogContent data-testid="dialog-about" className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="w-[18px] h-[18px] text-primary" aria-hidden="true" />
            О программе
          </DialogTitle>
          <DialogDescription className="sr-only">
            Информация о создателях программы питания
          </DialogDescription>
        </DialogHeader>

        <dl className="space-y-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Год создания</dt>
            <dd className="font-medium text-foreground">2026</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Автор программы питания</dt>
            <dd className="font-medium text-foreground">Николай Милютин</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Разработчик ПО</dt>
            <dd className="font-medium text-foreground">Кирилл Фёдоров</dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
}
