import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  MapPin, 
  Heart, 
  Search, 
  Filter, 
  Grid3X3, 
  LayoutList,
  Star,
  CheckCircle2,
  Crown,
  Sparkles,
  Clock,
  Phone,
  ChevronLeft
} from "lucide-react";
import { Link, useParams } from "wouter";

// Mock data for profiles
const mockProfiles = [
  {
    id: 1,
    slug: "julia-santos",
    name: "Julia Santos",
    age: 25,
    city: "São Paulo",
    neighborhood: "Moema",
    price: 300,
    mainPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop",
    isVerified: true,
    isPremium: true,
    isVip: false,
    is24Hours: true,
    hasOwnPlace: true,
    rating: 4.8,
    reviewCount: 45
  },
  {
    id: 2,
    slug: "amanda-oliveira",
    name: "Amanda Oliveira",
    age: 28,
    city: "São Paulo",
    neighborhood: "Jardins",
    price: 500,
    mainPhoto: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=500&fit=crop",
    isVerified: true,
    isPremium: false,
    isVip: true,
    is24Hours: false,
    hasOwnPlace: true,
    rating: 4.9,
    reviewCount: 89
  },
  {
    id: 3,
    slug: "carol-mello",
    name: "Carol Mello",
    age: 24,
    city: "São Paulo",
    neighborhood: "Pinheiros",
    price: 250,
    mainPhoto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop",
    isVerified: true,
    isPremium: true,
    isVip: false,
    is24Hours: true,
    hasOwnPlace: false,
    rating: 4.7,
    reviewCount: 32
  },
  {
    id: 4,
    slug: "fernanda-lima",
    name: "Fernanda Lima",
    age: 26,
    city: "São Paulo",
    neighborhood: "Itaim Bibi",
    price: 400,
    mainPhoto: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop",
    isVerified: true,
    isPremium: false,
    isVip: false,
    is24Hours: false,
    hasOwnPlace: true,
    rating: 4.6,
    reviewCount: 28
  },
  {
    id: 5,
    slug: "bianca-costa",
    name: "Bianca Costa",
    age: 23,
    city: "São Paulo",
    neighborhood: "Vila Olímpia",
    price: 350,
    mainPhoto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop",
    isVerified: true,
    isPremium: true,
    isVip: false,
    is24Hours: true,
    hasOwnPlace: true,
    rating: 4.8,
    reviewCount: 56
  },
  {
    id: 6,
    slug: "larissa-souza",
    name: "Larissa Souza",
    age: 27,
    city: "São Paulo",
    neighborhood: "Brooklin",
    price: 450,
    mainPhoto: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=500&fit=crop",
    isVerified: true,
    isPremium: false,
    isVip: true,
    is24Hours: false,
    hasOwnPlace: true,
    rating: 4.9,
    reviewCount: 72
  }
];

const categoryTitles: Record<string, { title: string; description: string }> = {
  mulheres: {
    title: "Mulheres",
    description: "Acompanhantes femininas verificadas em todo o Brasil"
  },
  homens: {
    title: "Homens",
    description: "Acompanhantes masculinos verificados em todo o Brasil"
  },
  travestis: {
    title: "Travestis",
    description: "Acompanhantes trans verificadas em todo o Brasil"
  }
};

const services = [
  "Massagem", "Oral", "Anal", "Beijo na boca", "Fetiches",
  "Dominação", "Inversão", "Casais", "Viagens"
];

