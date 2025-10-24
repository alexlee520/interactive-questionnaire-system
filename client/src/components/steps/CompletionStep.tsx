import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Heart } from "lucide-react";

interface CompletionStepProps {
  title: string;
  message: string;
}

export function CompletionStep({ title, message }: CompletionStepProps) {
  let Icon = Heart;
  let iconColor = "text-primary";

  if (title.includes("感謝")) {
    Icon = Heart;
    iconColor = "text-primary";
  } else if (message.includes("盡快與您聯繫")) {
    Icon = CheckCircle;
    iconColor = "text-green-500";
  } else if (message.includes("保留態度")) {
    Icon = XCircle;
    iconColor = "text-red-500";
  }

  return (
    <Card className="w-full max-w-lg mx-auto text-center">
      <CardHeader className="flex flex-col items-center">
        <Icon className={`w-16 h-16 mb-4 ${iconColor}`} />
        <CardTitle className="text-3xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

