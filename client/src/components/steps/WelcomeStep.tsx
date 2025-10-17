import { StepContainer } from "./StepContainer";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <StepContainer>
      <div className="flex flex-col items-center text-center">
        <div className="mb-5">
          <div className="text-[4rem] font-black text-foreground">
            Uber
          </div>
        </div>
        
        <h1 className="text-[2.8rem] md:text-[3.2rem] leading-[1.2] font-extrabold mb-[18px] text-foreground">
          店家新用戶獎勵專案
        </h1>
        
        <p className="text-muted-foreground text-[1.075rem] leading-[1.7] mb-7">
          <strong className="text-foreground">為顧客創造更流暢的體驗,同時賺取高額回饋。</strong>
          <br />
          這不僅是一份問卷,更是發掘無限商機的起點。
          <br /><br />
          <strong className="text-foreground">預計填寫時間:僅需 1 分鐘</strong>
        </p>
        
        <div className="w-full flex gap-3 flex-wrap mt-[26px]">
          <button
            type="button"
            onClick={onNext}
            className="flex-1 bg-primary text-primary-foreground px-[22px] py-[14px] rounded-[10px] text-base font-extrabold cursor-pointer flex items-center justify-center gap-2.5 transition-all duration-150 shadow-sm hover:bg-primary/90 hover:-translate-y-px hover:shadow-md active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            data-testid="button-start"
          >
            <span>立即探索合作機會</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </StepContainer>
  );
}