export default function Listing() {
  const params = useParams();
  const category = params.category || "mulheres";
  const categoryInfo = categoryTitles[category] || categoryTitles.mulheres;
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([100, 1000]);
  const [ageRange, setAgeRange] = useState([18, 50]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-pink flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient hidden sm:block">Amorax</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            <Link href="/mulheres">
              <Button variant={category === "mulheres" ? "default" : "ghost"} size="sm" className={category === "mulheres" ? "gradient-pink border-0" : ""}>
                Mulheres
              </Button>
            </Link>
            <Link href="/homens">
              <Button variant={category === "homens" ? "default" : "ghost"} size="sm" className={category === "homens" ? "gradient-pink border-0" : ""}>
                Homens
              </Button>
            </Link>
            <Link href="/travestis">
              <Button variant={category === "travestis" ? "default" : "ghost"} size="sm" className={category === "travestis" ? "gradient-pink border-0" : ""}>
                Travestis
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button className="gradient-pink border-0" size="sm" asChild>
              <Link href="/anunciar">Anunciar</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{categoryInfo.title}</h1>
          <p className="text-muted-foreground">{categoryInfo.description}</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome, cidade ou bairro..." 
              className="pl-10 bg-card"
            />
          </div>
          
          <div className="flex gap-2">
            <Select defaultValue="sao-paulo">
              <SelectTrigger className="w-[180px] bg-card">
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sao-paulo">São Paulo</SelectItem>
                <SelectItem value="rio-de-janeiro">Rio de Janeiro</SelectItem>
                <SelectItem value="belo-horizonte">Belo Horizonte</SelectItem>
                <SelectItem value="brasilia">Brasília</SelectItem>
                <SelectItem value="curitiba">Curitiba</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="relevancia">
              <SelectTrigger className="w-[150px] bg-card">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevancia">Relevância</SelectItem>
                <SelectItem value="preco-menor">Menor Preço</SelectItem>
                <SelectItem value="preco-maior">Maior Preço</SelectItem>
                <SelectItem value="avaliacao">Avaliação</SelectItem>
                <SelectItem value="recentes">Mais Recentes</SelectItem>
              </SelectContent>
            </Select>

            {/* Filters Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filtros Avançados</SheetTitle>
                </SheetHeader>
                
                <div className="space-y-6 mt-6">
                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Faixa de Preço: R$ {priceRange[0]} - R$ {priceRange[1]}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={50}
                      max={2000}
                      step={50}
                      className="mt-2"
                    />
                  </div>

                  {/* Age Range */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">
                      Idade: {ageRange[0]} - {ageRange[1]} anos
                    </label>
                    <Slider
                      value={ageRange}
                      onValueChange={setAgeRange}
                      min={18}
                      max={60}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  {/* Services */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Serviços</label>
                    <div className="grid grid-cols-2 gap-2">
                      {services.map((service) => (
                        <div key={service} className="flex items-center gap-2">
                          <Checkbox id={service} />
                          <label htmlFor={service} className="text-sm">{service}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Other Filters */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Outros</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="verified" />
                        <label htmlFor="verified" className="text-sm">Apenas verificados</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="24hours" />
                        <label htmlFor="24hours" className="text-sm">Atende 24 horas</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="hasPlace" />
                        <label htmlFor="hasPlace" className="text-sm">Com local próprio</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="acceptsPix" />
                        <label htmlFor="acceptsPix" className="text-sm">Aceita PIX</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="acceptsCard" />
                        <label htmlFor="acceptsCard" className="text-sm">Aceita Cartão</label>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full gradient-pink border-0">
                    Aplicar Filtros
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* View Mode Toggle */}
            <div className="hidden md:flex border border-border rounded-lg overflow-hidden">
              <Button 
                variant={viewMode === "grid" ? "secondary" : "ghost"} 
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === "list" ? "secondary" : "ghost"} 
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <LayoutList className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{mockProfiles.length}</span> perfis encontrados
          </p>
        </div>

        {/* Profiles Grid */}
        <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
          {mockProfiles.map((profile) => (
            <Link key={profile.id} href={`/perfil/${profile.slug}`}>
              <Card className={`profile-card overflow-hidden cursor-pointer ${viewMode === "list" ? "flex" : ""}`}>
                {/* Image */}
                <div className={`relative ${viewMode === "list" ? "w-48 shrink-0" : "aspect-[3/4]"}`}>
                  <img 
                    src={profile.mainPhoto} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {profile.isVip && (
                      <Badge className="badge-vip">
                        <Crown className="w-3 h-3" />
                        VIP
                      </Badge>
                    )}
                    {profile.isPremium && !profile.isVip && (
                      <Badge className="badge-premium">
                        <Sparkles className="w-3 h-3" />
                        Premium
                      </Badge>
                    )}
                    {profile.isVerified && (
                      <Badge className="badge-verified">
                        <CheckCircle2 className="w-3 h-3" />
                        Verificado
                      </Badge>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>

                  {/* Price Tag */}
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <span className="text-white font-bold">R$ {profile.price}</span>
                    <span className="text-white/70 text-xs">/h</span>
                  </div>
                </div>

                {/* Info */}
                <div className={`p-3 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold truncate">{profile.name}, {profile.age}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {profile.neighborhood}, {profile.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{profile.rating}</span>
                      <span className="text-xs text-muted-foreground">({profile.reviewCount})</span>
                    </div>
                    
                    {profile.is24Hours && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        24h
                      </div>
                    )}
                    
                    {profile.hasOwnPlace && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        Local
                      </div>
                    )}
                  </div>

                  {viewMode === "list" && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="gradient-pink border-0">
                        <Phone className="w-3 h-3 mr-1" />
                        Contato
                      </Button>
                      <Button size="sm" variant="outline">
                        Ver Perfil
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <Button variant="outline" size="lg">
            Carregar Mais Perfis
          </Button>
        </div>
      </div>
    </div>
  );
}
