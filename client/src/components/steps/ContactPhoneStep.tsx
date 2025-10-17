import { useState, useEffect } from "react";
import { StepContainer } from "./StepContainer";
import { NavigationButtons } from "./NavigationButtons";

interface ContactPhoneStepProps {
  value: string;
  onNext: () => void;
  onPrev: () => void;
  onChange: (value: string) => void;
}

export function ContactPhoneStep({ value, onNext, onPrev, onChange }: ContactPhoneStepProps) {
  const [error, setError] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const phoneRegex = /^09\d{8}$/;
    const cleanPhone = value.replace(/[-\s]/g, "");
    const valid = phoneRegex.test(cleanPhone);
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
    <StepContainer questionNumber="第 6 步">
      <h1 className="text-foreground text-[2.1rem] md:text-[2.1rem] leading-[1.3] font-extrabold mb-[18px]">
        請留下您的聯絡電話
      </h1>
      
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="09XX-XXX-XXX"
        autoComplete="tel"
        inputMode="tel"
        className={`w-full bg-background border-2 ${
          error ? "border-destructive" : "border-border"
        } text-foreground text-[1.05rem] px-[18px] py-4 rounded-[10px] outline-none transition-all duration-200 shadow-sm placeholder:text-muted-foreground placeholder:opacity-60 focus:border-primary focus:ring-2 focus:ring-primary/20 ${
          error ? "focus:ring-destructive/20" : ""
        }`}
        aria-describedby="phone-hint phone-error"
        data-testid="input-contact-phone"
      />
      
      <p className="text-muted-foreground text-[0.92rem] mt-2.5 font-medium" id="phone-hint">
        合作顧問將盡速與您聯繫,開啟雙贏契機。
      </p>
      
      {error && (
        <p className="text-destructive text-[0.9rem] mt-2 font-medium animate-in fade-in duration-300" id="phone-error" data-testid="error-phone">
          請輸入有效的台灣手機號碼(09開頭,10碼)
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
