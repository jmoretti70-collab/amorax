import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  MapPin,
  Check,
  X,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Settings,
  Ban
} from "lucide-react";

const DAYS_OF_WEEK = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda" },
  { value: 2, label: "Terça" },
  { value: 3, label: "Quarta" },
  { value: 4, label: "Quinta" },
  { value: 5, label: "Sexta" },
  { value: 6, label: "Sábado" },
];

const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => 
  `${i.toString().padStart(2, "0")}:00`
);

export default function ScheduleManagement() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekStart, setWeekStart] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showAppointmentDialog, setShowAppointmentDialog] = useState(false);
  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);
  
  // Availability state
  const [availabilitySlots, setAvailabilitySlots] = useState<Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }>>([]);

  // Get user's profile
  const { data: profile, isLoading: profileLoading } = trpc.profiles.getMyProfile.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Get appointments for the selected week
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const { data: appointmentsData, isLoading: appointmentsLoading, refetch: refetchAppointments } = trpc.appointments.listForAdvertiser.useQuery(
    {
      profileId: profile?.id || 0,
      startDate: weekStart.toISOString(),
      endDate: weekEnd.toISOString(),
      status: "all",
      limit: 100,
    },
    { enabled: !!profile?.id }
  );

  // Get availability slots
  const { data: slotsData, refetch: refetchSlots } = trpc.availability.getSlots.useQuery(
    { profileId: profile?.id || 0 },
    { enabled: !!profile?.id }
  );

  // Get blocked dates
  const { data: blockedDates, refetch: refetchBlocked } = trpc.availability.getBlockedDates.useQuery(
    {
      profileId: profile?.id || 0,
      startDate: weekStart.toISOString(),
      endDate: weekEnd.toISOString(),
    },
    { enabled: !!profile?.id }
  );

  // Mutations
  const updateStatus = trpc.appointments.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Status atualizado com sucesso!");
      refetchAppointments();
      setShowAppointmentDialog(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar status");
    }
  });

  const setSlots = trpc.availability.setSlots.useMutation({
    onSuccess: () => {
      toast.success("Disponibilidade salva com sucesso!");
      refetchSlots();
      setShowAvailabilityDialog(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao salvar disponibilidade");
    }
  });

  const toggleBlockDate = trpc.availability.toggleBlockDate.useMutation({
    onSuccess: (data) => {
      toast.success(data.blocked ? "Data bloqueada" : "Data desbloqueada");
      refetchBlocked();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao bloquear/desbloquear data");
    }
  });

  // Loading state
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Perfil não encontrado</h2>
            <p className="text-muted-foreground mb-4">
              Você precisa criar um perfil de anunciante primeiro.
            </p>
            <Button onClick={() => navigate("/anunciar")}>Criar Perfil</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get appointments for a specific day
  const getAppointmentsForDay = (date: Date) => {
    return (appointmentsData?.appointments || []).filter(apt => 
      isSameDay(new Date(apt.appointmentDate), date)
    );
  };

  // Check if date is blocked
  const isDateBlocked = (date: Date) => {
    return (blockedDates || []).some(bd => 
      isSameDay(new Date(bd.date), date)
    );
  };

  // Week navigation
  const goToPreviousWeek = () => setWeekStart(addDays(weekStart, -7));
  const goToNextWeek = () => setWeekStart(addDays(weekStart, 7));
  const goToCurrentWeek = () => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Week days
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pendente</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Confirmado</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Cancelado</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Concluído</Badge>;
      case "no_show":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">Não Compareceu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Open availability dialog
  const openAvailabilityDialog = () => {
    setAvailabilitySlots(slotsData || []);
    setShowAvailabilityDialog(true);
  };

  // Add availability slot
  const addSlot = () => {
    setAvailabilitySlots([...availabilitySlots, {
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "18:00",
      isActive: true,
    }]);
  };

  // Remove availability slot
  const removeSlot = (index: number) => {
    setAvailabilitySlots(availabilitySlots.filter((_, i) => i !== index));
  };

  // Update slot
  const updateSlot = (index: number, field: string, value: any) => {
    const updated = [...availabilitySlots];
    updated[index] = { ...updated[index], [field]: value };
    setAvailabilitySlots(updated);
  };

  // Save availability
  const saveAvailability = () => {
    if (!profile?.id) return;
    setSlots.mutate({
      profileId: profile.id,
      slots: availabilitySlots,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Gerenciar Agenda</h1>
                <p className="text-sm text-muted-foreground">
                  {profile.displayName}
                </p>
              </div>
            </div>
            <Button onClick={openAvailabilityDialog}>
              <Settings className="h-4 w-4 mr-2" />
              Configurar Disponibilidade
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <Tabs defaultValue="calendar" className="space-y-6">
          <TabsList>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>

          {/* Calendar View */}
          <TabsContent value="calendar" className="space-y-6">
            {/* Week Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={goToNextWeek}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="ghost" onClick={goToCurrentWeek}>
                  Hoje
                </Button>
              </div>
              <h2 className="text-lg font-semibold">
                {format(weekStart, "dd 'de' MMMM", { locale: ptBR })} - {format(weekEnd, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </h2>
            </div>

            {/* Week Grid */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const dayAppointments = getAppointmentsForDay(day);
                const isBlocked = isDateBlocked(day);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <Card 
                    key={day.toISOString()} 
                    className={`min-h-[200px] ${isToday ? "ring-2 ring-primary" : ""} ${isBlocked ? "bg-muted/50" : ""}`}
                  >
                    <CardHeader className="p-3 pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            {format(day, "EEEE", { locale: ptBR })}
                          </p>
                          <p className={`text-lg font-bold ${isToday ? "text-primary" : ""}`}>
                            {format(day, "dd")}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => toggleBlockDate.mutate({
                            profileId: profile.id,
                            date: format(day, "yyyy-MM-dd"),
                          })}
                        >
                          <Ban className={`h-3 w-3 ${isBlocked ? "text-destructive" : "text-muted-foreground"}`} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-2 space-y-1">
                      {isBlocked && (
                        <div className="text-xs text-center text-muted-foreground py-2">
                          Indisponível
                        </div>
                      )}
                      {dayAppointments.map((apt) => (
                        <button
                          key={apt.id}
                          className={`w-full text-left p-2 rounded text-xs transition-colors ${
                            apt.status === "confirmed" ? "bg-green-500/20 hover:bg-green-500/30" :
                            apt.status === "pending" ? "bg-yellow-500/20 hover:bg-yellow-500/30" :
                            apt.status === "cancelled" ? "bg-red-500/20 hover:bg-red-500/30" :
                            "bg-muted hover:bg-muted/80"
                          }`}
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setShowAppointmentDialog(true);
                          }}
                        >
                          <div className="font-medium truncate">
                            {format(new Date(apt.appointmentDate), "HH:mm")} - {apt.clientName}
                          </div>
                          <div className="text-muted-foreground truncate">
                            {apt.duration}min
                          </div>
                        </button>
                      ))}
                      {dayAppointments.length === 0 && !isBlocked && (
                        <div className="text-xs text-center text-muted-foreground py-4">
                          Sem agendamentos
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list" className="space-y-4">
            {appointmentsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (appointmentsData?.appointments || []).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum agendamento</h3>
                  <p className="text-muted-foreground">
                    Você não tem agendamentos para este período.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {(appointmentsData?.appointments || []).map((apt) => (
                  <Card 
                    key={apt.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setSelectedAppointment(apt);
                      setShowAppointmentDialog(true);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{apt.clientName}</h3>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                {format(new Date(apt.appointmentDate), "dd/MM/yyyy")}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(apt.appointmentDate), "HH:mm")}
                              </span>
                              <span>{apt.duration}min</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-semibold text-primary">
                              R$ {parseFloat(apt.estimatedPrice || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          {getStatusBadge(apt.status)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Appointment Details Dialog */}
      <Dialog open={showAppointmentDialog} onOpenChange={setShowAppointmentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Agendamento</DialogTitle>
            <DialogDescription>
              {selectedAppointment && format(new Date(selectedAppointment.appointmentDate), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                {getStatusBadge(selectedAppointment.status)}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedAppointment.clientName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${selectedAppointment.clientPhone}`} className="text-primary hover:underline">
                    {selectedAppointment.clientPhone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {format(new Date(selectedAppointment.appointmentDate), "HH:mm")} - {selectedAppointment.duration} minutos
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedAppointment.locationType === "advertiser_place" ? "Seu local" :
                     selectedAppointment.locationType === "client_place" ? "Local do cliente" : "Hotel/Motel"}
                  </span>
                </div>
                {selectedAppointment.locationAddress && (
                  <p className="text-sm text-muted-foreground ml-7">
                    {selectedAppointment.locationAddress}
                  </p>
                )}
              </div>

              {selectedAppointment.clientNotes && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">Observações do cliente:</p>
                  <p className="text-sm text-muted-foreground">{selectedAppointment.clientNotes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-muted-foreground">Valor estimado</span>
                <span className="text-xl font-bold text-primary">
                  R$ {parseFloat(selectedAppointment.estimatedPrice || "0").toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            {selectedAppointment?.status === "pending" && (
              <>
                <Button
                  variant="outline"
                  className="text-destructive"
                  onClick={() => updateStatus.mutate({
                    appointmentId: selectedAppointment.id,
                    status: "cancelled",
                    cancellationReason: "Cancelado pelo anunciante",
                  })}
                  disabled={updateStatus.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  Recusar
                </Button>
                <Button
                  onClick={() => updateStatus.mutate({
                    appointmentId: selectedAppointment.id,
                    status: "confirmed",
                  })}
                  disabled={updateStatus.isPending}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Confirmar
                </Button>
              </>
            )}
            {selectedAppointment?.status === "confirmed" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => updateStatus.mutate({
                    appointmentId: selectedAppointment.id,
                    status: "no_show",
                  })}
                  disabled={updateStatus.isPending}
                >
                  Não Compareceu
                </Button>
                <Button
                  onClick={() => updateStatus.mutate({
                    appointmentId: selectedAppointment.id,
                    status: "completed",
                  })}
                  disabled={updateStatus.isPending}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Concluir
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              asChild
            >
              <a href={`https://wa.me/55${selectedAppointment?.clientPhone?.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                <MessageSquare className="h-4 w-4 mr-2" />
                WhatsApp
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Availability Settings Dialog */}
      <Dialog open={showAvailabilityDialog} onOpenChange={setShowAvailabilityDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Configurar Disponibilidade</DialogTitle>
            <DialogDescription>
              Defina os horários em que você está disponível para atendimento.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {availabilitySlots.map((slot, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Select
                  value={String(slot.dayOfWeek)}
                  onValueChange={(v) => updateSlot(index, "dayOfWeek", Number(v))}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day.value} value={String(day.value)}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={slot.startTime}
                  onValueChange={(v) => updateSlot(index, "startTime", v)}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <span className="text-muted-foreground">até</span>

                <Select
                  value={slot.endTime}
                  onValueChange={(v) => updateSlot(index, "endTime", v)}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2 ml-auto">
                  <Switch
                    checked={slot.isActive}
                    onCheckedChange={(v) => updateSlot(index, "isActive", v)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => removeSlot(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button variant="outline" onClick={addSlot} className="w-full">
              + Adicionar Horário
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAvailabilityDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={saveAvailability} disabled={setSlots.isPending}>
              {setSlots.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Disponibilidade"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
