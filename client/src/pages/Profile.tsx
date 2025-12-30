import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  MapPin, 
  Heart, 
  Star,
  CheckCircle2,
  Crown,
  Sparkles,
  Clock,
  Phone,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Share2,
  Flag,
  Eye,
  Calendar,
  CreditCard,
  Banknote,
  Home,
  Car,
  X
} from "lucide-react";
import { Link, useParams } from "wouter";

// Mock profile data
const mockProfile = {
  id: 1,
  slug: "julia-santos",
  name: "Julia Santos",
  age: 25,
  bio: "Olá! Sou a Julia, uma acompanhante de alto padrão em São Paulo. Ofereço momentos únicos e inesquecíveis com muito carinho, atenção e discrição. Atendo em local próprio climatizado e confortável, ou posso ir até você. Sou educada, simpática e adoro uma boa conversa. Venha me conhecer!",
  city: "São Paulo",
  state: "SP",
  neighborhood: "Moema",
  
  // Physical
  height: 170,
  weight: 58,
  eyeColor: "Castanhos",
  hairColor: "Castanho",
  bodyType: "Magra",
  ethnicity: "Branca",
  
  // Contact
  whatsapp: "11999999999",
  telegram: "@juliasantos",
  
  // Pricing
  pricePerHour: 300,
  pricePerNight: 2000,
  acceptsPix: true,
  acceptsCard: true,
  acceptsCash: true,
  
  // Availability
  is24Hours: false,
  availableHours: "10h às 22h",
  hasOwnPlace: true,
  doesOutcalls: true,
  
  // Verification
  isVerified: true,
  documentsVerified: true,
  ageVerified: true,
  photosVerified: true,
  
  // Plan
  isPremium: true,
  isVip: false,
  
  // Stats
  viewCount: 15420,
  rating: 4.8,
  reviewCount: 45,
  
  // Media
  photos: [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1000&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1000&fit=crop"
  ],
  
  // Services
  services: [
    "Massagem", "Oral", "Beijo na boca", "Fetiches", 
    "Casais", "Viagens", "Pernoite", "Eventos"
  ],
  
  // Reviews
  reviews: [
    {
      id: 1,
      authorName: "Carlos M.",
      rating: 5,
      comment: "Excelente! Muito educada e atenciosa. Recomendo!",
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      authorName: "Roberto S.",
      rating: 5,
      comment: "Simplesmente perfeita. Local muito bom e ela é muito simpática.",
      createdAt: "2024-01-10"
    },
    {
      id: 3,
      authorName: "André L.",
      rating: 4,
      comment: "Muito boa, recomendo. Pontual e discreta.",
      createdAt: "2024-01-05"
    }
  ]
};

