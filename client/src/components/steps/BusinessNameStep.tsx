import { useState, useEffect } from "react";
import { StepContainer } from "./StepContainer";
import { NavigationButtons } from "./NavigationButtons";

interface BusinessNameStepProps {
  value: string;
  onNext: () => void;
  onPrev: () => void;
  onChange: (value: string) => void;
}

export function BusinessNameStep({ value, onNext, onPrev, onChange }: BusinessNameStepProps) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    setIsValid(value.trim().length > 0);
  }, [value]);

  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  return (
    <StepContainer questionNumber="第 2 步">
      <h1 className="text-foreground text-[2.1rem] md:text-[2.1rem] leading-[1.3] font-extrabold mb-[18px]">
        貴公司的寶號是?
      </h1>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="請輸入完整商家名稱"
        autoComplete="organization"
        className="w-full bg-background border-2 border-border text-foreground text-[1.05rem] px-[18px] py-4 rounded-[10px] outline-none transition-all duration-200 shadow-sm placeholder:text-muted-foreground placeholder:opacity-60 focus:border-primary focus:ring-2 focus:ring-primary/20"
        aria-describedby="business-hint"
        data-testid="input-business-name"
      />
      
      <p className="text-muted-foreground text-[0.92rem] mt-2.5 font-medium" id="business-hint">
        讓我們知道該如何稱呼您。
      </p>
      
      <NavigationButtons
        onPrev={onPrev}
        onNext={handleNext}
        nextDisabled={!isValid}
      />
    </StepContainer>
  );
}
