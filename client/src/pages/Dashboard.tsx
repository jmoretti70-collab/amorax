import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  Eye, 
  Phone, 
  TrendingUp,
  Camera,
  Video,
  Settings,
  User,
  MapPin,
  Clock,
  CreditCard,
  Crown,
  Sparkles,
  CheckCircle2,
  Upload,
  Plus,
  Trash2,
  Edit,
  BarChart3,
  Calendar,
  Bell,
  LogOut,
  ChevronRight,
  Star
} from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

// Mock stats data
const mockStats = {
  viewsToday: 245,
  viewsWeek: 1520,
  viewsMonth: 5840,
  contactsToday: 12,
  contactsWeek: 68,
  contactsMonth: 234,
  favoritesCount: 89,
  rating: 4.8,
  reviewCount: 45,
  profileCompletion: 85
};

const mockChartData = [
  { day: "Seg", views: 180, contacts: 8 },
  { day: "Ter", views: 220, contacts: 12 },
  { day: "Qua", views: 195, contacts: 10 },
  { day: "Qui", views: 280, contacts: 15 },
  { day: "Sex", views: 350, contacts: 22 },
  { day: "Sáb", views: 420, contacts: 28 },
  { day: "Dom", views: 380, contacts: 25 }
];

export default function Dashboard() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-pink flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Área do Anunciante</h1>
          <p className="text-muted-foreground mb-6">
            Faça login para acessar seu painel de controle e gerenciar seus anúncios.
          </p>
          <Button className="w-full gradient-pink border-0" asChild>
            <a href={getLoginUrl()}>Entrar com Manus</a>
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            Ainda não tem conta? O cadastro é feito automaticamente no primeiro acesso.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border hidden lg:flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Amorax" className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-xl font-bold text-gradient">Amorax</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <Button 
            variant={activeTab === "overview" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 className="w-4 h-4 mr-3" />
            Visão Geral
          </Button>
          <Button 
            variant={activeTab === "profile" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("profile")}
          >
            <User className="w-4 h-4 mr-3" />
            Meu Perfil
          </Button>
          <Button 
            variant={activeTab === "photos" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("photos")}
          >
            <Camera className="w-4 h-4 mr-3" />
            Fotos e Vídeos
          </Button>
          <Button 
            variant={activeTab === "schedule" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("schedule")}
          >
            <Calendar className="w-4 h-4 mr-3" />
            Disponibilidade
          </Button>
          <Button 
            variant={activeTab === "plan" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("plan")}
          >
            <Crown className="w-4 h-4 mr-3" />
            Meu Plano
          </Button>
          <Button 
            variant={activeTab === "verification" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("verification")}
          >
            <CheckCircle2 className="w-4 h-4 mr-3" />
            Verificação
          </Button>
          <Button 
            variant={activeTab === "settings" ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="w-4 h-4 mr-3" />
            Configurações
          </Button>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name || "Anunciante"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={() => logout()}>
            <LogOut className="w-4 h-4 mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between p-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-pink flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gradient">Amorax</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => logout()}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Mobile Tabs */}
          <div className="flex overflow-x-auto gap-1 px-4 pb-3">
            {[
              { id: "overview", icon: BarChart3, label: "Visão Geral" },
              { id: "profile", icon: User, label: "Perfil" },
              { id: "photos", icon: Camera, label: "Fotos" },
              { id: "plan", icon: Crown, label: "Plano" }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "secondary" : "ghost"}
                size="sm"
                className="shrink-0"
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </header>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Olá, {user?.name?.split(" ")[0] || "Anunciante"}!</h1>
                  <p className="text-muted-foreground">Veja como está o desempenho do seu perfil</p>
                </div>
                <Button className="gradient-pink border-0" asChild>
                  <Link href="/perfil/julia-santos">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Meu Perfil
                  </Link>
                </Button>
              </div>

              {/* Profile Completion */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Completude do Perfil</h3>
                    <p className="text-sm text-muted-foreground">Complete seu perfil para aparecer melhor nas buscas</p>
                  </div>
                  <span className="text-2xl font-bold text-primary">{mockStats.profileCompletion}%</span>
                </div>
                <Progress value={mockStats.profileCompletion} className="h-2" />
                <div className="flex gap-2 mt-4">
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                    Fotos
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-green-500" />
                    Descrição
                  </Badge>
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Vídeos pendentes
                  </Badge>
                </div>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{mockStats.viewsToday}</p>
                      <p className="text-xs text-muted-foreground">Visualizações hoje</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{mockStats.contactsToday}</p>
                      <p className="text-xs text-muted-foreground">Contatos hoje</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{mockStats.favoritesCount}</p>
                      <p className="text-xs text-muted-foreground">Favoritos</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{mockStats.rating}</p>
                      <p className="text-xs text-muted-foreground">{mockStats.reviewCount} avaliações</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Weekly Stats */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Desempenho da Semana</h3>
                <div className="grid grid-cols-7 gap-2">
                  {mockChartData.map((day) => (
                    <div key={day.day} className="text-center">
                      <div 
                        className="bg-primary/20 rounded-lg mx-auto mb-2"
                        style={{ 
                          height: `${Math.max(20, (day.views / 420) * 100)}px`,
                          width: "100%"
                        }}
                      />
                      <p className="text-xs text-muted-foreground">{day.day}</p>
                      <p className="text-sm font-medium">{day.views}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick Actions */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setActiveTab("photos")}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Camera className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Adicionar Fotos</p>
                        <p className="text-sm text-muted-foreground">5 de 15 fotos usadas</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
                <Card className="p-4 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => setActiveTab("plan")}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                        <Crown className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="font-medium">Upgrade para Premium</p>
                        <p className="text-sm text-muted-foreground">Apareça em destaque</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h1 className="text-2xl font-bold">Meu Perfil</h1>
                <p className="text-muted-foreground">Edite suas informações pessoais</p>
              </div>

              <Card className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome de exibição</Label>
                    <Input placeholder="Seu nome artístico" defaultValue="Julia Santos" />
                  </div>
                  <div>
                    <Label>Idade</Label>
                    <Input type="number" placeholder="Idade" defaultValue="25" />
                  </div>
                </div>

                <div>
                  <Label>Sobre mim</Label>
                  <Textarea 
                    placeholder="Descreva-se..." 
                    className="min-h-[120px]"
                    defaultValue="Olá! Sou a Julia, uma acompanhante de alto padrão em São Paulo..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>Altura (cm)</Label>
                    <Input type="number" placeholder="170" defaultValue="170" />
                  </div>
                  <div>
                    <Label>Peso (kg)</Label>
                    <Input type="number" placeholder="58" defaultValue="58" />
                  </div>
                  <div>
                    <Label>Cor dos olhos</Label>
                    <Select defaultValue="castanhos">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="castanhos">Castanhos</SelectItem>
                        <SelectItem value="azuis">Azuis</SelectItem>
                        <SelectItem value="verdes">Verdes</SelectItem>
                        <SelectItem value="pretos">Pretos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>WhatsApp</Label>
                    <Input placeholder="(11) 99999-9999" defaultValue="(11) 99999-9999" />
                  </div>
                  <div>
                    <Label>Telegram (opcional)</Label>
                    <Input placeholder="@seuusuario" defaultValue="@juliasantos" />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>Cidade</Label>
                    <Input placeholder="São Paulo" defaultValue="São Paulo" />
                  </div>
                  <div>
                    <Label>Bairro</Label>
                    <Input placeholder="Moema" defaultValue="Moema" />
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <Select defaultValue="SP">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Valor por hora (R$)</Label>
                    <Input type="number" placeholder="300" defaultValue="300" />
                  </div>
                  <div>
                    <Label>Valor pernoite (R$)</Label>
                    <Input type="number" placeholder="2000" defaultValue="2000" />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Formas de pagamento aceitas</Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Switch id="pix" defaultChecked />
                      <Label htmlFor="pix">PIX</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="card" defaultChecked />
                      <Label htmlFor="card">Cartão</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="cash" defaultChecked />
                      <Label htmlFor="cash">Dinheiro</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Atendimento</Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Switch id="hasPlace" defaultChecked />
                      <Label htmlFor="hasPlace">Tenho local próprio</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="doesOutcalls" defaultChecked />
                      <Label htmlFor="doesOutcalls">Vou até o cliente</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="is24h" />
                      <Label htmlFor="is24h">Atendo 24 horas</Label>
                    </div>
                  </div>
                </div>

                <Button className="gradient-pink border-0">
                  Salvar Alterações
                </Button>
              </Card>
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === "photos" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Fotos e Vídeos</h1>
                  <p className="text-muted-foreground">Gerencie sua galeria de mídia</p>
                </div>
                <Button className="gradient-pink border-0">
                  <Upload className="w-4 h-4 mr-2" />
                  Enviar Mídia
                </Button>
              </div>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Fotos (5/15)</h3>
                  <Badge variant="secondary">Plano Premium: até 15 fotos</Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                      <img 
                        src={`https://images.unsplash.com/photo-153452874177${i}-53994a69daeb?w=300&h=400&fit=crop`}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="icon" variant="secondary">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {i === 1 && (
                        <Badge className="absolute top-2 left-2 badge-premium">Principal</Badge>
                      )}
                    </div>
                  ))}
                  
                  {/* Add Photo Button */}
                  <button className="aspect-[3/4] rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                    <Plus className="w-8 h-8" />
                    <span className="text-sm">Adicionar</span>
                  </button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Vídeos (0/3)</h3>
                  <Badge variant="secondary">Plano Premium: até 3 vídeos</Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <button className="aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                    <Video className="w-8 h-8" />
                    <span className="text-sm">Adicionar Vídeo</span>
                  </button>
                </div>
              </Card>
            </div>
          )}

          {/* Plan Tab */}
          {activeTab === "plan" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">Meu Plano</h1>
                <p className="text-muted-foreground">Gerencie sua assinatura</p>
              </div>

              {/* Current Plan */}
              <Card className="p-6 border-primary">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Plano Premium</h3>
                      <p className="text-sm text-muted-foreground">Ativo até 15/02/2025</p>
                    </div>
                  </div>
                  <Badge className="badge-premium">Ativo</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Fotos</p>
                    <p className="font-medium">15 fotos</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vídeos</p>
                    <p className="font-medium">3 vídeos</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Destaque</p>
                    <p className="font-medium">Sim</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estatísticas</p>
                    <p className="font-medium">Completas</p>
                  </div>
                </div>
              </Card>

              {/* Upgrade Options */}
              <div>
                <h3 className="font-semibold mb-4">Fazer Upgrade</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="p-6 opacity-50">
                    <h4 className="font-semibold mb-2">Gratuito</h4>
                    <p className="text-3xl font-bold mb-4">R$ 0<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
                    <ul className="space-y-2 text-sm mb-4">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                        5 fotos
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                        Listagem padrão
                      </li>
                    </ul>
                    <Button variant="outline" disabled className="w-full">Plano Atual</Button>
                  </Card>

                  <Card className="p-6 border-primary">
                    <Badge className="badge-premium mb-2">Atual</Badge>
                    <h4 className="font-semibold mb-2">Premium</h4>
                    <p className="text-3xl font-bold mb-4">R$ 99<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
                    <ul className="space-y-2 text-sm mb-4">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        15 fotos
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        3 vídeos
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Destaque na listagem
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        Badge Premium
                      </li>
                    </ul>
                    <Button variant="outline" className="w-full">Renovar</Button>
                  </Card>

                  <Card className="p-6 border-yellow-500/50 glow-gold">
                    <Badge className="badge-vip mb-2">
                      <Crown className="w-3 h-3" />
                      Recomendado
                    </Badge>
                    <h4 className="font-semibold mb-2">VIP</h4>
                    <p className="text-3xl font-bold mb-4">R$ 199<span className="text-sm font-normal text-muted-foreground">/mês</span></p>
                    <ul className="space-y-2 text-sm mb-4">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                        Fotos ilimitadas
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                        10 vídeos
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                        Topo da listagem
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                        Badge VIP exclusivo
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-yellow-500" />
                        Suporte prioritário
                      </li>
                    </ul>
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 border-0 text-black font-semibold">
                      Fazer Upgrade
                    </Button>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Verification Tab */}
          {activeTab === "verification" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h1 className="text-2xl font-bold">Verificação</h1>
                <p className="text-muted-foreground">Complete a verificação para ganhar badges de confiança</p>
              </div>

              <Card className="p-6">
                <div className="space-y-6">
                  {/* Documents Verification */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Documentos</h3>
                        <Badge className="badge-verified">Verificado</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Seus documentos foram verificados com sucesso
                      </p>
                    </div>
                  </div>

                  {/* Age Verification */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Idade (+18)</h3>
                        <Badge className="badge-verified">Verificado</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Sua idade foi verificada com sucesso
                      </p>
                    </div>
                  </div>

                  {/* Photo Verification */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Fotos Reais</h3>
                        <Badge variant="outline">Pendente</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Envie uma selfie segurando seu documento para verificar que as fotos são suas
                      </p>
                      <Button className="mt-3" variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Enviar Selfie
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-primary/10 border-primary/30">
                <p className="text-sm">
                  💡 <strong>Dica:</strong> Perfis verificados recebem até 3x mais visualizações e contatos!
                </p>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h1 className="text-2xl font-bold">Configurações</h1>
                <p className="text-muted-foreground">Gerencie suas preferências</p>
              </div>

              <Card className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Perfil Ativo</h3>
                    <p className="text-sm text-muted-foreground">Seu perfil está visível nas buscas</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Notificações por Email</h3>
                    <p className="text-sm text-muted-foreground">Receba atualizações sobre seu perfil</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Mostrar Estatísticas</h3>
                    <p className="text-sm text-muted-foreground">Exibir contagem de visualizações no perfil</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-destructive mb-4">Zona de Perigo</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start text-muted-foreground">
                    Pausar meu anúncio temporariamente
                  </Button>
                  <Button variant="destructive" className="w-full justify-start">
                    Excluir minha conta
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === "schedule" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h1 className="text-2xl font-bold">Disponibilidade</h1>
                <p className="text-muted-foreground">Configure seus horários de atendimento</p>
              </div>

              <Card className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Atendimento 24 horas</h3>
                    <p className="text-sm text-muted-foreground">Disponível a qualquer horário</p>
                  </div>
                  <Switch />
                </div>

                <div className="space-y-4">
                  <Label>Horário de atendimento</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Início</Label>
                      <Select defaultValue="10">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={String(i)}>{String(i).padStart(2, '0')}:00</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Fim</Label>
                      <Select defaultValue="22">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={String(i)}>{String(i).padStart(2, '0')}:00</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Dias de atendimento</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((day) => (
                      <Button key={day} variant="outline" size="sm" className="w-12">
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button className="gradient-pink border-0">
                  Salvar Horários
                </Button>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
