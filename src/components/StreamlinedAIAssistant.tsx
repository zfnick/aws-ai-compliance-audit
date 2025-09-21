"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bot, 
  User, 
  Send, 
  Shield,
  AlertTriangle,
  AlertCircle
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
  overallScore: number;
  scanDuration: number;
  results: ComplianceResult[];
}

// Define the hackathon-friendly criteria
const criteria = [
  {
    "id": "IAM-001",
    "title": "MFA Disabled",
    "aws_service": "IAM",
    "check": "User accounts without Multi-Factor Authentication.",
    "mock_command": "aws iam list-users + list-mfa-devices",
    "compliance_impact": [
      "HIPAA: Access Control (164.312(d))",
      "ISO 27001: A.9.4.2 Secure log-on procedures"
    ],
    "explanation": "User accounts without MFA can be compromised easily, violating access control requirements.",
    "remediation": "Enforce MFA for all IAM users, especially admins."
  },
  {
    "id": "IAM-002",
    "title": "Overly Broad Permissions",
    "aws_service": "IAM",
    "check": "IAM user/role with AdministratorAccess policy attached.",
    "mock_command": "aws iam list-attached-user-policies",
    "compliance_impact": [
      "ISO 27001: A.9.2.3 Privileged access rights",
      "GDPR: Data minimization principle"
    ],
    "explanation": "Granting full admin rights to regular users increases security risks.",
    "remediation": "Apply least privilege by using fine-grained IAM policies."
  },
  {
    "id": "S3-001",
    "title": "Public S3 Bucket",
    "aws_service": "S3",
    "check": "Bucket ACL allows AllUsers or AuthenticatedUsers.",
    "mock_command": "aws s3api get-bucket-acl",
    "compliance_impact": [
      "GDPR: Article 32 – Security of processing",
      "HIPAA: 164.312(e)(1) Transmission security"
    ],
    "explanation": "A public S3 bucket may expose sensitive data to the internet.",
    "remediation": "Enable S3 Block Public Access and enforce encryption at rest."
  },
  {
    "id": "EC2-001",
    "title": "Open Security Group",
    "aws_service": "EC2",
    "check": "Inbound rule allows 0.0.0.0/0 on port 22 (SSH) or 3389 (RDP).",
    "mock_command": "aws ec2 describe-security-groups",
    "compliance_impact": [
      "ISO 27001: A.13.1.1 Network controls",
      "PCI DSS: Requirement 1.2 – Restrict inbound traffic"
    ],
    "explanation": "Open SSH/RDP ports make your cloud vulnerable to brute-force attacks.",
    "remediation": "Restrict inbound access to specific IPs or use AWS Systems Manager Session Manager."
  },
  {
    "id": "LOG-001",
    "title": "Logging Disabled",
    "aws_service": "CloudWatch",
    "check": "Lambda or EC2 instance without CloudWatch logging enabled.",
    "mock_command": "aws logs describe-log-groups",
    "compliance_impact": [
      "HIPAA: 164.312(b) Audit controls",
      "ISO 27001: A.12.4.1 Event logging"
    ],
    "explanation": "Without logging, suspicious activity or failures cannot be investigated.",
    "remediation": "Enable CloudWatch logging and enforce retention policies."
  }
];

interface StreamlinedAIAssistantProps {
  onStartAutomatedScan?: (scanType: string, triggeredByAI: boolean) => void;
  onSwitchToScanner?: () => void;
}

