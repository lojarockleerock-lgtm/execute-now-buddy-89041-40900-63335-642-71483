import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Video } from "lucide-react";

interface ClaimsStepProps {
  data: any[];
  onChange: (data: any[]) => void;
  factsData?: any; // Dados dos eventos da aba Fatos
}

const availableClaims = [
  {
    id: "horasExtras",
    type: "horasExtras",
    title: "Horas Extras Não Pagas",
    label: "Horas Extras Não Pagas",
    description: "Quando você trabalhou além da jornada sem receber o adicional de 50%",
    article: "Art. 59 CLT",
    category: "Jornada",
  },
  {
    id: "adicionalNoturno",
    type: "adicionalNoturno",
    title: "Adicional Noturno",
    label: "Adicional Noturno",
    description: "Trabalho entre 22h e 5h sem o adicional de 20%",
    article: "Art. 73 CLT",
    category: "Jornada",
  },
  {
    id: "feriasNaoPagas",
    type: "feriasNaoPagas",
    title: "Férias Não Pagas",
    label: "Férias Não Pagas",
    description: "Férias vencidas ou proporcionais não quitadas",
    article: "Arts. 129-153 CLT",
    category: "Verbas",
  },
  {
    id: "decimoTerceiro",
    type: "decimoTerceiro",
    title: "13º Salário",
    label: "13º Salário",
    description: "13º salário não pago ou pago incorretamente",
    article: "Lei 4.090/62",
    category: "Verbas",
  },
  {
    id: "fgts",
    type: "fgts",
    title: "FGTS Não Depositado",
    label: "FGTS Não Depositado",
    description: "Empresa não depositou FGTS ou não pagou a multa de 40%",
    article: "Lei 8.036/90",
    category: "Verbas",
  },
  {
    id: "assedioMoral",
    type: "assedioMoral",
    title: "Assédio Moral",
    label: "Danos Morais por Assédio",
    description: "Humilhações, constrangimentos ou perseguições no trabalho",
    article: "CF/88 Art. 5º",
    category: "Danos",
  },
  {
    id: "faltaRegistroCTPS",
    type: "faltaRegistroCTPS",
    title: "Falta de Registro em CTPS",
    label: "Falta de Registro em CTPS",
    description: "Trabalhou sem registro na Carteira de Trabalho",
    article: "Art. 29 CLT",
    category: "Vínculo",
  },
  {
    id: "pejotizacao",
    type: "pejotizacao",
    title: "Pejotização",
    label: "Reconhecimento de Vínculo (Pejotização)",
    description: "Foi obrigado a abrir CNPJ para mascarar vínculo empregatício",
    article: "Art. 9º CLT",
    category: "Vínculo",
  },
  {
    id: "reconhecimentoVinculo",
    type: "reconhecimentoVinculo",
    title: "Reconhecimento de Vínculo Empregatício",
    label: "Reconhecimento de Vínculo Empregatício",
    description: "Contratado como autônomo mas na realidade havia vínculo de emprego",
    article: "Art. 3º CLT",
    category: "Vínculo",
  },
  {
    id: "rescisaoIndireta",
    type: "rescisaoIndireta",
    title: "Despedida Indireta",
    label: "Rescisão Indireta",
    description: "Empresa descumpriu obrigações tornando insustentável o contrato",
    article: "Art. 483 CLT",
    category: "Rescisão",
  },
  {
    id: "multa467",
    type: "multa467",
    title: "Multa Art. 467",
    label: "Multa Art. 467 CLT",
    description: "Verbas incontroversas não pagas na primeira audiência",
    article: "Art. 467 CLT",
    category: "Multas",
  },
  {
    id: "multa477",
    type: "multa477",
    title: "Multa Art. 477",
    label: "Multa Art. 477 CLT",
    description: "Verbas rescisórias não pagas no prazo de 10 dias",
    article: "Art. 477 CLT",
    category: "Multas",
  },
  {
    id: "insalubridade",
    type: "insalubridade",
    title: "Adicional de Insalubridade",
    label: "Adicional de Insalubridade",
    description: "Trabalhou em condições insalubres sem receber adicional",
    article: "Art. 189-192 CLT",
    category: "Adicionais",
  },
  {
    id: "periculosidade",
    type: "periculosidade",
    title: "Adicional de Periculosidade",
    label: "Adicional de Periculosidade",
    description: "Trabalhou em condições perigosas sem adicional de 30%",
    article: "Art. 193 CLT",
    category: "Adicionais",
  },
  {
    id: "estabilidadeAcidentaria",
    type: "estabilidadeAcidentaria",
    title: "Estabilidade Acidentária",
    label: "Indenização por Estabilidade Acidentária",
    description: "Demitido durante período de estabilidade após acidente de trabalho",
    article: "Art. 118 Lei 8.213/91",
    category: "Estabilidade",
  },
  {
    id: "desvioFuncao",
    type: "desvioFuncao",
    title: "Acúmulo ou Desvio de Função",
    label: "Diferenças Salariais por Desvio de Função",
    description: "Realizou funções diferentes da contratada sem receber diferença salarial",
    article: "Art. 456 CLT",
    category: "Verbas",
  },
];

