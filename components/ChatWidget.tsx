"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, Bot, ExternalLink } from "lucide-react";
import { useLocale } from "@/lib/i18n/LocaleContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  options?: QuickReply[];
}

interface QuickReply {
  id: string;
  text: string;
  answer?: string;
  action?: "telegram" | "email" | "pricing" | "live-results";
}

export default function ChatWidget() {
  const { t, locale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get quick replies from translations
  const quickReplies: QuickReply[] = Array.isArray(t('chatWidget.quickReplies'))
    ? t('chatWidget.quickReplies').map((reply: any, index: number) => ({
        id: (index + 1).toString(),
        text: reply.text,
        answer: reply.answer,
        action: index === 1 ? "live-results" : undefined
      }))
    : [];

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        text: t('chatWidget.welcome'),
        sender: "bot",
        timestamp: new Date(),
        options: quickReplies
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, locale]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleQuickReply = (reply: QuickReply) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: reply.text,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Add bot response after delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: reply.answer || t('chatWidget.processing'),
        sender: "bot",
        timestamp: new Date(),
        options: reply.id === "7" ? undefined : quickReplies // Show options again except for "other"
      };

      setMessages(prev => [...prev, botMessage]);

      // Handle actions
      if (reply.action === "telegram") {
        setTimeout(() => {
          window.open("https://t.me/+0ETUdIuYUzdhZWQ1", "_blank");
        }, 1000);
      } else if (reply.action === "live-results") {
        setTimeout(() => {
          window.location.href = "/live-results";
        }, 2000);
      } else if (reply.action === "pricing") {
        setTimeout(() => {
          window.location.href = "/pricing";
        }, 2000);
      }
    }, 800);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Bot response for custom messages
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: t('chatWidget.customMessageResponse'),
        sender: "bot",
        timestamp: new Date(),
        options: [
          {
            id: "contact-telegram",
            text: t('chatWidget.contactOptions.telegram'),
            answer: t('chatWidget.contactAnswers.telegram'),
            action: "telegram"
          },
          {
            id: "contact-email",
            text: t('chatWidget.contactOptions.email'),
            answer: t('chatWidget.contactAnswers.email'),
            action: "email"
          },
          {
            id: "back-menu",
            text: t('chatWidget.contactOptions.backMenu'),
            answer: t('chatWidget.contactAnswers.backMenu'),
          }
        ]
      };

      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };

  const handleContactAction = (action: string) => {
    if (action === "telegram") {
      window.open("https://t.me/+0ETUdIuYUzdhZWQ1", "_blank");
    } else if (action === "email") {
      window.location.href = "mailto:support@thebenchmarktrader.com?subject=Hỏi về EA ThebenchmarkTrader";
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all duration-300 hover:scale-110 group"
          aria-label="Open chat"
          suppressHydrationWarning={true}
        >
          <MessageCircle size={28} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center animate-pulse">
            1
          </span>
          <span className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {t('chatWidget.buttonTooltip')}
          </span>
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Bot className="text-blue-600" size={24} />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h3 className="font-bold">{t('chatWidget.header.title')}</h3>
                <p className="text-xs text-blue-100">{t('chatWidget.header.subtitle')}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
              aria-label="Close chat"
              suppressHydrationWarning={true}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id}>
                <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-2`}>
                  <div className={`max-w-[80%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
                    <div className={`flex items-start space-x-2 ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === "user" ? "bg-blue-600" : "bg-gray-300"
                      }`}>
                        {message.sender === "user" ? (
                          <User size={16} className="text-white" />
                        ) : (
                          <Bot size={16} className="text-gray-700" />
                        )}
                      </div>
                      <div>
                        <div className={`px-4 py-3 rounded-2xl ${
                          message.sender === "user"
                            ? "bg-blue-600 text-white rounded-tr-none"
                            : "bg-white text-gray-800 rounded-tl-none shadow-sm"
                        }`}>
                          <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                        </div>
                        <p className={`text-xs text-gray-400 mt-1 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                          {message.timestamp.toLocaleTimeString(locale === 'vi' ? 'vi-VN' : 'en-US', { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Reply Options */}
                {message.options && (
                  <div className="space-y-2 ml-10 mt-3">
                    {message.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          if (option.action === "telegram" || option.action === "email") {
                            handleContactAction(option.action);
                          } else {
                            handleQuickReply(option);
                          }
                        }}
                        className="block w-full text-left px-4 py-2 bg-white border-2 border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all text-sm font-medium"
                        suppressHydrationWarning={true}
                      >
                        {option.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={t('chatWidget.input.placeholder')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-sm"
                suppressHydrationWarning={true}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
                suppressHydrationWarning={true}
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {t('chatWidget.input.hint')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

