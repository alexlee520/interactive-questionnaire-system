import { useState, useEffect } from "react";
import { StepContainer } from "./StepContainer";
import { NavigationButtons } from "./NavigationButtons";

interface ContactNameStepProps {
  value: string;
  onNext: () => void;
  onPrev: () => void;
  onChange: (value: string) => void;
}

export function ContactNameStep({ value, onNext, onPrev, onChange }: ContactNameStepProps) {
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
    <StepContainer questionNumber="第 5 步">
      <h1 className="text-foreground text-[2.1rem] md:text-[2.1rem] leading-[1.3] font-extrabold mb-[18px]">
        我們該如何稱呼您?
      </h1>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="請輸入您的姓名"
        autoComplete="name"
        className="w-full bg-background border-2 border-border text-foreground text-[1.05rem] px-[18px] py-4 rounded-[10px] outline-none transition-all duration-200 shadow-sm placeholder:text-muted-foreground placeholder:opacity-60 focus:border-primary focus:ring-2 focus:ring-primary/20"
        aria-describedby="name-hint"
        data-testid="input-contact-name"
      />
      
      <p className="text-muted-foreground text-[0.92rem] mt-2.5 font-medium" id="name-hint">
        請提供您的真實姓名,以便我們更好地為您服務。
      </p>
      
      <NavigationButtons
        onPrev={onPrev}
        onNext={handleNext}
        nextDisabled={!isValid}
      />
    </StepContainer>
  );
}
