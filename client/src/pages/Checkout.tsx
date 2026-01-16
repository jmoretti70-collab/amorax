import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Check, 
  Crown, 
  Star, 
  Sparkles,
  ArrowLeft,
  Loader2,
  CreditCard,
  Shield
} from "lucide-react";

const PLANS = [
  {
    id: "basic",
    name: "Básico",
    description: "Ideal para começar",
    prices: {
      monthly: 49,
    },
    features: [
      "Perfil completo",
      "Até 5 fotos",
      "Contato via WhatsApp",
      "Listagem padrão",
    ],
    icon: Star,
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Mais visibilidade",
    prices: {
      monthly: 99,
      quarterly: 249,
      yearly: 799,
    },
    features: [
      "Tudo do Básico",
      "Até 15 fotos",
      "2 vídeos",
      "Destaque na listagem",
      "Badge Premium",
      "Estatísticas de visualização",
    ],
    icon: Crown,
    popular: true,
  },
  {
    id: "vip",
    name: "VIP",
    description: "Máxima exposição",
    prices: {
      monthly: 199,
      quarterly: 499,
      yearly: 1599,
    },
    features: [
      "Tudo do Premium",
      "Fotos ilimitadas",
      "Vídeos ilimitados",
      "Topo da listagem",
      "Badge VIP exclusivo",
      "Suporte prioritário",
      "Destaque no mapa",
    ],
    icon: Sparkles,
    popular: false,
  },
];

type BillingInterval = "monthly" | "quarterly" | "yearly";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string>("premium");
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("monthly");
  const [isProcessing, setIsProcessing] = useState(false);

  const createCheckout = trpc.payments.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.success("Redirecionando para o checkout...");
        window.open(data.checkoutUrl, "_blank");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao criar sessão de checkout");
      setIsProcessing(false);
    },
  });

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para assinar um plano");
      return;
    }

    setIsProcessing(true);
    
    createCheckout.mutate({
      plan: selectedPlan as "premium" | "vip",
      interval: billingInterval,
    });
  };

  const getPrice = (plan: typeof PLANS[0], interval: BillingInterval) => {
    if (interval === "monthly") return plan.prices.monthly;
    if (interval === "quarterly") return plan.prices.quarterly || plan.prices.monthly * 3;
    return plan.prices.yearly || plan.prices.monthly * 12;
  };

  const getMonthlyEquivalent = (plan: typeof PLANS[0], interval: BillingInterval) => {
    const total = getPrice(plan, interval);
    if (interval === "monthly") return total;
    if (interval === "quarterly") return Math.round(total / 3);
    return Math.round(total / 12);
  };

  const getDiscount = (plan: typeof PLANS[0], interval: BillingInterval) => {
    if (interval === "monthly") return 0;
    const monthlyTotal = plan.prices.monthly * (interval === "quarterly" ? 3 : 12);
    const actualPrice = getPrice(plan, interval);
    return Math.round(((monthlyTotal - actualPrice) / monthlyTotal) * 100);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Amorax" className="w-10 h-10 rounded-lg object-cover" style={{width: '80px', height: '80px'}} />
              <span className="text-xl font-bold text-gradient">Amorax</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Escolha seu Plano</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Aumente sua visibilidade e conquiste mais clientes com nossos planos premium
          </p>
        </div>

        {/* Billing Interval Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-border p-1 bg-muted/50">
            <button
              onClick={() => setBillingInterval("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingInterval("quarterly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === "quarterly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Trimestral
              <Badge variant="secondary" className="ml-2 text-xs">-16%</Badge>
            </button>
            <button
              onClick={() => setBillingInterval("yearly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === "yearly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Anual
              <Badge variant="secondary" className="ml-2 text-xs">-33%</Badge>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            const price = getPrice(plan, billingInterval);
            const monthlyEquivalent = getMonthlyEquivalent(plan, billingInterval);
            const discount = getDiscount(plan, billingInterval);
            const hasInterval = plan.id !== "basic" || billingInterval === "monthly";

            return (
              <Card
                key={plan.id}
                className={`relative cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                } ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
                onClick={() => hasInterval && setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    plan.id === "vip" ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
                    plan.id === "premium" ? "bg-primary" : "bg-muted"
                  }`}>
                    <Icon className={`h-6 w-6 ${plan.id === "basic" ? "text-foreground" : "text-white"}`} />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    {!hasInterval ? (
                      <p className="text-muted-foreground text-sm">Apenas mensal</p>
                    ) : (
                      <>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold">R$ {price}</span>
                          <span className="text-muted-foreground">
                            /{billingInterval === "monthly" ? "mês" : billingInterval === "quarterly" ? "trim" : "ano"}
                          </span>
                        </div>
                        {billingInterval !== "monthly" && discount > 0 && (
                          <p className="text-sm text-primary mt-1">
                            R$ {monthlyEquivalent}/mês • Economia de {discount}%
                          </p>
                        )}
                      </>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Checkout Button */}
        <div className="max-w-md mx-auto">
          <Button
            size="lg"
            className="w-full text-lg py-6"
            onClick={handleCheckout}
            disabled={isProcessing || !isAuthenticated}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Assinar {PLANS.find(p => p.id === selectedPlan)?.name} - R$ {getPrice(PLANS.find(p => p.id === selectedPlan)!, billingInterval)}
              </>
            )}
          </Button>
          
          {!isAuthenticated && (
            <p className="text-center text-muted-foreground mt-4">
              <Link href="/" className="text-primary hover:underline">
                Faça login
              </Link>{" "}
              para assinar um plano
            </p>
          )}

          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Pagamento seguro via Stripe</span>
          </div>
        </div>
      </main>
    </div>
  );
}
