"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Send, Bot, User, Lightbulb, AlertTriangle, Sparkles, ArrowLeft } from "lucide-react";

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "Hi, need summarization? Ping me",
      timestamp: "10:30 AM"
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const suggestions = [
    "Analyze current compliance status",
    "Generate audit report",
    "Review security policies",
    "Check regulatory requirements"
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "ai" as const,
        content: "I'm here to help with your compliance needs! I can analyze your current setup, generate reports, and provide recommendations based on various regulatory frameworks.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex">
      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200 p-4 flex items-center gap-4 sticky top-0 z-10">
          <Button variant="ghost" size="sm" className="text-amber-700 hover:bg-amber-100">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Home Page
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-2xl font-bold text-amber-800">Summary</h1>
          </div>
          <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">📄</span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4 max-w-2xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {message.type === 'ai' && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-xs text-amber-600 mt-1 text-center">Bot</div>
                  </div>
                )}
                
                <div className={`flex-1 max-w-md ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`inline-block p-4 rounded-2xl shadow-sm ${
                    message.type === 'ai' 
                      ? 'bg-amber-600 text-white rounded-bl-md' 
                      : 'bg-white text-amber-800 border border-amber-200 rounded-br-md'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>

                {message.type === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-xs text-amber-600 mt-1 text-center">Bot</div>
                </div>
                <div className="flex-1">
                  <div className="inline-block p-4 bg-amber-600 text-white rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-amber-200 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your question..."
                className="pr-12 border-amber-300 focus:border-amber-500 focus:ring-amber-500 bg-white rounded-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim() || isTyping}
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-amber-600 hover:bg-amber-700 p-0"
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;