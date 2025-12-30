import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
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
  ChevronRight,
  ChevronLeft,
  Camera,
  Upload,
  CheckCircle2,
  Shield,
  MapPin,
  User,
  FileText,
  CreditCard,
  Sparkles
} from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

const steps = [
  { id: 1, title: "Categoria", icon: User },
  { id: 2, title: "Informações", icon: FileText },
  { id: 3, title: "Localização", icon: MapPin },
  { id: 4, title: "Fotos", icon: Camera },
  { id: 5, title: "Verificação", icon: Shield },
  { id: 6, title: "Plano", icon: CreditCard }
];

const services = [
  "Massagem", "Oral", "Anal", "Beijo na boca", "Fetiches",
  "Dominação", "Inversão", "Casais", "Viagens", "Pernoite",
  "Eventos", "Jantar", "Podolatria", "Fetiche de pés"
];

export default function Onboarding() {
  const { user, loading, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    displayName: "",
    age: "",
    bio: "",
    height: "",
    weight: "",
    eyeColor: "",
    hairColor: "",
    bodyType: "",
    whatsapp: "",
    telegram: "",
    city: "",
    state: "",
    neighborhood: "",
    hasOwnPlace: false,
    doesOutcalls: false,
    pricePerHour: "",
    pricePerNight: "",
    acceptsPix: true,
    acceptsCard: false,
    acceptsCash: true,
    services: [] as string[],
    photos: [] as string[],
    documentPhoto: "",
    selfiePhoto: "",
    plan: "free"
  });

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
          <h1 className="text-2xl font-bold mb-2">Criar Anúncio</h1>
          <p className="text-muted-foreground mb-6">
            Faça login para começar a criar seu anúncio na Amorax.
          </p>
          <Button className="w-full gradient-pink border-0" asChild>
            <a href={getLoginUrl()}>Entrar com Manus</a>
          </Button>
        </Card>
      </div>
    );
  }

  const progress = (currentStep / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-pink flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Amorax</span>
          </Link>
          
          <Button variant="ghost" asChild>
            <Link href="/">Cancelar</Link>
          </Button>
        </div>
      </header>

      <div className="container py-8 max-w-3xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Criar Anúncio</h1>
            <span className="text-sm text-muted-foreground">Passo {currentStep} de {steps.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`flex flex-col items-center gap-1 ${
                  step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step.id < currentStep 
                    ? "bg-primary text-primary-foreground" 
                    : step.id === currentStep 
                      ? "bg-primary/20 text-primary border-2 border-primary" 
                      : "bg-muted text-muted-foreground"
                }`}>
                  {step.id < currentStep ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <span className="text-xs hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-6 md:p-8">
          {/* Step 1: Category */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2">Escolha sua categoria</h2>
                <p className="text-muted-foreground">Em qual categoria você deseja anunciar?</p>
              </div>

              <RadioGroup 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                className="grid gap-4"
              >
                <Label 
                  htmlFor="women" 
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.category === "women" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="women" id="women" />
                  <div className="text-4xl">👩</div>
                  <div>
                    <p className="font-semibold">Mulheres</p>
                    <p className="text-sm text-muted-foreground">Acompanhantes femininas</p>
                  </div>
                </Label>

                <Label 
                  htmlFor="men" 
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.category === "men" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="men" id="men" />
                  <div className="text-4xl">👨</div>
                  <div>
                    <p className="font-semibold">Homens</p>
                    <p className="text-sm text-muted-foreground">Acompanhantes masculinos</p>
                  </div>
                </Label>

                <Label 
                  htmlFor="trans" 
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.category === "trans" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="trans" id="trans" />
                  <div className="text-4xl">💜</div>
                  <div>
                    <p className="font-semibold">Travestis</p>
                    <p className="text-sm text-muted-foreground">Acompanhantes trans</p>
                  </div>
                </Label>
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2">Informações Pessoais</h2>
                <p className="text-muted-foreground">Preencha seus dados para o anúncio</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome de exibição *</Label>
                  <Input 
                    placeholder="Seu nome artístico" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Idade *</Label>
                  <Input 
                    type="number" 
                    placeholder="25"
                    min="18"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Sobre você *</Label>
                <Textarea 
                  placeholder="Descreva-se de forma atraente..."
                  className="min-h-[120px]"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Altura (cm)</Label>
                  <Input 
                    type="number" 
                    placeholder="170"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Peso (kg)</Label>
                  <Input 
                    type="number" 
                    placeholder="58"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Cor dos olhos</Label>
                  <Select 
                    value={formData.eyeColor}
                    onValueChange={(value) => setFormData({ ...formData, eyeColor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="castanhos">Castanhos</SelectItem>
                      <SelectItem value="azuis">Azuis</SelectItem>
                      <SelectItem value="verdes">Verdes</SelectItem>
                      <SelectItem value="pretos">Pretos</SelectItem>
                      <SelectItem value="mel">Mel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>WhatsApp *</Label>
                  <Input 
                    placeholder="(11) 99999-9999"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Telegram (opcional)</Label>
                  <Input 
                    placeholder="@seuusuario"
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Serviços oferecidos</Label>
                <div className="flex flex-wrap gap-2">
                  {services.map((service) => (
                    <Badge
                      key={service}
                      variant={formData.services.includes(service) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        formData.services.includes(service) ? "gradient-pink border-0" : "hover:border-primary"
                      }`}
                      onClick={() => toggleService(service)}
                    >
                      {formData.services.includes(service) && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Valor por hora (R$) *</Label>
                  <Input 
                    type="number" 
                    placeholder="300"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Valor pernoite (R$)</Label>
                  <Input 
                    type="number" 
                    placeholder="2000"
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label className="mb-3 block">Formas de pagamento</Label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="pix" 
                      checked={formData.acceptsPix}
                      onCheckedChange={(checked) => setFormData({ ...formData, acceptsPix: checked as boolean })}
                    />
                    <Label htmlFor="pix">PIX</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="card"
                      checked={formData.acceptsCard}
                      onCheckedChange={(checked) => setFormData({ ...formData, acceptsCard: checked as boolean })}
                    />
                    <Label htmlFor="card">Cartão</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="cash"
                      checked={formData.acceptsCash}
                      onCheckedChange={(checked) => setFormData({ ...formData, acceptsCash: checked as boolean })}
                    />
                    <Label htmlFor="cash">Dinheiro</Label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2">Localização</h2>
                <p className="text-muted-foreground">Onde você atende?</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Estado *</Label>
                  <Select 
                    value={formData.state}
                    onValueChange={(value) => setFormData({ ...formData, state: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                      <SelectItem value="PR">Paraná</SelectItem>
                      <SelectItem value="SC">Santa Catarina</SelectItem>
                      <SelectItem value="BA">Bahia</SelectItem>
                      <SelectItem value="DF">Distrito Federal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Cidade *</Label>
                  <Input 
                    placeholder="São Paulo"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Bairro *</Label>
                <Input 
                  placeholder="Moema"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                />
              </div>

              <div>
                <Label className="mb-3 block">Tipo de atendimento</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="hasPlace"
                      checked={formData.hasOwnPlace}
                      onCheckedChange={(checked) => setFormData({ ...formData, hasOwnPlace: checked as boolean })}
                    />
                    <Label htmlFor="hasPlace">Tenho local próprio para atendimento</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="doesOutcalls"
                      checked={formData.doesOutcalls}
                      onCheckedChange={(checked) => setFormData({ ...formData, doesOutcalls: checked as boolean })}
                    />
                    <Label htmlFor="doesOutcalls">Vou até o cliente (motéis, hotéis, residências)</Label>
                  </div>
                </div>
              </div>

              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  📍 Sua localização exata não será exibida. Mostraremos apenas o bairro e cidade para proteger sua privacidade.
                </p>
              </Card>
            </div>
          )}

          {/* Step 4: Photos */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2">Fotos</h2>
                <p className="text-muted-foreground">Adicione fotos atraentes para seu anúncio</p>
              </div>

              <div>
                <Label className="mb-3 block">Fotos do perfil (mínimo 3)</Label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      className="aspect-[3/4] rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-xs">Foto {i}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Card className="p-4 bg-primary/10 border-primary/30">
                <h4 className="font-medium mb-2">📸 Dicas para boas fotos:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use fotos com boa iluminação</li>
                  <li>• Mostre seu rosto (opcional, mas recomendado)</li>
                  <li>• Evite fotos muito editadas ou com filtros pesados</li>
                  <li>• Fotos recentes têm melhor desempenho</li>
                </ul>
              </Card>
            </div>
          )}

          {/* Step 5: Verification */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2">Verificação</h2>
                <p className="text-muted-foreground">Verifique seu perfil para ganhar mais confiança</p>
              </div>

              <Card className="p-6 border-primary/50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Por que verificar?</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>✓ Perfis verificados recebem até 3x mais contatos</li>
                      <li>✓ Badge de verificação aumenta a confiança</li>
                      <li>✓ Melhor posicionamento nas buscas</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                <div>
                  <Label className="mb-3 block">1. Foto do documento (RG ou CNH)</Label>
                  <button className="w-full p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                    <Camera className="w-8 h-8" />
                    <span>Clique para enviar foto do documento</span>
                    <span className="text-xs">Apenas para verificação, não será exibido</span>
                  </button>
                </div>

                <div>
                  <Label className="mb-3 block">2. Selfie segurando o documento</Label>
                  <button className="w-full p-6 rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground">
                    <Camera className="w-8 h-8" />
                    <span>Clique para enviar selfie com documento</span>
                    <span className="text-xs">Comprova que você é a pessoa das fotos</span>
                  </button>
                </div>
              </div>

              <Card className="p-4 bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  🔒 Seus documentos são criptografados e usados apenas para verificação. 
                  Nunca serão compartilhados ou exibidos publicamente.
                </p>
              </Card>

              <Button variant="ghost" className="w-full">
                Pular verificação por enquanto
              </Button>
            </div>
          )}

          {/* Step 6: Plan Selection */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2">Escolha seu plano</h2>
                <p className="text-muted-foreground">Selecione o plano ideal para você</p>
              </div>

              <RadioGroup 
                value={formData.plan} 
                onValueChange={(value) => setFormData({ ...formData, plan: value })}
                className="grid gap-4"
              >
                <Label 
                  htmlFor="free" 
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.plan === "free" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value="free" id="free" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Gratuito</p>
                      <p className="font-bold">R$ 0/mês</p>
                    </div>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• 5 fotos</li>
                      <li>• Listagem padrão</li>
                      <li>• Perfil básico</li>
                    </ul>
                  </div>
                </Label>

                <Label 
                  htmlFor="premium" 
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                    formData.plan === "premium" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Badge className="absolute -top-2 right-4 badge-premium">Popular</Badge>
                  <RadioGroupItem value="premium" id="premium" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">Premium</p>
                      <p className="font-bold">R$ 99/mês</p>
                    </div>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• 15 fotos</li>
                      <li>• 3 vídeos</li>
                      <li>• Destaque na listagem</li>
                      <li>• Badge Premium</li>
                      <li>• Estatísticas completas</li>
                    </ul>
                  </div>
                </Label>

                <Label 
                  htmlFor="vip" 
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                    formData.plan === "vip" ? "border-yellow-500 bg-yellow-500/10" : "border-border hover:border-yellow-500/50"
                  }`}
                >
                  <Badge className="absolute -top-2 right-4 badge-vip">Exclusivo</Badge>
                  <RadioGroupItem value="vip" id="vip" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">VIP</p>
                      <p className="font-bold">R$ 199/mês</p>
                    </div>
                    <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                      <li>• Fotos ilimitadas</li>
                      <li>• 10 vídeos</li>
                      <li>• Topo da listagem</li>
                      <li>• Badge VIP exclusivo</li>
                      <li>• Suporte prioritário</li>
                      <li>• Analytics avançado</li>
                    </ul>
                  </div>
                </Label>
              </RadioGroup>

              {formData.plan !== "free" && (
                <Card className="p-4 bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    💳 O pagamento será processado após a criação do anúncio. 
                    Você pode começar com o plano gratuito e fazer upgrade depois.
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button 
              variant="ghost" 
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            {currentStep < steps.length ? (
              <Button 
                className="gradient-pink border-0"
                onClick={nextStep}
              >
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button className="gradient-pink border-0">
                <Sparkles className="w-4 h-4 mr-2" />
                Criar Anúncio
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
