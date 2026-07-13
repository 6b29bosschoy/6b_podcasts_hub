import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { MessageCircle, X, Send, Bot } from "lucide-react";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "你好！我係路邊小助 🎙️\n\n我可以幫你解答關於路邊電台、路邊玄學堂嘅問題，或者推薦相關影片同服務。有咩想問？" },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const chatMutation = trpc.chatbot.chat.useMutation({
    onSuccess: (data) => {
      const reply = typeof data.reply === 'string' ? data.reply : String(data.reply);
      setMessages((prev) => [...prev, { role: "assistant" as const, content: reply }]);
    },
    onError: () => {
      setMessages((prev) => [...prev, { role: "assistant", content: "唔好意思，我而家有啲問題，請稍後再試。" }]);
    },
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || chatMutation.isPending) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const history = messages.slice(-10);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    chatMutation.mutate({ message: userMsg.content, history });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        style={{ background: "linear-gradient(135deg, var(--red), var(--gold))", boxShadow: "none" }}
      >
        {open ? <X size={22} color="white" /> : <MessageCircle size={22} color="white" />}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{ height: "480px", background: "var(--bg-card)", border: "1px solid var(--line)", boxShadow: "none" }}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3" style={{ background: "linear-gradient(135deg, var(--red), var(--gold))" }}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot size={16} color="white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">路邊小助</div>
              <div className="text-xs text-white/70">AI 玄學助手</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap"
                  style={
                    msg.role === "user"
                      ? { background: "var(--red)", color: "white" }
                      : { background: "var(--line)", color: "var(--text)", border: "1px solid var(--line)" }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-xl text-sm" style={{ background: "var(--line)", color: "var(--text-3)" }}>
                  思考中...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 flex gap-2" style={{ borderTop: "1px solid var(--line)" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="問我任何問題..."
              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--text)" }}
            />
            <button
              onClick={sendMessage}
              disabled={chatMutation.isPending || !input.trim()}
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
              style={{ background: "var(--red)" }}
            >
              <Send size={16} color="white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
