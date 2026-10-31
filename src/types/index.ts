/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PlanTier = 'start' | 'pro' | 'business' | 'premium' | 'essencial' | 'profissional' | 'empresarial';

export interface PlanLimit {
  tier: PlanTier;
  name: string;
  priceMonthly: number;
  maxUsers: number;
  maxClients: number;
  aiQueriesPerMonth: number;
  whatsAppIntegrations: number;
  supportLevel: string;
  hasCustomReports: boolean;
  hasApiAccess: boolean;
  features: string[];
}

export type CompanyStatus = 'ativo' | 'em_teste' | 'suspenso' | 'inadimplente';

export type BusinessSegment = 
  | 'alimentacao'
  | 'automotivo'
  | 'beleza'
  | 'saude'
  | 'comercio'
  | 'logistica'
  | 'imobiliaria'
  | 'educacao'
  | 'servicos'
  | 'construcao'
  | 'petshop'
  | 'hotelaria'
  | 'digital'
  | 'restaurante'
  | 'oficina'
  | 'clinica'
  | 'personalizado';

export interface CustomTerminology {
  clientsLabel: string;
  clientSingular: string;
  salesLabel: string;
  saleSingular: string;
  itemsLabel: string;
  itemSingular: string;
}

export interface CustomKpi {
  id: string;
  title: string;
  value: string | number;
  changePercent?: number;
  isPositive?: boolean;
  unit?: string;
  description: string;
}

export interface Company {
  id: string;
  name: string;
  tradeName?: string;
  cnpjCpf: string;
  segment: BusinessSegment;
  customSegmentName?: string;
  activityDescription: string;
  staffCount: number;
  mainProductsOrServices: string;
  location?: string;
  businessGoals?: string;
  plan: PlanTier;
  status: CompanyStatus;
  createdAt: string;
  trialEndsAt?: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  terminology: CustomTerminology;
  enabledModules: string[];
  kpis: CustomKpi[];
  usage: {
    usersCount: number;
    aiQueriesThisMonth: number;
    whatsappMessagesThisMonth: number;
  };
}

export type UserRole = 'master_owner' | 'company_admin' | 'manager' | 'operator' | 'sales_rep';

export interface User {
  id: string;
  companyId: string | 'master';
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
  active: boolean;
  createdAt: string;
}

export interface Client {
  id: string;
  companyId: string;
  name: string;
  document: string;
  email: string;
  phone: string;
  segmentRole?: string;
  tags: string[];
  totalSpent: number;
  lastInteraction: string;
  status: 'ativo' | 'inativo' | 'em_atendimento';
  lgpdConsent: {
    granted: boolean;
    grantedAt: string;
    purpose: string;
    ipAddress?: string;
  };
  loyaltyPoints?: number;
  cashbackBalance?: number;
  notes?: string;
}

// NEXORA VENDAS & LEADS
export type FunnelStage = 'lead' | 'qualificacao' | 'proposta' | 'negociacao' | 'fechado_ganho' | 'perdido';

export interface LeadOpportunity {
  id: string;
  companyId: string;
  title: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  value: number;
  stage: FunnelStage;
  origin: 'instagram' | 'google_ads' | 'whatsapp' | 'indicacao' | 'landing_page' | 'balcao';
  salesRepName: string;
  commissionRate: number;
  probabilityPercent: number;
  expectedClosingDate: string;
  notes?: string;
  createdAt: string;
}

export interface SalesProposal {
  id: string;
  companyId: string;
  code: string;
  clientName: string;
  clientPhone: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  total: number;
  discount: number;
  paymentConditions: string;
  status: 'rascunho' | 'enviado' | 'aprovado' | 'rejeitado';
  validUntil: string;
  salesRep: string;
}

// NEXORA MARKETING
export interface MarketingCampaign {
  id: string;
  companyId: string;
  title: string;
  objective: string;
  channel: 'instagram' | 'whatsapp' | 'meta_ads' | 'email';
  targetAudience: string;
  copyText: string;
  callToAction: string;
  status: 'planejamento' | 'ativo' | 'concluido';
  budget?: number;
  scheduledDate: string;
  leadsGenerated?: number;
}

// NEXORA FIDELIDADE
export interface LoyaltyCoupon {
  id: string;
  companyId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  active: boolean;
  usageCount: number;
  expiresAt: string;
}

export interface LoyaltyConfig {
  cashbackPercent: number;
  pointsPerReal: number;
  referralRewardBonus: number;
  isActive: boolean;
}

// NEXORA TEAM
export interface TeamMember {
  id: string;
  companyId: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  department: string;
  commissionRate: number;
  salesGoalMonth: number;
  salesCurrentMonth: number;
  tasksCompleted: number;
  status: 'ativo' | 'afastado' | 'ferias';
}

export interface TeamTask {
  id: string;
  companyId: string;
  title: string;
  assignedTo: string;
  priority: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'pendente' | 'em_andamento' | 'concluida';
  dueDate: string;
}

// NEXORA STORE
export interface StoreProduct {
  id: string;
  companyId: string;
  sku: string;
  name: string;
  category: string;
  costPrice: number;
  sellPrice: number;
  stockQty: number;
  minStockQty: number;
  unit: string;
  checkoutLink?: string;
  active: boolean;
}

