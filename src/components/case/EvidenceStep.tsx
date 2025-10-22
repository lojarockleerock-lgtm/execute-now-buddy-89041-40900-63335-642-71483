import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, Image, Film, Mic, Trash2, CheckCircle, ChevronDown, AlertCircle, Lightbulb, Clock, Calendar, Users, MessageSquare, Heart, AlertTriangle, Camera, Receipt, IdCard, BookOpen, Video } from "lucide-react";
import { toast } from "sonner";
import { getSuggestedEvidencesForClaim } from "@/lib/evidenceSuggestions";
import HelpVideoDialog from "./HelpVideoDialog";

interface EvidenceStepProps {
  data: any[];
  onChange: (data: any[]) => void;
  claimsData?: any[];
}

const iconMap: Record<string, any> = {
  Clock, Calendar, Users, MessageSquare, Heart, AlertTriangle, Camera, Receipt, IdCard, BookOpen, FileText, Mic, Film, Image
};

export const EvidenceStep = ({ data, onChange, claimsData = [] }: EvidenceStepProps) => {
  const [evidences, setEvidences] = useState(data || []);
  const [expandedClaims, setExpandedClaims] = useState<string[]>([]);
  const [showHelpVideo, setShowHelpVideo] = useState(false);

  useEffect(() => {
    setEvidences(data || []);
  }, [data]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, claimId?: string) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const hash = await generateHash(arrayBuffer);
        
        const newEvidence = {
          id: Date.now() + Math.random(),
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          hash: hash,
          uploadDate: new Date().toISOString(),
          description: "",
          category: getFileCategory(file.type),
          linkedClaim: claimId || "",
        };

        const updated = [...evidences, newEvidence];
        setEvidences(updated);
        onChange(updated);
        toast.success(`Arquivo "${file.name}" adicionado com sucesso`);
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const generateHash = async (buffer: ArrayBuffer): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const getFileCategory = (type: string): string => {
    if (type.includes('image')) return 'Imagem';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('video')) return 'Vídeo';
    if (type.includes('audio')) return 'Áudio';
    return 'Documento';
  };

  const getFileIcon = (category: string) => {
    switch (category) {
      case 'Imagem': return <Image className="h-5 w-5" />;
      case 'PDF': return <FileText className="h-5 w-5" />;
      case 'Vídeo': return <Film className="h-5 w-5" />;
      case 'Áudio': return <Mic className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const removeEvidence = (id: number) => {
    const updated = evidences.filter((e) => e.id !== id);
    setEvidences(updated);
    onChange(updated);
    toast.success("Prova removida");
  };

  const updateEvidence = (id: number, field: string, value: string) => {
    const updated = evidences.map((e) =>
      e.id === id ? { ...e, [field]: value } : e
    );
    setEvidences(updated);
    onChange(updated);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const toggleClaimExpansion = (claimId: string) => {
    setExpandedClaims(prev => 
      prev.includes(claimId) 
        ? prev.filter(id => id !== claimId)
        : [...prev, claimId]
    );
  };

  const getEvidencesForClaim = (claimId: string) => {
    return evidences.filter(e => e.linkedClaim === claimId);
  };

  const getProgressForClaim = (claimId: string, suggestedCount: number) => {
    const attachedCount = getEvidencesForClaim(claimId).length;
    if (suggestedCount === 0) return 0;
    return Math.min((attachedCount / suggestedCount) * 100, 100);
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : <FileText className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Gestão de Provas e Documentos</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Organize suas provas por pedido. O sistema sugere automaticamente os documentos mais relevantes.
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              📎 <strong>Dica:</strong> Quanto mais provas, melhor! Anexe fotos, PDFs, áudios, mensagens de WhatsApp, e-mails. Cada prova deve ter uma descrição clara explicando o que ela comprova.
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

      {/* Cards por Pedido */}
      {claimsData && claimsData.length > 0 ? (
        <div className="space-y-4">
          {claimsData.map((claim) => {
            const suggestedEvidences = getSuggestedEvidencesForClaim(claim.type || claim.id);
            const claimEvidences = getEvidencesForClaim(claim.id);
            const progress = getProgressForClaim(claim.id, suggestedEvidences.length);
            const isExpanded = expandedClaims.includes(claim.id);

            return (
              <Card key={claim.id} className="border-2">
                <Collapsible open={isExpanded} onOpenChange={() => toggleClaimExpansion(claim.id)}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg">{claim.label || claim.title}</CardTitle>
                          <Badge variant={claimEvidences.length > 0 ? "default" : "outline"}>
                            {claimEvidences.length} {claimEvidences.length === 1 ? "prova" : "provas"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Progress value={progress} className="h-2 flex-1" />
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {Math.round(progress)}%
                          </span>
                        </div>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </CardHeader>

                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      {/* Sugestões de Provas */}
                      {suggestedEvidences.length > 0 && (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                          <div className="flex items-start gap-2 mb-3">
                            <Lightbulb className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h4 className="font-semibold text-sm">Provas Sugeridas</h4>
                              <p className="text-xs text-muted-foreground">
                                Documentos recomendados para este pedido
                              </p>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            {suggestedEvidences.map((suggested, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-sm">
                                <div className="mt-0.5">{getIconComponent(suggested.icon)}</div>
                                <div className="flex-1">
                                  <div className="font-medium">{suggested.label}</div>
                                  <div className="text-xs text-muted-foreground">{suggested.description}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upload Area */}
                      <div className="border-2 border-dashed rounded-lg p-4">
                        <div className="flex flex-col items-center justify-center py-4">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <h4 className="font-medium text-sm mb-1">Adicionar Provas</h4>
                          <p className="text-xs text-muted-foreground mb-3 text-center">
                            Arraste arquivos aqui ou clique para selecionar
                          </p>
                          <Input
                            type="file"
                            multiple
                            onChange={(e) => handleFileUpload(e, claim.id)}
                            className="max-w-xs"
                            accept="image/*,application/pdf,.doc,.docx,audio/*,video/*"
                          />
                          <p className="text-xs text-muted-foreground mt-2">
                            PDF, Imagens, Áudios, Vídeos (Max: 20MB)
                          </p>
                        </div>
                      </div>

                      {/* Provas Anexadas */}
                      {claimEvidences.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm">Provas Anexadas</h4>
                          {claimEvidences.map((evidence) => (
                            <Card key={evidence.id} className="bg-muted/30">
                              <CardContent className="pt-4">
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                      <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary">
                                        {getFileIcon(evidence.category)}
                                      </div>
                                      <div>
                                        <h5 className="font-medium text-sm">{evidence.fileName}</h5>
                                        <div className="flex items-center gap-2 mt-1">
                                          <Badge variant="outline" className="text-xs">{evidence.category}</Badge>
                                          <span className="text-xs text-muted-foreground">
                                            {formatFileSize(evidence.fileSize)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <Button
                                      onClick={() => removeEvidence(evidence.id)}
                                      variant="ghost"
                                      size="sm"
                                    >
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-xs">Descrição da Prova</Label>
                                    <Textarea
                                      placeholder="Ex: Holerite do mês de janeiro mostrando horas extras não pagas"
                                      value={evidence.description}
                                      onChange={(e) =>
                                        updateEvidence(evidence.id, "description", e.target.value)
                                      }
                                      rows={2}
                                      className="text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                      Hash SHA-256: <code className="text-xs bg-background px-1 rounded">{evidence.hash.slice(0, 16)}...</code>
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h4 className="font-semibold mb-2">Nenhum pedido adicionado</h4>
              <p className="text-sm text-muted-foreground">
                Primeiro, adicione pedidos na aba "Pedidos" para organizar suas provas automaticamente.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documentos Recomendados Gerais */}
      <Card className="bg-secondary/50">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Documentos Gerais Recomendados
          </h4>
          <div className="grid md:grid-cols-2 gap-2">
            {[
              "Carteira de Trabalho (CTPS)",
              "Holerites (contracheques)",
              "Comprovantes de FGTS",
              "Termo de rescisão",
              "Mensagens (WhatsApp, e-mails)",
              "Fotos do ambiente de trabalho",
              "Testemunhos ou declarações",
              "Atestados médicos",
            ].map((doc, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-3 w-3 text-muted-foreground" />
                <span>{doc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Aviso Legal */}
      <Card className="bg-warning/10 border-warning">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-2 text-warning-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Aviso Legal
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Todas as provas devem ser obtidas de forma lícita</li>
            <li>• Não edite ou altere documentos originais</li>
            <li>• Gravações: você pode gravar conversas em que participa</li>
            <li>• Mantenha sempre os arquivos originais</li>
            <li>• O hash garante a integridade dos arquivos</li>
          </ul>
        </CardContent>
      </Card>

      <HelpVideoDialog
        open={showHelpVideo}
        onOpenChange={setShowHelpVideo}
        stepName="Provas"
        stepId="evidence"
      />
    </div>
  );
};
