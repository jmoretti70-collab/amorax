import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Booking() {
  const { slug } = useParams<{ slug: string }>();
  const [, navigate] = useLocation();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<number>(60);
  const [locationType, setLocationType] = useState<"advertiser_place" | "client_place" | "hotel">("advertiser_place");
  const [locationAddress, setLocationAddress] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [step, setStep] = useState(1);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Fetch profile data
  const { data: profile, isLoading: profileLoading } = trpc.profiles.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  // Fetch available slots for selected date
  const { data: availabilityData, isLoading: slotsLoading } = trpc.appointments.getAvailableSlots.useQuery(
    { 
      profileId: profile?.id || 0, 
      date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "" 
    },
    { enabled: !!profile?.id && !!selectedDate }
  );

  // Create appointment mutation
  const createAppointment = trpc.appointments.create.useMutation({
    onSuccess: () => {
      setBookingComplete(true);
      toast.success("Agendamento realizado com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao realizar agendamento");
    }
  });

  const handleSubmit = () => {
    if (!profile?.id || !selectedDate || !selectedTime) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const appointmentDate = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    appointmentDate.setHours(hours, minutes, 0, 0);

    createAppointment.mutate({
      profileId: profile.id,
      clientName,
      clientPhone,
      clientEmail: clientEmail || undefined,
      appointmentDate: appointmentDate.toISOString(),
      duration,
      locationType,
      locationAddress: locationType !== "advertiser_place" ? locationAddress : undefined,
      clientNotes: clientNotes || undefined,
    });
  };

  // Calculate estimated price
  const hourlyRate = parseFloat(profile?.pricePerHour || "0");
  const estimatedPrice = (hourlyRate * duration) / 60;

  // Generate time slots
  const generateTimeSlots = () => {
    const slots: string[] = [];
    const availableSlots = availabilityData?.slots || [];
    
    if (availableSlots.length === 0) {
      // Default slots if no availability configured
      for (let hour = 9; hour <= 22; hour++) {
        slots.push(`${hour.toString().padStart(2, "0")}:00`);
      }
    } else {
      availableSlots.forEach(slot => {
        const [startHour] = slot.startTime.split(":").map(Number);
        const [endHour] = slot.endTime.split(":").map(Number);
        for (let hour = startHour; hour < endHour; hour++) {
          slots.push(`${hour.toString().padStart(2, "0")}:00`);
        }
      });
    }

    // Filter out already booked slots
    const bookedTimes = (availabilityData?.existingAppointments || []).map(apt => {
      const date = new Date(apt.appointmentDate);
      return `${date.getHours().toString().padStart(2, "0")}:00`;
    });

    return slots.filter(slot => !bookedTimes.includes(slot));
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Perfil não encontrado</h2>
            <Button onClick={() => navigate("/")}>Voltar ao início</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Agendamento Confirmado!</h2>
            <p className="text-muted-foreground mb-6">
              Seu agendamento com {profile.displayName} foi realizado com sucesso. 
              Você receberá uma confirmação em breve.
            </p>
            <div className="bg-muted rounded-lg p-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span>{selectedDate && format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{selectedTime} - {duration} minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>
                  {locationType === "advertiser_place" ? "Local do anunciante" :
                   locationType === "client_place" ? "Seu local" : "Hotel"}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => navigate(`/perfil/${slug}`)}>
                Ver Perfil
              </Button>
              <Button className="flex-1" onClick={() => navigate("/")}>
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/perfil/${slug}`)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Agendar com {profile.displayName}</h1>
              <p className="text-sm text-muted-foreground">
                {profile.city}, {profile.state}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Select Date & Time */}
            <Card className={step !== 1 ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    1
                  </div>
                  <div>
                    <CardTitle>Escolha a Data e Horário</CardTitle>
                    <CardDescription>Selecione quando deseja agendar</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block">Data</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setSelectedTime("");
                      }}
                      disabled={(date) => date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                      className="rounded-md border"
                      locale={ptBR}
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Horário Disponível</Label>
                    {selectedDate ? (
                      availabilityData?.isBlocked ? (
                        <div className="p-4 bg-destructive/10 rounded-lg text-center">
                          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                          <p className="text-sm">Esta data não está disponível</p>
                          {availabilityData.blockedReason && (
                            <p className="text-xs text-muted-foreground mt-1">{availabilityData.blockedReason}</p>
                          )}
                        </div>
                      ) : slotsLoading ? (
                        <div className="flex items-center justify-center p-8">
                          <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto">
                          {generateTimeSlots().map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedTime(time)}
                              className="w-full"
                            >
                              {time}
                            </Button>
                          ))}
                          {generateTimeSlots().length === 0 && (
                            <p className="col-span-3 text-center text-muted-foreground py-4">
                              Nenhum horário disponível
                            </p>
                          )}
                        </div>
                      )
                    ) : (
                      <div className="p-8 text-center text-muted-foreground border rounded-lg">
                        <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Selecione uma data primeiro</p>
                      </div>
                    )}

                    <div className="mt-4">
                      <Label className="mb-2 block">Duração</Label>
                      <Select value={String(duration)} onValueChange={(v) => setDuration(Number(v))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="120">2 horas</SelectItem>
                          <SelectItem value="180">3 horas</SelectItem>
                          <SelectItem value="240">4 horas</SelectItem>
                          <SelectItem value="480">Pernoite (8h)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                {selectedDate && selectedTime && (
                  <Button className="w-full mt-4" onClick={() => setStep(2)}>
                    Continuar
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Step 2: Location */}
            <Card className={step !== 2 ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    2
                  </div>
                  <div>
                    <CardTitle>Local do Encontro</CardTitle>
                    <CardDescription>Onde será o atendimento?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {profile.hasOwnPlace && (
                    <Button
                      variant={locationType === "advertiser_place" ? "default" : "outline"}
                      className="flex flex-col h-auto py-4"
                      onClick={() => setLocationType("advertiser_place")}
                    >
                      <MapPin className="h-5 w-5 mb-1" />
                      <span className="text-xs">Local do Anunciante</span>
                    </Button>
                  )}
                  {profile.doesOutcalls && (
                    <Button
                      variant={locationType === "client_place" ? "default" : "outline"}
                      className="flex flex-col h-auto py-4"
                      onClick={() => setLocationType("client_place")}
                    >
                      <MapPin className="h-5 w-5 mb-1" />
                      <span className="text-xs">Meu Local</span>
                    </Button>
                  )}
                  <Button
                    variant={locationType === "hotel" ? "default" : "outline"}
                    className="flex flex-col h-auto py-4"
                    onClick={() => setLocationType("hotel")}
                  >
                    <MapPin className="h-5 w-5 mb-1" />
                    <span className="text-xs">Hotel/Motel</span>
                  </Button>
                </div>

                {locationType !== "advertiser_place" && (
                  <div className="mt-4">
                    <Label htmlFor="address">Endereço</Label>
                    <Textarea
                      id="address"
                      placeholder="Digite o endereço completo"
                      value={locationAddress}
                      onChange={(e) => setLocationAddress(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>Voltar</Button>
                    <Button className="flex-1" onClick={() => setStep(3)}>Continuar</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Step 3: Contact Info */}
            <Card className={step !== 3 ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    3
                  </div>
                  <div>
                    <CardTitle>Seus Dados</CardTitle>
                    <CardDescription>Como podemos entrar em contato?</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Seu nome"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">WhatsApp *</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="(11) 99999-9999"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email (opcional)</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Alguma informação adicional?"
                      value={clientNotes}
                      onChange={(e) => setClientNotes(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                {step === 3 && (
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={() => setStep(2)}>Voltar</Button>
                    <Button 
                      className="flex-1" 
                      onClick={handleSubmit}
                      disabled={!clientName || !clientPhone || createAppointment.isPending}
                    >
                      {createAppointment.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Agendando...
                        </>
                      ) : (
                        "Confirmar Agendamento"
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumo do Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile Info */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-pink-500/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {profile.displayName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{profile.displayName}</h3>
                    <p className="text-sm text-muted-foreground">{profile.city}, {profile.state}</p>
                    <div className="flex gap-1 mt-1">
                      {profile.documentsVerified && (
                        <Badge variant="secondary" className="text-xs">Verificado</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data</span>
                    <span className="font-medium">
                      {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Horário</span>
                    <span className="font-medium">{selectedTime || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duração</span>
                    <span className="font-medium">
                      {duration >= 60 ? `${duration / 60}h` : `${duration}min`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Local</span>
                    <span className="font-medium text-right">
                      {locationType === "advertiser_place" ? "Local do anunciante" :
                       locationType === "client_place" ? "Seu local" : "Hotel/Motel"}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Valor Estimado</span>
                    <span className="text-2xl font-bold text-primary">
                      R$ {estimatedPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    *Valor baseado no preço por hora. Confirme com o anunciante.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Após confirmar, {profile.displayName} entrará em contato para confirmar os detalhes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