const StreamlinedAIAssistant = ({
  onStartAutomatedScan,
  onSwitchToScanner
}: StreamlinedAIAssistantProps) => {
  // Quick action modes matching Grok 3 interface
  const quickModes = [
    {
      icon: "🔍",
      title: "Quick Scan",
      action: "scan",
      description: "Instant compliance check"
    },
    {
      icon: "🔧",
      title: "AWS Setup",
      action: "setup",
      description: "Configure cloud access"
    },
    {
      icon: "📋",
      title: "Audit Report",
      action: "report",
      description: "Generate audit docs"
    },
    {
      icon: "🛡️",
      title: "Risk Analysis",
      action: "risk",
      description: "AI compliance insights"
    }
  ];

  const models = [
    { id: "grok-3", name: "Grok 3", status: "online" },
    { id: "grok-3-mini", name: "Grok 3 Mini", status: "online" },
    { id: "compliance-ai", name: "Compliance AI", status: "online" }
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "ai",
      content: "Welcome to your AI-Enhanced Compliance Audit Assistant! 🛡️ I automatically scan AWS cloud configurations and logs to flag compliance risks for Malaysia's latest 2025 frameworks (NCCP, CSA 2024, DSA 2025) and provide human-readable audit explanations.\n\n🤖 **Automated Scanning Commands:**\n• \"Start Malaysia NCCP 2025 audit scan\"\n• \"Scan for Cybersecurity Act 2024 compliance\"\n• \"Check Data Sharing Act 2025 requirements\"\n• \"Run full Malaysian compliance audit\"\n\n✨ I'll automatically execute scans and provide detailed audit-ready explanations!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState("grok-3");
  const [showSetup, setShowSetup] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [accountId, setAccountId] = useState("");
  const [roleName, setRoleName] = useState("ComplianceAuditRole");
  const [setupCompleted, setSetupCompleted] = useState(false);

  const useCases: UseCase[] = [
    {
      id: "aws-hipaa",
      title: "HIPAA Audit Readiness Scan",
      description: "Comprehensive healthcare compliance audit with human-readable explanations",
      prompt: "Scan my AWS environment for HIPAA compliance violations and generate audit-ready documentation with human-readable explanations.",
      overallScore: 0,
      scanDuration: 0,
      results: []
    },
    {
      id: "multi-iso27001",
      title: "ISO 27001 Multi-Cloud Audit",
      description: "Cross-cloud information security audit with compliance evidence",
      prompt: "Perform comprehensive ISO 27001 compliance audit across AWS, Azure, and GCP with detailed audit trail documentation.",
      overallScore: 0,
      scanDuration: 0,
      results: []
    },
    {
      id: "gdpr-privacy",
      title: "GDPR Data Protection Audit",
      description: "Privacy compliance scan with audit-ready GDPR documentation",
      prompt: "Evaluate my cloud infrastructure for GDPR compliance and generate audit-ready documentation for data protection authorities.",
      overallScore: 0,
      scanDuration: 0,
      results: []
    },
    {
      id: "compliance-readiness",
      title: "Multi-Framework Audit Prep",
      description: "Comprehensive audit preparation across HIPAA, GDPR, ISO 27001, SOC 2",
      prompt: "Prepare comprehensive audit documentation across all major compliance frameworks with human-readable explanations and remediation steps.",
      overallScore: 0,
      scanDuration: 0,
      results: []
    }
  ];

  const generateSetupInstructions = () => {
    return `## AWS Cross-Account Role Setup

To enable secure compliance scanning, create an IAM role in your AWS account:

### 1. Create IAM Role
\`\`\`bash
aws iam create-role --role-name ${roleName} --assume-role-policy-document '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::756550684766:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "compliance-audit-${accountId}"
        }
      }
    }
  ]
}'
\`\`\`

### 2. Attach ReadOnly Policy
\`\`\`bash
aws iam attach-role-policy --role-name ${roleName} --policy-arn arn:aws:iam::aws:policy/ReadOnlyAccess
\`\`\`

### 3. Attach Security Audit Policy  
\`\`\`bash
aws iam attach-role-policy --role-name ${roleName} --policy-arn arn:aws:iam::aws:policy/SecurityAudit
\`\`\`

**Role ARN:** \`arn:aws:iam::${accountId}:role/${roleName}\`

This role allows our compliance engine to safely read your AWS configuration without any modification permissions.`;
  };

  const handleModeSelect = (action: string) => {
    if (action === "setup") {
      setShowSetup(true);
    } else if (action === "scan") {
      const scanMessage: Message = {
        id: Date.now(),
        type: "ai",
        content: setupCompleted ?
          "🔍 **Initiating Quick Compliance Scan...**\n\n⚡ Running rapid assessment across your cloud infrastructure:\n• IAM policies and access controls\n• Data encryption and storage security\n• Network security configurations\n• Logging and monitoring setup\n\n📊 **Quick Findings:**\n🟢 **78% Compliant** - Good overall security posture\n🟡 **3 Medium Issues** - MFA gaps detected\n🔴 **1 Critical** - Public S3 bucket found\n\n💬 Ask me for detailed analysis: \"Explain the S3 bucket issue\" or \"How do I fix MFA gaps?\"" :
          "🚀 **Ready for Quick Scan!** To perform compliance scanning, please first complete the AWS setup process. Click 'AWS Setup' above to configure secure access to your cloud resources.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, scanMessage]);
    } else if (action === "report") {
      const reportMessage: Message = {
        id: Date.now(),
        type: "ai",
        content: setupCompleted ?
          "📋 **Generating Audit-Ready Report...**\n\n🤖 Creating comprehensive compliance documentation:\n• Executive summary with risk assessment\n• Framework-specific compliance mappings\n• Human-readable findings for auditors\n• Technical remediation roadmap\n• Evidence collection and audit trails\n\n📊 **Report Types Available:**\n• HIPAA Healthcare Compliance Report\n• GDPR Data Protection Assessment\n• ISO 27001 Security Management Report\n• SOC 2 Operational Security Report\n\n⏱️ **Completion time**: 2-3 minutes for full analysis" :
          "📋 To generate audit-ready reports, please complete the AWS setup first. Once connected, I can create detailed compliance reports with human-readable explanations perfect for auditors and compliance teams.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, reportMessage]);
    } else if (action === "risk") {
      const riskMessage: Message = {
        id: Date.now(),
        type: "ai",
        content: setupCompleted ?
          "🛡️ **AI Risk Analysis Dashboard**\n\n🤖 Intelligent compliance risk assessment:\n\n**🔴 Critical Risks (Immediate Action Required):**\n• Public S3 bucket exposing sensitive data\n• Root account without MFA protection\n\n**🟡 Medium Risks (Plan Remediation):**\n• Overly permissive IAM policies\n• Unencrypted EBS volumes\n• Missing CloudTrail in key regions\n\n**🟢 Low Risks (Monitor):**\n• Outdated security group descriptions\n• Non-critical logging gaps\n\n💡 **AI Recommendations:**\nPrioritize the critical S3 bucket issue first - it poses immediate GDPR/HIPAA violation risk. I can provide step-by-step remediation guidance." :
          "🛡️ To perform AI-powered risk analysis, please complete the AWS setup first. Once connected, I can analyze your cloud infrastructure and provide intelligent risk prioritization with remediation guidance.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, riskMessage]);
    }
  };

  const handleSetupComplete = () => {
    setSetupCompleted(true);
    setShowSetup(false);
    
    const setupMessage: Message = {
      id: Date.now(),
      type: "ai",
      content: `✅ **AWS Setup Complete!**\n\nYour account ${accountId} is now configured for compliance scanning with role: \`${roleName}\`\n\nI can now help you with:\n🔍 **Compliance Scans** - Run comprehensive security audits\n📊 **Risk Analysis** - Identify critical vulnerabilities\n📋 **Audit Reports** - Generate compliance documentation\n\nTry asking: "scan my AWS environment" or "check for HIPAA compliance"`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, setupMessage]);
  };

  const handleSendMessage = () => {
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

    setTimeout(() => {
      let aiResponse = "";
      let isScanning = false;
      let scanType = "";

      // Detect Malaysia 2025 compliance frameworks and trigger automated scanning
      if ((messageContent.includes('scan') || messageContent.includes('check') || messageContent.includes('audit')) && setupCompleted) {
        isScanning = true;

        // Detect specific Malaysian frameworks
        if (messageContent.includes('nccp') || messageContent.includes('national cloud')) {
          scanType = "Malaysia NCCP 2025";
        } else if (messageContent.includes('cybersecurity act') || messageContent.includes('csa 2024')) {
          scanType = "Cybersecurity Act 2024";
        } else if (messageContent.includes('data sharing') || messageContent.includes('dsa 2025')) {
          scanType = "Data Sharing Act 2025";
        } else if (messageContent.includes('mydigital') || messageContent.includes('digital framework')) {
          scanType = "MyDIGITAL Framework";
        } else if (messageContent.includes('full') || messageContent.includes('complete')) {
          scanType = "Full Malaysia Audit 2025";
        } else {
          scanType = "Malaysia NCCP 2025"; // Default to NCCP
        }

        // Trigger automated scan
        if (onStartAutomatedScan && onSwitchToScanner) {
          onStartAutomatedScan(scanType, true);
          onSwitchToScanner();
        }

        aiResponse = `🤖 **AI Automated Scan Initiated: ${scanType}**\n\n✨ I'm automatically scanning your AWS cloud configurations against Malaysian compliance frameworks:\n\n⚡ **Real-time Analysis:**\n• 🔍 Analyzing cloud configurations for ${scanType} compliance\n• 📊 Checking data residency requirements (Malaysia region)\n• 🛡️ Validating security controls against NACSA standards\n• 📋 Generating human-readable audit explanations\n\n🔄 **Switching to Scanner tab** to show live progress...\n\n📱 **Next Steps:**\n1. Monitor real-time scan progress\n2. Review AI-generated compliance findings\n3. Access detailed audit-ready explanations\n4. Implement recommended remediation steps\n\n💡 I'll provide comprehensive audit documentation mapped to Malaysia's 2025 regulatory requirements!`;
      } else if ((messageContent.includes('scan') || messageContent.includes('check') || messageContent.includes('audit')) && !setupCompleted) {
        aiResponse = "🚀 **Ready to start scanning!** To perform compliance scanning, please first complete the AWS account setup process. I'll guide you through creating the necessary cross-account role for secure access.\n\nClick 'AWS Setup' above to get started, then I can scan your infrastructure for compliance risks.";
      } else if (messageContent.includes('help')) {
        aiResponse = "🛡️ **I'm your AI Compliance Audit Assistant for Malaysia 2025!** Here's how I automate your compliance:\n\n🤖 **Automated Scanning**: AI-powered cloud configuration analysis\n🇲🇾 **Malaysia 2025 Frameworks**: NCCP, CSA 2024, DSA 2025, MyDIGITAL\n📊 **Risk Assessment**: Real-time compliance gap identification\n📋 **Audit Preparation**: Human-readable audit documentation\n✨ **Smart Remediation**: Step-by-step compliance fixes\n\n**🔥 Popular Commands:**\n• \"Start Malaysia NCCP 2025 scan\"\n• \"Check Cybersecurity Act 2024 compliance\"\n• \"Scan for Data Sharing Act violations\"\n• \"Run full Malaysian compliance audit\"\n\n💡 Just ask me to scan - I'll automatically detect the framework and execute!";
      } else if (messageContent.includes('criteria') || messageContent.includes('checklist') || messageContent.includes('compliance')) {
        aiResponse = `🔍 **AI Compliance Criteria Analysis**\n\nI can analyze your cloud infrastructure against these key compliance frameworks:\n\n${criteria.map(c =>
          `🔍 **${c.title}** (${c.aws_service})\n   💡 ${c.explanation}\n   📋 **Compliance Impact**: ${c.compliance_impact.join(', ')}\n   ✅ **AI Remediation**: ${c.remediation}`
        ).join('\n\n')}\n\n🚀 **Ready to scan?** ${setupCompleted ? 'Just ask me to scan any service or framework!' : 'Complete AWS Setup first to begin scanning.'}`;
      } else if (messageContent.includes('iam') || messageContent.includes('mfa')) {
        const iamCriteria = criteria.filter(c => c.aws_service === 'IAM');
        aiResponse = `🔐 **IAM Security Analysis**\n\n${iamCriteria.map(c =>
          `🔐 **${c.title}**\n   💡 ${c.explanation}\n   📋 **Compliance**: ${c.compliance_impact.join(', ')}\n   ✅ **AI Fix**: ${c.remediation}`
        ).join('\n\n')}\n\n${setupCompleted ? '🔍 Want me to scan your current IAM configuration? Just ask!' : '⚠️ Complete setup first to scan your actual IAM policies.'}`;
      } else if (messageContent.includes('s3') || messageContent.includes('bucket')) {
        const s3Criteria = criteria.filter(c => c.aws_service === 'S3');
        aiResponse = `🪣 **S3 Security Analysis**\n\n${s3Criteria.map(c =>
          `🪣 **${c.title}**\n   💡 ${c.explanation}\n   📋 **Compliance**: ${c.compliance_impact.join(', ')}\n   ✅ **AI Fix**: ${c.remediation}`
        ).join('\n\n')}\n\n${setupCompleted ? '🔍 Ready to scan your S3 buckets for compliance violations? Just say \"scan my S3 buckets\"!' : '⚠️ Complete setup first to access your S3 configurations.'}`;
      } else if (messageContent.includes('ec2') || messageContent.includes('security group')) {
        const ec2Criteria = criteria.filter(c => c.aws_service === 'EC2');
        aiResponse = `💻 **EC2 Security Analysis**\n\n${ec2Criteria.map(c =>
          `💻 **${c.title}**\n   💡 ${c.explanation}\n   📋 **Compliance**: ${c.compliance_impact.join(', ')}\n   ✅ **AI Fix**: ${c.remediation}`
        ).join('\n\n')}\n\n${setupCompleted ? '🔍 Want me to check your EC2 instances and security groups? Just ask!' : '⚠️ Complete setup first to analyze your EC2 configurations.'}`;
      } else if (messageContent.includes('log') || messageContent.includes('cloudwatch')) {
        const logCriteria = criteria.filter(c => c.aws_service === 'CloudWatch');
        aiResponse = `📝 **Logging & Monitoring Analysis**\n\n${logCriteria.map(c =>
          `📝 **${c.title}**\n   💡 ${c.explanation}\n   📋 **Compliance**: ${c.compliance_impact.join(', ')}\n   ✅ **AI Fix**: ${c.remediation}`
        ).join('\n\n')}\n\n${setupCompleted ? '🔍 Ready to review your logging and monitoring setup? Just ask!' : '⚠️ Complete setup first to access your CloudWatch configurations.'}`;
      } else if (messageContent.includes('report') || messageContent.includes('generate')) {
        aiResponse = setupCompleted ?
          "📋 **Generating Audit-Ready Report...**\n\n🤖 AI is creating a comprehensive compliance report with:\n• Executive summary of compliance posture\n• Detailed findings with risk assessments\n• Human-readable explanations for auditors\n• Step-by-step remediation guidance\n• Evidence collection for audit trails\n\n📊 **Report will include**: Risk matrices, compliance mappings, and technical recommendations.\n\n⏱️ **Estimated completion**: 2-3 minutes for full multi-framework analysis." :
          "📋 To generate audit-ready reports, please complete the AWS setup first. Once connected, I can create detailed compliance reports with human-readable explanations perfect for auditors.";
      } else {
        aiResponse = "💬 I'm your AI Compliance Audit Assistant! I can scan cloud configurations, flag compliance risks, and provide human-readable audit explanations.\n\n**Try asking:**\n• \"Scan my environment for HIPAA compliance\"\n• \"Check for GDPR violations\"\n• \"Generate an ISO 27001 audit report\"\n• \"Help me prepare for my compliance audit\"";
      }

      const aiMessage: Message = {
        id: Date.now() + 1,
        type: "ai",
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isScanning: isScanning
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Mode Cards - Grok 3 Style */}
        <div className="grid grid-cols-4 gap-4">
          {quickModes.map((mode, index) => (
            <div
              key={index}
              onClick={() => handleModeSelect(mode.action)}
              className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
            >
              <div className="text-center space-y-2">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {mode.icon}
                </div>
                <div className="text-white font-medium text-sm">{mode.title}</div>
                <div className="text-white/60 text-xs">{mode.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Model Selector & Chat Interface */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
          
          {/* Model Selector Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-white/10 text-white rounded-xl px-4 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                {models.map(model => (
                  <option key={model.id} value={model.id} className="bg-slate-800 text-white">
                    {model.name}
                  </option>
                ))}
              </select>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Online
              </Badge>
            </div>
            
            <div className="text-white/60 text-sm">
              Compliance AI Assistant
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "ai" && (
                  <Avatar className="h-8 w-8 bg-blue-600 border border-white/30">
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-2xl p-4 rounded-2xl ${
                    message.type === "user"
                      ? "bg-blue-600 text-white ml-12"
                      : "bg-white/10 text-white border border-white/20"
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className="text-xs opacity-60 mt-2">
                    {message.timestamp}
                  </div>
                </div>
                
                {message.type === "user" && (
                  <Avatar className="h-8 w-8 bg-slate-600 border border-white/30">
                    <AvatarFallback className="bg-slate-600 text-white text-xs">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 bg-blue-600 border border-white/30">
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white/10 text-white border border-white/20 p-4 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-3">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Ask about compliance requirements, setup, or audit guidance..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl focus:ring-2 focus:ring-blue-500/50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-white/10 disabled:text-white/30 text-white p-3 rounded-xl transition-all duration-300 flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* AWS Setup Modal */}
        {showSetup && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  🔧 AWS Account Setup
                </h2>
                <button
                  onClick={() => setShowSetup(false)}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {setupStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-white mb-2 font-medium">
                      AWS Account ID
                    </label>
                    <Input
                      value={accountId}
                      onChange={(e) => setAccountId(e.target.value)}
                      placeholder="123456789012"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <p className="text-white/60 text-sm mt-2">
                      Enter your 12-digit AWS Account ID for cross-account role setup
                    </p>
                  </div>

                  <div>
                    <label className="block text-white mb-2 font-medium">
                      IAM Role Name
                    </label>
                    <Input
                      value={roleName}
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="ComplianceAuditRole"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <p className="text-white/60 text-sm mt-2">
                      Choose a name for the IAM role that will be created
                    </p>
                  </div>

                  <button
                    onClick={() => setSetupStep(2)}
                    disabled={!accountId || !roleName}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-white/10 disabled:text-white/30 text-white py-3 rounded-xl font-medium transition-all duration-300"
                  >
                    Generate Setup Instructions
                  </button>
                </div>
              )}

              {setupStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
                    <pre className="text-white/90 text-sm whitespace-pre-wrap overflow-x-auto">
                      {generateSetupInstructions()}
                    </pre>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSetupStep(1)}
                      className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium transition-all duration-300"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSetupComplete}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-all duration-300"
                    >
                      Setup Complete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Use Case Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {useCases.map((useCase) => (
            <div
              key={useCase.id}
              className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-300 transition-colors">
                    {useCase.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {useCase.description}
                  </p>
                </div>
                <Shield className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors flex-shrink-0 ml-4" />
              </div>
              
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  Ready to Scan
                </Badge>
                <div className="text-white/40 text-sm">
                  Click to start →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreamlinedAIAssistant;