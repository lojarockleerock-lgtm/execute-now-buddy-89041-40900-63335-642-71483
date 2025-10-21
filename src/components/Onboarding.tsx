import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Lightbulb, ArrowRight } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

const onboardingSteps = [
  {
    title: "Bem-vindo à Petição Trabalhista Digital! 👋",
    description: "Este assistente vai guiá-lo passo a passo para criar sua petição inicial trabalhista de forma completa e profissional.",
    tips: [
      "Você pode salvar seu progresso a qualquer momento",
      "Seus dados são salvos automaticamente a cada alteração",
      "Você pode voltar e editar qualquer etapa quando quiser"
    ]
  },
  {
    title: "Como funciona? 📝",
    description: "O processo é dividido em 6 etapas simples:",
    tips: [
      "1. Qualificação - Seus dados e do empregador",
      "2. Fatos - Linha do tempo dos eventos",
      "3. Pedidos - O que você deseja reivindicar",
      "4. Provas - Documentos e evidências",
      "5. Cálculos - Valores das verbas",
      "6. Revisão - Gerar a petição final"
    ]
  },
  {
    title: "Dicas importantes 💡",
    description: "Para uma petição completa e bem fundamentada:",
    tips: [
      "Preencha todos os campos obrigatórios marcados com *",
      "A formatação de CPF, CNPJ, CEP e telefone é automática",
      "Tenha em mãos seus documentos e contratos",
      "Descreva os fatos com o máximo de detalhes possível",
      "Guarde todos os documentos e comprovantes que possuir"
    ]
  }
];

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("trt_onboarding_completed");
    if (!hasSeenOnboarding) {
      setShow(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem("trt_onboarding_completed", "true");
    setShow(false);
    onComplete();
  };

  if (!show) return null;

  const step = onboardingSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{step.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Passo {currentStep + 1} de {onboardingSteps.length}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-muted-foreground mb-6">{step.description}</p>

          <div className="space-y-3 mb-8">
            {step.tips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">
                    {currentStep === 1 ? "" : "✓"}
                  </span>
                </div>
                <p className="text-sm">{tip}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentStep
                      ? "bg-primary w-8"
                      : index < currentStep
                      ? "bg-primary/50"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSkip}>
                Pular
              </Button>
              <Button onClick={handleNext} className="gradient-primary">
                {currentStep < onboardingSteps.length - 1 ? (
                  <>
                    Próximo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  "Começar"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
