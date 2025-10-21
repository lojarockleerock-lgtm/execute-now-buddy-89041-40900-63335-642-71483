import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Check, Scale } from "lucide-react";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Perfeito para começar",
    features: [
      "1 petição por mês",
      "Modelos básicos",
      "Suporte por e-mail",
      "Validade de 30 dias",
    ],
    limitations: [
      "Sem cálculos automáticos",
      "Sem assistência de IA",
    ],
    buttonText: "Começar Grátis",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Básico",
    price: "R$ 49",
    period: "/mês",
    description: "Para casos simples",
    features: [
      "5 petições por mês",
      "Todos os modelos",
      "Cálculos automáticos",
      "Suporte prioritário",
      "Validade de 90 dias",
      "Download em PDF",
    ],
    buttonText: "Assinar Básico",
    buttonVariant: "outline" as const,
    popular: false,
  },
  {
    name: "Profissional",
    price: "R$ 99",
    period: "/mês",
    description: "Ideal para profissionais",
    features: [
      "20 petições por mês",
      "Todos os modelos premium",
      "Assistência de IA avançada",
      "Cálculos complexos automáticos",
      "Suporte 24/7",
      "Armazenamento ilimitado",
      "Revisão por especialistas",
      "Validade ilimitada",
    ],
    buttonText: "Assinar Profissional",
    buttonVariant: "default" as const,
    popular: true,
  },
  {
    name: "Premium",
    price: "R$ 199",
    period: "/mês",
    description: "Para alto volume",
    features: [
      "Petições ilimitadas",
      "Todos os recursos profissionais",
      "Consultoria jurídica inclusa",
      "API para integração",
      "Gestor de clientes",
      "Múltiplos usuários",
      "Treinamento personalizado",
      "Gerente de conta dedicado",
    ],
    buttonText: "Assinar Premium",
    buttonVariant: "default" as const,
    popular: false,
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex justify-center mb-4">
            <Scale className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Escolha o Plano Ideal
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Receba até 30% a mais com nossa plataforma. Exerça seu direito de jus postulandi com segurança e praticidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`relative flex flex-col ${
                plan.popular 
                  ? 'border-primary shadow-lg shadow-primary/20 card-elevated' 
                  : 'border-border'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="mb-4">{plan.description}</CardDescription>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation) => (
                    <li key={limitation} className="flex items-start gap-2 opacity-50">
                      <span className="h-5 w-5 flex-shrink-0 mt-0.5 text-center">—</span>
                      <span className="text-sm line-through">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  asChild
                  variant={plan.buttonVariant}
                  className={`w-full ${plan.popular ? 'gradient-primary' : ''}`}
                >
                  <Link to="/signup">
                    {plan.buttonText}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Todos os planos incluem atualizações automáticas e conformidade com a legislação trabalhista vigente
          </p>
          <Link to="/help">
            <Button variant="link" className="text-primary">
              Dúvidas sobre os planos? Entre em contato
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;