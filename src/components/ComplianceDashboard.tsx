"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StreamlinedAIAssistant from "./StreamlinedAIAssistant";
import { Shield, AlertTriangle, CheckCircle, Clock, FileText, TrendingUp, TrendingDown, Minus, Bot, BarChart3, Search, MessageCircle, AlertCircle } from "lucide-react";

const ComplianceDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeScan, setActiveScan] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [realTimeData, setRealTimeData] = useState({
    activeScans: 4,
    aiFindings: 12,
    autoRemediated: 87,
    auditReports: 6,
    lastUpdate: new Date()
  });
  const [isLiveMonitoring, setIsLiveMonitoring] = useState(true);
  
  const tabs = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "scanner", label: "Scanner", icon: Search },
    { id: "ai-assistant", label: "AI Assistant", icon: Bot }
  ];
  // Real-time monitoring effect
  useEffect(() => {
    if (!isLiveMonitoring) return;

    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeScans: prev.activeScans + Math.floor(Math.random() * 3) - 1,
        aiFindings: Math.max(0, prev.aiFindings + Math.floor(Math.random() * 5) - 2),
        autoRemediated: prev.autoRemediated + Math.floor(Math.random() * 3),
        auditReports: prev.auditReports + (Math.random() > 0.95 ? 1 : 0),
        lastUpdate: new Date()
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isLiveMonitoring]);

  const stats = [
    {
      title: "Active Scans",
      value: realTimeData.activeScans.toString(),
      icon: Search,
      color: "success",
      trend: "Malaysia NCCP, AWS Cloud"
    },
    {
      title: "AI Findings",
      value: realTimeData.aiFindings.toString(),
      icon: Bot,
      color: "warning",
      trend: "Real-time log analysis"
    },
    {
      title: "Auto-Remediated Issues",
      value: realTimeData.autoRemediated.toString(),
      icon: CheckCircle,
      color: "success",
      trend: "AI-powered fixes"
    },
    {
      title: "Audit-Ready Reports",
      value: realTimeData.auditReports.toString(),
      icon: FileText,
      color: "success",
      trend: "Malaysian compliance"
    }
  ];

  const frameworks = [
    { name: "Malaysia NCCP 2025", compliance: 82, status: "good" },
    { name: "Cybersecurity Act 2024", compliance: 78, status: "warning" },
    { name: "Data Sharing Act 2025", compliance: 85, status: "good" },
    { name: "AWS Security Best Practices", compliance: 94, status: "excellent" },
    { name: "ISO 27017 (Cloud Security)", compliance: 91, status: "excellent" },
    { name: "MyDIGITAL Framework", compliance: 87, status: "excellent" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "success";
      case "good": return "success";
      case "warning": return "warning";
      case "needs-attention": return "critical";
      default: return "muted";
    }
  };

  // AI-automated scanning function
  const startAIAutomatedScan = (scanType: string, triggeredByAI: boolean = false) => {
    setActiveScan(scanType);
    setScanProgress(0);
    setScanResults([]);

    // If triggered by AI, switch to scanner tab to show progress
    if (triggeredByAI) {
      setActiveTab("scanner");
    }

    // Simulate AI-powered scan progress with real-time analysis
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setActiveScan(null);
          // Add Malaysia 2025 compliance results with real AWS resource mappings
          setScanResults([
            {
              id: 1,
              type: "critical",
              title: "S3 Bucket Public Access Risk",
              service: "S3",
              resourceDetails: {
                resourceName: "customer-data",
                resourceType: "S3 Bucket",
                region: "us-east-1",
                arn: "arn:aws:s3:::customer-data"
              },
              description: "S3 bucket 'customer-data' has public read access enabled, potentially exposing sensitive customer information. This violates Malaysia NCCP 2025 Pillar 3 (Secure Data Protection) and Data Sharing Act 2025 requirements for confidential data handling.",
              remediation: "Remove public access permissions, implement bucket-level encryption, migrate to Malaysia region (ap-southeast-3), and configure proper IAM policies for controlled access",
              complianceFrameworks: [
                "Malaysia NCCP 2025 - Pillar 3 (Data Residency)",
                "Data Sharing Act 2025 - Section 12 (Data Classification)",
                "Cybersecurity Act 2024 - NCII Requirements"
              ],
              riskLevel: "HIGH",
              humanExplanation: "For auditors: This bucket contains customer data accessible publicly, violating Malaysian data sovereignty requirements under NCCP 2025. The Data Sharing Act 2025 mandates strict access controls for personal data, and this configuration poses significant compliance risks."
            },
            {
              id: 2,
              type: "critical",
              title: "IAM Administrative Role Over-Privileges",
              service: "IAM",
              resourceDetails: {
                resourceName: "AdminRole",
                resourceType: "IAM Role",
                region: "global",
                arn: "arn:aws:iam::123456789012:role/AdminRole"
              },
              description: "IAM role 'AdminRole' has excessive administrative privileges without proper MFA enforcement or session duration limits. This creates security vulnerabilities that violate Cybersecurity Act 2024 requirements for National Critical Information Infrastructure (NCII) access controls.",
              remediation: "Implement least-privilege access principles, enforce MFA for all administrative access, set maximum session duration to 1 hour, and establish audit logging compliant with NACSA reporting requirements",
              complianceFrameworks: [
                "Cybersecurity Act 2024 - Section 15 (NCII Security)",
                "Malaysia NCCP 2025 - Pillar 4 (Access Management)",
                "MyDIGITAL Framework - Digital Security Standards"
              ],
              riskLevel: "HIGH",
              humanExplanation: "For auditors: This role provides unrestricted administrative access without adequate security controls, violating CSA 2024 requirements for critical infrastructure protection and NCCP 2025 access management standards."
            },
            {
              id: 3,
              type: "medium",
              title: "IAM Read-Only Role Missing Audit Trail",
              service: "IAM",
              resourceDetails: {
                resourceName: "ReadOnlyRole",
                resourceType: "IAM Role",
                region: "global",
                arn: "arn:aws:iam::123456789012:role/ReadOnlyRole"
              },
              description: "IAM role 'ReadOnlyRole' lacks comprehensive audit logging and doesn't implement proper data classification tagging required under Data Sharing Act 2025 for government data access.",
              remediation: "Enable CloudTrail logging for all role activities, implement data classification tags, establish inter-agency access policies, and ensure compliance with DSA 2025 audit requirements",
              complianceFrameworks: [
                "Data Sharing Act 2025 - Section 8 (Audit Requirements)",
                "Malaysia NCCP 2025 - Pillar 5 (Monitoring & Compliance)",
                "ISO 27017 - Cloud Audit Controls"
              ],
              riskLevel: "MEDIUM",
              humanExplanation: "For auditors: While this role has limited permissions, it lacks the audit trail required by Data Sharing Act 2025 for tracking government data access and doesn't implement proper data classification controls."
            },
            {
              id: 4,
              type: "medium",
              title: "Lambda Function Data Processing Non-Compliance",
              service: "Lambda",
              resourceDetails: {
                resourceName: "ProcessCustomerData",
                resourceType: "Lambda Function",
                region: "us-east-1",
                arn: "arn:aws:lambda:us-east-1:123456789012:function:ProcessCustomerData"
              },
              description: "Lambda function 'ProcessCustomerData' processes personal data outside Malaysia region without implementing NCCP 2025 data residency requirements and lacks proper encryption in transit and at rest.",
              remediation: "Migrate function to Malaysia region (ap-southeast-3), implement end-to-end encryption, add data classification handling, and ensure compliance with MyDIGITAL Framework security requirements",
              complianceFrameworks: [
                "Malaysia NCCP 2025 - Pillar 3 (Data Residency)",
                "MyDIGITAL Framework - Data Security Requirements",
                "Data Sharing Act 2025 - Personal Data Protection"
              ],
              riskLevel: "MEDIUM",
              humanExplanation: "For auditors: This function processes customer data in a foreign region, violating NCCP 2025 data sovereignty requirements. The MyDIGITAL Framework mandates specific security controls for personal data processing in Malaysia's digital economy."
            },
            {
              id: 5,
              type: "medium",
              title: "Lambda Report Generation Security Gap",
              service: "Lambda",
              resourceDetails: {
                resourceName: "GenerateReports",
                resourceType: "Lambda Function",
                region: "us-east-1",
                arn: "arn:aws:lambda:us-east-1:123456789012:function:GenerateReports"
              },
              description: "Lambda function 'GenerateReports' generates audit reports without implementing proper data retention policies and lacks integration with NACSA reporting requirements under Cybersecurity Act 2024.",
              remediation: "Implement data retention policies aligned with Malaysian regulatory requirements, add NACSA-compliant reporting capabilities, enable comprehensive logging, and migrate to Malaysia region",
              complianceFrameworks: [
                "Cybersecurity Act 2024 - NACSA Reporting Requirements",
                "Malaysia NCCP 2025 - Pillar 5 (Compliance Monitoring)",
                "Data Sharing Act 2025 - Data Retention Standards"
              ],
              riskLevel: "MEDIUM",
              humanExplanation: "For auditors: This report generation function doesn't meet CSA 2024 requirements for NACSA incident reporting and lacks proper data retention controls mandated by Malaysian compliance frameworks."
            },
            {
              id: 6,
              type: "resolved",
              title: "S3 Internal Documentation Bucket Compliant",
              service: "S3",
              resourceDetails: {
                resourceName: "internal-docs",
                resourceType: "S3 Bucket",
                region: "ap-southeast-3",
                arn: "arn:aws:s3:::internal-docs"
              },
              description: "S3 bucket 'internal-docs' properly implements NCCP 2025 encryption standards, is located in Malaysia region (ap-southeast-3), and has appropriate access controls for internal documentation.",
              remediation: "Maintain current configuration and continue scheduled access reviews as per NCCP guidelines",
              complianceFrameworks: [
                "Malaysia NCCP 2025 - Pillar 3 (Data Protection)",
                "AWS Security Best Practices - Asia Pacific",
                "ISO 27017 - Cloud Storage Security"
              ],
              riskLevel: "LOW",
              humanExplanation: "For auditors: This bucket configuration demonstrates proper implementation of NCCP 2025 data residency and encryption requirements, serving as a compliance model for other resources."
            }
          ]);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 800);
  };

  // Legacy function for backwards compatibility
  const startScan = (scanType: string) => {
    startAIAutomatedScan(scanType, false);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-slate-900 -z-10"></div>
      
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl">
        <div className="container mx-auto px-6 py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 bg-blue-600 border-2 border-white/30">
                    <AvatarFallback className="bg-transparent text-white">
                      <Shield className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold text-white">AI-Enhanced Compliance Audit Assistant</h1>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-xs font-medium">LIVE</span>
                      </div>
                    </div>
                    <p className="text-sm text-white/70">Real-time scanning of AWS cloud configurations and logs to flag Malaysian compliance risks with human-readable audit explanations</p>
                    <p className="text-xs text-white/50 mt-1">Last updated: {realTimeData.lastUpdate.toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/20">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'border-blue-400 text-white bg-white/10 backdrop-blur-sm'
                        : 'border-transparent text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-white/70 font-medium">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                      {stat.trend.includes('+') && <TrendingUp className="h-4 w-4 text-green-400" />}
                      {stat.trend.includes('-') && <TrendingDown className="h-4 w-4 text-red-400" />}
                      {!stat.trend.includes('+') && !stat.trend.includes('-') && <Clock className="h-4 w-4 text-yellow-400" />}
                    </div>
                    <p className="text-xs text-white/50">{stat.trend}</p>
                  </div>
                  <div className={`p-3 rounded-xl shadow-lg backdrop-blur-sm ${
                    stat.color === 'success' ? 'bg-green-500/20 text-green-400 border border-green-400/30' :
                    stat.color === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-400/30' :
                    stat.color === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30' :
                    'bg-white/20 text-white border border-white/30'
                  }`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Scanning Dashboard */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-white" />
                <h3 className="text-white text-lg font-semibold">AI Scanning Dashboard</h3>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                4 Active Scans
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Scans */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">Current Scans</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-white text-sm font-medium">AWS HIPAA Scan</span>
                      </div>
                      <span className="text-white/60 text-xs">73% complete</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
                      <div className="h-2 bg-blue-500 rounded-full" style={{ width: '73%' }}></div>
                    </div>
                    <p className="text-white/50 text-xs mt-2">Scanning S3 buckets and IAM policies</p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-white text-sm font-medium">Multi-Cloud ISO 27001</span>
                      </div>
                      <span className="text-white/60 text-xs">45% complete</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <p className="text-white/50 text-xs mt-2">Cross-cloud security controls analysis</p>
                  </div>
                </div>
              </div>

              {/* Recent AI Findings */}
              <div className="space-y-4">
                <h4 className="text-white font-medium">Recent AI Findings</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white text-sm font-medium">Critical: Public S3 Bucket Detected</p>
                        <p className="text-white/60 text-xs mt-1">AI detected GDPR violation in bucket 'user-data-prod'</p>
                        <button className="text-blue-400 text-xs mt-2 hover:underline">View remediation →</button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white text-sm font-medium">Medium: MFA Not Enforced</p>
                        <p className="text-white/60 text-xs mt-1">HIPAA compliance risk for 12 IAM users</p>
                        <button className="text-blue-400 text-xs mt-2 hover:underline">Auto-fix available →</button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white text-sm font-medium">Resolved: Encryption Enabled</p>
                        <p className="text-white/60 text-xs mt-1">AI auto-remediated RDS encryption issues</p>
                        <span className="text-green-400 text-xs">✓ Compliant</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Frameworks */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-white" />
              <h3 className="text-white text-lg font-semibold">Compliance Framework Status</h3>
            </div>
            <div className="space-y-6">
              {frameworks.map((framework, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-lg text-white">{framework.name}</h4>
                      <Badge className={`capitalize backdrop-blur-sm ${
                        framework.status === 'excellent' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                        framework.status === 'good' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                        framework.status === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30' :
                        'bg-red-500/20 text-red-400 border-red-400/30'
                      }`}>
                        {framework.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{framework.compliance}%</div>
                      <div className="text-sm text-white/50">Compliant</div>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        framework.compliance >= 80 ? 'bg-green-500' :
                        framework.compliance >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${framework.compliance}%` }}
                    ></div>
                  </div>
                  {index < frameworks.length - 1 && <div className="border-t border-white/10 pt-4"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
            <div className="p-6">
              <h3 className="text-white text-lg font-semibold mb-4">AI Activity Feed</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                  <Avatar className="h-8 w-8 bg-blue-500/20 border border-blue-400/30">
                    <AvatarFallback className="bg-transparent text-blue-400">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-white text-sm font-medium">AI auto-remediated 5 encryption issues</p>
                    <p className="text-white/50 text-xs">15 minutes ago • RDS instances now compliant</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                  <Avatar className="h-8 w-8 bg-green-500/20 border border-green-400/30">
                    <AvatarFallback className="bg-transparent text-green-400">
                      <CheckCircle className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-white text-sm font-medium">GDPR compliance scan completed with AI insights</p>
                    <p className="text-white/50 text-xs">2 hours ago • 87% compliant, audit-ready report generated</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                  <Avatar className="h-8 w-8 bg-yellow-500/20 border border-yellow-400/30">
                    <AvatarFallback className="bg-transparent text-yellow-400">
                      <AlertTriangle className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-white text-sm font-medium">AI flagged HIPAA risks in S3 configurations</p>
                    <p className="text-white/50 text-xs">4 hours ago • Human-readable remediation steps provided</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
            <div className="p-6">
              <h3 className="text-white text-lg font-semibold mb-4">AI Audit Assistant</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start gap-3 bg-blue-600 hover:bg-blue-700 text-white border-0 rounded-xl shadow-lg transition-all duration-300">
                  <Bot className="h-4 w-4" />
                  Ask AI to Scan AWS Resources
                </Button>
                <Button className="w-full justify-start gap-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-300">
                  <FileText className="h-4 w-4" />
                  Generate HIPAA Audit Report
                </Button>
                <Button className="w-full justify-start gap-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-300">
                  <Shield className="h-4 w-4" />
                  Check GDPR Compliance
                </Button>
                <Button className="w-full justify-start gap-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all duration-300">
                  <CheckCircle className="h-4 w-4" />
                  Get ISO 27001 Readiness Score
                </Button>
              </div>
            </div>
          </div>
        </div>
          </>
        )}

        {/* AI Assistant Tab Content */}
        {activeTab === "ai-assistant" && (
          <StreamlinedAIAssistant
            onStartAutomatedScan={startAIAutomatedScan}
            onSwitchToScanner={() => setActiveTab("scanner")}
          />
        )}

        {activeTab === "scanner" && (
          <div className="space-y-6">
            {/* Real-Time Scanner Header */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Search className="h-6 w-6 text-white" />
                    <h2 className="text-2xl font-bold text-white">Real-Time AI Compliance Scanner</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                      Live Monitoring
                    </Badge>
                  </div>
                </div>
                <p className="text-white/70 mb-6">Real-time scanning of AWS cloud configurations and logs for Malaysian compliance frameworks. Chat with AI for instant insights and remediation guidance.</p>

                {/* Malaysia 2025 Cloud Compliance Scans */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
                  <Button
                    onClick={() => startScan("Malaysia NCCP 2025")}
                    disabled={!!activeScan}
                    className="h-20 flex-col gap-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white border-0 rounded-xl shadow-lg transition-all duration-300"
                  >
                    <Shield className="h-5 w-5" />
                    <span className="text-xs font-medium">NCCP 2025</span>
                    <span className="text-xs opacity-70">Cloud Policy</span>
                  </Button>
                  <Button
                    onClick={() => startScan("Cybersecurity Act 2024")}
                    disabled={!!activeScan}
                    className="h-20 flex-col gap-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white border-0 rounded-xl shadow-lg transition-all duration-300"
                  >
                    <Shield className="h-5 w-5" />
                    <span className="text-xs font-medium">CSA 2024</span>
                    <span className="text-xs opacity-70">NCII Security</span>
                  </Button>
                  <Button
                    onClick={() => startScan("Data Sharing Act 2025")}
                    disabled={!!activeScan}
                    className="h-20 flex-col gap-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white border-0 rounded-xl shadow-lg transition-all duration-300"
                  >
                    <Shield className="h-5 w-5" />
                    <span className="text-xs font-medium">DSA 2025</span>
                    <span className="text-xs opacity-70">Data Sharing</span>
                  </Button>
                  <Button
                    onClick={() => startScan("MyDIGITAL Framework")}
                    disabled={!!activeScan}
                    className="h-20 flex-col gap-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white border-0 rounded-xl shadow-lg transition-all duration-300"
                  >
                    <Shield className="h-5 w-5" />
                    <span className="text-xs font-medium">MyDIGITAL</span>
                    <span className="text-xs opacity-70">Digital Blueprint</span>
                  </Button>
                  <Button
                    onClick={() => startScan("AWS Best Practices")}
                    disabled={!!activeScan}
                    className="h-20 flex-col gap-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white border-0 rounded-xl shadow-lg transition-all duration-300"
                  >
                    <Shield className="h-5 w-5" />
                    <span className="text-xs font-medium">AWS Security</span>
                    <span className="text-xs opacity-70">Best Practices</span>
                  </Button>
                  <Button
                    onClick={() => startScan("Full Malaysia Audit 2025")}
                    disabled={!!activeScan}
                    className="h-20 flex-col gap-1 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white border-0 rounded-xl shadow-lg transition-all duration-300"
                  >
                    <Search className="h-5 w-5" />
                    <span className="text-xs font-medium">Full Audit</span>
                    <span className="text-xs opacity-70">All 2025 Laws</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Scan Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cloud Resources */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
                <div className="p-6">
                  <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Cloud Resources to Scan
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-blue-600" />
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                          <span className="text-white">AWS (Primary Account)</span>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-xs">Connected</Badge>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-white/20 bg-white/10 text-blue-600" />
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <span className="text-white">Azure (Secondary)</span>
                        </div>
                        <Badge className="bg-gray-500/20 text-gray-400 border-gray-400/30 text-xs">Setup Required</Badge>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-white/20 bg-white/10 text-blue-600" />
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span className="text-white">Google Cloud</span>
                        </div>
                        <Badge className="bg-gray-500/20 text-gray-400 border-gray-400/30 text-xs">Setup Required</Badge>
                      </label>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-white font-medium mb-3">AWS Services</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-blue-600" />
                          <span className="text-white/80">S3 Buckets</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-blue-600" />
                          <span className="text-white/80">IAM</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-blue-600" />
                          <span className="text-white/80">EC2</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-blue-600" />
                          <span className="text-white/80">RDS</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-blue-600" />
                          <span className="text-white/80">CloudTrail</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-blue-600" />
                          <span className="text-white/80">VPC</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance Frameworks */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
                <div className="p-6">
                  <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Compliance Frameworks
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-blue-600" />
                        <div>
                          <div className="text-white font-medium">Malaysia NCCP 2025</div>
                          <div className="text-white/60 text-sm">National Cloud Computing Policy - 5 Pillars</div>
                        </div>
                      </div>
                      <Badge className="bg-red-500/20 text-red-400 border-red-400/30">152 controls</Badge>
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-blue-600" />
                        <div>
                          <div className="text-white font-medium">Cybersecurity Act 2024</div>
                          <div className="text-white/60 text-sm">NCII requirements & NACSA compliance</div>
                        </div>
                      </div>
                      <Badge className="bg-orange-500/20 text-orange-400 border-orange-400/30">89 controls</Badge>
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/10 text-blue-600" />
                        <div>
                          <div className="text-white font-medium">Data Sharing Act 2025</div>
                          <div className="text-white/60 text-sm">Inter-agency data exchange compliance</div>
                        </div>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30">67 controls</Badge>
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-white/20 bg-white/10 text-blue-600" />
                        <div>
                          <div className="text-white font-medium">MyDIGITAL Framework</div>
                          <div className="text-white/60 text-sm">Digital economy blueprint & 4IR alignment</div>
                        </div>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">134 controls</Badge>
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-white/20 bg-white/10 text-blue-600" />
                        <div>
                          <div className="text-white font-medium">AWS Security Best Practices</div>
                          <div className="text-white/60 text-sm">Cloud security framework for Malaysia region</div>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/30">127 controls</Badge>
                    </label>

                    <label className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="rounded border-white/20 bg-white/10 text-blue-600" />
                        <div>
                          <div className="text-white font-medium">ISO 27017</div>
                          <div className="text-white/60 text-sm">International cloud security controls</div>
                        </div>
                      </div>
                      <Badge className="bg-teal-500/20 text-teal-400 border-teal-400/30">87 controls</Badge>
                    </label>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <Button
                      onClick={() => startScan("Custom Scan")}
                      disabled={!!activeScan}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white border-0 rounded-xl shadow-lg transition-all duration-300"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      {activeScan ? `Scanning... ${Math.round(scanProgress)}%` : "Start AI Compliance Scan"}
                    </Button>
                    <p className="text-white/50 text-xs text-center mt-2">
                      {activeScan ? `Running ${activeScan} scan...` : "Estimated scan time: 3-5 minutes"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Scan Results */}
            {(activeScan || scanResults.length > 0) && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      {activeScan ? `${activeScan} Scan in Progress` : "Latest Scan Results"}
                    </h3>
                    {activeScan && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 animate-pulse">
                        {Math.round(scanProgress)}% Complete
                      </Badge>
                    )}
                  </div>

                  {activeScan && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/70 text-sm">Scanning cloud infrastructure...</span>
                        <span className="text-white/70 text-sm">{Math.round(scanProgress)}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                        <div
                          className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-white/50 text-xs mt-2">
                        AI is analyzing your cloud configurations for compliance violations...
                      </p>
                    </div>
                  )}

                  {scanResults.length > 0 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-red-500/10 border border-red-400/20 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                            <span className="text-red-400 font-medium">Critical Issues</span>
                          </div>
                          <div className="text-2xl font-bold text-red-400">
                            {scanResults.filter(r => r.type === 'critical').length}
                          </div>
                          <p className="text-red-400/70 text-xs">Immediate action required</p>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-4 w-4 text-yellow-400" />
                            <span className="text-yellow-400 font-medium">Medium Risks</span>
                          </div>
                          <div className="text-2xl font-bold text-yellow-400">
                            {scanResults.filter(r => r.type === 'medium').length}
                          </div>
                          <p className="text-yellow-400/70 text-xs">Plan remediation</p>
                        </div>
                        <div className="bg-green-500/10 border border-green-400/20 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-green-400 font-medium">Compliant</span>
                          </div>
                          <div className="text-2xl font-bold text-green-400">
                            {scanResults.filter(r => r.type === 'resolved').length}
                          </div>
                          <p className="text-green-400/70 text-xs">No action needed</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {scanResults.map((result) => (
                          <div
                            key={result.id}
                            className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                {result.type === 'critical' && <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />}
                                {result.type === 'medium' && <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />}
                                {result.type === 'resolved' && <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-white font-medium">{result.title}</h4>
                                    <Badge className="bg-white/10 text-white/70 text-xs">{result.service}</Badge>
                                    {result.riskLevel && (
                                      <Badge className={`text-xs ${
                                        result.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border-red-400/30' :
                                        result.riskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30' :
                                        'bg-green-500/20 text-green-400 border-green-400/30'
                                      }`}>
                                        {result.riskLevel} RISK
                                      </Badge>
                                    )}
                                  </div>

                                  {result.resourceDetails && (
                                    <div className="mb-2 p-2 bg-white/5 rounded border border-white/10">
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                          <span className="text-white/50">Resource:</span>
                                          <span className="text-white ml-1">{result.resourceDetails.resourceName}</span>
                                        </div>
                                        <div>
                                          <span className="text-white/50">Type:</span>
                                          <span className="text-white ml-1">{result.resourceDetails.resourceType}</span>
                                        </div>
                                        <div>
                                          <span className="text-white/50">Region:</span>
                                          <span className="text-white ml-1">{result.resourceDetails.region}</span>
                                        </div>
                                        <div>
                                          <span className="text-white/50">ARN:</span>
                                          <span className="text-white/70 ml-1 font-mono text-xs break-all">{result.resourceDetails.arn}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <p className="text-white/70 text-sm mb-2">{result.description}</p>
                                  <div className="space-y-2">
                                    <p className="text-white/50 text-xs">
                                      <strong>Remediation:</strong> {result.remediation}
                                    </p>
                                    {result.humanExplanation && (
                                      <div className="p-2 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                                        <p className="text-blue-300 text-xs">
                                          <strong>Audit Explanation:</strong> {result.humanExplanation}
                                        </p>
                                      </div>
                                    )}
                                    <div className="space-y-2">
                                      {result.complianceFrameworks && result.complianceFrameworks.length > 0 ? (
                                        <div className="flex flex-wrap gap-1">
                                          {result.complianceFrameworks.map((framework, idx) => (
                                            <Badge key={idx} className="bg-blue-500/20 text-blue-400 border-blue-400/30 text-xs">
                                              {framework}
                                            </Badge>
                                          ))}
                                        </div>
                                      ) : result.framework && (
                                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 text-xs">
                                          {result.framework}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceDashboard;