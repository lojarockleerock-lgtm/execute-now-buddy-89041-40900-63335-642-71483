import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Scale, BookOpen, FileText, HelpCircle, Scale as Gavel, Shield } from "lucide-react";

const Help = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Petição Trabalhista Digital</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost">Voltar ao Dashboard</Button>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">Central de Ajuda</h1>
          <p className="text-xl text-muted-foreground">
            Tudo o que você precisa saber para criar sua petição trabalhista
          </p>
        </div>

        {/* Quick Guide Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="card-elevated">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Guia Básico</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Aprenda o básico sobre jus postulandi e seus direitos trabalhistas
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Saiba quais documentos você precisa reunir para sua ação
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardHeader>
              <Gavel className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-base">Processo</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Entenda como funciona o processo trabalhista passo a passo
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
            <CardDescription>
              As dúvidas mais comuns sobre ações trabalhistas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>O que é jus postulandi?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Jus postulandi é o direito garantido pela CLT de ingressar com uma ação trabalhista 
                  sem a necessidade de contratar um advogado. Isso significa que você pode representar 
                  a si mesmo perante a Justiça do Trabalho até o Tribunal Regional do Trabalho (TRT). 
                  Para recursos ao TST, será necessário advogado.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Quais documentos preciso reunir?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Os principais documentos são: Carteira de Trabalho (CTPS), holerites, comprovantes 
                  de FGTS, termo de rescisão, mensagens de WhatsApp ou e-mails relacionados ao trabalho, 
                  fotos do ambiente, atestados médicos (se aplicável) e qualquer outro documento que 
                  comprove seus direitos.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Quanto tempo leva um processo trabalhista?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  O tempo varia muito dependendo da complexidade do caso e da vara trabalhista. 
                  Em média, processos no rito sumaríssimo (valor até 40 salários mínimos) tendem 
                  a ser mais rápidos, podendo levar de 6 meses a 1 ano. Processos ordinários podem 
                  levar mais tempo.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Posso perder a ação e ter que pagar algo?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Na Justiça do Trabalho, cada parte arca com seus próprios custos. Se você perder, 
                  não precisará pagar honorários advocatícios à parte contrária (exceto em casos de 
                  má-fé). Custas processuais geralmente são baixas e podem ser dispensadas se você 
                  não tiver condições de pagar.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Como funciona a audiência?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Normalmente há duas audiências: a primeira é de conciliação (tentativa de acordo) 
                  e instrução (apresentação de provas). Você apresentará suas provas, depoimentos 
                  e testemunhas. O juiz fará perguntas e tentará mediar um acordo. Se não houver 
                  acordo, o processo segue para julgamento.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Posso fazer acordo?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Sim! O acordo é sempre uma opção e pode ser feito a qualquer momento. Muitas 
                  empresas preferem fazer acordos para evitar custos processuais. O juiz sempre 
                  tentará conciliar as partes. Você decide se aceita ou não o acordo proposto.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>Quais são os prazos importantes?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  - Você tem até 2 anos após o fim do contrato para entrar com a ação<br/>
                  - Pode reclamar verbas dos últimos 5 anos<br/>
                  - Após a sentença, há 8 dias para recurso ordinário<br/>
                  - Para embargos de declaração: 5 dias<br/>
                  - Fique atento aos prazos que o juiz determinar para cada etapa
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>A plataforma tem custo?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  A criação da petição é gratuita. Você pode gerar sua petição, revisar e baixar 
                  o documento sem custos. Nosso objetivo é democratizar o acesso à Justiça do 
                  Trabalho através da tecnologia.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Legal Info */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle>Informações Legais Importantes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Base Legal do Jus Postulandi</h4>
              <p className="text-sm text-muted-foreground">
                O direito de representar a si mesmo na Justiça do Trabalho está previsto no 
                artigo 791 da CLT e é garantido pela Constituição Federal.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Limites do Jus Postulandi</h4>
              <p className="text-sm text-muted-foreground">
                Você pode atuar sozinho até o TRT (segunda instância). Para recursos ao TST 
                (Tribunal Superior do Trabalho), é obrigatória a presença de advogado.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Responsabilidade</h4>
              <p className="text-sm text-muted-foreground">
                Esta plataforma é uma ferramenta educacional e de auxílio. As informações 
                fornecidas não substituem aconselhamento jurídico profissional. Sempre revise 
                cuidadosamente sua petição antes de protocolar.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Pronto para começar sua ação trabalhista?
          </p>
          <Link to="/case/new">
            <Button size="lg" className="gradient-primary">
              Criar Nova Petição
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;
