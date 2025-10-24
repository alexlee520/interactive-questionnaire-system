import { StepProps } from "./StepContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { NavigationButtons } from "./NavigationButtons";
import { Loader2 } from "lucide-react";

interface RatingStepProps extends StepProps {
  question: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  isSubmitting?: boolean;
}

const ratings = [
  { value: 1, label: "1 分" },
  { value: 2, label: "2 分" },
  { value: 3, label: "3 分" },
  { value: 4, label: "4 分" },
  { value: 5, label: "5 分" },
];

export function RatingStep({ question, description, value, onChange, onNext, onPrev, isSubmitting = false }: RatingStepProps) {
  const isLastQuestion = isSubmitting !== undefined; // 判斷是否為最後一題

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{question}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={value.toString()}
          onValueChange={(v) => onChange(parseInt(v, 10))}
          className="flex justify-between space-x-2 py-4"
        >
          {ratings.map((rating) => (
            <div key={rating.value} className="flex flex-col items-center space-y-1">
              <RadioGroupItem value={rating.value.toString()} id={`rating-${rating.value}`} className="w-6 h-6" />
              <Label htmlFor={`rating-${rating.value}`} className="text-sm">
                {rating.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <NavigationButtons
          onNext={onNext}
          onPrev={onPrev}
          nextText={isLastQuestion ? (isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "完成並送出") : "下一步"}
          nextDisabled={isSubmitting}
        />
      </CardContent>
    </Card>
  );
}

