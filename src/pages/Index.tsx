import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, FileText, Calculator, Shield, Users, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import TypeWriter from "@/components/TypeWriter";

const Index = () => {
  const rightsCarousel = [
    "Horas Extras Não Pagas",
    "Adicional Noturno",
    "Férias Não Concedidas",
    "13º Salário Atrasado",
    "FGTS Não Depositado",
    "Assédio Moral",
    "Pejotização Irregular",
    "Despedida Indireta",
    "Falta de Registro CTPS",
    "Multas Art. 467/477",
    "Adicional de Insalubridade",
    "Adicional de Periculosidade",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-white/80 backdrop-blur-sm fixed w-full z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">Petição Trabalhista Digital</span>
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <Link to="/help">
              <Button variant="ghost" className="text-foreground hover:text-primary">Ajuda</Button>
            </Link>
            <Link to="/templates">
              <Button variant="ghost" className="text-foreground hover:text-primary">Modelos</Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" className="text-foreground hover:text-primary">Login</Button>
            </Link>
            <Link to="/signup">
              <Button className="gradient-primary text-white font-semibold px-6">
                Teste GRÁTIS agora
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-6xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-fade-in-up">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">Tecnologia para seus direitos trabalhistas</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground leading-tight animate-fade-in-up min-h-[180px] md:min-h-[240px]">
            <TypeWriter 
              text="Ação trabalhista sem advogado crie sua petição em minutos" 
              speed={50}
              className="text-gradient"
            />
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto animate-fade-in-up">
            Receba até 30% a mais. Com nossa plataforma você exerce seu direito de jus postulandi com segurança e praticidade.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap animate-fade-in-up">
            <Link to="/signup">
              <Button size="lg" className="gradient-primary text-white text-lg px-8 py-6 font-semibold shadow-purple hover:shadow-xl transition-all">
                TESTE GRÁTIS AGORA
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Scrolling Rights Carousel */}
        <div className="mt-16 overflow-hidden relative">
          <div className="flex gap-4 animate-slide-left whitespace-nowrap">
            {[...rightsCarousel, ...rightsCarousel].map((right, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full border border-border shadow-sm"
              >
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">{right}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <Card className="card-elevated border-2 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Scale className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-semibold text-primary">Reclamação Trabalhista</span>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p className="font-bold text-foreground">EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DA [X]ª VARA DO TRABALHO DE [CIDADE/ESTADO]</p>
                    <p className="leading-relaxed">
                      [Nome do Autor], [nacionalidade], [estado civil], [profissão], portador da Carteira de Identidade nº [número], inscrito no CPF sob o nº [número], residente e domiciliado na [endereço completo], vem, respeitosamente, à presença de Vossa Excelência, por intermédio de seu advogado que esta subscreve...
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-xs text-primary font-medium">Gerado automaticamente</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Petição pronta <span className="text-gradient">em minutos</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Não perca mais tempo criando suas peças e fuja dos modelos prontos. 
                Com a nossa plataforma você gera petições completas, personalizadas e 
                com fundamentação legal sólida em apenas alguns minutos.
              </p>
              <Link to="/signup">
                <Button className="gradient-primary text-white font-semibold px-6">
                  Começar agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 gradient-hero">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Três passos simples para criar sua petição trabalhista profissional
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-elevated border-none bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div className="text-primary font-bold text-lg mb-2">01</div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Preencha os Dados</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Responda perguntas simples sobre sua situação trabalhista. 
                  Nosso sistema guia você passo a passo de forma intuitiva.
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated border-none bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
                  <Calculator className="h-8 w-8 text-white" />
                </div>
                <div className="text-primary font-bold text-lg mb-2">02</div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Cálculos Automáticos</h3>
                <p className="text-muted-foreground leading-relaxed">
                  O sistema calcula automaticamente verbas rescisórias, horas extras, 
                  FGTS e todos os valores devidos com precisão.
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated border-none bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
                  <Scale className="h-8 w-8 text-white" />
                </div>
                <div className="text-primary font-bold text-lg mb-2">03</div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">Petição Pronta</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receba sua petição completa em PDF, com fundamentação legal 
                  robusta e pronta para protocolo no TRT.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rights Covered */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Direitos Que Você Pode Reclamar</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nossa plataforma cobre todos os principais direitos trabalhistas garantidos pela CLT
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rightsCarousel.map((right, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                <span className="text-foreground font-medium">{right}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 gradient-hero">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Por Que Escolher Nossa Plataforma</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="card-elevated border-none bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">100% Legal e Seguro</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Baseado na CLT e na Constituição Federal. Seu direito de jus postulandi 
                  é garantido até o TRT sem necessidade de advogado.
                </p>
              </CardContent>
            </Card>

            <Card className="card-elevated border-none bg-white">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Suporte Educacional</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Materiais explicativos, checklists e orientações em cada etapa. 
                  Você aprende enquanto cria sua petição.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Comece Sua Ação Trabalhista Agora</h2>
          <p className="text-xl mb-10 opacity-95">
            Gratuito para começar. Crie sua petição em minutos.
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-10 py-6 font-semibold bg-white text-primary hover:bg-white/90 shadow-xl">
              Criar Conta Gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground">Petição Trabalhista Digital</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2025 Todos os direitos reservados. Plataforma educacional baseada na CLT.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
