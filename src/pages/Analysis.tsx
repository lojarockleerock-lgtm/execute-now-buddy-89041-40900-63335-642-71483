import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart3, 
  FileText, 
  RefreshCw, 
  Download, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp,
  Scale,
  Lightbulb
} from "lucide-react";
import { getAllCases, type SavedCase } from "@/lib/caseStorage";
import { consultarDataJud, type AnalysisResult } from "@/lib/datajudService";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

const Analysis = () => {
  const [selectedCase, setSelectedCase] = useState<SavedCase | null>(null);
  const [cases, setCases] = useState<SavedCase[]>([]);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const allCases = getAllCases();
    setCases(allCases);
    
    // Selecionar o caso mais recente automaticamente
    if (allCases.length > 0) {
      setSelectedCase(allCases[0]);
    }
  }, []);

  useEffect(() => {
    if (selectedCase) {
      analisarCaso();
    }
  }, [selectedCase]);

  const analisarCaso = async () => {
    if (!selectedCase || !selectedCase.data.claims || selectedCase.data.claims.length === 0) {
      toast({
        title: "Nenhum pedido encontrado",
        description: "Este caso não possui pedidos para analisar.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setAnalysisResults([]);

    try {
      const tribunal = selectedCase.data.qualification?.tribunal || "TRT-2";
      const resultados: AnalysisResult[] = [];

      for (const pedido of selectedCase.data.claims) {
        const resultado = await consultarDataJud({ 
          pedido,
          tribunal 
        });
        resultados.push(resultado);
        // Atualizar progressivamente
        setAnalysisResults([...resultados]);
      }

      toast({
        title: "Análise concluída",
        description: `${resultados.length} pedidos analisados com sucesso.`
      });
    } catch (error) {
      toast({
        title: "Erro na análise",
        description: "Não foi possível completar a análise. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const gerarRelatorioPDF = () => {
    if (!selectedCase || analysisResults.length === 0) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Título
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Relatório de Viabilidade", pageWidth / 2, y, { align: "center" });
    
    y += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(selectedCase.title, pageWidth / 2, y, { align: "center" });
    
    y += 15;
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 15, y);
    
    y += 15;

    // Análises
    analysisResults.forEach((resultado, index) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${resultado.pedido}`, 15, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      doc.text(`Probabilidade de deferimento: ${resultado.probabilidade}%`, 20, y);
      y += 6;
      
      doc.text(`Base: ${resultado.baseComparacao}`, 20, y);
      y += 6;
      
      doc.text(`Fundamentos: ${resultado.artigosCLT.join(", ")}`, 20, y);
      y += 8;

      doc.setFont("helvetica", "italic");
      const resumoLines = doc.splitTextToSize(resultado.resumoJurisprudencia, pageWidth - 30);
      doc.text(resumoLines, 20, y);
      y += resumoLines.length * 6 + 5;

      if (resultado.recomendacoes.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.text("Recomendações:", 20, y);
        y += 6;
        
        doc.setFont("helvetica", "normal");
        resultado.recomendacoes.forEach(rec => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          const recLines = doc.splitTextToSize(`• ${rec}`, pageWidth - 35);
          doc.text(recLines, 25, y);
          y += recLines.length * 5 + 2;
        });
      }

      y += 10;
    });

    // Disclaimer
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    y += 10;
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 100, 100);
    const disclaimer = doc.splitTextToSize(
      "Os resultados são estimativos e baseados em dados públicos do CNJ. Não constituem aconselhamento jurídico.",
      pageWidth - 30
    );
    doc.text(disclaimer, 15, y);

    doc.save(`analise-viabilidade-${selectedCase.id}.pdf`);
    
    toast({
      title: "Relatório gerado",
      description: "O PDF foi baixado com sucesso."
    });
  };

  const getProbabilidadeColor = (prob: number) => {
    if (prob >= 75) return "text-success";
    if (prob >= 50) return "text-warning";
    return "text-destructive";
  };

  const getProbabilidadeVariant = (prob: number): "default" | "secondary" | "destructive" => {
    if (prob >= 75) return "default";
    if (prob >= 50) return "secondary";
    return "destructive";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold">Análise de Viabilidade</h1>
          </div>
          <p className="text-muted-foreground">
            Compare seus pedidos com decisões reais da Justiça do Trabalho
          </p>
        </div>

        {/* Case Selector */}
        {cases.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Você ainda não possui casos cadastrados. Crie uma petição primeiro para poder analisá-la.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <Card className="card-elevated mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Caso Selecionado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">{selectedCase?.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedCase?.data.claims?.length || 0} pedidos para analisar
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={analisarCaso} 
                      disabled={loading}
                      variant="outline"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                      Atualizar Análise
                    </Button>
                    {analysisResults.length > 0 && (
                      <Button onClick={gerarRelatorioPDF} className="gradient-primary">
                        <Download className="h-4 w-4 mr-2" />
                        Gerar Relatório PDF
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {loading && analysisResults.length === 0 ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="card-elevated">
                    <CardContent className="pt-6">
                      <Skeleton className="h-40 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : analysisResults.length > 0 ? (
              <div className="space-y-6">
                {/* Summary Card */}
                <Card className="card-elevated bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <Scale className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm text-muted-foreground">Média de Sucesso</p>
                        <p className="text-3xl font-bold text-primary">
                          {Math.round(analysisResults.reduce((acc, r) => acc + r.probabilidade, 0) / analysisResults.length)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-success" />
                        <p className="text-sm text-muted-foreground">Pedidos Viáveis</p>
                        <p className="text-3xl font-bold text-success">
                          {analysisResults.filter(r => r.probabilidade >= 70).length}
                        </p>
                      </div>
                      <div className="text-center">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Total Analisados</p>
                        <p className="text-3xl font-bold">
                          {analysisResults.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual Analysis Cards */}
                {analysisResults.map((resultado, index) => (
                  <Card key={index} className="card-elevated">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 mb-2">
                            {resultado.probabilidade >= 75 ? (
                              <CheckCircle2 className="h-5 w-5 text-success" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-warning" />
                            )}
                            {resultado.pedido}
                          </CardTitle>
                          <CardDescription>
                            Base: {resultado.baseComparacao}
                          </CardDescription>
                        </div>
                        <Badge variant={getProbabilidadeVariant(resultado.probabilidade)}>
                          {resultado.probabilidade}% de sucesso
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Probabilidade de Deferimento</span>
                          <span className={`text-sm font-bold ${getProbabilidadeColor(resultado.probabilidade)}`}>
                            {resultado.probabilidade}%
                          </span>
                        </div>
                        <Progress value={resultado.probabilidade} className="h-3" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>{resultado.casosProcedentes} procedentes</span>
                          <span>{resultado.casosImprocedentes} improcedentes</span>
                        </div>
                      </div>

                      {/* Legal Foundation */}
                      {resultado.artigosCLT.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold mb-2">Fundamentos Legais:</p>
                          <div className="flex flex-wrap gap-2">
                            {resultado.artigosCLT.map((artigo, i) => (
                              <Badge key={i} variant="outline">{artigo}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Jurisprudence Summary */}
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <Scale className="h-4 w-4" />
                          Resumo Jurisprudencial
                        </p>
                        <p className="text-sm text-muted-foreground italic">
                          {resultado.resumoJurisprudencia}
                        </p>
                      </div>

                      {/* Recommendations */}
                      {resultado.recomendacoes.length > 0 && (
                        <div>
                          <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-warning" />
                            Recomendações para Fortalecer o Pedido
                          </p>
                          <ul className="space-y-2">
                            {resultado.recomendacoes.map((rec, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <span className="text-primary font-bold">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {/* Disclaimer */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Importante:</strong> Os resultados são estimativos e baseados em dados públicos do CNJ.
                    Não constituem aconselhamento jurídico. Recomenda-se consultar um advogado para análise específica do seu caso.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <Card className="card-elevated">
                <CardContent className="py-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aguardando Análise</h3>
                  <p className="text-muted-foreground mb-6">
                    Clique em "Atualizar Análise" para consultar a base de jurisprudência
                  </p>
                  <Button onClick={analisarCaso} className="gradient-primary">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Iniciar Análise
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Analysis;
