import { useState, useMemo } from "react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProgressBar } from "@/components/ProgressBar";
import { StepContainer } from "@/components/steps/StepContainer";
import { NavigationButtons } from "@/components/steps/NavigationButtons";
import { useMutation } from "@tanstack/react-query";
import { QuestionnaireData } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// --- 步驟組件 ---
import { IdentityStep } from "@/components/steps/IdentityStep";
import { IntentionStep } from "@/components/steps/IntentionStep";
import { CompanyNameStep } from "@/components/steps/CompanyNameStep";
import { ContactNameStep } from "@/components/steps/ContactNameStep";
import { TitleStep } from "@/components/steps/TitleStep";
import { ContactInfoStep } from "@/components/steps/ContactInfoStep";
import { NotInterestedReasonStep } from "@/components/steps/NotInterestedReasonStep";
import { DurationStep } from "@/components/steps/DurationStep";
import { NewCustomerCountStep } from "@/components/steps/NewCustomerCountStep";
import { RatingStep } from "@/components/steps/RatingStep";
import { CompletionStep } from "@/components/steps/CompletionStep";

// 步驟 ID 定義
const STEPS = {
  IDENTITY: 0,
  A1_INTENTION: 1,
  A2_COMPANY: 2,
  A3_NAME: 3,
  A4_TITLE: 4,
  A5_CONTACT: 5,
  A6_REASON: 6,
  B1_DURATION: 7,
  B2_CUSTOMERS: 8,
  B3_OVERALL: 9,
  B4_SATISFACTION: 10,
  B5_ORDER_GROWTH: 11,
  B6_QUALITY: 12,
  END_A: 100,
  END_B: 101,
  END_C: 102,
};

const initialData: QuestionnaireData = {
  identity: "potential",
};

