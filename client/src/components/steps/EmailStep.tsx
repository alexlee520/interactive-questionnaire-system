import { useState, useEffect } from "react";
import { StepContainer } from "./StepContainer";
import { NavigationButtons } from "./NavigationButtons";

interface EmailStepProps {
  value: string;
  onNext: () => void;
  onPrev: () => void;
  onChange: (value: string) => void;
}

export function EmailStep({ value, onNext, onPrev, onChange }: EmailStepProps) {
  const [error, setError] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(value.trim());
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const normalized = e.target.value
      .replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
      .replace(/\u3000/g, " ")
      .trim();
    onChange(normalized);
  };

  return (
    <StepContainer questionNumber="第 1 步">
      <h1 className="text-foreground text-[2.1rem] md:text-[2.1rem] leading-[1.3] font-extrabold mb-[18px]">
        第一步,讓我們認識您。您的商務聯絡信箱是?
      </h1>
      
      <input
        type="email"
        value={value}
        onChange={handleChange}
        placeholder="example@email.com"
        autoComplete="email"
        inputMode="email"
        autoCapitalize="none"
        autoCorrect="off"
        className={`w-full bg-background border-2 ${
          error ? "border-destructive" : "border-border"
        } text-foreground text-[1.05rem] px-[18px] py-4 rounded-[10px] outline-none transition-all duration-200 shadow-sm placeholder:text-muted-foreground placeholder:opacity-60 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
          error ? "focus:ring-destructive/20" : ""
        }`}
        aria-describedby="email-hint email-error"
        data-testid="input-email"
      />
      
      <p className="text-muted-foreground text-[0.92rem] mt-2.5 font-medium" id="email-hint">
        輸入有效信箱後即可前往下一步(自動轉換全形字元與移除隱藏空白)。
      </p>
      
      {error && (
        <p className="text-destructive text-[0.9rem] mt-2 font-medium animate-in fade-in duration-300" id="email-error" data-testid="error-email">
          請輸入有效的電子郵件地址
        </p>
      )}
      
      <NavigationButtons
        onPrev={onPrev}
        onNext={handleNext}
        nextDisabled={!isValid}
        nextLabel="下一步"
        prevLabel="返回"
      />
    </StepContainer>
  );
}
