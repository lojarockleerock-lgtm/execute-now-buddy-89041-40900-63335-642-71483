import { useMemo, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info, Calculator, Edit2, Check, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Video } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import HelpVideoDialog from "./HelpVideoDialog";

interface CalculationsStepProps {
  data: {
    claims: any[];
    salarioBruto?: number;
    dataAdmissao?: string;
    dataDemissao?: string;
  };
  onChange: (data: any) => void;
}

type ConfidenceLevel = "high" | "medium" | "low";

interface CalculationItem {
  id: string;
  claimType: string;
  description: string;
  baseValue: number;
  reflexos: number;
  total: number;
  formula: string;
  editable: boolean;
  confidenceLevel: ConfidenceLevel;
  parameters?: any;
}

export const CalculationsStep = ({ data, onChange }: CalculationsStepProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<string[]>([]);
  const [editedValues, setEditedValues] = useState<Record<string, number>>({});
  const [showHelpVideo, setShowHelpVideo] = useState(false);

  // Helper para calcular meses entre duas datas
  const calculateMonths = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return (
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) + 1
    );
  };

  // Lógica de cálculo automático por tipo de pedido
  const calculations = useMemo(() => {
    if (!data.claims || data.claims.length === 0) return null;

    const salario = data.salarioBruto || 0;
    const mesesTrabalhados = calculateMonths(
      data.dataAdmissao || "",
      data.dataDemissao || ""
    );

    const items: CalculationItem[] = [];

    data.claims.forEach((claim, index) => {
      const claimText = claim.label || claim.title || claim.type || claim;
      const claimLower = typeof claimText === 'string' ? claimText.toLowerCase() : '';
      const claimType = claim.type || claim.id || '';
      let baseValue = 0;
      let reflexos = 0;
      let formula = "";
      let editable = true;
      let confidenceLevel: ConfidenceLevel = salario > 0 && mesesTrabalhados > 0 ? "high" : "low";

      // ============ VERBAS INCONTROVERSAS (calculadas automaticamente) ============
      
      // Saldo de Salário
      if (claimType === "saldoSalario") {
        const diasUteis = 20; // Estimativa média de dias úteis no mês
        const diasTrabalhados = 10; // Estimativa de meio mês
        baseValue = (salario / diasUteis) * diasTrabalhados;
        reflexos = 0;
        formula = "(Salário ÷ dias úteis do mês) × dias trabalhados";
        editable = false;
        confidenceLevel = salario > 0 ? "high" : "low";
      }
      
      // Aviso-Prévio Indenizado
      else if (claimType === "avisoPrevioIndenizado") {
        // Art. 487 CLT: 30 dias + 3 dias por ano trabalhado (até 60 dias adicionais)
        const anosCompletos = Math.floor(mesesTrabalhados / 12);
        const diasAdicionais = Math.min(anosCompletos * 3, 60);
        const totalDias = 30 + diasAdicionais;
        baseValue = (salario / 30) * totalDias;
        reflexos = baseValue * 0.08; // FGTS sobre aviso
        formula = `Salário × (30 dias + ${diasAdicionais} dias adicionais) / 30`;
        editable = false;
        confidenceLevel = salario > 0 && mesesTrabalhados > 0 ? "high" : "low";
      }
      
      // Férias Vencidas + 1/3
      else if (claimType === "feriasVencidas") {
        const periodosVencidos = Math.floor(mesesTrabalhados / 12);
        baseValue = salario * (4/3) * periodosVencidos; // Cada período = salário + 1/3
        reflexos = baseValue * 0.08; // FGTS
        formula = `Salário × 4/3 × ${periodosVencidos} período(s) vencido(s)`;
        editable = false;
        confidenceLevel = salario > 0 && mesesTrabalhados >= 12 ? "high" : "medium";
      }
      
      // Férias Proporcionais + 1/3
      else if (claimType === "feriasProporcionais") {
        const mesesProporcional = mesesTrabalhados % 12;
        baseValue = (salario / 12) * mesesProporcional * (4/3);
        reflexos = baseValue * 0.08; // FGTS
        formula = `(Salário ÷ 12) × ${mesesProporcional} meses × 4/3`;
        editable = false;
        confidenceLevel = salario > 0 && mesesTrabalhados > 0 ? "high" : "low";
      }
      
      // 13º Salário Proporcional
      else if (claimType === "decimoTerceiroProporcional") {
        const mesesAno = mesesTrabalhados > 12 ? 12 : mesesTrabalhados;
        baseValue = (salario / 12) * mesesAno;
        reflexos = baseValue * 0.08; // FGTS
        formula = `(Salário ÷ 12) × ${mesesAno} meses`;
        editable = false;
        confidenceLevel = salario > 0 ? "high" : "low";
      }
      
      // Multa de 40% sobre FGTS
      else if (claimType === "multaFGTS40") {
        const fgtsTotal = salario * 0.08 * mesesTrabalhados;
        baseValue = fgtsTotal * 0.40;
        reflexos = 0;
        formula = `(FGTS Total: R$ ${fgtsTotal.toFixed(2)}) × 40%`;
        editable = false;
        confidenceLevel = salario > 0 && mesesTrabalhados > 0 ? "high" : "low";
      }
      
      // Depósitos de FGTS Não Realizados
      else if (claimType === "depositosFGTSNaoRealizados") {
        baseValue = salario * 0.08 * mesesTrabalhados;
        reflexos = 0;
        formula = `Salário × 8% × ${mesesTrabalhados} meses`;
        editable = false;
        confidenceLevel = salario > 0 && mesesTrabalhados > 0 ? "high" : "low";
      }
      
      // ============ OUTROS PEDIDOS (lógica existente) ============

      // Horas Extras
      else if (claimLower.includes("horas extras") || claimLower.includes("hora extra")) {
        const horasPorMes = 40; // Estimativa média
        const valorHora = salario / 220;
        const adicional = 1.5; // 50%
        baseValue = valorHora * horasPorMes * adicional * mesesTrabalhados;
        reflexos = baseValue * 0.25; // 25% reflexos (FGTS, 13º, férias)
        formula = "(Salário ÷ 220) × horas extras × 1,5 × meses";
        confidenceLevel = salario > 0 && mesesTrabalhados > 0 ? "medium" : "low";
      }
      
      // FGTS
      else if (claimLower.includes("fgts")) {
        baseValue = salario * 0.08 * mesesTrabalhados;
        reflexos = baseValue * 0.4; // Multa de 40%
        formula = "Salário × 0,08 × nº meses + multa 40%";
        confidenceLevel = salario > 0 && mesesTrabalhados > 0 ? "high" : "low";
      }
      
      // 13º Salário
      else if (claimLower.includes("13") || claimLower.includes("décimo") || claimLower.includes("decimo")) {
        baseValue = (salario / 12) * mesesTrabalhados;
        reflexos = baseValue * 0.08; // FGTS sobre 13º
        formula = "Salário ÷ 12 × meses trabalhados";
        confidenceLevel = salario > 0 && mesesTrabalhados > 0 ? "high" : "low";
      }
      
      // Férias
      else if (claimLower.includes("férias") || claimLower.includes("ferias")) {
        const feriasSimples = (salario / 12) * mesesTrabalhados;
        const tercoConstitucional = feriasSimples / 3;
        baseValue = feriasSimples + tercoConstitucional;
        reflexos = baseValue * 0.08; // FGTS
        formula = "(Salário ÷ 12 × meses) + 1/3 constitucional";
        confidenceLevel = salario > 0 && mesesTrabalhados > 0 ? "high" : "low";
      }
      
      // Multa Art. 477
      else if (claimLower.includes("477") || claimLower.includes("multa")) {
        baseValue = salario;
        reflexos = 0;
        formula = "Um salário nominal";
        confidenceLevel = salario > 0 ? "high" : "low";
      }
      
      // Assédio Moral / Dano Moral
      else if (claimLower.includes("assédio") || claimLower.includes("assedio") || claimLower.includes("dano moral")) {
        baseValue = 10000; // Valor padrão sugerido
        reflexos = 0;
        formula = "Valor estimado (R$ 3.000 - R$ 50.000)";
        confidenceLevel = "low";
        editable = true;
      }
      
      // Acidente de Trabalho
      else if (claimLower.includes("acidente")) {
        baseValue = 15000; // Valor padrão sugerido
        reflexos = 0;
        formula = "Indenização variável por tipo de lesão";
        confidenceLevel = "low";
        editable = true;
      }
      
      // Equiparação Salarial
      else if (claimLower.includes("equiparação") || claimLower.includes("equiparacao")) {
        const diferenca = salario * 0.2; // 20% de diferença estimada
        baseValue = diferenca * mesesTrabalhados;
        reflexos = baseValue * 0.25;
        formula = "(Diferença salarial) × nº de meses";
        confidenceLevel = "medium";
      }
      
      // Adicional Noturno
      else if (claimLower.includes("noturno")) {
        baseValue = salario * 0.2 * mesesTrabalhados; // 20% do salário
        reflexos = baseValue * 0.25;
        formula = "Salário × 0,20 × meses";
        confidenceLevel = "medium";
      }
      
      // Insalubridade
      else if (claimLower.includes("insalubridade")) {
        baseValue = salario * 0.2 * mesesTrabalhados; // 20% grau médio
        reflexos = baseValue * 0.25;
        formula = "Salário × 0,20 (grau médio) × meses";
        confidenceLevel = "medium";
      }
      
      // Periculosidade
      else if (claimLower.includes("periculosidade")) {
        baseValue = salario * 0.3 * mesesTrabalhados; // 30%
        reflexos = baseValue * 0.25;
        formula = "Salário × 0,30 × meses";
        confidenceLevel = "medium";
      }
      
      // Aviso Prévio
      else if (claimLower.includes("aviso")) {
        baseValue = salario;
        reflexos = salario * 0.08; // FGTS
        formula = "Um salário mensal";
        confidenceLevel = salario > 0 ? "high" : "low";
      }
      
      // Outros (valor padrão)
      else {
        baseValue = 5000;
        reflexos = 0;
        formula = "Valor estimado";
        confidenceLevel = "low";
        editable = true;
      }

      // Aplicar valores editados se existirem
      if (editedValues[`calc_${index}`]) {
        baseValue = editedValues[`calc_${index}`];
      }

      const total = baseValue + reflexos;

      items.push({
        id: `calc_${index}`,
        claimType: claimText,
        description: claimText,
        baseValue,
        reflexos,
        total,
        formula,
        editable,
        confidenceLevel,
      });
    });

    const totalGeral = items.reduce((sum, item) => sum + item.total, 0);
    const totalBase = items.reduce((sum, item) => sum + item.baseValue, 0);
    const totalReflexos = items.reduce((sum, item) => sum + item.reflexos, 0);

    return {
      items,
      totalBase,
      totalReflexos,
      totalGeral,
    };
  }, [data.claims, data.salarioBruto, data.dataAdmissao, data.dataDemissao, editedValues]);

  // Sincronizar dados calculados com o estado pai
  useEffect(() => {
    if (calculations) {
      onChange(calculations);
    }
  }, [calculations, onChange]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getConfidenceBadge = (level: ConfidenceLevel) => {
    switch (level) {
      case "high":
        return (
          <Badge variant="default" className="bg-success/10 text-success border-success/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Alta confiabilidade
          </Badge>
        );
      case "medium":
        return (
          <Badge variant="default" className="bg-warning/10 text-warning border-warning/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Média confiabilidade
          </Badge>
        );
      case "low":
        return (
          <Badge variant="default" className="bg-destructive/10 text-destructive border-destructive/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Baixa confiabilidade
          </Badge>
        );
    }
  };

  const toggleCard = (id: string) => {
    setExpandedCards(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSaveEdit = (itemId: string, newValue: number) => {
    setEditedValues(prev => ({ ...prev, [itemId]: newValue }));
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Cálculos Trabalhistas</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Aqui estão os cálculos automáticos baseados nos dados informados.
          </p>
        </div>
        <Button 
          variant="outline" 
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground shrink-0"
          onClick={() => setShowHelpVideo(true)}
        >
          <Video className="h-4 w-4 mr-2" />
          Veja como preencher
        </Button>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Como funcionam os cálculos?
        </h4>
        <p className="text-xs text-muted-foreground">
          💡 Os valores são calculados automaticamente com base no salário, tempo de trabalho e pedidos selecionados. Você pode ajustar valores manualmente se necessário. A confiabilidade indica se temos dados suficientes para um cálculo preciso.
        </p>
      </div>
      {!calculations || calculations.items.length === 0 ? (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Nenhum pedido calculável foi identificado. Por favor, adicione pedidos na aba anterior.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Total Acumulado - Sidebar Fixa */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 sticky top-4 z-10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Total Geral da Causa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-2">
                {formatCurrency(calculations.totalGeral)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                <div>
                  <p className="text-muted-foreground">Valor Base</p>
                  <p className="font-semibold">{formatCurrency(calculations.totalBase)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reflexos</p>
                  <p className="font-semibold">{formatCurrency(calculations.totalReflexos)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards de Pedidos */}
          <div className="space-y-4">
            {calculations.items.map((item) => (
              <Collapsible
                key={item.id}
                open={expandedCards.includes(item.id)}
                onOpenChange={() => toggleCard(item.id)}
              >
                <Card className="hover:border-primary/30 transition-colors">
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
                            {item.description}
                            {getConfidenceBadge(item.confidenceLevel)}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            💰 Total: <span className="font-bold text-foreground">{formatCurrency(item.total)}</span>
                          </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm">
                          {expandedCards.includes(item.id) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="space-y-4 pt-0">
                      {/* Detalhamento do Cálculo */}
                      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                        <div>
                          <Label className="text-xs text-muted-foreground">Valor Base</Label>
                          <p className="text-lg font-semibold">{formatCurrency(item.baseValue)}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Reflexos</Label>
                          <p className="text-lg font-semibold">{formatCurrency(item.reflexos)}</p>
                        </div>
                      </div>

                      {/* Fórmula */}
                      <Alert className="bg-primary/5 border-primary/20">
                        <Calculator className="h-4 w-4 text-primary" />
                        <AlertDescription>
                          <span className="font-medium">Fórmula aplicada:</span> {item.formula}
                        </AlertDescription>
                      </Alert>

                      {/* Parâmetros Editáveis (se aplicável) */}
                      {item.editable && editingId === item.id && (
                        <div className="space-y-3 p-4 border border-border rounded-lg bg-card">
                          <Label htmlFor={`base-${item.id}`}>Valor Base (R$)</Label>
                          <Input
                            id={`base-${item.id}`}
                            type="number"
                            defaultValue={item.baseValue}
                            placeholder="Digite o valor"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const newValue = parseFloat((e.target as HTMLInputElement).value);
                                if (!isNaN(newValue)) {
                                  handleSaveEdit(item.id, newValue);
                                }
                              }
                            }}
                          />
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={(e) => {
                                const input = document.getElementById(`base-${item.id}`) as HTMLInputElement;
                                const newValue = parseFloat(input.value);
                                if (!isNaN(newValue)) {
                                  handleSaveEdit(item.id, newValue);
                                }
                              }}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Salvar
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      )}

                      {item.editable && editingId !== item.id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(item.id)}
                          className="w-full"
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          🧮 Ajustar Parâmetros
                        </Button>
                      )}

                      {/* Nota sobre confiabilidade */}
                      {item.confidenceLevel === "low" && (
                        <Alert variant="destructive" className="bg-destructive/5">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            ⚠️ Faltam dados completos — informe salário ou período para maior precisão.
                          </AlertDescription>
                        </Alert>
                      )}

                      {item.confidenceLevel === "high" && (
                        <Alert className="bg-success/5 border-success/20">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <AlertDescription className="text-success">
                            ✅ Cálculo estimado com base nos dados fornecidos e CLT.
                          </AlertDescription>
                        </Alert>
                      )}

                      {item.confidenceLevel === "medium" && (
                        <Alert className="bg-warning/5 border-warning/20">
                          <Info className="h-4 w-4 text-warning" />
                          <AlertDescription className="text-warning">
                            💬 Cálculo baseado em parâmetros médios. Recomenda-se anexar provas documentais.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>

          {/* Resumo Consolidado */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>📊 Resumo Consolidado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Pedido</th>
                      <th className="text-right py-2 px-4">Valor Base</th>
                      <th className="text-right py-2 px-4">Reflexos</th>
                      <th className="text-right py-2 px-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.items.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-muted/30">
                        <td className="py-2 px-4">{item.description}</td>
                        <td className="text-right py-2 px-4">{formatCurrency(item.baseValue)}</td>
                        <td className="text-right py-2 px-4">{formatCurrency(item.reflexos)}</td>
                        <td className="text-right py-2 px-4 font-semibold">{formatCurrency(item.total)}</td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-primary/5">
                      <td className="py-3 px-4">TOTAL GERAL</td>
                      <td className="text-right py-3 px-4">{formatCurrency(calculations.totalBase)}</td>
                      <td className="text-right py-3 px-4">{formatCurrency(calculations.totalReflexos)}</td>
                      <td className="text-right py-3 px-4 text-primary text-lg">
                        {formatCurrency(calculations.totalGeral)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Informações Importantes */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <p className="font-medium">💡 Informações Importantes:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Os valores apresentados são <strong>estimativas</strong> baseadas na CLT e médias salariais.</li>
                <li>Cálculos precisos devem ser realizados por perito contábil.</li>
                <li>Reflexos incluem FGTS, 13º salário e férias proporcionais quando aplicável.</li>
                <li>Valores de danos morais são sugestões e podem variar conforme jurisprudência.</li>
              </ul>
            </AlertDescription>
          </Alert>
        </>
      )}

      <HelpVideoDialog
        open={showHelpVideo}
        onOpenChange={setShowHelpVideo}
        stepName="Cálculos"
        stepId="calculations"
      />
    </div>
  );
};