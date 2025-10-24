import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import React from "react";

interface NavigationButtonsProps {
  onNext: () => void;
  onPrev: () => void;
  showPrev?: boolean;
  nextText?: React.ReactNode;
  nextDisabled?: boolean;
  isSubmitting?: boolean;
}

export function NavigationButtons({
  onNext,
  onPrev,
  showPrev = true,
  nextText = "下一步",
  nextDisabled = false,
  isSubmitting = false,
}: NavigationButtonsProps) {
  const isFinalStep = typeof nextText === 'string' && nextText.includes("完成");

  return (
    <div className="flex justify-between mt-8 pt-6 border-t border-border">
      {showPrev ? (
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          上一步
        </Button>
      ) : (
        <div />
      )}
      <Button
        onClick={onNext}
        disabled={nextDisabled || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            提交中...
          </>
        ) : (
          <>
            {nextText}
            {isFinalStep ? <Check className="ml-2 h-4 w-4" /> : <ArrowRight className="ml-2 h-4 w-4" />}
          </>
        )}
      </Button>
    </div>
  );
}

