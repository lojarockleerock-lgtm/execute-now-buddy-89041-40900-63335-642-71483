import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Scale, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QualificationStep } from "@/components/case/QualificationStep";
import { FactsStep } from "@/components/case/FactsStep";
import { ClaimsStep } from "@/components/case/ClaimsStep";
import { EvidenceStep } from "@/components/case/EvidenceStep";
import { CalculationsStep } from "@/components/case/CalculationsStep";
import { ReviewStep } from "@/components/case/ReviewStep";
import { getCaseById, updateCase, formatCurrency } from "@/lib/caseStorage";

const steps = [
  { id: 1, name: "Qualificação", description: "Dados pessoais e do empregador" },
  { id: 2, name: "Fatos", description: "Linha do tempo e eventos" },
  { id: 3, name: "Pedidos", description: "Direitos a reclamar" },
  { id: 4, name: "Provas", description: "Documentos e evidências" },
  { id: 5, name: "Cálculos", description: "Valores e verbas" },
  { id: 6, name: "Revisão", description: "Gerar petição" },
];

const CaseEdit = () => {
  const { id } = useParams<{ id: string }>();
  const [currentStep, setCurrentStep] = useState(1);
  const [caseData, setCaseData] = useState({
    qualification: {},
    facts: [],
    dismissalType: "",
    claims: [],
    evidence: [],
    calculations: {},
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const progress = (currentStep / steps.length) * 100;

  // Carregar caso existente
  useEffect(() => {
    if (id) {
      const existingCase = getCaseById(id);
      if (existingCase) {
        setCaseData({
          qualification: existingCase.data.qualification || {},
          facts: existingCase.data.facts || [],
          dismissalType: (existingCase.data as any).dismissalType || "",
          claims: existingCase.data.claims || [],
          evidence: existingCase.data.evidence || [],
          calculations: existingCase.data.calculations || {},
        });
        toast({
          title: "Caso carregado",
          description: "Você pode editar e salvar as alterações.",
        });
      } else {
        toast({
          title: "Caso não encontrado",
          description: "Redirecionando para o dashboard...",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    }
  }, [id, navigate]);

  // Auto-save no localStorage a cada mudança
  useEffect(() => {
    if (id) {
      const autoSaveTimer = setTimeout(() => {
        const totalValue = calculateTotalValue();
        const claimantName = (caseData.qualification as any)?.nome || "Reclamante";
        const defendantName = (caseData.qualification as any)?.empresa_nome || "Empresa";
        
        updateCase(id, {
          title: `${claimantName} vs ${defendantName}`,
          value: totalValue,
          data: caseData,
        });
      }, 1000);

      return () => clearTimeout(autoSaveTimer);
    }
  }, [caseData, id]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const calculateTotalValue = (): number => {
    const calculations = caseData.calculations as any;
    if (!calculations || !calculations.totalGeral) return 0;
    return calculations.totalGeral;
  };

  const handleSaveCase = () => {
    if (!id) return;

    const totalValue = calculateTotalValue();
    const claimantName = (caseData.qualification as any)?.nome || "Reclamante";
    const defendantName = (caseData.qualification as any)?.empresa_nome || "Empresa";

    updateCase(id, {
      title: `${claimantName} vs ${defendantName}`,
      status: "generated",
      value: totalValue,
      data: caseData,
    });

    toast({
      title: "Caso atualizado com sucesso!",
      description: `Valor total: ${formatCurrency(totalValue)}`,
    });

    navigate("/dashboard");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <QualificationStep data={caseData.qualification} onChange={(data) => setCaseData({ ...caseData, qualification: data })} />;
      case 2:
        return (
          <FactsStep 
            data={{ facts: caseData.facts, dismissalType: caseData.dismissalType }} 
            onChange={(data) => setCaseData({ 
              ...caseData, 
              facts: data.facts || data,
              dismissalType: data.dismissalType || caseData.dismissalType
            })} 
          />
        );
      case 3:
        return (
          <ClaimsStep 
            data={caseData.claims} 
            onChange={(data) => setCaseData({ ...caseData, claims: data })}
            factsData={{ facts: caseData.facts }}
          />
        );
      case 4:
        return (
          <EvidenceStep 
            data={caseData.evidence} 
            onChange={(data) => setCaseData({ ...caseData, evidence: data })} 
            claimsData={caseData.claims}
          />
        );
      case 5:
        return (
          <CalculationsStep 
            data={{ 
              claims: caseData.claims,
              salarioBruto: (caseData.qualification as any)?.salarioBruto,
              dataAdmissao: (caseData.qualification as any)?.dataAdmissao,
              dataDemissao: (caseData.qualification as any)?.dataDemissao
            }} 
            onChange={(data) => setCaseData({ ...caseData, calculations: data })} 
          />
        );
      case 6:
        return <ReviewStep caseData={caseData} />;
      default:
        return <div className="text-center py-12">Etapa não encontrada</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Petição Trabalhista Digital</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Progress Header */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-2xl">Editar Petição Trabalhista</CardTitle>
                <CardDescription className="mt-2">
                  Passo {currentStep} de {steps.length}: {steps[currentStep - 1].name}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={handleSaveCase}>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
        </Card>

        {/* Steps Navigation */}
        <div className="grid grid-cols-6 gap-2 mb-8">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`p-3 rounded-lg text-center transition-all ${
                step.id === currentStep
                  ? "bg-primary text-primary-foreground"
                  : step.id < currentStep
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <div className="text-xs font-medium">{step.name}</div>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <Card className="card-elevated mb-8">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].name}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>{renderStep()}</CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex gap-2">
            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                className="gradient-primary"
              >
                Próximo
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSaveCase}
                className="bg-success hover:bg-success/90 text-success-foreground"
              >
                <Save className="h-4 w-4 mr-2" />
                Finalizar e Salvar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseEdit;
