// Stripe Products and Prices Configuration
// These IDs should be created in Stripe Dashboard and referenced here

export const STRIPE_PRODUCTS = {
  // Premium Plan - R$ 99/mês
  PREMIUM: {
    name: "Plano Premium",
    description: "Destaque nos resultados de busca, até 15 fotos, badge verificado",
    priceMonthly: 9900, // R$ 99,00 em centavos
    priceQuarterly: 26700, // R$ 267,00 (10% desconto)
    priceYearly: 95000, // R$ 950,00 (20% desconto)
    features: [
      "Destaque nos resultados de busca",
      "Até 15 fotos no perfil",
      "Até 3 vídeos",
      "Badge de verificado",
      "Estatísticas básicas",
      "Suporte por email"
    ],
    metadata: {
      plan: "premium",
      maxPhotos: "15",
      maxVideos: "3"
    }
  },
  
  // VIP Plan - R$ 199/mês
  VIP: {
    name: "Plano VIP",
    description: "Topo da listagem, fotos ilimitadas, suporte prioritário",
    priceMonthly: 19900, // R$ 199,00 em centavos
    priceQuarterly: 53700, // R$ 537,00 (10% desconto)
    priceYearly: 191000, // R$ 1.910,00 (20% desconto)
    features: [
      "Topo da listagem",
      "Fotos ilimitadas",
      "Vídeos ilimitados",
      "Badge VIP exclusivo",
      "Estatísticas avançadas",
      "Suporte prioritário 24/7",
      "Destaque na página inicial"
    ],
    metadata: {
      plan: "vip",
      maxPhotos: "unlimited",
      maxVideos: "unlimited"
    }
  }
};

// Price IDs will be dynamically created or fetched from Stripe
// For now, we'll create checkout sessions with price_data

export type PlanType = "premium" | "vip";
export type BillingInterval = "monthly" | "quarterly" | "yearly";

export function getPlanPrice(plan: PlanType, interval: BillingInterval): number {
  const product = plan === "premium" ? STRIPE_PRODUCTS.PREMIUM : STRIPE_PRODUCTS.VIP;
  
  switch (interval) {
    case "monthly":
      return product.priceMonthly;
    case "quarterly":
      return product.priceQuarterly;
    case "yearly":
      return product.priceYearly;
    default:
      return product.priceMonthly;
  }
}

export function getPlanIntervalCount(interval: BillingInterval): number {
  switch (interval) {
    case "monthly":
      return 1;
    case "quarterly":
      return 3;
    case "yearly":
      return 12;
    default:
      return 1;
  }
}
