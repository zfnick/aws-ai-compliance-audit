"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  User, 
  Send, 
  Loader2, 
  Play,
  Shield,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  FileText,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface Message {
  id: number;
  type: "ai" | "user";
  content: string;
  timestamp: string;
  isScanning?: boolean;
}

interface ComplianceResult {
  category: string;
  score: number;
  description: string;
  issues: string;
  framework: string;
  criticalFindings: number;
  recommendations: string[];
}

interface UseCase {
  id: string;
  title: string;
  description: string;
  prompt: string;
  results: ComplianceResult[];
  overallScore: number;
  scanDuration: number;
}

const EnhancedAIAssistant = () => {
  // Mock use cases with detailed scenarios
  const mockUseCases: UseCase[] = [
    {
      id: "healthcare-hipaa",
      title: "Healthcare Data Protection (HIPAA)",
      description: "Hospital system with patient data across AWS infrastructure",
      prompt: "Scan our healthcare infrastructure for HIPAA compliance",
      overallScore: 68,
      scanDuration: 3500,
      results: [
        {
          category: "Administrative Safeguards",
          score: 75,
          description: "Access controls and workforce training policies need improvement. Missing security officer designations and user access reviews.",
          issues: "No designated security officer, quarterly access reviews missing",
          framework: "HIPAA",
          criticalFindings: 2,
          recommendations: [
            "Designate a HIPAA Security Officer",
            "Implement quarterly user access reviews",
            "Create workforce security training program"
          ]
        },
        {
          category: "Physical Safeguards", 
          score: 45,
          description: "Data center access controls insufficient. No biometric authentication for server rooms containing PHI.",
          issues: "Weak physical access controls, no audit logs for facility access",
          framework: "HIPAA",
          criticalFindings: 3,
          recommendations: [
            "Install biometric access controls",
            "Implement facility access audit logging",
            "Add security cameras in sensitive areas"
          ]
        },
        {
          category: "Technical Safeguards",
          score: 82,
          description: "Strong encryption implementation but missing audit controls for database access to PHI.",
          issues: "Database access logging incomplete, no integrity controls",
          framework: "HIPAA",
          criticalFindings: 1,
          recommendations: [
            "Enable comprehensive database audit logging",
            "Implement data integrity verification",
            "Add automatic logoff for idle sessions"
          ]
        }
      ]
    },
    {
      id: "fintech-gdpr",
      title: "Financial Services GDPR Compliance",
      description: "European fintech handling customer personal data",
      prompt: "Check our EU customer data processing for GDPR compliance",
      overallScore: 89,
      scanDuration: 2800,
      results: [
        {
          category: "Data Processing Lawfulness",
          score: 95,
          description: "Strong legal basis documentation and consent mechanisms. Well-implemented data processing registers.",
          issues: "Minor: Some legacy consent records need updating",
          framework: "GDPR",
          criticalFindings: 0,
          recommendations: [
            "Update legacy consent records to GDPR standards",
            "Implement automated consent expiry notifications"
          ]
        },
        {
          category: "Data Subject Rights",
          score: 78,
          description: "Good implementation of access and deletion rights. Data portability needs automation improvements.",
          issues: "Manual data portability process, slow response times",
          framework: "GDPR", 
          criticalFindings: 1,
          recommendations: [
            "Automate data portability export process",
            "Reduce data subject request response time to under 48 hours",
            "Implement self-service data access portal"
          ]
        },
        {
          category: "Privacy by Design",
          score: 92,
          description: "Excellent privacy impact assessments and data minimization practices across systems.",
          issues: "Some third-party integrations lack privacy assessments",
          framework: "GDPR",
          criticalFindings: 0,
          recommendations: [
            "Complete privacy assessments for all third-party integrations",
            "Implement privacy-preserving analytics"
          ]
        }
      ]
    },
    {
      id: "tech-iso27001", 
      title: "Technology Company ISO 27001",
      description: "SaaS platform seeking ISO 27001 certification",
      prompt: "Audit our information security management for ISO 27001 readiness",
      overallScore: 73,
      scanDuration: 4200,
      results: [
        {
          category: "Information Security Policies",
          score: 85,
          description: "Comprehensive security policies established. Need regular review cycles and staff acknowledgment tracking.",
          issues: "Policy review schedule needs formalization, no acknowledgment tracking",
          framework: "ISO 27001",
          criticalFindings: 1,
          recommendations: [
            "Establish annual policy review schedule",
            "Implement digital policy acknowledgment system",
            "Create policy exception approval process"
          ]
        },
        {
          category: "Access Control",
          score: 62,
          description: "Basic access controls in place but missing privileged access management and regular access reviews.",
          issues: "No PAM solution, inconsistent access reviews, shared accounts detected",
          framework: "ISO 27001",
          criticalFindings: 3,
          recommendations: [
            "Deploy Privileged Access Management (PAM) solution",
            "Eliminate all shared service accounts",
            "Implement monthly privileged access reviews",
            "Enable just-in-time access for administrative tasks"
          ]
        },
        {
          category: "Incident Management",
          score: 71,
          description: "Incident response procedures defined but need testing and automation improvements.",
          issues: "No tabletop exercises, manual escalation processes",
          framework: "ISO 27001",
          criticalFindings: 2,
          recommendations: [
            "Conduct quarterly incident response tabletop exercises",
            "Automate incident escalation procedures",
            "Establish security incident communication templates"
          ]
        }
      ]
    },
    {
      id: "startup-soc2",
      title: "Startup SOC 2 Type II Preparation", 
      description: "Growing startup preparing for first SOC 2 audit",
      prompt: "Evaluate our readiness for SOC 2 Type II audit",
      overallScore: 56,
      scanDuration: 3100,
      results: [
        {
          category: "Security",
          score: 48,
          description: "Foundational security controls missing. No formal risk assessment or security monitoring program.",
          issues: "No SIEM, missing vulnerability management, weak password policies",
          framework: "SOC 2",
          criticalFindings: 5,
          recommendations: [
            "Implement Security Information and Event Management (SIEM)",
            "Deploy automated vulnerability scanning",
            "Enforce strong password policies with MFA",
            "Establish formal risk assessment process",
            "Create security awareness training program"
          ]
        },
        {
          category: "Availability",
          score: 65,
          description: "Basic backup procedures exist but lack disaster recovery testing and SLA monitoring.",
          issues: "No DR testing, missing availability monitoring, inadequate backup verification",
          framework: "SOC 2",
          criticalFindings: 2,
          recommendations: [
            "Conduct semi-annual disaster recovery tests",
            "Implement availability monitoring and alerting", 
            "Automate backup verification procedures",
            "Define and monitor availability SLAs"
          ]
        },
        {
          category: "Confidentiality",
          score: 58,
          description: "Data classification program started but needs encryption improvements and data loss prevention.",
          issues: "Inconsistent data encryption, no DLP solution, weak data retention policies",
          framework: "SOC 2",
          criticalFindings: 3,
          recommendations: [
            "Deploy Data Loss Prevention (DLP) solution",
            "Implement end-to-end encryption for sensitive data",
            "Formalize data retention and disposal procedures",
            "Complete data classification for all systems"
          ]
        }
      ]
    },
    {
      id: "multi-cloud-compliance",
      title: "Multi-Cloud Enterprise Compliance",
      description: "Large enterprise with AWS, Azure, and GCP infrastructure",
      prompt: "Comprehensive compliance audit across our multi-cloud environment",
      overallScore: 81,
      scanDuration: 5200,
      results: [
        {
          category: "Cloud Security Posture",
          score: 87,
          description: "Strong cloud security implementation across all platforms. Minor configuration drift detected in non-production environments.",
          issues: "Dev environment security group overly permissive, unused IAM roles",
          framework: "Multi-Framework",
          criticalFindings: 1,
          recommendations: [
            "Implement cloud security posture management (CSPM)",
            "Automate security configuration compliance",
            "Regular cleanup of unused cloud resources",
            "Standardize security baselines across all cloud providers"
          ]
        },
        {
          category: "Identity & Access Management",
          score: 79,
          description: "Centralized IAM with SSO implemented. Need to improve cross-cloud privilege management and access analytics.",
          issues: "Inconsistent cross-cloud permissions, limited access analytics",
          framework: "Multi-Framework", 
          criticalFindings: 2,
          recommendations: [
            "Implement cloud access governance platform",
            "Deploy access analytics and anomaly detection",
            "Standardize IAM policies across cloud providers",
            "Implement just-in-time cloud access"
          ]
        },
        {
          category: "Data Protection",
          score: 75,
          description: "Data encryption implemented but key management needs improvement. Data residency controls adequate.",
          issues: "Manual key rotation, inconsistent encryption standards",
          framework: "Multi-Framework",
          criticalFindings: 1,
          recommendations: [
            "Implement automated key rotation policies",
            "Standardize encryption algorithms across all clouds",
            "Deploy cloud key management service integration",
            "Enhance data residency monitoring"
          ]
        }
      ]
    }
  ];

  // Framework-specific conversation responses
  const frameworkResponses = {
    "hipaa": {
      intro: "I'll analyze your healthcare infrastructure against HIPAA's Administrative, Physical, and Technical Safeguards. This includes reviewing access controls, encryption, audit logs, and workforce training compliance.",
      findings: "Your scan reveals critical gaps in physical safeguards and some administrative control improvements needed. The technical implementation shows strong encryption but needs enhanced audit capabilities."
    },
    "gdpr": {
      intro: "I'm evaluating your data processing activities against GDPR requirements including lawfulness, data subject rights, privacy by design, and breach notification procedures.",
      findings: "Your GDPR compliance shows strong legal basis documentation and privacy implementation, with room for improvement in data subject rights automation and response times."
    },
    "iso27001": {
      intro: "I'll assess your Information Security Management System against ISO 27001 controls including security policies, access management, incident response, and business continuity.",
      findings: "Your ISO 27001 readiness shows good policy framework but needs strengthening in access control management and incident response testing procedures."
    },
    "soc2": {
      intro: "I'm reviewing your controls against SOC 2 Trust Service Criteria: Security, Availability, Processing Integrity, Confidentiality, and Privacy.",
      findings: "Your SOC 2 preparation needs significant attention in foundational security controls and availability monitoring before you'll be audit-ready."
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content: "Hi, need summarization? Ping me. I can help you run compliance scans and explain audit readiness for your cloud infrastructure. I support HIPAA, GDPR, ISO 27001, SOC 2, and multi-cloud compliance frameworks.",
      timestamp: "10:30 AM"
    }
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentScan, setCurrentScan] = useState<ComplianceResult[] | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [currentUseCase, setCurrentUseCase] = useState<UseCase | null>(null);

  // Quick action buttons for common scenarios
  const quickActions = [
    { label: "Healthcare HIPAA Scan", useCase: "healthcare-hipaa" },
    { label: "EU GDPR Assessment", useCase: "fintech-gdpr" },
    { label: "ISO 27001 Readiness", useCase: "tech-iso27001" },
    { label: "SOC 2 Preparation", useCase: "startup-soc2" },
    { label: "Multi-Cloud Audit", useCase: "multi-cloud-compliance" }
  ];

  const runComplianceScan = async (useCaseId?: string) => {
    const useCase = useCaseId ? mockUseCases.find(uc => uc.id === useCaseId) : mockUseCases[0];
    if (!useCase) return;

    setCurrentUseCase(useCase);
    setIsScanning(true);
    setScanProgress(0);
    
    // Add scanning message
    const scanMessage: Message = {
      id: Date.now(),
      type: "ai",
      content: `🔍 ${useCase.description}\n\nRunning ${useCase.title} compliance scan across your infrastructure...\n\nAnalyzing: ${useCase.results.map(r => r.category).join(', ')}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isScanning: true
    };
    
    setMessages(prev => [...prev, scanMessage]);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return next;
      });
    }, useCase.scanDuration / 20);
    
    // Simulate scan delay based on use case
    setTimeout(() => {
      setCurrentScan(useCase.results);
      
      // Aggregate all recommendations
      const allRecommendations = useCase.results.flatMap(result => result.recommendations);
      setRecommendations(allRecommendations);
      setIsScanning(false);
      setScanProgress(0);
      
      // Add completion message with framework-specific insights
      const framework = useCase.results[0].framework.toLowerCase();
      const frameworkResponse = frameworkResponses[framework as keyof typeof frameworkResponses];
      
      const completionMessage: Message = {
        id: Date.now() + 1,
        type: "ai",
        content: `✅ ${useCase.title} scan completed!\n\n${frameworkResponse?.findings || 'Scan analysis complete.'}\n\nOverall Compliance Score: ${useCase.overallScore}%\n\nTotal Critical Findings: ${useCase.results.reduce((sum, r) => sum + r.criticalFindings, 0)}\n\nCheck the summary panel for detailed findings and ${allRecommendations.length} specific recommendations.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev.filter(m => !m.isScanning), completionMessage]);
    }, useCase.scanDuration);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = newMessage.toLowerCase();
    setNewMessage("");
    setIsTyping(true);

    // Check if user is asking for a specific framework or scan type
    let selectedUseCase = null;
    let frameworkIntro = "";

    if (messageContent.includes('hipaa') || messageContent.includes('healthcare') || messageContent.includes('medical')) {
      selectedUseCase = "healthcare-hipaa";
      frameworkIntro = frameworkResponses.hipaa.intro;
    } else if (messageContent.includes('gdpr') || messageContent.includes('privacy') || messageContent.includes('eu data')) {
      selectedUseCase = "fintech-gdpr";
      frameworkIntro = frameworkResponses.gdpr.intro;
    } else if (messageContent.includes('iso 27001') || messageContent.includes('iso27001') || messageContent.includes('information security')) {
      selectedUseCase = "tech-iso27001";
      frameworkIntro = frameworkResponses.iso27001.intro;
    } else if (messageContent.includes('soc 2') || messageContent.includes('soc2') || messageContent.includes('service organization')) {
      selectedUseCase = "startup-soc2";
      frameworkIntro = frameworkResponses.soc2.intro;
    } else if (messageContent.includes('multi-cloud') || messageContent.includes('aws azure gcp') || messageContent.includes('all clouds')) {
      selectedUseCase = "multi-cloud-compliance";
      frameworkIntro = "I'll perform a comprehensive compliance assessment across your AWS, Azure, and GCP infrastructure, evaluating security posture, identity management, and data protection controls.";
    }

    const isRequestingScan = messageContent.includes('scan') || 
                           messageContent.includes('check') || 
                           messageContent.includes('audit') ||
                           messageContent.includes('assess') ||
                           selectedUseCase !== null;

    setTimeout(() => {
      let aiResponse = "";
      
      if (isRequestingScan && selectedUseCase) {
        aiResponse = `${frameworkIntro}\n\nI'll start the compliance scan now.`;
        // Automatically trigger specific scan
        setTimeout(() => runComplianceScan(selectedUseCase), 1000);
      } else if (isRequestingScan) {
        aiResponse = "I'll run a comprehensive compliance scan for you. This will check your cloud configurations against major standards like GDPR, HIPAA, ISO 27001, and SOC 2. You can also specify a particular framework if you have specific requirements.";
        // Trigger default scan
        setTimeout(() => runComplianceScan(), 1000);
      } else if (messageContent.includes('explain') || messageContent.includes('what is') || messageContent.includes('help')) {
        aiResponse = "I can help you with:\n\n🔍 **Compliance Scanning**: Run comprehensive audits against HIPAA, GDPR, ISO 27001, SOC 2\n📊 **Risk Analysis**: Identify and prioritize compliance gaps\n📋 **Audit Readiness**: Provide human-readable explanations for audit preparation\n🛠️ **Remediation**: Specific recommendations to fix compliance issues\n\nTry asking: 'Scan for HIPAA compliance' or 'Check our GDPR readiness'";
      } else {
        aiResponse = "I can help explain your compliance status, run scans, or provide audit readiness guidance. What specific framework or area would you like me to focus on? I support HIPAA, GDPR, ISO 27001, SOC 2, and multi-cloud environments.";
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        type: "ai",
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const CircularProgress = ({ value, size = 80 }: { value: number; size?: number }) => {
    const radius = (size - 8) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#3b82f6"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-700">{value}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)] relative">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-10"></div>
      
      {/* Left Panel - Chat Interface */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl flex flex-col h-full">
        {/* Chat Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-white/30">
                  <AvatarFallback className="bg-transparent text-white">
                    <Bot className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white/50"></div>
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">AI Compliance Assistant</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/70 text-sm">Online • Ready to help</span>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => runComplianceScan()}
              disabled={isScanning}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300"
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="hidden sm:inline">Scanning...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Run Scan</span>
                </>
              )}
            </Button>
          </div>
          
          {/* Quick Action Buttons - Integrated into header */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className="text-white/90 text-sm font-medium mb-3">Quick Compliance Scans</h4>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => runComplianceScan(action.useCase)}
                  disabled={isScanning}
                  className="text-xs px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white transition-all duration-300 backdrop-blur-sm disabled:opacity-50"
                >
                  {action.label.replace(' Scan', '').replace(' Assessment', '').replace(' Preparation', '').replace(' Readiness', '').replace(' Audit', '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className={
                    message.type === 'ai' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                  }>
                    {message.type === 'ai' ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex-1 max-w-md ${
                  message.type === 'user' ? 'text-right' : 'text-left'
                }`}>
                  <div className={`p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                    message.type === 'ai' 
                      ? 'bg-white/10 border-white/20 text-white' 
                      : 'bg-gradient-to-r from-blue-500/80 to-purple-600/80 border-blue-400/30 text-white ml-auto'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                      {message.isScanning && (
                        <div className="flex items-center gap-2 mt-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-xs opacity-80">Analyzing your infrastructure...</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-white/50 mt-2 px-4">
                    {message.timestamp}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white max-w-md">
                    <div className="flex items-center gap-1">
                      <span className="text-sm opacity-80">Thinking</span>
                      <div className="flex space-x-1 ml-2">
                        <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Indicator (when scanning) */}
            {isScanning && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white max-w-lg">
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 64 64">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-white/20"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={175.929}
                            strokeDashoffset={175.929 * (1 - scanProgress / 100)}
                            className="text-blue-400 transition-all duration-500"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">{scanProgress}%</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm">Scanning Infrastructure</h4>
                        <p className="text-white/60 text-xs mt-1">
                          Analyzing compliance requirements and security configurations...
                        </p>
                        <div className="mt-2 text-xs text-white/50">
                          Step {Math.ceil(scanProgress / 25)} of 4: {
                            scanProgress < 25 ? 'Discovering resources' :
                            scanProgress < 50 ? 'Analyzing configurations' :
                            scanProgress < 75 ? 'Evaluating compliance rules' :
                            'Generating report'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Section */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask anything about compliance..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-xl backdrop-blur-sm focus:bg-white/20 focus:border-white/40 transition-all duration-300"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isTyping}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-xl px-6 shadow-lg transition-all duration-300"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick suggestions */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <button 
              onClick={() => setNewMessage("Scan for HIPAA compliance")}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs rounded-lg border border-white/20 transition-all duration-300"
            >
              HIPAA Scan
            </button>
            <button 
              onClick={() => setNewMessage("Check GDPR readiness")}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs rounded-lg border border-white/20 transition-all duration-300"
            >
              GDPR Check
            </button>
            <button 
              onClick={() => setNewMessage("What is my compliance status?")}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white text-xs rounded-lg border border-white/20 transition-all duration-300"
            >
              Status Check
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Summary */}
      <div className="space-y-4">
        {/* Analysis Status */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">
                {currentUseCase?.title || "Compliance Analysis"}
              </h3>
              <Badge className="bg-gradient-to-r from-emerald-500/80 to-teal-600/80 text-white border-emerald-400/30 backdrop-blur-sm">
                {currentScan ? 'Complete' : 'Ready'}
              </Badge>
            </div>
            
            {currentUseCase && (
              <p className="text-white/70 text-sm mb-6">{currentUseCase.description}</p>
            )}

            {currentScan && currentUseCase ? (
              <>
                {/* Overall Score */}
                <div className="text-center mb-6">
                  <div className="mx-auto mb-4">
                    <div className="relative w-24 h-24 mx-auto">
                      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-white/20"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={251.33}
                          strokeDashoffset={251.33 * (1 - (currentUseCase?.overallScore || 0) / 100)}
                          className="text-gradient-to-r from-blue-400 to-purple-500 transition-all duration-1000"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">{currentUseCase?.overallScore || 0}%</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-white text-lg font-semibold">Overall Compliance Score</h3>
                  <p className="text-white/70 text-sm">
                    {currentUseCase?.results.reduce((sum, r) => sum + r.criticalFindings, 0) || 0} critical findings • 
                    {currentUseCase?.results.length || 0} categories assessed
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-white">{currentUseCase?.overallScore || 0}%</div>
                    <div className="text-white/60 text-xs">Overall</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-red-400">
                      {currentUseCase?.results.reduce((sum, r) => sum + r.criticalFindings, 0) || 0}
                    </div>
                    <div className="text-white/60 text-xs">Critical</div>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="text-2xl font-bold text-amber-400">{currentUseCase?.results.length || 0}</div>
                    <div className="text-white/60 text-xs">Categories</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Shield className="h-8 w-8 text-white/60" />
                </div>
                <p className="text-white/60 text-sm mb-4">Run a compliance scan to see detailed analysis</p>
                <div className="space-y-2 text-white/50 text-xs">
                  <p>💡 Try: "Scan for HIPAA compliance"</p>
                  <p>💡 Try: "Check our GDPR readiness"</p>
                  <p>💡 Try: "Audit ISO 27001 controls"</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Results */}
        {currentScan && currentUseCase && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
            <div className="p-6">
              <h4 className="text-white text-lg font-semibold mb-4">Category Analysis</h4>
              
              <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {currentScan?.map((result, index) => (
                  <div key={index} className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-white/20"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={251.33}
                            strokeDashoffset={251.33 * (1 - result.score / 100)}
                            className={`transition-all duration-1000 ${
                              result.score >= 80 ? 'text-green-400' :
                              result.score >= 60 ? 'text-amber-400' : 'text-red-400'
                            }`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{result.score}%</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-white">{result.category}</h4>
                          <Badge className={`text-xs border-white/30 backdrop-blur-sm ${
                            result.criticalFindings > 2 
                              ? 'text-red-200 bg-red-500/20 border-red-400/30' 
                              : result.criticalFindings > 0 
                              ? 'text-yellow-200 bg-yellow-500/20 border-yellow-400/30'
                              : 'text-green-200 bg-green-500/20 border-green-400/30'
                          }`}>
                            {result.framework}
                          </Badge>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed">{result.description}</p>
                        {result.criticalFindings > 0 && (
                          <p className="text-red-300 text-xs mt-2 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {result.criticalFindings} critical finding{result.criticalFindings !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        {currentScan && recommendations.length > 0 && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
            <div className="p-6">
              <h3 className="text-white text-lg font-semibold mb-4">
                Action Items ({recommendations.length} recommended)
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-xl backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-blue-400 font-medium text-sm mb-1">Priority Action</div>
                        <div className="text-white text-sm leading-relaxed">{recommendation}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-6 pt-4 border-t border-white/10">
                <Button 
                  onClick={() => runComplianceScan()}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-300"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Re-scan
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 rounded-xl shadow-lg transition-all duration-300">
                  <FileText className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Framework-specific insights */}
        {currentUseCase && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
            <div className="p-6">
              {currentUseCase?.id === "healthcare-hipaa" && (
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 p-4 rounded-xl border border-blue-400/30 backdrop-blur-sm">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="text-lg">🏥</span> HIPAA Insight
                  </h4>
                  <p className="text-white/90 text-sm leading-relaxed">
                    Focus on Physical Safeguards - they're your biggest risk area. Consider implementing biometric access controls and comprehensive facility logging.
                  </p>
                </div>
              )}

              {currentUseCase?.id === "fintech-gdpr" && (
                <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 p-4 rounded-xl border border-purple-400/30 backdrop-blur-sm">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="text-lg">🇪🇺</span> GDPR Insight
                  </h4>
                  <p className="text-white/90 text-sm leading-relaxed">
                    Your privacy implementation is strong! Focus on automating data subject rights to reduce response times and ensure consistent compliance.
                  </p>
                </div>
              )}

              {currentUseCase?.id === "startup-soc2" && (
                <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 p-4 rounded-xl border border-orange-400/30 backdrop-blur-sm">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="text-lg">🚀</span> SOC 2 Readiness
                  </h4>
                  <p className="text-white/90 text-sm leading-relaxed">
                    You need foundational security controls before audit readiness. Start with SIEM implementation and vulnerability management - these are audit blockers.
                  </p>
                </div>
              )}

              {currentUseCase?.id === "tech-iso27001" && (
                <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-4 rounded-xl border border-emerald-400/30 backdrop-blur-sm">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="text-lg">🛡️</span> ISO 27001 Insight
                  </h4>
                  <p className="text-white/90 text-sm leading-relaxed">
                    Strong policy framework detected. Focus on strengthening access control management and conducting regular incident response drills.
                  </p>
                </div>
              )}

              {currentUseCase?.id === "multi-cloud-compliance" && (
                <div className="bg-gradient-to-r from-slate-500/20 to-gray-500/20 p-4 rounded-xl border border-slate-400/30 backdrop-blur-sm">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <span className="text-lg">☁️</span> Multi-Cloud Insight
                  </h4>
                  <p className="text-white/90 text-sm leading-relaxed">
                    Excellent cross-cloud security posture. Consider implementing unified governance and automated compliance monitoring across all platforms.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedAIAssistant;