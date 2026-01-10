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
  ChevronLeft,
  Loader2
} from "lucide-react";
import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";

const categoryTitles: Record<string, { title: string; description: string; apiCategory: "women" | "men" | "trans" }> = {
  mulheres: {
    title: "Mulheres",
    description: "Acompanhantes femininas verificadas em todo o Brasil",
    apiCategory: "women"
  },
  homens: {
    title: "Homens",
    description: "Acompanhantes masculinos verificados em todo o Brasil",
    apiCategory: "men"
  },
  travestis: {
    title: "Travestis",
    description: "Acompanhantes trans verificadas em todo o Brasil",
    apiCategory: "trans"
  }
};

const services = [
  "Massagem", "Oral", "Anal", "Beijo na boca", "Fetiches",
  "Dominação", "Inversão", "Casais", "Viagens"
];

interface ListingProps {
  category?: string;
}

export default function Listing({ category: propCategory }: ListingProps) {
  const params = useParams();
  const category = propCategory || params.category || "mulheres";
  const categoryInfo = categoryTitles[category] || categoryTitles.mulheres;
  
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState([100, 1000]);
  const [ageRange, setAgeRange] = useState([18, 50]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [sortBy, setSortBy] = useState<"relevance" | "price_asc" | "price_desc" | "rating" | "recent">("relevance");

  // Fetch profiles from API
  const { data, isLoading, error } = trpc.profiles.list.useQuery({
    category: categoryInfo.apiCategory,
    city: selectedCity !== "all" ? selectedCity : undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    minAge: ageRange[0],
    maxAge: ageRange[1],
    sortBy: sortBy,
    limit: 20,
  });

  // Fetch media for profiles
  const profileIds = data?.profiles.map(p => p.id) || [];
  const { data: mediaData } = trpc.media.getByProfiles.useQuery(
    { profileIds },
    { enabled: profileIds.length > 0 }
  );

  const profiles = data?.profiles || [];

  // Get main photo for a profile
  const getMainPhoto = (profileId: number) => {
    const media = mediaData?.find(m => m.profileId === profileId && m.isMain);
    if (media?.url) {
      // If it's a relative URL, use it directly
      if (media.url.startsWith('/')) {
        return media.url;
      }
      return media.url;
    }
    // Fallback placeholder
    return `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop`;
  };

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
              <img src="/logo.png" alt="Amorax" className="w-20 h-20 rounded-lg object-cover" />
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
          <h1 className="text-3xl font-bold">{categoryInfo.title}</h1>
          <p className="text-muted-foreground">{categoryInfo.description}</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome, cidade ou bairro..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="w-[140px]">
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="São Paulo">São Paulo</SelectItem>
                <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                <SelectItem value="Belo Horizonte">Belo Horizonte</SelectItem>
                <SelectItem value="Curitiba">Curitiba</SelectItem>
                <SelectItem value="Porto Alegre">Porto Alegre</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="price_asc">Menor Preço</SelectItem>
                <SelectItem value="price_desc">Maior Preço</SelectItem>
                <SelectItem value="rating">Avaliação</SelectItem>
                <SelectItem value="recent">Mais Recentes</SelectItem>
              </SelectContent>
            </Select>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  {/* Price Range */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Preço por hora: R$ {priceRange[0]} - R$ {priceRange[1]}
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
                    <label className="text-sm font-medium mb-2 block">
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
                    <label className="text-sm font-medium mb-2 block">Serviços</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {services.map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox id={service} />
                          <label htmlFor={service} className="text-sm">{service}</label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Other Filters */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="verified" />
                      <label htmlFor="verified" className="text-sm">Apenas verificadas</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="hasPlace" />
                      <label htmlFor="hasPlace" className="text-sm">Com local próprio</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="24hours" />
                      <label htmlFor="24hours" className="text-sm">Atende 24h</label>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden md:flex border rounded-lg">
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
        <div className="mb-4 text-sm text-muted-foreground">
          {isLoading ? "Carregando..." : `${data?.total || 0} perfis encontrados`}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500">Erro ao carregar perfis. Tente novamente.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && profiles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Nenhum perfil encontrado para esta categoria.</p>
          </div>
        )}

        {/* Profiles Grid */}
        {!isLoading && !error && profiles.length > 0 && (
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {profiles.map((profile) => (
              <Link key={profile.id} href={`/perfil/${profile.slug}`}>
                <Card className="group overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                  <div className="relative aspect-[4/5]">
                    <img 
                      src={getMainPhoto(profile.id)} 
                      alt={profile.displayName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {profile.plan === "vip" && (
                        <Badge className="bg-yellow-500 text-black">
                          <Crown className="w-3 h-3 mr-1" />
                          VIP
                        </Badge>
                      )}
                      {profile.plan === "premium" && (
                        <Badge className="bg-pink-500">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-green-500/90 text-white">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                    </div>

                    {/* Favorite Button */}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute top-2 right-2 bg-black/30 hover:bg-black/50"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>

                    {/* Price Tag */}
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded-lg">
                      <span className="text-white font-bold">R$ {Number(profile.pricePerHour || 0).toFixed(0)}</span>
                      <span className="text-white/70 text-sm">/h</span>
                    </div>
                  </div>

                  <div className="p-3">
                    <h3 className="font-semibold">{profile.displayName}, {profile.age}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {profile.neighborhood}, {profile.city}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-medium">4.8</span>
                        <span className="text-sm text-muted-foreground">(45)</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {profile.is24Hours && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            24h
                          </span>
                        )}
                        {profile.hasOwnPlace && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            Local
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Load More */}
        {!isLoading && !error && profiles.length > 0 && data && data.page < data.totalPages && (
          <div className="flex justify-center mt-8">
            <Button variant="outline" size="lg">
              Carregar Mais Perfis
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Category Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2">
        <div className="flex justify-around">
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
        </div>
      </nav>
    </div>
  );
}
