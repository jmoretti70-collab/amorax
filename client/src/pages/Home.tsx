import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Shield, 
  Star, 
  Heart, 
  Users, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Crown,
  Verified
} from "lucide-react";
import { Link } from "wouter";

const categories = [
  {
    id: "women",
    title: "Mulheres",
    description: "Acompanhantes femininas verificadas",
    icon: "👩",
    gradient: "from-pink-500 to-rose-600",
    count: "2.500+",
    href: "/mulheres"
  },
  {
    id: "men",
    title: "Homens",
    description: "Acompanhantes masculinos verificados",
    icon: "👨",
    gradient: "from-blue-500 to-indigo-600",
    count: "800+",
    href: "/homens"
  },
  {
    id: "trans",
    title: "Travestis",
    description: "Acompanhantes trans verificadas",
    icon: "💜",
    gradient: "from-purple-500 to-fuchsia-600",
    count: "1.200+",
    href: "/travestis"
  }
];

const features = [
  {
    icon: Shield,
    title: "Perfis Verificados",
    description: "Todos os anunciantes passam por verificação de documentos, idade e fotos reais"
  },
  {
    icon: MapPin,
    title: "Geolocalização",
    description: "Encontre acompanhantes próximos a você com busca por cidade, bairro ou proximidade"
  },
  {
    icon: Star,
    title: "Avaliações Reais",
    description: "Sistema de avaliações e comentários moderados para sua segurança"
  },
  {
    icon: Heart,
    title: "Favoritos",
    description: "Salve seus perfis favoritos e receba notificações de disponibilidade"
  }
];

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    features: ["5 fotos", "Perfil básico", "Listagem padrão"],
    popular: false
  },
  {
    name: "Premium",
    price: "R$ 99",
    period: "/mês",
    features: ["15 fotos", "3 vídeos", "Destaque na listagem", "Badge Premium", "Estatísticas"],
    popular: true
  },
  {
    name: "VIP",
    price: "R$ 199",
    period: "/mês",
    features: ["Fotos ilimitadas", "10 vídeos", "Topo da listagem", "Badge VIP", "Suporte prioritário", "Analytics avançado"],
    popular: false
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Amorax" className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-xl font-bold text-gradient">Amorax</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/mulheres" className="text-muted-foreground hover:text-foreground transition-colors">
              Mulheres
            </Link>
            <Link href="/homens" className="text-muted-foreground hover:text-foreground transition-colors">
              Homens
            </Link>
            <Link href="/travestis" className="text-muted-foreground hover:text-foreground transition-colors">
              Travestis
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button className="gradient-pink border-0" asChild>
              <Link href="/anunciar">
                <Sparkles className="w-4 h-4 mr-2" />
                Anunciar
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30">
              <Verified className="w-3 h-3 mr-1" />
              Plataforma 100% Verificada
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Encontre{" "}
              <span className="text-gradient">Acompanhantes</span>
              <br />
              Verificados e Seguros
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A plataforma mais segura do Brasil para encontrar acompanhantes. 
              Todos os perfis são verificados com documentos, idade e fotos reais.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-pink border-0 text-lg h-14 px-8">
                <MapPin className="w-5 h-5 mr-2" />
                Buscar por Localização
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-14 px-8">
                Ver Todos os Perfis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
              <div>
                <div className="text-3xl font-bold text-gradient">4.500+</div>
                <div className="text-sm text-muted-foreground">Anunciantes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient">500+</div>
                <div className="text-sm text-muted-foreground">Cidades</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient">100%</div>
                <div className="text-sm text-muted-foreground">Verificados</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Escolha sua <span className="text-gradient">Categoria</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Navegue por categoria e encontre o perfil ideal para você
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {categories.map((category) => (
              <Link key={category.id} href={category.href}>
                <Card className="profile-card p-8 text-center cursor-pointer group">
                  <div className="text-6xl mb-4">{category.icon}</div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <Badge variant="secondary" className="text-lg px-4 py-1">
                    {category.count} perfis
                  </Badge>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que escolher a <span className="text-gradient">Amorax</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A plataforma mais completa e segura do mercado
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 rounded-xl gradient-pink flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planos para <span className="text-gradient">Anunciantes</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para destacar seu perfil
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`p-6 relative ${plan.popular ? 'border-primary glow-pink' : 'border-border'}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-pink border-0">
                    <Crown className="w-3 h-3 mr-1" />
                    Mais Popular
                  </Badge>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'gradient-pink border-0' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  Começar Agora
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <Card className="p-12 text-center gradient-pink border-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative">
              <Users className="w-16 h-16 mx-auto mb-6 text-white/80" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Comece a Anunciar Hoje
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Junte-se a milhares de anunciantes verificados e alcance milhões de usuários em todo o Brasil
              </p>
              <Button size="lg" variant="secondary" className="text-lg h-14 px-8">
                Criar Meu Anúncio
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-pink flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">Amorax</span>
              </div>
              <p className="text-sm text-muted-foreground">
                A plataforma mais segura e verificada para encontrar acompanhantes no Brasil.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categorias</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/mulheres" className="hover:text-foreground transition-colors">Mulheres</Link></li>
                <li><Link href="/homens" className="hover:text-foreground transition-colors">Homens</Link></li>
                <li><Link href="/travestis" className="hover:text-foreground transition-colors">Travestis</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Para Anunciantes</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/anunciar" className="hover:text-foreground transition-colors">Criar Anúncio</Link></li>
                <li><Link href="/planos" className="hover:text-foreground transition-colors">Planos</Link></li>
                <li><Link href="/verificacao" className="hover:text-foreground transition-colors">Verificação</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/ajuda" className="hover:text-foreground transition-colors">Central de Ajuda</Link></li>
                <li><Link href="/termos" className="hover:text-foreground transition-colors">Termos de Uso</Link></li>
                <li><Link href="/privacidade" className="hover:text-foreground transition-colors">Privacidade</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 Amorax. Todos os direitos reservados.</p>
            <p className="mt-2">
              ⚠️ Este site contém conteúdo adulto (+18). Ao acessar, você confirma ter mais de 18 anos.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
