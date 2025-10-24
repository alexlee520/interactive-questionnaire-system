import { StepProps } from "./StepContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { NavigationButtons } from "./NavigationButtons";

interface IdentityStepProps extends StepProps {
  value: "potential" | "existing";
  onChange: (value: "potential" | "existing") => void;
}

export function IdentityStep({ value, onChange, onNext }: IdentityStepProps) {
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">身份確認</CardTitle>
        <CardDescription>
          請選擇您的商家目前與本公司的合作關係，我們將據此為您提供最相關的問卷內容。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={value}
          onValueChange={(v) => onChange(v as "potential" | "existing")}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
            <RadioGroupItem value="potential" id="potential" />
            <Label htmlFor="potential" className="text-base font-medium">
              尚未與本公司合作 (潛在合作夥伴)
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors">
            <RadioGroupItem value="existing" id="existing" />
            <Label htmlFor="existing" className="text-base font-medium">
              已與本公司合作 (現有合作夥伴)
            </Label>
          </div>
        </RadioGroup>
        <NavigationButtons
          onNext={onNext}
          onPrev={onPrev}
          showPrev={false}
          nextText="下一步"
        />
      </CardContent>
    </Card>
  );
}

