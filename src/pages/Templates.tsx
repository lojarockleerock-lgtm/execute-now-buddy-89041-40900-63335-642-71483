import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Scale, FileText, Eye, Download, Search, Filter, Clock, Briefcase, Heart, Users, DollarSign, Shield } from "lucide-react";
import { useState } from "react";

const TEMPLATES = [
  {
    id: 1,
    title: "Horas Extras Não Pagas",
    category: "Jornada",
    description: "Modelo para reclamar horas extras trabalhadas sem o devido adicional",
    baseLegal: ["Art. 59 CLT", "Art. 7º CF/88"],
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Adicional Noturno",
    category: "Jornada",
    description: "Petição para adicional noturno não pago (trabalho entre 22h e 5h)",
    baseLegal: ["Art. 73 CLT"],
    color: "bg-blue-500"
  },
  {
    id: 3,
    title: "Assédio Moral",
    category: "Danos Morais",
    description: "Casos de constrangimento e humilhação no ambiente de trabalho",
    baseLegal: ["Art. 5º CF/88", "Arts. 186 e 927 CC"],
    color: "bg-red-500"
  },
  {
    id: 4,
    title: "Pejotização",
    category: "Vínculo",
    description: "Para casos onde o empregador mascarou vínculo empregatício com PJ",
    baseLegal: ["Art. 9º CLT", "Art. 3º CLT"],
    color: "bg-purple-500"
  },
  {
    id: 5,
    title: "Despedida Indireta",
    category: "Rescisão",
    description: "Quando o empregador descumpre obrigações contratuais graves",
    baseLegal: ["Art. 483 CLT"],
    color: "bg-orange-500"
  },
  {
    id: 6,
    title: "Falta de Registro em CTPS",
    category: "Vínculo",
    description: "Para reconhecimento de vínculo empregatício sem registro",
    baseLegal: ["Art. 29 CLT"],
    color: "bg-purple-500"
  },
  {
    id: 7,
    title: "FGTS Não Depositado",
    category: "Verbas",
    description: "Cobrança de FGTS não recolhido e multa de 40%",
    baseLegal: ["Lei 8.036/90"],
    color: "bg-green-500"
  },
  {
    id: 8,
    title: "Férias Não Pagas",
    category: "Verbas",
    description: "Férias vencidas e proporcionais não quitadas",
    baseLegal: ["Arts. 129–153 CLT"],
    color: "bg-green-500"
  },
  {
    id: 9,
    title: "13º Salário Não Pago",
    category: "Verbas",
    description: "13º salário não pago ou pago incorretamente",
    baseLegal: ["Lei 4.090/62"],
    color: "bg-green-500"
  },
  {
    id: 10,
    title: "Multas dos Arts. 467 e 477",
    category: "Multas",
    description: "Verbas rescisórias não pagas no prazo",
    baseLegal: ["Arts. 467 e 477 CLT"],
    color: "bg-yellow-500"
  },
  {
    id: 11,
    title: "Adicional de Insalubridade",
    category: "Adicionais",
    description: "Trabalho em condições insalubres sem o devido adicional",
    baseLegal: ["Arts. 189–192 CLT"],
    color: "bg-amber-500"
  },
  {
    id: 12,
    title: "Adicional de Periculosidade",
    category: "Adicionais",
    description: "Trabalho em condições perigosas sem o adicional de 30%",
    baseLegal: ["Art. 193 CLT"],
    color: "bg-amber-500"
  }
];

const CATEGORIES = ["Todos", "Jornada", "Danos Morais", "Vínculo", "Rescisão", "Verbas", "Multas", "Adicionais"];

const Templates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredTemplates = TEMPLATES.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Petição Trabalhista Digital</span>
          </Link>
          <div className="flex gap-4">
            <Link to="/help">
              <Button variant="ghost">Ajuda</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Modelos</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Petições prontas baseadas na CLT para os principais direitos trabalhistas
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="transition-all"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id} 
              className="relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              <Badge className={`absolute top-4 right-4 ${template.color} text-white border-0`}>
                {template.category}
              </Badge>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-lg pr-20">{template.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {template.description}
                </CardDescription>
                
                <div className="flex flex-wrap gap-1">
                  {template.baseLegal.map((lei, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {lei}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    Baixar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How to Use Section */}
        <Card className="mb-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Como Usar os Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                  1
                </div>
                <p className="text-sm font-medium">Escolha o template que corresponde ao seu caso</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                  2
                </div>
                <p className="text-sm font-medium">Use nosso sistema de criação de petição para preencher automaticamente</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                  3
                </div>
                <p className="text-sm font-medium">O sistema adaptará o template aos seus dados específicos</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto">
                  4
                </div>
                <p className="text-sm font-medium">Revise e ajuste conforme necessário antes de gerar o PDF final</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
            <h3 className="text-2xl font-bold mb-3">Pronto para começar?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Utilize nossos templates profissionais e crie sua petição trabalhista em minutos
            </p>
            <Link to="/case/new">
              <Button size="lg" className="text-lg px-8">
                🚀 Começar Agora
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Templates;
