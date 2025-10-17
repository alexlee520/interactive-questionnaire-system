interface NavigationButtonsProps {
  onPrev?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  prevLabel?: string;
  showPrev?: boolean;
  showNext?: boolean;
}

export function NavigationButtons({
  onPrev,
  onNext,
  nextDisabled = false,
  nextLabel = "下一步",
  prevLabel = "上一步",
  showPrev = true,
  showNext = true,
}: NavigationButtonsProps) {
  return (
    <div className="mt-[26px] flex gap-3 flex-wrap">
      {showPrev && onPrev && (
        <button
          type="button"
          onClick={onPrev}
          className="bg-background text-foreground border-2 border-border px-[22px] py-[14px] rounded-[10px] text-base font-extrabold cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-150 shadow-sm hover:border-border/80 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          data-testid="button-prev"
        >
          <span>←</span>
          <span>{prevLabel}</span>
        </button>
      )}
      
      {showNext && onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="flex-1 bg-primary text-primary-foreground px-[22px] py-[14px] rounded-[10px] text-base font-extrabold cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-150 shadow-sm hover:bg-primary/90 hover:-translate-y-px hover:shadow-md active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:translate-y-0 disabled:hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          data-testid="button-next"
        >
          <span>{nextLabel}</span>
          <span>→</span>
        </button>
      )}
    </div>
  );
}