export const ClaimsStep = ({ data, onChange, factsData }: ClaimsStepProps) => {
  const [selectedClaims, setSelectedClaims] = useState<string[]>(
    data.map((c: any) => c.id) || []
  );
  const [claimDetails, setClaimDetails] = useState<Record<string, any>>(
    data.reduce((acc, claim) => ({ ...acc, [claim.id]: claim.details || {} }), {})
  );
  const [showHelp, setShowHelp] = useState(true);

  // Extrair pedidos sugeridos dos eventos
  const suggestedClaimsFromEvents = factsData?.facts
    ? factsData.facts.reduce((acc: string[], fact: any) => {
        if (fact.suggestedClaims && fact.suggestedClaims.length > 0) {
          return [...acc, ...fact.suggestedClaims];
        }
        return acc;
      }, [])
    : [];

  // Remover duplicatas
  const uniqueSuggestedClaims = Array.from(new Set(suggestedClaimsFromEvents));

  const toggleClaim = (claimId: string) => {
    const newSelection = selectedClaims.includes(claimId)
      ? selectedClaims.filter((id) => id !== claimId)
      : [...selectedClaims, claimId];
    
    setSelectedClaims(newSelection);
    updateClaimsData(newSelection, claimDetails);
  };

  const updateClaimDetails = (claimId: string, field: string, value: any) => {
    const newDetails = {
      ...claimDetails,
      [claimId]: {
        ...claimDetails[claimId],
        [field]: value,
      },
    };
    setClaimDetails(newDetails);
    updateClaimsData(selectedClaims, newDetails);
  };

  const updateClaimsData = (selection: string[], details: Record<string, any>) => {
    const claimsData = availableClaims
      .filter((claim) => selection.includes(claim.id))
      .map((claim) => ({
        ...claim,
        details: details[claim.id] || {},
      }));
    onChange(claimsData);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Jornada: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Verbas: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Danos: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      Vínculo: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      Rescisão: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Multas: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      Adicionais: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      Estabilidade: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const groupedClaims = availableClaims.reduce((acc, claim) => {
    if (!acc[claim.category]) {
      acc[claim.category] = [];
    }
    acc[claim.category].push(claim);
    return acc;
  }, {} as Record<string, typeof availableClaims>);

  const renderClaimDetails = (claimId: string) => {
    const details = claimDetails[claimId] || {};

    switch (claimId) {
      case "horasExtras":
        return (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Total de Horas Extras (sem receber)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 120"
                  value={details.totalHoras || ""}
                  onChange={(e) => updateClaimDetails(claimId, "totalHoras", e.target.value)}
                />
              </div>
              <div>
                <Label>Adicional (%)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 50"
                  value={details.adicional || "50"}
                  onChange={(e) => updateClaimDetails(claimId, "adicional", e.target.value)}
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground bg-background p-2 rounded">
              <strong>Fórmula:</strong> (Salário / 220 horas) × Horas Extras × (1 + Adicional%)
            </div>
          </div>
        );

      case "adicionalNoturno":
        return (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Total de Horas Noturnas (sem receber)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 80"
                  value={details.totalHoras || ""}
                  onChange={(e) => updateClaimDetails(claimId, "totalHoras", e.target.value)}
                />
              </div>
              <div>
                <Label>Adicional Noturno (%)</Label>
                <Input
                  type="number"
                  placeholder="20"
                  value="20"
                  disabled
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground bg-background p-2 rounded">
              <strong>Fórmula:</strong> (Salário / 220 horas) × Horas Noturnas × 20%
            </div>
          </div>
        );

      case "feriasNaoPagas":
        return (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label>Quantos períodos de férias não foram pagos?</Label>
              <Input
                type="number"
                placeholder="Ex: 2"
                min="1"
                value={details.periodos || ""}
                onChange={(e) => updateClaimDetails(claimId, "periodos", e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground bg-background p-2 rounded">
              <strong>Fórmula:</strong> Salário × (4/3) × Número de períodos<br />
              <em>Cada período de férias = salário + 1/3 constitucional</em>
            </div>
          </div>
        );

      case "decimoTerceiro":
        return (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label>Meses Trabalhados sem Receber 13º</Label>
              <Input
                type="number"
                placeholder="Ex: 7"
                max="12"
                value={details.meses || ""}
                onChange={(e) => updateClaimDetails(claimId, "meses", e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground bg-background p-2 rounded">
              <strong>Fórmula:</strong> (Salário Bruto ÷ 12) × Meses Trabalhados<br />
              <em>Obs: Mês com 15 dias ou mais conta como mês completo</em>
            </div>
          </div>
        );

      case "fgts":
        return (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label>Meses sem depósito de FGTS</Label>
              <Input
                type="number"
                placeholder="Ex: 24"
                value={details.mesesSemDeposito || ""}
                onChange={(e) => updateClaimDetails(claimId, "mesesSemDeposito", e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground bg-background p-2 rounded">
              <strong>Depósito Mensal:</strong> Salário × 8%<br />
              <strong>Total FGTS:</strong> (Salário × 0.08) × Meses<br />
              <strong>Multa 40%:</strong> Total FGTS × 0.40
            </div>
          </div>
        );

      case "assedioMoral":
        return (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label>Descrição Detalhada dos Fatos</Label>
              <Textarea
                placeholder="Descreva as situações de assédio: condutas abusivas, repetitividade, testemunhas..."
                rows={4}
                value={details.descricao || ""}
                onChange={(e) => updateClaimDetails(claimId, "descricao", e.target.value)}
              />
            </div>
            <div>
              <Label>Valor Estimado para Danos Morais (R$)</Label>
              <Input
                type="number"
                placeholder="Ex: 10000"
                value={details.valorIndenizacao || ""}
                onChange={(e) => updateClaimDetails(claimId, "valorIndenizacao", e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground bg-background p-2 rounded">
              <strong>Elementos essenciais:</strong> Conduta abusiva, repetitividade, intencionalidade, degradação do ambiente, desestabilização
            </div>
          </div>
        );

      case "faltaRegistroCTPS":
        return (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Data de Início (sem registro)</Label>
                <Input
                  type="date"
                  value={details.periodoInicio || ""}
                  onChange={(e) => updateClaimDetails(claimId, "periodoInicio", e.target.value)}
                />
              </div>
              <div>
                <Label>Data de Término (sem registro)</Label>
                <Input
                  type="date"
                  value={details.periodoFim || ""}
                  onChange={(e) => updateClaimDetails(claimId, "periodoFim", e.target.value)}
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground bg-background p-2 rounded">
              <strong>Verbas devidas:</strong> Saldo salário, férias (vencidas + proporcionais + 1/3), 13º proporcional, FGTS (8% + multa 40%), aviso prévio indenizado
            </div>
          </div>
        );

      case "pejotizacao":
      case "reconhecimentoVinculo":
        return (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label>Descrição da Relação de Trabalho</Label>
              <Textarea
                placeholder="Descreva: pessoalidade, subordinação, onerosidade, habitualidade..."
                rows={4}
                value={details.descricao || ""}
                onChange={(e) => updateClaimDetails(claimId, "descricao", e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground bg-background p-2 rounded">
              <strong>Requisitos CLT Art. 3º:</strong> Pessoalidade, Onerosidade, Não eventualidade, Subordinação<br />
              <strong>Princípio:</strong> Primazia da realidade sobre a forma
            </div>
          </div>
        );

      case "employment_recognition":
        return (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label>Descrição das Atividades e Subordinação</Label>
              <Textarea
                placeholder="Descreva como exercia as atividades com subordinação, horário fixo, impossibilidade de substituição..."
                rows={4}
                value={details.description || ""}
                onChange={(e) => updateClaimDetails(claimId, "description", e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground bg-background p-2 rounded">
              <strong>Provas necessárias:</strong> Testemunhas, e-mails, mensagens, registro de ponto, uniformes, crachás
            </div>
          </div>
        );

      case "rescisaoIndireta":
        return (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label>Motivo da Rescisão Indireta</Label>
              <Textarea
                placeholder="Descreva as faltas graves do empregador (Art. 483 CLT): não pagamento, redução de salário, assédio..."
                rows={4}
                value={details.motivo || ""}
                onChange={(e) => updateClaimDetails(claimId, "motivo", e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground bg-background p-2 rounded">
              <strong>Verbas devidas:</strong> Mesmas da demissão sem justa causa (saldo, 13º, férias + 1/3, aviso prévio, FGTS + 40%, seguro-desemprego)
            </div>
          </div>
        );

      case "multa467":
      case "multa477":
        return (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label>Tipo de Multa</Label>
              <div className="space-y-2 mt-2">
                {claimId === "multa477" && (
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={true} disabled />
                    <Label className="font-normal">
                      Art. 477 - Verbas não pagas em 10 dias (Multa: 1 salário)
                    </Label>
                  </div>
                )}
                {claimId === "multa467" && (
                  <>
                    <div className="flex items-center space-x-2">
                      <Checkbox checked={true} disabled />
                      <Label className="font-normal">
                        Art. 467 - Verbas incontroversas não pagas na audiência (Multa: 50% do valor)
                      </Label>
                    </div>
                    <div className="mt-3">
                      <Label>Valor das verbas incontroversas (R$)</Label>
                      <Input
                        type="number"
                        placeholder="Ex: 5000"
                        value={details.valorVerbas || ""}
                        onChange={(e) => updateClaimDetails(claimId, "valorVerbas", e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="text-xs text-muted-foreground bg-background p-2 rounded">
              <strong>Art. 477:</strong> 1 salário do empregado<br />
              <strong>Art. 467:</strong> Valor das verbas incontroversas + 50%
            </div>
          </div>
        );

      case "insalubridade":
        return (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label>Grau de Insalubridade</Label>
              <Select
                value={details.grau || ""}
                onValueChange={(value) => updateClaimDetails(claimId, "grau", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimo">Mínimo - 10%</SelectItem>
                  <SelectItem value="medio">Médio - 20%</SelectItem>
                  <SelectItem value="maximo">Máximo - 40%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Descrição das Condições Insalubres</Label>
              <Textarea
                placeholder="Descreva a exposição a agentes nocivos (calor, ruído, produtos químicos...)"
                rows={3}
                value={details.descricao || ""}
                onChange={(e) => updateClaimDetails(claimId, "descricao", e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground bg-background p-2 rounded">
              <strong>Fórmula:</strong> Salário Mínimo (R$ 1.518) × Percentual × Meses<br />
              <strong>Base:</strong> Salário Mínimo Nacional (TST/STF)
            </div>
          </div>
        );

      case "periculosidade":
        return (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label>Descrição das Condições Perigosas</Label>
              <Textarea
                placeholder="Descreva a exposição ao perigo (inflamáveis, explosivos, energia elétrica...)"
                rows={3}
                value={details.descricao || ""}
                onChange={(e) => updateClaimDetails(claimId, "descricao", e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground bg-background p-2 rounded">
              <strong>Fórmula:</strong> Salário Base × 30% × Meses<br />
              <strong>Atenção:</strong> NÃO pode cumular com Insalubridade. Escolha o mais vantajoso.
            </div>
          </div>
        );

      case "estabilidadeAcidentaria":
        return (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Data do Acidente/Afastamento</Label>
                <Input
                  type="date"
                  value={details.dataAcidente || ""}
                  onChange={(e) => updateClaimDetails(claimId, "dataAcidente", e.target.value)}
                />
              </div>
              <div>
                <Label>Data da Alta do INSS</Label>
                <Input
                  type="date"
                  value={details.dataAlta || ""}
                  onChange={(e) => updateClaimDetails(claimId, "dataAlta", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Meses de Estabilidade (12 meses padrão)</Label>
              <Input
                type="number"
                placeholder="12"
                value={details.mesesEstabilidade || "12"}
                onChange={(e) => updateClaimDetails(claimId, "mesesEstabilidade", e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground bg-background p-2 rounded">
              <strong>Estabilidade:</strong> 12 meses após alta do INSS<br />
              <strong>Fórmula:</strong> Salário × Meses de estabilidade<br />
              <strong>Base legal:</strong> Art. 118 Lei 8.213/91 e Súmula 378 TST
            </div>
          </div>
        );

      case "desvioFuncao":
        return (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div>
              <Label>Função Contratada</Label>
              <Input
                placeholder="Ex: Auxiliar Administrativo"
                value={details.funcaoContratada || ""}
                onChange={(e) => updateClaimDetails(claimId, "funcaoContratada", e.target.value)}
              />
            </div>
            <div>
              <Label>Função Efetivamente Exercida</Label>
              <Input
                placeholder="Ex: Gerente de Vendas"
                value={details.funcaoExercida || ""}
                onChange={(e) => updateClaimDetails(claimId, "funcaoExercida", e.target.value)}
              />
            </div>
            <div>
              <Label>Diferença Salarial Mensal (R$)</Label>
              <Input
                type="number"
                placeholder="Ex: 1500"
                value={details.diferencaSalarial || ""}
                onChange={(e) => updateClaimDetails(claimId, "diferencaSalarial", e.target.value)}
              />
            </div>
            <div>
              <Label>Quantos meses exerceu a função desviada?</Label>
              <Input
                type="number"
                placeholder="Ex: 24"
                value={details.meses || ""}
                onChange={(e) => updateClaimDetails(claimId, "meses", e.target.value)}
              />
            </div>
            <div className="text-xs text-muted-foreground bg-background p-2 rounded">
              <strong>Fórmula:</strong> Diferença Salarial × Meses<br />
              <strong>Direito:</strong> Receber diferença salarial pelo período em que exerceu função diversa
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Selecione seus Direitos</h3>
          <p className="text-sm text-muted-foreground">
            Marque todos os direitos que foram violados e preencha os detalhes de cada um.
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-3">
            <p className="text-xs text-muted-foreground">
              ✅ <strong>Dica:</strong> Selecione TODOS os direitos que foram violados. Cada pedido precisa de detalhes específicos (valores, períodos, descrições). Quanto mais preciso, melhor seu cálculo.
            </p>
          </div>
        </div>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground shrink-0">
          <Video className="h-4 w-4 mr-2" />
          Veja como preencher
        </Button>
      </div>

      {/* Pedidos Automáticos Baseados em Eventos */}
      {uniqueSuggestedClaims.length > 0 && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-primary">⚡</span> Pedidos Sugeridos Automaticamente
            </CardTitle>
            <CardDescription>
              Com base nos eventos registrados na aba "Fatos", os seguintes pedidos são recomendados:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {uniqueSuggestedClaims.map((claimId: string) => {
              const claim = availableClaims.find(c => c.id === claimId);
              if (!claim) return null;
              
              const isSelected = selectedClaims.includes(claimId);
              
              return (
                <div
                  key={claimId}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "bg-success/10 border-success"
                      : "bg-background hover:border-primary"
                  }`}
                  onClick={() => toggleClaim(claimId)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox checked={isSelected} className="mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{claim.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {claim.description}
                      </p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {claim.article}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-muted-foreground italic mt-3">
              💡 Você pode aceitar, editar ou excluir estes pedidos. Outros pedidos estão disponíveis abaixo.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Todos os Pedidos Disponíveis por Categoria */}

      {Object.entries(groupedClaims).map(([category, claims]) => (
        <div key={category}>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            {category}
            <Badge variant="secondary" className={getCategoryColor(category)}>
              {claims.length}
            </Badge>
          </h4>
          <div className="space-y-4">
            {claims.map((claim) => (
              <Collapsible key={claim.id} open={selectedClaims.includes(claim.id)}>
                <Card
                  className={`transition-all ${
                    selectedClaims.includes(claim.id)
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  }`}
                >
                  <CollapsibleTrigger className="w-full" asChild>
                    <CardHeader
                      className="pb-3 cursor-pointer"
                      onClick={() => toggleClaim(claim.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedClaims.includes(claim.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-base">{claim.title}</CardTitle>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {claim.article}
                              </Badge>
                            </div>
                            {selectedClaims.includes(claim.id) && (
                              <ChevronDown className="h-4 w-4 shrink-0 transition-transform" />
                            )}
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-sm ml-9">
                        {claim.description}
                      </CardDescription>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent onClick={(e) => e.stopPropagation()}>
                      {renderClaimDetails(claim.id)}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      ))}

      {selectedClaims.length > 0 && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-primary">
              ✓ {selectedClaims.length} direito(s) selecionado(s)
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Preencha todos os detalhes de cada pedido para gerar sua petição completa.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Dica:</strong> Não tenha medo de marcar vários direitos. É melhor incluir 
          tudo que você acha que foi violado. O juiz analisará cada pedido individualmente.
        </p>
      </div>
    </div>
  );
};
