import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { ChatBox } from "@/components/ChatBox";
import { MessageCircle, Loader2, Heart } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "wouter";

export default function Messages() {
  const { user, loading } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch conversations
  const { data: conversations, isLoading } = trpc.chat.listConversations.useQuery(
    undefined,
    { enabled: !!user }
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <MessageCircle className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold text-foreground">Faça login para acessar mensagens</h2>
        <p className="text-muted-foreground">Você precisa estar autenticado para ver suas conversas</p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-pink-500 to-magenta-500 hover:from-pink-600 hover:to-magenta-600">
            Voltar ao início
          </Button>
        </Link>
      </div>
    );
  }

  const filteredConversations = conversations?.filter((conv) =>
    conv.advertiser?.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const selectedConversation = conversations?.find(
    (c) => c.id === selectedConversationId
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Amorax" className="w-10 h-10 rounded-xl object-cover" />
            <span className="text-xl font-bold text-gradient">Amorax</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-20 pb-8">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
            {/* Conversations List */}
            <div className="lg:col-span-1 flex flex-col border border-border rounded-lg bg-card">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-bold text-foreground mb-4">Mensagens</h2>
                <Input
                  placeholder="Buscar conversa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              <ScrollArea className="flex-1">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredConversations.length > 0 ? (
                  <div className="space-y-2 p-2">
                    {filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversationId(conv.id)}
                        className={`w-full p-3 rounded-lg text-left transition-colors ${
                          selectedConversationId === conv.id
                            ? "bg-gradient-to-r from-pink-500/20 to-magenta-500/20 border border-pink-500/50"
                            : "hover:bg-muted"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">
                              {conv.advertiser?.displayName}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                              {conv.lastMessage || "Nenhuma mensagem"}
                            </p>
                            {conv.lastMessageAt && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatDistanceToNow(new Date(conv.lastMessageAt), {
                                  addSuffix: true,
                                  locale: ptBR,
                                })}
                              </p>
                            )}
                          </div>
                          {conv.userUnreadCount > 0 && (
                            <div className="bg-gradient-to-r from-pink-500 to-magenta-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">
                              {conv.userUnreadCount}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    <MessageCircle className="w-8 h-8 mb-2" />
                    <p className="text-sm">Nenhuma conversa</p>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Chat Box */}
            <div className="lg:col-span-2 hidden lg:flex flex-col border border-border rounded-lg bg-card">
              {selectedConversation ? (
                <ChatBox
                  conversationId={selectedConversation.id}
                  advertiserName={selectedConversation.advertiser?.displayName || "Acompanhante"}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Heart className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-lg font-semibold">Selecione uma conversa</p>
                  <p className="text-sm">Escolha uma conversa na lista para começar a chatear</p>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Chat Modal */}
          {selectedConversationId && selectedConversation && (
            <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
              <div className="w-full h-[90vh] bg-background rounded-t-lg">
                <ChatBox
                  conversationId={selectedConversation.id}
                  advertiserName={selectedConversation.advertiser?.displayName || "Acompanhante"}
                  onClose={() => setSelectedConversationId(null)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
