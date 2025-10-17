import { useState } from "react";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProgressBar } from "@/components/ProgressBar";
import { WelcomeStep } from "@/components/steps/WelcomeStep";
import { EmailStep } from "@/components/steps/EmailStep";
import { BusinessNameStep } from "@/components/steps/BusinessNameStep";
import { PrivacyConsentStep } from "@/components/steps/PrivacyConsentStep";
import { PrivacyRejectedStep } from "@/components/steps/PrivacyRejectedStep";
import { IntentionStep } from "@/components/steps/IntentionStep";
import { ContactNameStep } from "@/components/steps/ContactNameStep";
import { ContactPhoneStep } from "@/components/steps/ContactPhoneStep";
import { TaxIdStep } from "@/components/steps/TaxIdStep";
import { InfoSourceStep } from "@/components/steps/InfoSourceStep";
import { ReferralStep } from "@/components/steps/ReferralStep";
import { NotInterestedStep } from "@/components/steps/NotInterestedStep";
import { CompletionStep } from "@/components/steps/CompletionStep";

export interface QuestionnaireData {
  email: string;
  businessName: string;
  privacyConsent: string;
  intention: string;
  contactName: string;
  contactPhone: string;
  taxId: string;
  infoSource: string[];
  referral?: string;
  notInterestedReason?: string;
}

export default function Questionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<QuestionnaireData>({
    email: "",
    businessName: "",
    privacyConsent: "",
    intention: "",
    contactName: "",
    contactPhone: "",
    taxId: "",
    infoSource: [],
  });

  const totalSteps = 12;
  const calculateProgress = () => {
    if (currentStep >= 100) return 100;
    if (currentStep === 99) return (3 / totalSteps) * 100;
    return (currentStep / totalSteps) * 100;
  };
  const progress = calculateProgress();

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const updateData = (field: keyof QuestionnaireData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <ParticleBackground />
      <ThemeToggle />
      <ProgressBar progress={progress} />
      
      <div className="relative z-[1] min-h-screen flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-[760px] mx-auto">
          {currentStep === 0 && <WelcomeStep onNext={nextStep} />}
          {currentStep === 1 && (
            <EmailStep
              value={data.email}
              onNext={nextStep}
              onPrev={prevStep}
              onChange={(value) => updateData("email", value)}
            />
          )}
          {currentStep === 2 && (
            <BusinessNameStep
              value={data.businessName}
              onNext={nextStep}
              onPrev={prevStep}
              onChange={(value) => updateData("businessName", value)}
            />
          )}
          {currentStep === 3 && (
            <PrivacyConsentStep
              value={data.privacyConsent}
              onNext={nextStep}
              onPrev={prevStep}
              onReject={() => goToStep(99)}
              onChange={(value) => updateData("privacyConsent", value)}
            />
          )}
          {currentStep === 99 && (
            <PrivacyRejectedStep
              onReconsider={() => goToStep(3)}
              onHome={() => goToStep(0)}
            />
          )}
          {currentStep === 4 && (
            <IntentionStep
              value={data.intention}
              onNext={nextStep}
              onPrev={prevStep}
              onChange={(value) => updateData("intention", value)}
            />
          )}
          {currentStep === 5 && (
            <ContactNameStep
              value={data.contactName}
              onNext={nextStep}
              onPrev={prevStep}
              onChange={(value) => updateData("contactName", value)}
            />
          )}
          {currentStep === 6 && (
            <ContactPhoneStep
              value={data.contactPhone}
              onNext={nextStep}
              onPrev={prevStep}
              onChange={(value) => updateData("contactPhone", value)}
            />
          )}
          {currentStep === 7 && (
            <TaxIdStep
              value={data.taxId}
              onNext={nextStep}
              onPrev={prevStep}
              onChange={(value) => updateData("taxId", value)}
            />
          )}
          {currentStep === 8 && (
            <InfoSourceStep
              value={data.infoSource}
              onNext={(nextStepNum) => {
                if (data.intention === "interested") {
                  goToStep(9);
                } else if (data.intention === "more-info") {
                  goToStep(100);
                } else {
                  goToStep(10);
                }
              }}
              onPrev={prevStep}
              onChange={(value) => updateData("infoSource", value)}
            />
          )}
          {currentStep === 9 && (
            <ReferralStep
              value={data.referral || ""}
              onNext={() => goToStep(101)}
              onPrev={prevStep}
              onChange={(value) => updateData("referral", value)}
            />
          )}
          {currentStep === 10 && (
            <NotInterestedStep
              value={data.notInterestedReason || ""}
              onNext={() => goToStep(102)}
              onPrev={prevStep}
              onChange={(value) => updateData("notInterestedReason", value)}
            />
          )}
          {(currentStep === 100 || currentStep === 101 || currentStep === 102) && (
            <CompletionStep type={currentStep} data={data} />
          )}
        </div>
      </div>
    </div>
  );
}