// NEXORA REPUTATION
export interface ReputationReview {
  id: string;
  companyId: string;
  clientName: string;
  clientPhone?: string;
  rating: number; // 1 to 5
  npsScore: number; // 0 to 10
  comment: string;
  channel: 'google_review' | 'whatsapp' | 'pesquisa_interna';
  responded: boolean;
  responseNote?: string;
  date: string;
}

// NEXORA ACADEMY
export interface AcademyCourse {
  id: string;
  title: string;
  category: string;
  duration: string;
  modulesCount: number;
  progressPercent: number;
  description: string;
  badge: string;
}

// NEXORA EXPANSION
export interface ExpansionBranch {
  id: string;
  companyId: string;
  name: string;
  city: string;
  state: string;
  isHeadquarters: boolean;
  monthlyRevenue: number;
  monthlyExpenses: number;
  staffCount: number;
  status: 'operando' | 'em_implantacao' | 'estudo';
}

// NEXORA GROWTH AI
export interface GrowthOpportunity {
  id: string;
  companyId: string;
  question: string;
  insight: string;
  suggestedAction: string;
  potentialRevenueGain: number;
  status: 'disponivel' | 'em_execucao' | 'concluido';
  actionPayload?: any;
}

// Financial
export interface FinancialTransaction {
  id: string;
  companyId: string;
  type: 'receita' | 'despesa';
  category: string;
  description: string;
  amount: number;
  date: string;
  dueDate?: string;
  status: 'pago' | 'pendente' | 'cancelado';
  isConciliated: boolean; // Conciliação bancária
  paymentMethod: 'pix' | 'cartao_credito' | 'cartao_debito' | 'boleto' | 'transferencia' | 'dinheiro';
  clientName?: string;
  clientId?: string;
}

// WhatsApp Connection & Messages
export interface WhatsAppConnection {
  companyId: string;
  wabaId: string;
  phoneNumberId: string;
  displayPhoneNumber: string;
  verifiedName: string;
  status: 'conectado' | 'desconectado' | 'verificacao_pendente';
  qualityRating: 'GREEN' | 'YELLOW' | 'RED';
  lastSyncAt: string;
  embeddedSignupActive: boolean;
}

export interface WhatsAppMessage {
  id: string;
  companyId: string;
  contactId?: string;
  contactName: string;
  contactPhone: string;
  direction: 'inbound' | 'outbound';
  content: string;
  status: 'enviado' | 'entregue' | 'lido' | 'falha';
  timestamp: string;
  isOfficialTemplate?: boolean;
  templateName?: string;
  errorMessage?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'UTILITY' | 'MARKETING' | 'AUTHENTICATION';
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  language: string;
  content: string;
  variables: string[];
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  rolePersona?: 'geral' | 'vendas' | 'financeiro' | 'marketing' | 'processos';
  actionProposal?: {
    actionType: 'create_transaction' | 'update_status' | 'send_whatsapp' | 'create_campaign' | 'add_task';
    title: string;
    description: string;
    payload: any;
    status: 'pending' | 'approved' | 'rejected';
  };
}

export interface AuditLog {
  id: string;
  companyId: string | 'master';
  userId: string;
  userName: string;
  action: string;
  entity: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

// Segment legacy compatibility interfaces
export interface RestaurantTable {
  id: string;
  companyId: string;
  number: number;
  capacity: number;
  status: 'livre' | 'ocupada' | 'reservada' | 'fechando';
  currentCustomerName?: string;
  currentBillTotal: number;
  openedAt?: string;
  items: { name: string; quantity: number; unitPrice: number }[];
}

export interface WorkshopWorkOrder {
  id: string;
  companyId: string;
  code: string;
  clientName: string;
  clientPhone: string;
  vehiclePlate: string;
  vehicleModel: string;
  vehicleYear?: number;
  problemReported: string;
  diagnostic: string;
  status: 'orcamento' | 'aprovado' | 'em_execucao' | 'aguardando_pecas' | 'concluido' | 'entregue';
  totalParts: number;
  totalLabor: number;
  total: number;
  openedAt: string;
  estimatedDelivery: string;
}

export interface ClinicAppointment {
  id: string;
  companyId: string;
  patientName: string;
  patientPhone: string;
  professionalName: string;
  specialtyOrProcedure: string;
  dateTime: string;
  status: 'agendado' | 'confirmado_whatsapp' | 'em_atendimento' | 'concluido' | 'cancelado';
  value: number;
  insuranceName?: string;
  notes?: string;
}

export interface RealEstateProperty {
  id: string;
  companyId: string;
  code: string;
  title: string;
  type: 'apartamento' | 'casa' | 'comercial' | 'terreno' | 'cobertura';
  purpose: 'venda' | 'locacao';
  price: number;
  address: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  areaM2: number;
  status: 'disponivel' | 'em_negociacao' | 'vendido' | 'alugado';
  leadsCount: number;
}

export interface RetailProduct {
  id: string;
  companyId: string;
  sku: string;
  name: string;
  category: string;
  costPrice: number;
  sellPrice: number;
  stockQty: number;
  minStockQty: number;
  unit: string;
}

export interface ServiceContract {
  id: string;
  companyId: string;
  clientName: string;
  contractTitle: string;
  recurrence: 'mensal' | 'trimestral' | 'semestral' | 'anual' | 'avulso';
  value: number;
  status: 'ativo' | 'renovacao_pendente' | 'cancelado';
  startDate: string;
  renewalDate: string;
  deliverables: string[];
}
