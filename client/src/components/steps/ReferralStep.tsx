import { StepContainer } from "./StepContainer";
import { NavigationButtons } from "./NavigationButtons";

interface ReferralStepProps {
  value: string;
  onNext: () => void;
  onPrev: () => void;
  onChange: (value: string) => void;
}

const options = [
  { value: "非常願意", letter: "A", label: "超願意！會主動推薦" },
  { value: "願意", letter: "B", label: "願意，有機會就推" },
  { value: "中立", letter: "C", label: "看情況再說" },
  { value: "不太願意", letter: "D", label: "可能不太會推" },
];

export function ReferralStep({ value, onNext, onPrev, onChange }: ReferralStepProps) {
  const handleSelect = (selected: string) => {
    onChange(selected);
    setTimeout(onNext, 300);
  };

  return (
    <StepContainer questionNumber="第 9 步">
      <h1 className="text-foreground text-[2.1rem] md:text-[2.1rem] leading-[1.3] font-extrabold mb-[18px]">
        最後！會想推薦給朋友嗎？
      </h1>
      
      <p className="text-muted-foreground text-[1.075rem] leading-[1.7] mb-7">
        如果有其他店家朋友，您會推薦這個專案嗎？
      </p>
      
      <div className="grid gap-3.5" role="radiogroup" aria-label="推薦意願">
        {options.map((option) => (
          <label
            key={option.value}
            className={`bg-background border-2 ${
              value === option.value ? "border-primary bg-primary/10 dark:bg-primary/15 shadow-md" : "border-border"
            } text-foreground px-[22px] py-[18px] rounded-xl cursor-pointer flex items-center gap-3.5 font-semibold transition-all duration-[180ms] shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-border/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20`}
            data-testid={`option-referral-${option.value}`}
          >
            <input
              type="radio"
              name="referral"
              value={option.value}
              className="sr-only"
              checked={value === option.value}
              onChange={(e) => handleSelect(e.target.value)}
            />
            <span className="w-[34px] h-[34px] rounded-lg bg-card text-foreground flex items-center justify-center font-extrabold text-[0.9rem] flex-shrink-0">
              {option.letter}
            </span>
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      
      <NavigationButtons onPrev={onPrev} showNext={false} />
    </StepContainer>
  );
}
