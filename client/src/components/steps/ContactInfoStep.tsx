import { StepProps } from "./StepContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavigationButtons } from "./NavigationButtons";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface ContactInfoStepProps extends StepProps {
  value: string;
  onChange: (value: string) => void;
  isSubmitting?: boolean;
}

export function ContactInfoStep({ value, onChange, onNext, onPrev, isSubmitting = false }: ContactInfoStepProps) {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!value.trim()) {
      setError("聯絡方式為必填項目。");
      return;
    }
    setError("");
    onNext();
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">問題 A5: 聯絡方式</CardTitle>
        <CardDescription>
          請提供您的聯絡方式（電話或 Email）。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="contactInfo">聯絡方式</Label>
          <Input
            id="contactInfo"
            type="text"
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              if (error && e.target.value.trim()) setError("");
            }}
            placeholder="例如：0912-345-678 或 example@company.com"
            required
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <NavigationButtons
          onNext={handleNext}
          onPrev={onPrev}
          nextText={isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "完成並送出"}
          nextDisabled={!value.trim() || isSubmitting}
        />
      </CardContent>
    </Card>
  );
}