export default function Profile() {
  const params = useParams();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const profile = mockProfile;

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % profile.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length);
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Link href="/mulheres">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <span className="font-medium truncate">{profile.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Flag className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Photos */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Photo Gallery */}
            <Card className="overflow-hidden">
              <div className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/3]">
                <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                  <DialogTrigger asChild>
                    <img 
                      src={profile.photos[currentPhotoIndex]} 
                      alt={profile.name}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 bg-black border-0">
                    <div className="relative">
                      <img 
                        src={profile.photos[currentPhotoIndex]} 
                        alt={profile.name}
                        className="w-full h-auto max-h-[90vh] object-contain"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 text-white hover:bg-white/20"
                        onClick={() => setIsGalleryOpen(false)}
                      >
                        <X className="w-6 h-6" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                        onClick={prevPhoto}
                      >
                        <ChevronLeft className="w-8 h-8" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                        onClick={nextPhoto}
                      >
                        <ChevronRight className="w-8 h-8" />
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Navigation Arrows */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={prevPhoto}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={nextPhoto}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>

                {/* Photo Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-white text-sm">
                    {currentPhotoIndex + 1} / {profile.photos.length}
                  </span>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
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
              </div>

              {/* Thumbnails */}
              <div className="p-3 flex gap-2 overflow-x-auto">
                {profile.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPhotoIndex(index)}
                    className={`shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentPhotoIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Tabs - About, Services, Reviews */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="about">Sobre</TabsTrigger>
                <TabsTrigger value="services">Serviços</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações ({profile.reviewCount})</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="mt-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Sobre Mim</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {profile.bio}
                  </p>

                  <h4 className="font-semibold mb-3">Características</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Idade:</span>
                      <span className="ml-2 font-medium">{profile.age} anos</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Altura:</span>
                      <span className="ml-2 font-medium">{profile.height} cm</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Peso:</span>
                      <span className="ml-2 font-medium">{profile.weight} kg</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Olhos:</span>
                      <span className="ml-2 font-medium">{profile.eyeColor}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cabelo:</span>
                      <span className="ml-2 font-medium">{profile.hairColor}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Corpo:</span>
                      <span className="ml-2 font-medium">{profile.bodyType}</span>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="mt-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Serviços Oferecidos</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.services.map((service) => (
                      <Badge key={service} variant="secondary" className="px-3 py-1">
                        <CheckCircle2 className="w-3 h-3 mr-1 text-primary" />
                        {service}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4 space-y-4">
                {/* Rating Summary */}
                <Card className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold">{profile.rating}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= Math.round(profile.rating) ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} 
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {profile.reviewCount} avaliações
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Reviews List */}
                {profile.reviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>{review.authorName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{review.authorName}</span>
                          <span className="text-xs text-muted-foreground">{review.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3 h-3 ${star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`} 
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Add Review */}
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Deixe sua avaliação</h4>
                  <div className="space-y-3">
                    <Input placeholder="Seu nome (opcional)" />
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} className="p-1 hover:scale-110 transition-transform">
                          <Star className="w-6 h-6 text-muted hover:text-yellow-500" />
                        </button>
                      ))}
                    </div>
                    <Textarea placeholder="Escreva sua avaliação..." />
                    <Button className="gradient-pink border-0">Enviar Avaliação</Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Contact Card */}
          <div className="space-y-4">
            {/* Profile Info Card */}
            <Card className="p-6 sticky top-20">
              <div className="text-center mb-4">
                <h1 className="text-2xl font-bold">{profile.name}, {profile.age}</h1>
                <p className="text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <MapPin className="w-4 h-4" />
                  {profile.neighborhood}, {profile.city} - {profile.state}
                </p>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold">{profile.rating}</span>
                </div>
                <span className="text-muted-foreground">({profile.reviewCount} avaliações)</span>
              </div>

              {/* Verification Badges */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {profile.documentsVerified && (
                  <Badge className="badge-verified">
                    <CheckCircle2 className="w-3 h-3" />
                    Documentos
                  </Badge>
                )}
                {profile.ageVerified && (
                  <Badge className="badge-verified">
                    <CheckCircle2 className="w-3 h-3" />
                    Idade
                  </Badge>
                )}
                {profile.photosVerified && (
                  <Badge className="badge-verified">
                    <CheckCircle2 className="w-3 h-3" />
                    Fotos Reais
                  </Badge>
                )}
              </div>

              {/* Pricing */}
              <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-muted-foreground">1 hora</span>
                  <span className="text-2xl font-bold">R$ {profile.pricePerHour}</span>
                </div>
                {profile.pricePerNight && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Pernoite</span>
                    <span className="font-medium">R$ {profile.pricePerNight}</span>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="flex justify-center gap-4 mb-4">
                {profile.acceptsPix && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Banknote className="w-4 h-4" />
                    PIX
                  </div>
                )}
                {profile.acceptsCard && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <CreditCard className="w-4 h-4" />
                    Cartão
                  </div>
                )}
                {profile.acceptsCash && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Banknote className="w-4 h-4" />
                    Dinheiro
                  </div>
                )}
              </div>

              {/* Availability */}
              <div className="flex justify-center gap-4 mb-6 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {profile.is24Hours ? "24 horas" : profile.availableHours}
                </div>
                {profile.hasOwnPlace && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Home className="w-4 h-4" />
                    Com local
                  </div>
                )}
                {profile.doesOutcalls && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Car className="w-4 h-4" />
                    Vai até você
                  </div>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <Button className="w-full gradient-pink border-0 h-12 text-lg" asChild>
                  <Link href={`/agendar/${profile.slug}`}>
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar Encontro
                  </Link>
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700 border-0 h-12 text-lg" asChild>
                  <a href={`https://wa.me/55${profile.whatsapp}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </a>
                </Button>
                <Button variant="outline" className="w-full h-12" asChild>
                  <a href={`tel:+55${profile.whatsapp}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    Ligar
                  </a>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex justify-center gap-6 mt-6 pt-4 border-t border-border text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {profile.viewCount.toLocaleString()} views
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Desde Jan/2024
                </div>
              </div>
            </Card>

            {/* Safety Warning */}
            <Card className="p-4 bg-destructive/10 border-destructive/30">
              <p className="text-sm text-center">
                ⚠️ <strong>Evite golpes!</strong> Não faça pagamento antecipado. 
                Ao marcar o encontro, avise que viu no <span className="text-primary font-semibold">Amorax</span>.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Fixed Contact Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-4 md:hidden safe-bottom">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="font-bold">R$ {profile.pricePerHour}/h</div>
            <div className="text-xs text-muted-foreground">{profile.neighborhood}</div>
          </div>
          <Button className="gradient-pink border-0" asChild>
            <Link href={`/agendar/${profile.slug}`}>
              <Calendar className="w-4 h-4 mr-2" />
              Agendar
            </Link>
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 border-0" asChild>
            <a href={`https://wa.me/55${profile.whatsapp}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
