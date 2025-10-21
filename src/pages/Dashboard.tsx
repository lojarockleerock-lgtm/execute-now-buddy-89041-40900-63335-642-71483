import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar, User, Trash2, Eye } from "lucide-react";
import { getAllCases, deleteCase, formatCurrency, type SavedCase } from "@/lib/caseStorage";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const [cases, setCases] = useState<SavedCase[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = () => {
    const allCases = getAllCases();
    setCases(allCases);
  };

  const handleDeleteCase = (id: string) => {
    if (deleteCase(id)) {
      loadCases();
      toast({
        title: "Caso excluído",
        description: "O caso foi removido com sucesso.",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary";
      case "generated":
        return "default";
      case "filed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "draft":
        return "Rascunho";
      case "generated":
        return "Petição Gerada";
      case "filed":
        return "Protocolado";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Minhas Petições</h1>
          <p className="text-muted-foreground">
            Gerencie suas ações trabalhistas e acompanhe o progresso
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link to="/case/new" className="block">
            <Card className="card-elevated cursor-pointer hover:shadow-xl transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Nova Petição</h3>
                    <p className="text-sm text-muted-foreground">Criar ação trabalhista</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold">{cases.length}</h3>
                  <p className="text-sm text-muted-foreground">Casos Ativos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <h3 className="font-semibold">0</h3>
                  <p className="text-sm text-muted-foreground">Prazos Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cases List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">Suas Petições</h2>
          
          {cases.length === 0 ? (
            <Card className="card-elevated">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Nenhuma petição ainda</h3>
                <p className="text-muted-foreground mb-6">
                  Comece criando sua primeira ação trabalhista
                </p>
                <Link to="/case/new">
                  <Button className="gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Nova Petição
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            cases.map((caseItem) => (
              <Card key={caseItem.id} className="card-elevated">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{caseItem.title}</CardTitle>
                      <CardDescription className="mt-2">
                        Criado em {new Date(caseItem.createdAt).toLocaleDateString("pt-BR")}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusColor(caseItem.status)}>
                      {getStatusText(caseItem.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Valor estimado</p>
                      <p className="text-xl font-bold text-primary">{formatCurrency(caseItem.value)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/case/edit/${caseItem.id}`}>
                        <Button variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir este caso? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteCase(caseItem.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
