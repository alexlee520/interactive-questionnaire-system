import { useState, useEffect } from "react";
import { StepContainer } from "./StepContainer";
import { NavigationButtons } from "./NavigationButtons";

interface TaxIdStepProps {
  value: string;
  onNext: () => void;
  onPrev: () => void;
  onChange: (value: string) => void;
}

export function TaxIdStep({ value, onNext, onPrev, onChange }: TaxIdStepProps) {
  const [error, setError] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // 台灣統一編號：8位數字
    const taxIdRegex = /^\d{8}$/;
    const valid = taxIdRegex.test(value);
    setIsValid(valid);
    if (value && !valid) {
      setError(true);
    } else {
      setError(false);
    }
  }, [value]);

  const handleNext = () => {
    if (isValid) {
      onNext();
    }
  };

  return (
    <StepContainer questionNumber="第 7 步">
      <h1 className="text-foreground text-[2.1rem] md:text-[2.1rem] leading-[1.3] font-extrabold mb-[18px]">
        您的店家統編是多少？
      </h1>
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="8位數字"
        inputMode="numeric"
        maxLength={8}
        className={`w-full bg-background border-2 ${
          error ? "border-destructive" : "border-border"
        } text-foreground text-[1.05rem] px-[18px] py-4 rounded-[10px] outline-none transition-all duration-200 shadow-sm placeholder:text-muted-foreground placeholder:opacity-60 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
          error ? "focus:ring-destructive/20" : ""
        }`}
        aria-describedby="taxid-hint taxid-error"
        data-testid="input-tax-id"
      />
      
      <p className="text-muted-foreground text-[0.92rem] mt-2.5 font-medium" id="taxid-hint">
        8位數字就可以囉～
      </p>
      
      {error && (
        <p className="text-destructive text-[0.9rem] mt-2 font-medium animate-in fade-in duration-300" id="taxid-error" data-testid="error-tax-id">
          請輸入有效的8位數統一編號
        </p>
      )}
      
      <NavigationButtons
        onPrev={onPrev}
        onNext={handleNext}
        nextDisabled={!isValid}
      />
    </StepContainer>
  );
}
