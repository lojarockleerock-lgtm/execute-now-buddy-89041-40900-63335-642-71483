import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Calendar, Info, Video } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { dismissalTypes, eventTypes, getEventTypeByValue } from "@/lib/eventClaimMapping";

interface FactsStepProps {
  data: any;
  onChange: (data: any) => void;
}

export const FactsStep = ({ data, onChange }: FactsStepProps) => {
  const factsArray = Array.isArray(data) ? data : (data?.facts || []);
  const [facts, setFacts] = useState(factsArray);
  const [dismissalType, setDismissalType] = useState(
    Array.isArray(data) ? "" : (data?.dismissalType || "")
  );

  const addFact = () => {
    const newFact = {
      id: Date.now(),
      date: "",
      type: "admissao",
      description: "",
      suggestedClaims: [],
    };
    const updated = [newFact, ...facts];
    setFacts(updated);
    onChange({ facts: updated, dismissalType });
  };

  const removeFact = (id: number) => {
    const updated = facts.filter((fact) => fact.id !== id);
    setFacts(updated);
    onChange({ facts: updated, dismissalType });
  };

  const updateFact = (id: number, field: string, value: string) => {
    const updated = facts.map((fact) => {
      if (fact.id === id) {
        const updatedFact = { ...fact, [field]: value };
        
        // Se mudou o tipo de evento, atualiza a descrição sugerida e os pedidos
        if (field === "type") {
          const eventType = getEventTypeByValue(value);
          if (eventType) {
            updatedFact.description = eventType.suggestedDescription;
            updatedFact.suggestedClaims = eventType.suggestedClaims;
          }
        }
        
        return updatedFact;
      }
      return fact;
    });
    setFacts(updated);
    onChange({ facts: updated, dismissalType });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Linha do Tempo dos Fatos</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Adicione os principais eventos da sua relação de trabalho em ordem cronológica.
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mb-4">
            <p className="text-xs text-muted-foreground">
              📅 <strong>Dica:</strong> Registre TODOS os eventos importantes: admissão, mudanças de função, horas extras, acidentes, advertências, assédios, demissão. Quanto mais detalhado, melhor sua petição.
            </p>
          </div>
        </div>
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground shrink-0">
          <Video className="h-4 w-4 mr-2" />
          Veja como preencher
        </Button>
      </div>

      {/* Dismissal Type Info */}
      <Card className="bg-secondary">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-2">Tipo de Demissão</h4>
          <p className="text-xs text-muted-foreground mb-3">
            ⚖️ Esta informação determina quais direitos você tem. Escolha a opção que melhor descreve como sua relação de trabalho terminou.
          </p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dismissal_type">Forma da Demissão *</Label>
              <Select value={dismissalType} onValueChange={(value) => {
                setDismissalType(value);
                onChange({ facts, dismissalType: value });
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de demissão" />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    Demissões Regulares
                  </div>
                  {dismissalTypes.regular.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t mt-2 pt-2">
                    Período de Experiência
                  </div>
                  {dismissalTypes.probation.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {dismissalType && (
                <div className="mt-3 p-3 bg-background rounded-lg border">
                  <div className="flex gap-2 items-start">
                    <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      {[...dismissalTypes.regular, ...dismissalTypes.probation]
                        .find(t => t.value === dismissalType)?.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline Events */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">Eventos Importantes</h4>
          <Button onClick={addFact} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Evento
          </Button>
        </div>

        {facts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                Nenhum evento adicionado. Clique em "Adicionar Evento" para começar.
              </p>
            </CardContent>
          </Card>
        ) : (
          facts.map((fact) => (
            <Card key={fact.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium">Evento #{fact.id}</h5>
                    <Button
                      onClick={() => removeFact(fact.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data do Evento *</Label>
                    <Input
                      type="date"
                      value={fact.date}
                      onChange={(e) => updateFact(fact.id, "date", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Data aproximada está ok se não lembrar o dia exato</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Evento</Label>
                      <Select
                        value={fact.type}
                        onValueChange={(value) => updateFact(fact.id, "type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de evento" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {eventTypes.map((eventType) => (
                            <SelectItem key={eventType.value} value={eventType.value}>
                              <div className="flex flex-col">
                                <span className="font-medium">{eventType.label}</span>
                                <span className="text-xs text-muted-foreground">
                                  {eventType.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição do Evento *</Label>
                    <Textarea
                      placeholder="Descreva o que aconteceu..."
                      value={fact.description}
                      onChange={(e) =>
                        updateFact(fact.id, "description", e.target.value)
                      }
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 A descrição foi pré-preenchida com base no tipo de evento. Você pode editá-la livremente.
                    </p>
                  </div>
                  
                  {/* Pedidos Automáticos Sugeridos */}
                  {fact.suggestedClaims && fact.suggestedClaims.length > 0 && (
                    <div className="space-y-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" />
                        <Label className="text-sm font-semibold">Pedidos Sugeridos para este Evento</Label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {fact.suggestedClaims.map((claimId: string) => (
                          <Badge key={claimId} variant="secondary" className="text-xs">
                            {claimId}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Estes pedidos serão sugeridos automaticamente na aba "Pedidos" com base neste evento.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Importante:</strong> Registre todos os eventos relevantes como mudanças 
          de função, advertências, acidentes, assédios ou qualquer situação irregular. 
          Esses fatos serão fundamentais para sua petição.
        </p>
      </div>
    </div>
  );
};
