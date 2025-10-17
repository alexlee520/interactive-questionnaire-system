import { StepContainer } from "./StepContainer";
import { NavigationButtons } from "./NavigationButtons";

interface IntentionStepProps {
  value: string;
  onNext: () => void;
  onPrev: () => void;
  onChange: (value: string) => void;
}

const options = [
  { value: "interested", letter: "A", label: "很有興趣！想了解更多細節" },
  { value: "more-info", letter: "B", label: "想跟專人聊聊，看看適不適合" },
  { value: "not-interested", letter: "C", label: "暫時不考慮，但可以聊聊" },
];

export function IntentionStep({ value, onNext, onPrev, onChange }: IntentionStepProps) {
  const handleSelect = (selected: string) => {
    onChange(selected);
    setTimeout(onNext, 300);
  };

  return (
    <StepContainer questionNumber="第 4 步">
      <h1 className="text-foreground text-[2.1rem] md:text-[2.1rem] leading-[1.3] font-extrabold mb-[18px]">
        聽起來如何？有興趣嗎？
      </h1>
      
      <div className="grid gap-3.5" role="radiogroup" aria-label="合作意向">
        {options.map((option) => (
          <label
            key={option.value}
            className={`bg-background border-2 ${
              value === option.value ? "border-primary bg-primary/10 dark:bg-primary/15 shadow-md" : "border-border"
            } text-foreground px-[22px] py-[18px] rounded-xl cursor-pointer flex items-center gap-3.5 font-semibold transition-all duration-[180ms] shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-border/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20`}
            data-testid={`option-${option.value}`}
          >
            <input
              type="radio"
              name="intention"
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