export default function Questionnaire() {
  const [currentStep, setCurrentStep] = useState(STEPS.IDENTITY);
  const [data, setData] = useState<QuestionnaireData>(initialData);
  const { toast } = useToast();

  const updateData = (field: keyof QuestionnaireData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const submitMutation = useMutation({
    mutationFn: (formData: QuestionnaireData) =>
      fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).then((res) => {
        if (!res.ok) {
          throw new Error("提交問卷失敗");
        }
        return res.json();
      }),
    onSuccess: (response) => {
      console.log("問卷提交成功:", response);
    },
    onError: (error) => {
      console.error("問卷提交錯誤:", error);
      toast({
        title: "提交失敗",
        description: "問卷提交失敗，請稍後再試。",
        variant: "destructive",
      });
    },
  });

  const isSubmitting = submitMutation.isPending;

  const handleSubmit = (endStep: number) => {
    submitMutation.mutate(data, {
      onSuccess: () => {
        goToStep(endStep);
      },
    });
  };

  const calculateNextStep = () => {
    switch (currentStep) {
      case STEPS.IDENTITY:
        return data.identity === "potential" ? STEPS.A1_INTENTION : STEPS.B1_DURATION;

      case STEPS.A1_INTENTION:
        return data.cooperationIntention === "yes" ? STEPS.A2_COMPANY : STEPS.A6_REASON;

      case STEPS.A2_COMPANY:
        return STEPS.A3_NAME;
      case STEPS.A3_NAME:
        return STEPS.A4_TITLE;
      case STEPS.A4_TITLE:
        return STEPS.A5_CONTACT;
      case STEPS.A5_CONTACT:
        handleSubmit(STEPS.END_A);
        return currentStep;

      case STEPS.A6_REASON:
        handleSubmit(STEPS.END_B);
        return currentStep;

      case STEPS.B1_DURATION:
        return STEPS.B2_CUSTOMERS;
      case STEPS.B2_CUSTOMERS:
        return STEPS.B3_OVERALL;
      case STEPS.B3_OVERALL:
        return STEPS.B4_SATISFACTION;
      case STEPS.B4_SATISFACTION:
        return STEPS.B5_ORDER_GROWTH;
      case STEPS.B5_ORDER_GROWTH:
        return STEPS.B6_QUALITY;
      case STEPS.B6_QUALITY:
        handleSubmit(STEPS.END_C);
        return currentStep;

      default:
        return currentStep + 1;
    }
  };

  const nextStep = () => {
    const next = calculateNextStep();
    if (next !== currentStep) {
      goToStep(next);
    }
  };

  const prevStep = () => {
    if (currentStep === STEPS.A6_REASON) {
      goToStep(STEPS.A1_INTENTION);
    } else if (currentStep >= STEPS.A2_COMPANY && currentStep <= STEPS.A5_CONTACT) {
      goToStep(currentStep - 1);
    } else if (currentStep === STEPS.B1_DURATION) {
      goToStep(STEPS.IDENTITY);
    } else if (currentStep > STEPS.B1_DURATION && currentStep <= STEPS.B6_QUALITY) {
      goToStep(currentStep - 1);
    } else {
      goToStep(currentStep - 1);
    }
  };

  const totalQuestions = 1 + (data.identity === "potential" ? 5 : 6);
  const currentQuestionIndex = useMemo(() => {
    if (currentStep >= STEPS.END_A) return totalQuestions;
    if (currentStep === STEPS.IDENTITY) return 0;
    
    let index = 1;
    if (data.identity === "potential") {
      if (currentStep === STEPS.A1_INTENTION) return index;
      index++;
      if (data.cooperationIntention === "yes") {
        if (currentStep === STEPS.A2_COMPANY) return index;
        index++;
        if (currentStep === STEPS.A3_NAME) return index;
        index++;
        if (currentStep === STEPS.A4_TITLE) return index;
        index++;
        if (currentStep === STEPS.A5_CONTACT) return index;
      } else if (data.cooperationIntention === "no") {
        if (currentStep === STEPS.A6_REASON) return index;
      }
    } else if (data.identity === "existing") {
      if (currentStep === STEPS.B1_DURATION) return index;
      index++;
      if (currentStep === STEPS.B2_CUSTOMERS) return index;
      index++;
      if (currentStep === STEPS.B3_OVERALL) return index;
      index++;
      if (currentStep === STEPS.B4_SATISFACTION) return index;
      index++;
      if (currentStep === STEPS.B5_ORDER_GROWTH) return index;
      index++;
      if (currentStep === STEPS.B6_QUALITY) return index;
    }

    return index;
  }, [currentStep, data.identity, data.cooperationIntention]);

  const progress = (currentQuestionIndex / totalQuestions) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.IDENTITY:
        return (
          <IdentityStep
            value={data.identity}
            onChange={(value) => updateData("identity", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );

      case STEPS.A1_INTENTION:
        return (
          <IntentionStep
            value={data.cooperationIntention || "yes"}
            onChange={(value) => updateData("cooperationIntention", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case STEPS.A2_COMPANY:
        return (
          <CompanyNameStep
            value={data.companyName || ""}
            onChange={(value) => updateData("companyName", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case STEPS.A3_NAME:
        return (
          <ContactNameStep
            value={data.contactName || ""}
            onChange={(value) => updateData("contactName", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case STEPS.A4_TITLE:
        return (
          <TitleStep
            value={data.title || "商家老闆"}
            onChange={(value) => updateData("title", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case STEPS.A5_CONTACT:
        return (
          <ContactInfoStep
            value={data.contactInfo || ""}
            onChange={(value) => updateData("contactInfo", value)}
            onNext={nextStep}
            onPrev={prevStep}
            isSubmitting={isSubmitting}
          />
        );
      case STEPS.A6_REASON:
        return (
          <NotInterestedReasonStep
            value={data.notInterestedReasons || []}
            otherValue={data.notInterestedReasonOther || ""}
            onChange={(value) => updateData("notInterestedReasons", value)}
            onOtherChange={(value) => updateData("notInterestedReasonOther", value)}
            onNext={nextStep}
            onPrev={prevStep}
            isSubmitting={isSubmitting}
          />
        );

      case STEPS.B1_DURATION:
        return (
          <DurationStep
            value={data.cooperationDuration || "<3m"}
            onChange={(value) => updateData("cooperationDuration", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case STEPS.B2_CUSTOMERS:
        return (
          <NewCustomerCountStep
            value={data.newCustomerCount || 0}
            onChange={(value) => updateData("newCustomerCount", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case STEPS.B3_OVERALL:
        return (
          <RatingStep
            question="請您對合作的整體成效進行評分（1–5分）。"
            description="（1分代表遠低於預期，5分代表遠超出預期的表現）"
            value={data.overallEffectiveness || 3}
            onChange={(value) => updateData("overallEffectiveness", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case STEPS.B4_SATISFACTION:
        return (
          <RatingStep
            question="請評估合作在提升客戶滿意度方面的效果（1–5分）。"
            description="（1分表示表現不理想或無明顯改善，5分表示表現優異、提升顯著）"
            value={data.customerSatisfactionEffect || 3}
            onChange={(value) => updateData("customerSatisfactionEffect", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case STEPS.B5_ORDER_GROWTH:
        return (
          <RatingStep
            question="請評估合作在帶動訂單增長方面的效果（1–5分）。"
            description="（1分表示表現不理想或無明顯改善，5分表示表現優異、提升顯著）"
            value={data.orderGrowthEffect || 3}
            onChange={(value) => updateData("orderGrowthEffect", value)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case STEPS.B6_QUALITY:
        return (
          <RatingStep
            question="請評估合作在品質維持方面的表現（1–5分）。"
            description="（1分表示表現不理想或無明顯改善，5分表示表現優異、提升顯著）"
            value={data.qualityMaintenancePerformance || 3}
            onChange={(value) => updateData("qualityMaintenancePerformance", value)}
            onNext={nextStep}
            onPrev={prevStep}
            isSubmitting={isSubmitting}
          />
        );

      case STEPS.END_A:
        return (
          <CompletionStep
            title="感謝您的填答！"
            message="我們將盡快與您聯繫，提供進一步合作資訊，期待與您展開合作。"
          />
        );
      case STEPS.END_B:
        return (
          <CompletionStep
            title="感謝您的填答！"
            message="了解您目前對合作持保留態度。您的意見我們謹記在心，未來若有合作機會，歡迎隨時與我們聯繫。"
          />
        );
      case STEPS.END_C:
        return (
          <CompletionStep
            title="感謝您的填答！"
            message="您的回饋對我們非常重要。我們將持續優化合作方式，期待與您繼續攜手創造更佳成果。"
          />
        );

      default:
        return <div>錯誤：未知的步驟 {currentStep}</div>;
    }
  };

  const isCompletionStep = currentStep >= STEPS.END_A;
  const isFirstStep = currentStep === STEPS.IDENTITY;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <ParticleBackground />
      <ThemeToggle />
      {!isCompletionStep && <ProgressBar progress={progress} />}

      <div className="relative z-[1] min-h-screen flex items-center justify-center px-5 py-16">
        <StepContainer>
          {renderStep()}
          {!isCompletionStep && (
            <NavigationButtons
              onNext={nextStep}
              onPrev={prevStep}
              showPrev={!isFirstStep}
            />
          )}
        </StepContainer>
      </div>
    </div>
  );
}

