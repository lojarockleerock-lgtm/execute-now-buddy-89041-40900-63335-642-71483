import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Download, 
  Edit3, 
  CheckCircle, 
  User, 
  Building, 
  Calendar,
  Scale,
  DollarSign,
  Save,
  Video
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import JSZip from "jszip";
import HelpVideoDialog from "./HelpVideoDialog";

interface ReviewStepProps {
  caseData: any;
}

export const ReviewStep = ({ caseData }: ReviewStepProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [petitionText, setPetitionText] = useState("");
  const [showHelpVideo, setShowHelpVideo] = useState(false);
  
  const handleGeneratePDF = () => {
    if (!petitionText) {
      toast.error("Gere a petição primeiro!");
      return;
    }

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const lineHeight = 7;
      const maxWidth = pageWidth - 2 * margin;

      // Adicionar o texto da petição
      const lines = pdf.splitTextToSize(petitionText, maxWidth);
      let yPosition = margin;

      lines.forEach((line: string) => {
        if (yPosition + lineHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });

      // Salvar o PDF
      const claimantName = caseData.qualification?.nome || "Reclamante";
      const fileName = `Petição_${claimantName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Erro ao gerar PDF");
    }
  };

  const handleDownloadPackage = async () => {
    if (!petitionText) {
      toast.error("Gere a petição primeiro!");
      return;
    }

    try {
      const zip = new JSZip();
      
      // Adicionar petição em texto
      const claimantName = caseData.qualification?.nome || "Reclamante";
      zip.file("01_Petição_Inicial.txt", petitionText);

      // Adicionar resumo dos cálculos
      const calculations = caseData.calculations || {};
      let calculationsSummary = "RESUMO DOS CÁLCULOS\n\n";
      
      if (calculations.items) {
        calculations.items.forEach((item: any) => {
          calculationsSummary += `${item.label}: ${formatCurrency(item.value)}\n`;
        });
      }
      
      if (calculations.additionalItems) {
        calculationsSummary += "\nVerbas Adicionais:\n";
        calculations.additionalItems.forEach((item: any) => {
          calculationsSummary += `${item.label}: ${formatCurrency(item.value)}\n`;
        });
      }
      
      calculationsSummary += `\nVALOR TOTAL: ${formatCurrency(calculations.totalGeral || 0)}`;
      zip.file("02_Cálculos.txt", calculationsSummary);

      // Adicionar lista de provas
      const evidenceList = caseData.evidence || [];
      let evidenceText = "LISTA DE PROVAS\n\n";
      evidenceList.forEach((evidence: any, idx: number) => {
        evidenceText += `${idx + 1}. ${evidence.fileName} (${evidence.category})\n`;
      });
      if (evidenceList.length === 0) {
        evidenceText += "Nenhuma prova anexada.\n";
      }
      zip.file("03_Provas.txt", evidenceText);

      // Adicionar instruções
      const instructions = `INSTRUÇÕES PARA PROTOCOLO NO TRT

1. Acesse o site do Tribunal Regional do Trabalho da sua região
2. Realize o cadastro ou faça login no sistema PJe-JT
3. Selecione a opção "Petição Inicial"
4. Preencha os dados conforme solicitado pelo sistema
5. Anexe os seguintes documentos:
   - Petição Inicial (arquivo 01)
   - Planilha de Cálculos (arquivo 02)
   - Provas documentais (conforme lista no arquivo 03)
6. Revise todas as informações antes de protocolar
7. Após o protocolo, guarde o número do processo

IMPORTANTE:
- Você está exercendo o direito de jus postulandi (CLT, art. 791)
- Para recursos ao TST, será necessário contratar advogado
- Acompanhe o processo regularmente pelo site do TRT
- Compareça às audiências designadas

Dúvidas: Procure o atendimento do TRT da sua região.`;
      
      zip.file("00_LEIA_PRIMEIRO.txt", instructions);

      // Gerar e baixar o ZIP
      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Pacote_TRT_${claimantName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Pacote TRT baixado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar pacote:", error);
      toast.error("Erro ao gerar pacote");
    }
  };

  const handleGeneratePetition = () => {
    const generatedText = generatePetitionText();
    setPetitionText(generatedText);
    toast.success("Petição gerada automaticamente!");
  };

  const handleSaveEdits = () => {
    setIsEditing(false);
    toast.success("Alterações salvas!");
  };

  const generatePetitionText = (): string => {
    const q = caseData.qualification || {};
    const claims = caseData.claims || [];
    const factsData = Array.isArray(caseData.facts) ? caseData.facts : (caseData.facts?.facts || []);
    const calculations = caseData.calculations || {};
    const totalValue = calculations.totalGeral || 0;
    const dataAdmissao = q.dataAdmissao || '[xx/xx/xxxx]';
    const dataDemissao = q.dataDemissao || '[xx/xx/xxxx]';
    const salarioBruto = q.salarioBruto_numeric || parseFloat(q.salarioBruto) || 0;
    const motivoDesligamento = caseData.dismissalType || 'dispensa sem justa causa';
    
    // Construir narrativa dos fatos
    const factsNarrative = factsData.length > 0 
      ? factsData.map((f: any) => `${f.description}`).join('. ')
      : '[Descreva aqui sua história resumida com todos os fatos relevantes]';

    // Montar lista de pedidos com valores
    const pedidosDetalhados = claims.map((c: any, idx: number) => {
      const calc = calculations.items?.find((item: any) => item.claimType === c.type);
      const value = calc?.total || calc?.value || 0;
      const valueText = value > 0 ? `: ${formatCurrency(value)}` : '';
      return `${idx + 1}. ${c.title}${valueText}`;
    }).join('\n');

    // Montar resumo de valores para a seção 5
    let valoresTotaisTexto = '';
    if (calculations.items && calculations.items.length > 0) {
      valoresTotaisTexto = calculations.items.map((item: any) => {
        return `${item.label}: ${formatCurrency(item.value || item.total || 0)}`;
      }).join('\n');
    }

    return `${q.nome || '[Seu nome completo]'}:
Nacionalidade: ${q.nacionalidade || '[nacionalidade]'}, estado civil: ${q.estadoCivil || '[estado civil]'}, profissão: ${q.profissao || '[profissão]'}, portador(a) do RG ${q.rg || '[xxx]'}, CPF nº ${q.cpf || '[xxx]'}, residente e domiciliado(a) ${q.endereco ? `à ${q.endereco}, ${q.bairro || ''}, ${q.cidade || ''} - ${q.estado || ''}, CEP ${q.cep || ''}` : '[endereço completo com CEP]'}, telefone/whatsapp ${q.telefone || '(xx) xxxxx-xxxx'}, vem, respeitosamente, à presença de Vossa Excelência propor a presente:

Reclamação Trabalhista
Com fundamento no art. 840 da CLT e art. 319 do CPC, em face de:

${q.empresa_nome || '[Razão social da Empresa]'}
Inscrita no CNPJ sob o nº ${q.empresa_cnpj || '[xxxxx]'}, com sede ${q.empresa_endereco ? `à ${q.empresa_endereco}, ${q.empresa_bairro || ''}, ${q.empresa_cidade || ''} - ${q.empresa_estado || ''}, CEP ${q.empresa_cep || ''}` : '[endereço completo com CEP]'}, endereço para notificações, pelos fatos e fundamentos a seguir expostos:

1: DA OPÇÃO PELO PROCESSO DIGITAL

${q.processoDigital ? 'O(A) Reclamante informa que possui meios para participar de audiência virtual e prefere que o processo tramite em juízo 100% digital, caso possível.' : 'O(A) Reclamante não optou pelo processo 100% digital.'}

2: DA RELAÇÃO DE TRABALHO

Data de admissão: ${dataAdmissao}
Data de saída: ${dataDemissao}
Motivo do desligamento: ${motivoDesligamento}
Função exercida: ${q.cargo || '[xxxxx]'}
Último salário: ${formatCurrency(salarioBruto)}

O(A) Reclamante foi contratado(a) pela empresa Reclamada para exercer a função acima, prestando serviços no endereço ${q.local_trabalho_endereco ? `${q.local_trabalho_endereco}, ${q.local_trabalho_cidade || ''} - ${q.local_trabalho_estado || ''}, CEP ${q.local_trabalho_cep || ''}` : '[local da prestação de serviço com CEP]'}, até a data da saída mencionada.

3: DOS FATOS

${factsNarrative}

4: DOS PEDIDOS

Com base nos direitos trabalhistas e na legislação vigente, venho requerer:

${pedidosDetalhados}

5: TOTAL DA CAUSA

${valoresTotaisTexto}

Total geral: ${formatCurrency(totalValue)}

Termos em que, pede deferimento

${q.cidade || '[Local]'}, ${new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}

_____________________________________
Assinatura do Reclamante
${q.nome || '[Nome completo]'}`;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);
  };

  const totalValue = caseData.calculations?.totalGeral || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Revisão e Geração da Petição</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Revise todas as informações antes de gerar sua petição trabalhista.
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              📄 <strong>Última etapa!</strong> Confira se todos os dados estão corretos. Você pode gerar a petição em PDF, editá-la manualmente se necessário, e baixar todos os documentos juntos em um arquivo ZIP.
            </p>
          </div>
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

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Reclamante</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{caseData.qualification?.nome || "Não informado"}</p>
            <p className="text-sm text-muted-foreground">
              CPF: {caseData.qualification?.cpf || "N/A"}
            </p>
            <p className="text-sm text-muted-foreground">
              {caseData.qualification?.cidade || ""}, {caseData.qualification?.estado || ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Reclamada</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-semibold">{caseData.qualification?.empresa_nome || "Não informado"}</p>
            <p className="text-sm text-muted-foreground">
              CNPJ: {caseData.qualification?.empresa_cnpj || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Linha do Tempo</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {caseData.facts && Array.isArray(caseData.facts) && caseData.facts.length > 0 ? (
              caseData.facts.map((fact: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="font-medium">{fact.date}</p>
                    <p className="text-muted-foreground">{fact.description}</p>
                  </div>
                </div>
              ))
            ) : caseData.facts?.facts && Array.isArray(caseData.facts.facts) && caseData.facts.facts.length > 0 ? (
              caseData.facts.facts.map((fact: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div>
                    <p className="font-medium">{fact.date}</p>
                    <p className="text-muted-foreground">{fact.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum evento registrado</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Claims */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Pedidos ({caseData.claims?.length || 0})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {caseData.claims && caseData.claims.length > 0 ? (
              caseData.claims.map((claim: any, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-sm">
                  {claim.title}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum pedido selecionado</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Evidence */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Provas Anexadas</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {caseData.evidence && caseData.evidence.length > 0 ? (
              caseData.evidence.map((evidence: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>{evidence.fileName}</span>
                  <Badge variant="outline" className="text-xs">{evidence.category}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma prova anexada</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Calculations Summary */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Valor Total da Causa</CardTitle>
            </div>
            <p className="text-3xl font-bold text-primary">
              {formatCurrency(totalValue)}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Valor estimado baseado nos cálculos de verbas trabalhistas
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* Generated Petition */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Petição Inicial Gerada</CardTitle>
              <CardDescription>
                Revise e edite o texto da petição conforme necessário
              </CardDescription>
            </div>
            {!petitionText ? (
              <Button onClick={handleGeneratePetition} className="gradient-primary">
                <FileText className="h-4 w-4 mr-2" />
                Gerar Petição Automática
              </Button>
            ) : (
              <div className="flex gap-2">
                {isEditing ? (
                  <Button onClick={handleSaveEdits} variant="default">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {petitionText ? (
            isEditing ? (
              <Textarea
                value={petitionText}
                onChange={(e) => setPetitionText(e.target.value)}
                className="min-h-[600px] font-mono text-sm"
              />
            ) : (
              <div className="bg-muted p-6 rounded-lg max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">{petitionText}</pre>
              </div>
            )
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Clique no botão acima para gerar automaticamente a petição inicial</p>
              <p className="text-xs mt-2">A petição será baseada em todas as informações coletadas nas etapas anteriores</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {petitionText && (
        <div className="grid md:grid-cols-2 gap-4">
          <Button
            onClick={handleGeneratePDF}
            className="gradient-primary h-14"
            size="lg"
          >
            <FileText className="h-5 w-5 mr-2" />
            Gerar Petição em PDF
          </Button>
          <Button
            onClick={handleDownloadPackage}
            variant="outline"
            className="h-14"
            size="lg"
          >
            <Download className="h-5 w-5 mr-2" />
            Baixar Pacote TRT Completo
          </Button>
        </div>
      )}

      {/* Instructions */}
      <Card className="bg-secondary">
        <CardHeader>
          <CardTitle className="text-base">Próximos Passos</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">1.</span>
              <span>Revise cuidadosamente todos os dados da petição</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">2.</span>
              <span>Faça o download do pacote completo (petição + provas + planilha)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">3.</span>
              <span>Acesse o site do TRT da sua região para protocolo eletrônico</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">4.</span>
              <span>Acompanhe o processo pelo número do protocolo</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Legal Notice */}
      <Card className="border-warning">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Importante:</strong> Esta é uma petição gerada automaticamente. Você está exercendo 
            seu direito de jus postulandi garantido pela CLT. Para recursos ao TST, será necessário 
            contratar advogado. Consulte sempre as orientações específicas do TRT da sua região.
          </p>
        </CardContent>
      </Card>

      <HelpVideoDialog
        open={showHelpVideo}
        onOpenChange={setShowHelpVideo}
        stepName="Revisão"
        stepId="review"
      />
    </div>
  );
};
