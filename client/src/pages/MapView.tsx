import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin, 
  Heart, 
  Search, 
  Filter, 
  List,
  Star,
  CheckCircle2,
  Crown,
  Sparkles,
  ChevronLeft,
  Navigation,
  X
} from "lucide-react";
import { Link } from "wouter";
import { MapView } from "@/components/Map";

// Mock profiles with coordinates
const mockProfiles = [
  {
    id: 1,
    slug: "julia-santos",
    name: "Julia Santos",
    age: 25,
    neighborhood: "Moema",
    price: 300,
    mainPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=250&fit=crop",
    isVerified: true,
    isPremium: true,
    rating: 4.8,
    lat: -23.6015,
    lng: -46.6657
  },
  {
    id: 2,
    slug: "amanda-oliveira",
    name: "Amanda Oliveira",
    age: 28,
    neighborhood: "Jardins",
    price: 500,
    mainPhoto: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=250&fit=crop",
    isVerified: true,
    isVip: true,
    rating: 4.9,
    lat: -23.5632,
    lng: -46.6658
  },
  {
    id: 3,
    slug: "carol-mello",
    name: "Carol Mello",
    age: 24,
    neighborhood: "Pinheiros",
    price: 250,
    mainPhoto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=250&fit=crop",
    isVerified: true,
    isPremium: true,
    rating: 4.7,
    lat: -23.5667,
    lng: -46.6917
  },
  {
    id: 4,
    slug: "fernanda-lima",
    name: "Fernanda Lima",
    age: 26,
    neighborhood: "Itaim Bibi",
    price: 400,
    mainPhoto: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=250&fit=crop",
    isVerified: true,
    rating: 4.6,
    lat: -23.5847,
    lng: -46.6762
  },
  {
    id: 5,
    slug: "bianca-costa",
    name: "Bianca Costa",
    age: 23,
    neighborhood: "Vila Olímpia",
    price: 350,
    mainPhoto: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=250&fit=crop",
    isVerified: true,
    isPremium: true,
    rating: 4.8,
    lat: -23.5958,
    lng: -46.6856
  }
];

export default function MapViewPage() {
  const [selectedProfile, setSelectedProfile] = useState<typeof mockProfiles[0] | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  const getUserLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(location);
          if (mapRef.current) {
            mapRef.current.panTo(location);
            mapRef.current.setZoom(14);
          }
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLocating(false);
        }
      );
    }
  };

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.map = null);
    markersRef.current = [];

    // Add markers for each profile
    mockProfiles.forEach((profile) => {
      const markerContent = document.createElement('div');
      markerContent.innerHTML = `
        <div class="relative cursor-pointer transform hover:scale-110 transition-transform">
          <div class="w-12 h-12 rounded-full overflow-hidden border-3 ${
            profile.isVip ? 'border-yellow-500' : profile.isPremium ? 'border-pink-500' : 'border-white'
          } shadow-lg">
            <img src="${profile.mainPhoto}" alt="${profile.name}" class="w-full h-full object-cover" />
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
            R$ ${profile.price}
          </div>
        </div>
      `;

      const marker = new google.maps.marker.AdvancedMarkerElement({
        map,
        position: { lat: profile.lat, lng: profile.lng },
        content: markerContent,
        title: profile.name
      });

      marker.addListener('click', () => {
        setSelectedProfile(profile);
      });

      markersRef.current.push(marker);
    });
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Link href="/mulheres">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <span className="font-medium">Mapa</span>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={getUserLocation}
              disabled={isLocating}
            >
              <Navigation className={`w-4 h-4 mr-2 ${isLocating ? 'animate-pulse' : ''}`} />
              {isLocating ? 'Localizando...' : 'Minha localização'}
            </Button>
            
            <Link href="/mulheres">
              <Button variant="outline" size="sm">
                <List className="w-4 h-4 mr-2" />
                Lista
              </Button>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Categoria</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="women">Mulheres</SelectItem>
                        <SelectItem value="men">Homens</SelectItem>
                        <SelectItem value="trans">Travestis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Raio de busca</label>
                    <Select defaultValue="5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 km</SelectItem>
                        <SelectItem value="5">5 km</SelectItem>
                        <SelectItem value="10">10 km</SelectItem>
                        <SelectItem value="20">20 km</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full gradient-pink border-0">Aplicar</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Map */}
      <div className="flex-1 relative">
        <MapView
          onMapReady={handleMapReady}
          initialCenter={{ lat: -23.5505, lng: -46.6333 }}
          initialZoom={12}
          className="w-full h-full"
        />

        {/* Selected Profile Card */}
        {selectedProfile && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-10">
            <Card className="p-4 bg-background/95 backdrop-blur-lg">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2"
                onClick={() => setSelectedProfile(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              
              <Link href={`/perfil/${selectedProfile.slug}`}>
                <div className="flex gap-4">
                  <div className="w-20 h-24 rounded-lg overflow-hidden shrink-0">
                    <img 
                      src={selectedProfile.mainPhoto} 
                      alt={selectedProfile.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{selectedProfile.name}, {selectedProfile.age}</h3>
                      {selectedProfile.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3" />
                      {selectedProfile.neighborhood}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{selectedProfile.rating}</span>
                      </div>
                      {selectedProfile.isVip && (
                        <Badge className="badge-vip text-xs">
                          <Crown className="w-3 h-3" />
                          VIP
                        </Badge>
                      )}
                      {selectedProfile.isPremium && !selectedProfile.isVip && (
                        <Badge className="badge-premium text-xs">
                          <Sparkles className="w-3 h-3" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">R$ {selectedProfile.price}/h</span>
                      <Button size="sm" className="gradient-pink border-0">
                        Ver Perfil
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        )}

        {/* Profile Count */}
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="secondary" className="bg-background/95 backdrop-blur-lg">
            {mockProfiles.length} perfis nesta área
          </Badge>
        </div>
      </div>
    </div>
  );
}
