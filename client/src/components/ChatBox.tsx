import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ChatBoxProps {
  conversationId: number;
  advertiserName: string;
  onClose?: () => void;
}

export function ChatBox({ conversationId, advertiserName, onClose }: ChatBoxProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch messages
  const { data: messages, isLoading, refetch } = trpc.chat.getMessages.useQuery(
    { conversationId },
    { refetchInterval: 2000 } // Poll every 2 seconds
  );

  // Send message mutation
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      setMessage("");
      setIsSending(false);
      refetch();
    },
    onError: () => {
      setIsSending(false);
    },
  });

  // Mark as read mutation
  const markAsReadMutation = trpc.chat.markAsRead.useMutation();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Mark messages as read when component mounts
  useEffect(() => {
    markAsReadMutation.mutate({ conversationId });
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);
    await sendMessageMutation.mutateAsync({
      conversationId,
      content: message,
    });
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h3 className="font-semibold text-foreground">{advertiserName}</h3>
          <p className="text-xs text-muted-foreground">Chat direto</p>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </Button>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages && messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.senderId === user?.id ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.senderId === user?.id
                      ? "bg-gradient-to-r from-pink-500 to-magenta-500 text-white rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  }`}
                >
                  <p className="text-sm break-words">{msg.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      msg.senderId === user?.id
                        ? "text-pink-100"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatDistanceToNow(new Date(msg.createdAt), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <p className="text-sm">Nenhuma mensagem ainda. Comece a conversa!</p>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isSending}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isSending || !message.trim()}
            size="icon"
            className="bg-gradient-to-r from-pink-500 to-magenta-500 hover:from-pink-600 hover:to-magenta-600"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
