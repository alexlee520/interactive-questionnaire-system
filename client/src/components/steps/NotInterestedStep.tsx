import { StepContainer } from "./StepContainer";
import { NavigationButtons } from "./NavigationButtons";

interface NotInterestedStepProps {
  value: string;
  onNext: () => void;
  onPrev: () => void;
  onChange: (value: string) => void;
}

const options = [
  { value: "已有合作對象", letter: "A", label: "已有合作對象" },
  { value: "不符合營業需求", letter: "B", label: "不符合營業需求" },
  { value: "費用考量", letter: "C", label: "費用考量" },
  { value: "目前時間不合適", letter: "D", label: "目前時間不合適" },
  { value: "不了解服務內容", letter: "E", label: "不了解服務內容" },
  { value: "其他原因", letter: "F", label: "其他原因" },
];

export function NotInterestedStep({ value, onNext, onPrev, onChange }: NotInterestedStepProps) {
  const handleSelect = (selected: string) => {
    onChange(selected);
    setTimeout(onNext, 300);
  };

  return (
    <StepContainer questionNumber="最後一步">
      <h1 className="text-foreground text-[2.1rem] md:text-[2.1rem] leading-[1.3] font-extrabold mb-[18px]">
        您的寶貴意見,是我們進步的動力。
      </h1>
      
      <p className="text-muted-foreground text-[1.075rem] leading-[1.7] mb-7">
        請問您暫不考慮的主要原因是?
      </p>
      
      <div className="grid gap-3.5" role="radiogroup" aria-label="不考慮原因">
        {options.map((option) => (
          <label
            key={option.value}
            className={`bg-background border-2 ${
              value === option.value ? "border-primary bg-primary/10 dark:bg-primary/15 shadow-md" : "border-border"
            } text-foreground px-[22px] py-[18px] rounded-xl cursor-pointer flex items-center gap-3.5 font-semibold transition-all duration-[180ms] shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-border/80 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20`}
            data-testid={`option-reason-${option.value}`}
          >
            <input
              type="radio"
              name="notInterestedReason"
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
