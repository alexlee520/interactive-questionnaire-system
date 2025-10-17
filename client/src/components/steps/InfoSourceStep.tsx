import { useState, useEffect } from "react";
import { StepContainer } from "./StepContainer";
import { NavigationButtons } from "./NavigationButtons";

interface InfoSourceStepProps {
  value: string[];
  onNext: (nextStep: number) => void;
  onPrev: () => void;
  onChange: (value: string[]) => void;
}

const sources = [
  "Facebook 廣告",
  "Google 搜尋",
  "Instagram",
  "朋友推薦",
  "Email 通知",
  "官方網站",
  "其他",
];

export function InfoSourceStep({ value, onNext, onPrev, onChange }: InfoSourceStepProps) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(value.length > 0);
  }, [value]);

  const handleToggle = (source: string) => {
    if (value.includes(source)) {
      onChange(value.filter((s) => s !== source));
    } else {
      onChange([...value, source]);
    }
  };

  const handleNext = () => {
    if (isValid) {
      onNext(0);
    }
  };

  return (
    <StepContainer questionNumber="第 7 步">
      <h1 className="text-foreground text-[2.1rem] md:text-[2.1rem] leading-[1.3] font-extrabold mb-[18px]">
        很高興您找到了我們!您是從哪裡得知此計畫?
      </h1>
      
      <div className="grid gap-3" role="group" aria-label="資訊來源">
        {sources.map((source) => {
          const isSelected = value.includes(source);
          return (
            <label
              key={source}
              className={`bg-background border-2 ${
                isSelected ? "border-primary bg-primary/10 dark:bg-primary/15" : "border-border"
              } px-[18px] py-3.5 rounded-xl flex items-center gap-3 font-semibold cursor-pointer transition-all duration-[180ms] shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-border/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20`}
              data-testid={`checkbox-${source}`}
            >
              <input
                type="checkbox"
                name="infoSource"
                value={source}
                className="sr-only"
                checked={isSelected}
                onChange={() => handleToggle(source)}
              />
              <div className={`w-6 h-6 border-2 ${
                isSelected ? "bg-primary border-primary" : "border-muted-foreground bg-background"
              } rounded-md flex items-center justify-center transition-all duration-[180ms]`}>
                {isSelected && (
                  <span className="text-white font-extrabold text-[0.95rem] animate-in zoom-in duration-300">
                    ✓
                  </span>
                )}
              </div>
              <span>{source}</span>
            </label>
          );
        })}
      </div>
      
      <p className="text-muted-foreground text-[0.92rem] mt-2.5 font-medium">
        可複選,幫助我們了解最有效的推廣管道。
      </p>
      
      <NavigationButtons
        onPrev={onPrev}
        onNext={handleNext}
        nextDisabled={!isValid}
      />
    </StepContainer>
  );
}
