import { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  X,
  Send,
  ArrowUp,
  Phone,
  Mail,
  Minus,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
} from "lucide-react";
import { saveChatInquiry, checkNeonHealth, type ChatInquiry } from "@/lib/neon-db";
import { askGemini } from "@/lib/gemini";

interface Message {
  id: string;
  sender: "visitor" | "assistant" | "system";
  text: string;
  timestamp: string;
}

export function ChatWidget() {
  // Widget states: 'popup' (initial state matching uploaded screenshot), 'chat' (open conversation), 'minimized' (just bubble)
  const [viewState, setViewState] = useState<"popup" | "chat" | "minimized">("popup");
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "assistant",
      text: "👋 Welcome to RotoIntellecta AI! How can our rotating machinery specialists help you today?",
      timestamp: "Just now",
    },
  ]);
  const [visitorContact, setVisitorContact] = useState("");
  const [isAskingContact, setIsAskingContact] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [dbConnected, setDbConnected] = useState<boolean>(true);
  const [sessionId] = useState(() => "session_" + Math.random().toString(36).substring(2, 9));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check Neon database connectivity on mount
  useEffect(() => {
    checkNeonHealth().then((res) => {
      setDbConnected(res.connected);
    });
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (viewState === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, viewState]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputValue.trim();
    if (!textToSend || isSending) return;

    setInputValue("");
    setIsSending(true);

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "visitor",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const nextMessages = [...messages, newMsg];
    setMessages(nextMessages);

    // Open chat window if sending from popup view
    if (viewState === "popup") {
      setViewState("chat");
    }

    // Save visitor message to Neon PostgreSQL
    try {
      await saveChatInquiry({
        sessionId,
        name: "Website Visitor",
        contact: visitorContact || "Anonymous",
        message: textToSend,
        sender: "visitor",
      });
    } catch (e) {
      console.warn("Neon persistence note:", e);
    }

    // Ask Gemini AI with full conversation context
    try {
      const history = nextMessages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));
      const replyText = await askGemini(textToSend, history);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // Save bot message to Neon PostgreSQL
      try {
        await saveChatInquiry({
          sessionId,
          name: "RotoIntellecta AI (Gemini)",
          contact: "Rotointellecta@gmail.com",
          message: replyText,
          sender: "assistant",
        });
      } catch (e) {
        console.warn("Neon persistence note:", e);
      }
    } catch (err) {
      console.error("Gemini assistant error:", err);
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: "Thank you for reaching out! You can reach our rotating machinery engineering desk directly at 📞 +91 88911 44334 or ✉️ Rotointellecta@gmail.com.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickQuestion = (q: string) => {
    handleSendMessage(q);
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      {/* 1. POPUP CARD VIEW (Exact match to uploaded user image) */}
      {viewState === "popup" && (
        <div className="mb-2 w-[calc(100vw-1.5rem)] max-w-[340px] sm:max-w-[360px] rounded-3xl bg-[#f5f5f5] p-4 sm:p-5 shadow-2xl border border-zinc-200/90 text-zinc-900 animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Top Row with Waving Hand & Avatar */}
          <div className="relative flex flex-col items-center pt-2 pb-1">
            <span className="text-5xl select-none animate-bounce" role="img" aria-label="waving hand">
              👋
            </span>
            <div className="absolute right-0 top-0 flex size-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-md">
              <Bot className="size-5" />
            </div>
          </div>

          {/* Greeting text */}
          <p className="mt-3 text-center text-sm font-medium text-zinc-800 leading-snug">
            Hi, let us know if you have any questions.
          </p>

          {/* Quick Action Buttons */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setViewState("chat")}
              className="rounded-full bg-[#0d47a1] hover:bg-[#09357a] text-white px-5 py-2 text-xs font-semibold shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              Chat now
            </button>
            <button
              type="button"
              onClick={() => setViewState("minimized")}
              className="rounded-full bg-zinc-200/80 hover:bg-zinc-300/80 text-zinc-700 px-4 py-2 text-xs font-medium transition-colors cursor-pointer"
            >
              Just browsing
            </button>
          </div>

          {/* Bottom input area matching the image */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="mt-5 flex items-center gap-2 rounded-full bg-white px-3.5 py-2 border border-zinc-200/80 shadow-xs"
          >
            <input
              type="text"
              placeholder="Write a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-transparent text-xs text-zinc-800 placeholder-zinc-400 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              aria-label="Send message"
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-700 hover:bg-zinc-300 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ArrowUp className="size-4" />
            </button>
          </form>
        </div>
      )}

      {/* 2. EXPANDED FULL CHAT CONVERSATION VIEW */}
      {viewState === "chat" && (
        <div className="mb-2 flex h-[calc(100dvh-5.5rem)] max-h-[520px] w-[calc(100vw-1.5rem)] max-w-[380px] flex-col rounded-3xl bg-white shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-zinc-950 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative flex size-9 items-center justify-center rounded-xl bg-white/10 text-white font-bold">
                <Bot className="size-5 text-emerald-400" />
                <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-zinc-950"></span>
              </div>
              <div>
                <h4 className="text-xs font-bold tracking-tight text-white flex items-center gap-1.5">
                  RotoIntellecta AI Desk
                  <span className="rounded bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 text-[9px] font-mono">
                    ONLINE
                  </span>
                </h4>
                <p className="text-[10px] text-zinc-400">24/7 Technical Dispatch</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewState("minimized")}
                className="grid size-7 place-items-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Minimize"
              >
                <Minus className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewState("popup")}
                className="grid size-7 place-items-center rounded-lg text-zinc-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Back to prompt"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Quick contact banner */}
          <div className="bg-zinc-100 px-4 py-2 border-b border-zinc-200 flex items-center justify-between text-[11px] font-mono text-zinc-600">
            <a href="tel:8891144334" className="flex items-center gap-1 hover:text-zinc-950 text-zinc-800 font-semibold">
              <Phone className="size-3 text-emerald-600" /> +91 88911 44334
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=Rotointellecta@gmail.com&su=Technical%20Inquiry%20-%20RotoIntellecta%20AI"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-950 text-zinc-500 hover:underline"
            >
              Rotointellecta@gmail.com
            </a>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#fafafa]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "visitor" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                    m.sender === "visitor"
                      ? "bg-zinc-950 text-white rounded-br-xs"
                      : "bg-white text-zinc-800 border border-zinc-200/80 rounded-bl-xs"
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                <span className="mt-1 text-[9px] font-mono text-zinc-400 px-1">{m.timestamp}</span>
              </div>
            ))}
            {isSending && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 italic">
                <span className="size-1.5 rounded-full bg-zinc-400 animate-pulse"></span>
                <span>Specialist is typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 py-2 bg-white border-t border-zinc-100 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <button
              type="button"
              onClick={() => handleQuickQuestion("I need emergency vibration analysis.")}
              className="shrink-0 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-2.5 py-1 transition-colors cursor-pointer"
            >
              🚨 Emergency RCA
            </button>
            <button
              type="button"
              onClick={() => handleQuickQuestion("What are the upcoming Mobius training dates?")}
              className="shrink-0 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-2.5 py-1 transition-colors cursor-pointer"
            >
              🎓 Mobius Training
            </button>
            <button
              type="button"
              onClick={() => handleQuickQuestion("What is your official phone number?")}
              className="shrink-0 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-2.5 py-1 transition-colors cursor-pointer"
            >
              📞 Call Details
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Write a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 rounded-xl bg-zinc-100 px-3.5 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-hidden focus:bg-white focus:ring-1 focus:ring-zinc-400 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isSending}
              aria-label="Send message"
              className="grid size-8 place-items-center rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 disabled:opacity-30 transition-colors cursor-pointer shadow-sm"
            >
              <Send className="size-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* 3. FLOATING TRIGGER BUTTON (When Minimized) */}
      {viewState === "minimized" && (
        <button
          type="button"
          onClick={() => setViewState("popup")}
          className="group relative flex size-14 items-center justify-center rounded-full bg-zinc-950 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white/20"
          aria-label="Open chat"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform select-none">👋</span>
          <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500"></span>
          </span>
        </button>
      )}
    </div>
  );
}
