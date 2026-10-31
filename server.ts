/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { 
  Company, 
  PlanLimit, 
  Client, 
  FinancialTransaction, 
  RestaurantTable, 
  WorkshopWorkOrder, 
  ClinicAppointment, 
  RealEstateProperty, 
  RetailProduct, 
  ServiceContract,
  WhatsAppConnection,
  WhatsAppMessage,
  WhatsAppTemplate,
  AuditLog,
  LeadOpportunity,
  SalesProposal,
  MarketingCampaign,
  LoyaltyCoupon,
  LoyaltyConfig,
  TeamMember,
  TeamTask,
  StoreProduct,
  ReputationReview,
  AcademyCourse,
  ExpansionBranch,
  GrowthOpportunity
} from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const rawKey = process.env.GEMINI_API_KEY || '';
const hasValidKey = rawKey && rawKey !== 'MY_GEMINI_API_KEY';
const ai = hasValidKey
  ? new GoogleGenAI({
      apiKey: rawKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Timeout wrapper for AI calls
async function callGeminiWithTimeout<T>(promise: Promise<T>, timeoutMs = 8000): Promise<T> {
  let timeoutHandle: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutHandle = setTimeout(() => reject(new Error('AI request timed out')), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutHandle));
}

// Master Owner Configurable Plans (Start, Pro, Business, Premium)
let PLANS: Record<string, PlanLimit> = {
  start: {
    tier: 'start',
    name: 'Start',
    priceMonthly: 49.90,
    maxUsers: 2,
    maxClients: 300,
    aiQueriesPerMonth: 80,
    whatsAppIntegrations: 1,
    supportLevel: 'Suporte por Base e E-mail',
    hasCustomReports: false,
    hasApiAccess: false,
    features: ['Isolamento total de dados', 'Módulos essenciais de vendas', 'Até 300 clientes', '1 conexão WhatsApp Cloud', 'NEXORA Copilot básico'],
  },
  pro: {
    tier: 'pro',
    name: 'Pro',
    priceMonthly: 99.90,
    maxUsers: 6,
    maxClients: 1500,
    aiQueriesPerMonth: 350,
    whatsAppIntegrations: 1,
    supportLevel: 'Atendimento WhatsApp Comercial',
    hasCustomReports: true,
    hasApiAccess: false,
    features: ['Tudo do Start +', 'Até 6 colaboradores', 'NEXORA Marketing com IA', 'NEXORA Fidelidade & Cashback', 'Relatórios DRE conciliados'],
  },
  business: {
    tier: 'business',
    name: 'Business',
    priceMonthly: 199.90,
    maxUsers: 20,
    maxClients: 8000,
    aiQueriesPerMonth: 1500,
    whatsAppIntegrations: 3,
    supportLevel: 'Gerente de Contas Dedicado',
    hasCustomReports: true,
    hasApiAccess: true,
    features: ['Tudo do Pro +', 'Até 20 colaboradores', 'NEXORA Growth AI analítico', 'NEXORA Expansion & Filiais', 'Automação avançada WhatsApp'],
  },
  premium: {
    tier: 'premium',
    name: 'Premium',
    priceMonthly: 299.90,
    maxUsers: 999,
    maxClients: 99999,
    aiQueriesPerMonth: 6000,
    whatsAppIntegrations: 10,
    supportLevel: 'SLA Prioritário 24/7 & Engenharia',
    hasCustomReports: true,
    hasApiAccess: true,
    features: ['Usuários e clientes ilimitados', 'Até 10 números WhatsApp Cloud', 'NEXORA Academy completo', 'Modelos prioritários de IA', 'Multi-filiais ilimitadas'],
  },
  // Legacy aliases
  essencial: {
    tier: 'start',
    name: 'Start (Essencial)',
    priceMonthly: 49.90,
    maxUsers: 2,
    maxClients: 300,
    aiQueriesPerMonth: 80,
    whatsAppIntegrations: 1,
    supportLevel: 'Suporte Base',
    hasCustomReports: false,
    hasApiAccess: false,
    features: ['Módulos essenciais'],
  },
  profissional: {
    tier: 'pro',
    name: 'Pro (Profissional)',
    priceMonthly: 99.90,
    maxUsers: 6,
    maxClients: 1500,
    aiQueriesPerMonth: 350,
    whatsAppIntegrations: 1,
    supportLevel: 'Comercial',
    hasCustomReports: true,
    hasApiAccess: false,
    features: ['Módulos avançados'],
  },
  empresarial: {
    tier: 'business',
    name: 'Business (Empresarial)',
    priceMonthly: 199.90,
    maxUsers: 20,
    maxClients: 8000,
    aiQueriesPerMonth: 1500,
    whatsAppIntegrations: 3,
    supportLevel: 'Dedicado',
    hasCustomReports: true,
    hasApiAccess: true,
    features: ['Multi-filiais e Growth AI'],
  },
};

// Seed companies representing real Brazilian businesses across key verticals
let companies: Company[] = [
  {
    id: 'comp_restaurante',
    name: 'Gourmet Bistro & Wine',
    tradeName: 'Bistrô do Chef',
    cnpjCpf: '12.345.678/0001-90',
    segment: 'alimentacao',
    activityDescription: 'Restaurante contemporâneo e adega com serviço de salão, comandas eletrônicas e delivery selecionado.',
    staffCount: 14,
    mainProductsOrServices: 'Pratos à la carte, vinhos importados, menus degustação e sobremesas artesanais',
    location: 'São Paulo - SP',
    businessGoals: 'Aumentar ticket médio em 20% e fidelizar clientes de jantar',
    plan: 'business',
    status: 'ativo',
    createdAt: '2026-02-15T10:00:00Z',
    contactEmail: 'gerencia@gourmetbistro.com.br',
    contactPhone: '+55 11 98765-4321',
    address: 'Alameda Santos, 1200 - Jardins, São Paulo/SP',
    terminology: {
      clientsLabel: 'Comensais & Reservas',
      clientSingular: 'Cliente / Reserva',
      salesLabel: 'Comandas & Contas',
      saleSingular: 'Conta de Mesa',
      itemsLabel: 'Cardápio & Vinhos',
      itemSingular: 'Item do Cardápio',
    },
    enabledModules: ['dashboard', 'vendas', 'marketing', 'connect', 'financeiro', 'fidelidade', 'intelligence', 'team', 'store', 'growth_ai', 'academy'],
    kpis: [
      { id: 'k1', title: 'Ticket Médio por Mesa', value: 'R$ 184,50', changePercent: 12.4, isPositive: true, description: 'Média de consumo por comanda finalizada' },
      { id: 'k2', title: 'Giro de Mesas / Noite', value: '2.8x', changePercent: 5.2, isPositive: true, description: 'Rotatividade média do salão no jantar' },
      { id: 'k3', title: 'Custo Mercadoria Vendida (CMV)', value: '28.5%', changePercent: -1.8, isPositive: true, description: 'Eficiência de insumos e compras' },
    ],
    usage: {
      usersCount: 8,
      aiQueriesThisMonth: 142,
      whatsappMessagesThisMonth: 620,
    },
  },
  {
    id: 'comp_oficina',
    name: 'AutoTech Precision & Performance',
    tradeName: 'AutoTech Mecânica',
    cnpjCpf: '23.456.789/0001-01',
    segment: 'automotivo',
    activityDescription: 'Centro automotivo multimarcas especializado em injeção eletrônica, suspensão, freios e revisões preventivas.',
    staffCount: 9,
    mainProductsOrServices: 'Revisão geral, troca de óleo, diagnóstico computadorizado, alinhamento 3D e peças originais',
    location: 'Campinas - SP',
    businessGoals: 'Expandir para frotas corporativas e reduzir tempo de box',
    plan: 'pro',
    status: 'ativo',
    createdAt: '2026-03-01T14:30:00Z',
    contactEmail: 'atendimento@autotechprecision.com.br',
    contactPhone: '+55 19 97123-4567',
    address: 'Av. Brasil, 4500 - Campinas/SP',
    terminology: {
      clientsLabel: 'Proprietários & Frotistas',
      clientSingular: 'Cliente Automotivo',
      salesLabel: 'Ordens de Serviço (OS)',
      saleSingular: 'Ordem de Serviço',
      itemsLabel: 'Peças & Estoque Técnico',
      itemSingular: 'Peça Automotiva',
    },
    enabledModules: ['dashboard', 'vendas', 'connect', 'financeiro', 'team', 'store', 'reputation', 'growth_ai'],
    kpis: [
      { id: 'k1', title: 'Tempo Médio no Box', value: '4.2 horas', changePercent: -8.5, isPositive: true, description: 'Velocidade de liberação dos veículos' },
      { id: 'k2', title: 'Taxa de Conversão de Orçamento', value: '78%', changePercent: 6.3, isPositive: true, description: 'Aprovação de laudos técnicos' },
      { id: 'k3', title: 'Faturamento em Peças vs Serviços', value: '54% / 46%', changePercent: 3.1, isPositive: true, description: 'Equilíbrio de margem operacional' },
    ],
    usage: {
      usersCount: 4,
      aiQueriesThisMonth: 88,
      whatsappMessagesThisMonth: 390,
    },
  },
  {
    id: 'comp_clinica',
    name: 'Clínica Lumina Dermatologia & Estética',
    tradeName: 'Lumina Saúde & Beleza',
    cnpjCpf: '34.567.890/0001-12',
    segment: 'saude',
    activityDescription: 'Clínica médica especializada em procedimentos dermatológicos estéticos e clínicos com atendimento humanizado.',
    staffCount: 12,
    mainProductsOrServices: 'Consultas dermatológicas, laser, preenchimento, toxina botulínica e bioestimuladores',
    location: 'Rio de Janeiro - RJ',
    businessGoals: 'Fidelização de pacientes particulares e redução do no-show a zero',
    plan: 'business',
    status: 'ativo',
    createdAt: '2026-01-20T08:15:00Z',
    contactEmail: 'contato@clinicalumina.com.br',
    contactPhone: '+55 21 98877-6655',
    address: 'Av. das Américas, 3500 - Barra da Tijuca, Rio de Janeiro/RJ',
    terminology: {
      clientsLabel: 'Pacientes',
      clientSingular: 'Paciente',
      salesLabel: 'Procedimentos & Consultas',
      saleSingular: 'Atendimento Clínico',
      itemsLabel: 'Serviços Médicos & Fórmulas',
      itemSingular: 'Procedimento Clínico',
    },
    enabledModules: ['dashboard', 'vendas', 'marketing', 'connect', 'financeiro', 'fidelidade', 'intelligence', 'team', 'reputation', 'growth_ai'],
    kpis: [
      { id: 'k1', title: 'Taxa de Retorno de Pacientes', value: '84%', changePercent: 9.1, isPositive: true, description: 'Recorrência em tratamentos contínuos' },
      { id: 'k2', title: 'Taxa de No-Show (Faltas)', value: '4.8%', changePercent: -35.0, isPositive: true, description: 'Redução drástica com confirmação WhatsApp' },
      { id: 'k3', title: 'Ticket Médio por Procedimento', value: 'R$ 890,00', changePercent: 15.2, isPositive: true, description: 'Média de procedimentos de alta complexidade' },
    ],
    usage: {
      usersCount: 7,
      aiQueriesThisMonth: 310,
      whatsappMessagesThisMonth: 1450,
    },
  },
  {
    id: 'comp_imobiliaria',
    name: 'Vanguard Imóveis Prime',
    tradeName: 'Vanguard Real Estate',
    cnpjCpf: '45.678.901/0001-23',
    segment: 'imobiliaria',
    activityDescription: 'Imobiliária boutique com foco em locação e venda de imóveis de médio e alto padrão na região metropolitana.',
    staffCount: 18,
    mainProductsOrServices: 'Intermediação de compra e venda, assessoria de locação residencial e comercial, laudos de avaliação',
    location: 'Belo Horizonte - MG',
    businessGoals: 'Abrir 2 novas filiais metropolitanas e atingir R$ 15M VGV trimestral',
    plan: 'premium',
    status: 'ativo',
    createdAt: '2026-01-10T11:20:00Z',
    contactEmail: 'diretoria@vanguardimoveis.com.br',
    contactPhone: '+55 31 99123-9876',
    address: 'Rua Paraíba, 1000 - Savassi, Belo Horizonte/MG',
    terminology: {
      clientsLabel: 'Clientes & Compradores/Locatários',
      clientSingular: 'Interessado / Cliente',
      salesLabel: 'Propostas & Contratos',
      saleSingular: 'Negociação Fechada',
      itemsLabel: 'Carteira de Imóveis',
      itemSingular: 'Imóvel Cadastrado',
    },
    enabledModules: ['dashboard', 'vendas', 'marketing', 'connect', 'financeiro', 'team', 'expansion', 'growth_ai', 'academy'],
    kpis: [
      { id: 'k1', title: 'Tempo Médio de Fechamento', value: '28 dias', changePercent: -14.0, isPositive: true, description: 'Da primeira visita à assinatura de contrato' },
      { id: 'k2', title: 'Volume Geral de Vendas (VGV)', value: 'R$ 8.4M', changePercent: 22.8, isPositive: true, description: 'Volume total transacionado no trimestre' },
      { id: 'k3', title: 'Taxa de Conversão de Visitas', value: '31%', changePercent: 4.5, isPositive: true, description: 'Visitas que geram propostas formais' },
    ],
    usage: {
      usersCount: 15,
      aiQueriesThisMonth: 640,
      whatsappMessagesThisMonth: 2890,
    },
  },
];

// In-memory data store logically isolated by companyId
const dataStore = {
  clients: [] as Client[],
  transactions: [] as FinancialTransaction[],
  restaurantTables: [] as RestaurantTable[],
  workshopOrders: [] as WorkshopWorkOrder[],
  clinicAppointments: [] as ClinicAppointment[],
  realEstateProperties: [] as RealEstateProperty[],
  retailProducts: [] as RetailProduct[],
  serviceContracts: [] as ServiceContract[],
  whatsappConnections: [] as WhatsAppConnection[],
  whatsappMessages: [] as WhatsAppMessage[],
  whatsappTemplates: [] as WhatsAppTemplate[],
  auditLogs: [] as AuditLog[],
  // NEXORA BUSINESS new collections
  leadOpportunities: [] as LeadOpportunity[],
  salesProposals: [] as SalesProposal[],
  marketingCampaigns: [] as MarketingCampaign[],
  loyaltyCoupons: [] as LoyaltyCoupon[],
  loyaltyConfigs: {} as Record<string, LoyaltyConfig>,
  teamMembers: [] as TeamMember[],
  teamTasks: [] as TeamTask[],
  storeProducts: [] as StoreProduct[],
  reputationReviews: [] as ReputationReview[],
  academyCourses: [] as AcademyCourse[],
  expansionBranches: [] as ExpansionBranch[],
  growthOpportunities: [] as GrowthOpportunity[],
};

// Seed initial realistic data across all NEXORA BUSINESS modules
function seedInitialData() {
  // 1. Clients
  dataStore.clients.push(
    {
      id: 'cli_rest_1',
      companyId: 'comp_restaurante',
      name: 'Dr. Roberto Vasconcelos',
      document: '123.456.789-00',
      email: 'roberto.vasconcelos@hospital.com.br',
      phone: '+55 11 99123-4455',
      segmentRole: 'Comensal VIP Salão',
      tags: ['VIP', 'Sommelier Club', 'Jantar'],
      totalSpent: 4250.00,
      lastInteraction: '2026-10-28T21:30:00Z',
      status: 'ativo',
      loyaltyPoints: 425,
      cashbackBalance: 212.50,
      lgpdConsent: { granted: true, grantedAt: '2026-03-01T12:00:00Z', purpose: 'Reservas, menus e cashback' },
      notes: 'Aprecia vinhos tintos encorpados safra Bordeaux e reserva a mesma mesa.',
    },
    {
      id: 'cli_rest_2',
      companyId: 'comp_restaurante',
      name: 'Mariana Duarte Prado',
      document: '234.567.890-11',
      email: 'mariana.prado@arquitetura.com',
      phone: '+55 11 98822-3344',
      segmentRole: 'Almoço Executivo Recorrente',
      tags: ['Executivo', 'Reserva Antecipada'],
      totalSpent: 1890.00,
      lastInteraction: '2026-10-29T13:15:00Z',
      status: 'ativo',
      loyaltyPoints: 189,
      cashbackBalance: 94.50,
      lgpdConsent: { granted: true, grantedAt: '2026-04-10T14:00:00Z', purpose: 'Lembretes de almoço e reservas' },
    }
  );

  // 2. Financial Transactions with Conciliation status
  dataStore.transactions.push(
    { id: 'tr_1', companyId: 'comp_restaurante', type: 'receita', category: 'Vendas Salão', description: 'Comandas Salão Almoço e Jantar', amount: 8450.00, date: '2026-10-29', status: 'pago', isConciliated: true, paymentMethod: 'cartao_credito', clientName: 'Faturamento Balcão' },
    { id: 'tr_2', companyId: 'comp_restaurante', type: 'receita', category: 'Delivery & Takeout', description: 'Vendas Plataforma Delivery e WhatsApp', amount: 2190.00, date: '2026-10-29', status: 'pago', isConciliated: true, paymentMethod: 'pix', clientName: 'Entregas Delivery' },
    { id: 'tr_3', companyId: 'comp_restaurante', type: 'despesa', category: 'Fornecedores - Carnes Nobres', description: 'Frigorífico Premium Carnes Angus', amount: 3200.00, date: '2026-10-28', status: 'pago', isConciliated: true, paymentMethod: 'transferencia' },
    { id: 'tr_4', companyId: 'comp_restaurante', type: 'despesa', category: 'Bebidas e Adega', description: 'Importadora Mistral Vinhos Finos', amount: 2450.00, date: '2026-10-27', status: 'pago', isConciliated: true, paymentMethod: 'boleto' },
    { id: 'tr_5', companyId: 'comp_restaurante', type: 'despesa', category: 'Folha de Pagamento', description: 'Adiantamento Quinzenal Equipe Cozinha e Salão', amount: 4800.00, date: '2026-10-30', status: 'pendente', isConciliated: false, paymentMethod: 'pix' }
  );

  // 3. NEXORA VENDAS (Pipeline Leads & Opportunities)
  dataStore.leadOpportunities.push(
    {
      id: 'opp_1',
      companyId: 'comp_restaurante',
      title: 'Evento Corporativo de Fim de Ano (40 Pessoas)',
      clientName: 'Banco Safra Asset Management',
      clientPhone: '+55 11 98123-4567',
      clientEmail: 'eventos@safra.com.br',
      value: 12800.00,
      stage: 'negociacao',
      origin: 'whatsapp',
      salesRepName: 'Chef Executivo / Sommelier',
      commissionRate: 5.0,
      probabilityPercent: 85,
      expectedClosingDate: '2026-11-10',
      notes: 'Cardápio fechado de 4 tempos com harmonização de vinhos. Aguardando assinatura de contrato.',
      createdAt: '2026-10-26T14:00:00Z',
    },
    {
      id: 'opp_2',
      companyId: 'comp_restaurante',
      title: 'Jantar Comemorativo 15 Anos Casamento',
      clientName: 'Eduardo Silveira Couto',
      clientPhone: '+55 11 97654-3210',
      clientEmail: 'eduardo.couto@investimentos.com',
      value: 3400.00,
      stage: 'proposta',
      origin: 'instagram',
      salesRepName: 'Maitre Salão',
      commissionRate: 4.0,
      probabilityPercent: 70,
      expectedClosingDate: '2026-11-05',
      notes: 'Mesa no lounge privativo da adega com sobremesa personalizada.',
      createdAt: '2026-10-28T10:30:00Z',
    },
    {
      id: 'opp_3',
      companyId: 'comp_restaurante',
      title: 'Parceria Mensal Menu Degustação para Sócios',
      clientName: 'Clube dos Magistrados',
      clientPhone: '+55 11 99988-1122',
      value: 18500.00,
      stage: 'qualificacao',
      origin: 'indicacao',
      salesRepName: 'Diretoria Comercial',
      commissionRate: 6.0,
      probabilityPercent: 50,
      expectedClosingDate: '2026-11-20',
      notes: 'Interesse em 20 jantares mensais garantidos.',
      createdAt: '2026-10-29T16:00:00Z',
    }
  );

  // 4. NEXORA MARKETING
  dataStore.marketingCampaigns.push(
    {
      id: 'camp_1',
      companyId: 'comp_restaurante',
      title: 'Quinta dos Vinhos & Jazz ao Vivo',
      objective: 'Atrair clientes em dia de movimento moderado e elevar ticket médio',
      channel: 'instagram',
      targetAudience: 'Casais e apreciadores de gastronomia refinada nos Jardins e Pinheiros',
      copyText: '✨ Quintas-feiras ganham um novo tom no Bistrô do Chef. Seleção especial de rótulos premiados com 20% off e jazz ao vivo no salão intimista. Lugares limitados. Reserve seu lugar via WhatsApp.',
      callToAction: 'Reservar Mesa Exclusiva',
      status: 'ativo',
      budget: 650.00,
      scheduledDate: '2026-11-05',
      leadsGenerated: 38,
    },
    {
      id: 'camp_2',
      companyId: 'comp_restaurante',
      title: 'Reativação de Clientes Sumidos (60 dias sem visita)',
      objective: 'Reengajar base inativa com sobremesa cortesia do Chef',
      channel: 'whatsapp',
      targetAudience: 'Clientes sem visita há mais de 45 dias com cadastro LGPD',
      copyText: 'Olá {{nome}}! Sentimos sua falta em nosso salão. Como você é muito especial para nós, preparamos uma garrafa de vinho ou sobremesa autoral por nossa conta no seu próximo jantar.',
      callToAction: 'Garantir Cortesia',
      status: 'planejamento',
      budget: 0,
      scheduledDate: '2026-11-08',
      leadsGenerated: 14,
    }
  );

  // 5. NEXORA FIDELIDADE
  dataStore.loyaltyConfigs['comp_restaurante'] = {
    cashbackPercent: 5.0,
    pointsPerReal: 1,
    referralRewardBonus: 30.00,
    isActive: true,
  };

  dataStore.loyaltyCoupons.push(
    {
      id: 'coup_1',
      companyId: 'comp_restaurante',
      code: 'NEXORA-WINE15',
      discountType: 'percentage',
      discountValue: 15,
      minSpend: 250.00,
      active: true,
      usageCount: 24,
      expiresAt: '2026-12-31',
    },
    {
      id: 'coup_2',
      companyId: 'comp_restaurante',
      code: 'PRIMEIRO-JANTAR',
      discountType: 'fixed',
      discountValue: 50.00,
      minSpend: 200.00,
      active: true,
      usageCount: 42,
      expiresAt: '2026-11-30',
    }
  );

  // 6. NEXORA TEAM
  dataStore.teamMembers.push(
    {
      id: 'tm_1',
      companyId: 'comp_restaurante',
      name: 'Guilherme Sampaio',
      role: 'Sommelier & Gestor Comercial',
      email: 'guilherme.sommelier@bistro.com.br',
      phone: '+55 11 98877-1234',
      department: 'Salão & Vendas',
      commissionRate: 5.0,
      salesGoalMonth: 65000.00,
      salesCurrentMonth: 58400.00,
      tasksCompleted: 18,
      status: 'ativo',
    },
    {
      id: 'tm_2',
      companyId: 'comp_restaurante',
      name: 'Chef Marcelo Fagundes',
      role: 'Chef Executivo de Cozinha',
      email: 'marcelo.chef@bistro.com.br',
      phone: '+55 11 97766-5544',
      department: 'Gastronomia & Insumos',
      commissionRate: 2.0,
      salesGoalMonth: 120000.00,
      salesCurrentMonth: 114000.00,
      tasksCompleted: 26,
      status: 'ativo',
    },
    {
      id: 'tm_3',
      companyId: 'comp_restaurante',
      name: 'Larissa Alencar',
      role: 'Maitre & Recepção Executiva',
      email: 'larissa.maitre@bistro.com.br',
      phone: '+55 11 96655-4433',
      department: 'Atendimento & Reservas',
      commissionRate: 3.5,
      salesGoalMonth: 45000.00,
      salesCurrentMonth: 43200.00,
      tasksCompleted: 31,
      status: 'ativo',
    }
  );

  dataStore.teamTasks.push(
    { id: 'tsk_1', companyId: 'comp_restaurante', title: 'Conferir lote de vinhos safra 2020 importados', assignedTo: 'Guilherme Sampaio', priority: 'alta', status: 'em_andamento', dueDate: '2026-10-31' },
    { id: 'tsk_2', companyId: 'comp_restaurante', title: 'Atualizar ficha técnica do menu de degustação', assignedTo: 'Chef Marcelo Fagundes', priority: 'media', status: 'concluida', dueDate: '2026-10-29' },
    { id: 'tsk_3', companyId: 'comp_restaurante', title: 'Confirmar reservas de sábado via WhatsApp Business', assignedTo: 'Larissa Alencar', priority: 'critica', status: 'pendente', dueDate: '2026-10-31' }
  );

  // 7. NEXORA STORE (Catálogo Digital & Checkout Rápido)
  dataStore.storeProducts.push(
    { id: 'sp_1', companyId: 'comp_restaurante', sku: 'VIN-BOR-01', name: 'Vinho Tinto Château Haut-Médoc 2018 750ml', category: 'Adega Premium', costPrice: 140.00, sellPrice: 320.00, stockQty: 18, minStockQty: 6, unit: 'GARRAFA', checkoutLink: 'https://nexora.app/pay/bistro-vin-01', active: true },
    { id: 'sp_2', companyId: 'comp_restaurante', sku: 'EXP-DEG-02', name: 'Experiência Menu Degustação do Chef (2 Pessoas)', category: 'Experiências Gastronômicas', costPrice: 90.00, sellPrice: 280.00, stockQty: 99, minStockQty: 0, unit: 'VOUCHER', checkoutLink: 'https://nexora.app/pay/bistro-deg-02', active: true },
    { id: 'sp_3', companyId: 'comp_restaurante', sku: 'AZE-ART-03', name: 'Azeite Extra Virgem Monovarietal Koroneiki 500ml', category: 'Empório Gourmet', costPrice: 38.00, sellPrice: 89.00, stockQty: 25, minStockQty: 8, unit: 'UNIDADE', checkoutLink: 'https://nexora.app/pay/bistro-azeite', active: true }
  );

  // 8. NEXORA REPUTATION (Avaliações e NPS)
  dataStore.reputationReviews.push(
    { id: 'rev_1', companyId: 'comp_restaurante', clientName: 'Roberto Vasconcelos', rating: 5, npsScore: 10, comment: 'Atendimento impecável do Sommelier Guilherme e risoto de trufas excepcional. Experiência de nível internacional.', channel: 'google_review', responded: true, responseNote: 'Agradecemos imensamente, Dr. Roberto! É sempre uma honra recebê-lo.', date: '2026-10-28' },
    { id: 'rev_2', companyId: 'comp_restaurante', clientName: 'Mariana Duarte Prado', rating: 5, npsScore: 10, comment: 'Adoro o almoço executivo, rápido e saboroso para quem tem reuniões perto.', channel: 'whatsapp', responded: true, responseNote: 'Obrigado Mariana! Esperamos vê-la novamente esta semana.', date: '2026-10-29' },
    { id: 'rev_3', companyId: 'comp_restaurante', clientName: 'Carlos Mendonça', rating: 4, npsScore: 8, comment: 'Comida excelente, apenas a carta de sobremesas poderia ter mais opções sem açúcar.', channel: 'pesquisa_interna', responded: false, date: '2026-10-25' }
  );

  // 9. NEXORA ACADEMY
  dataStore.academyCourses.push(
    { id: 'acad_1', title: 'Técnicas Avançadas de Fechamento de Vendas Corporativas', category: 'Vendas & Negociação', duration: '2h 45m', modulesCount: 6, progressPercent: 80, description: 'Metodologia consultiva para conduzir orçamentos de alto valor com margens protegidas.', badge: 'Vendedor Master' },
    { id: 'acad_2', title: 'Atendimento e Conversão via WhatsApp Cloud Oficial', category: 'Comunicação & Vendas', duration: '1h 30m', modulesCount: 4, progressPercent: 100, description: 'Como usar gatilhos mentais e templates homologados pela Meta para converter contatos frios.', badge: 'Especialista WhatsApp' },
    { id: 'acad_3', title: 'Gestão de Fluxo de Caixa, DRE e Precificação Estratégica', category: 'Finanças Empresariais', duration: '3h 15m', modulesCount: 8, progressPercent: 40, description: 'Cálculo de CMV, margem de contribuição e proteção de capital de giro em negócios em crescimento.', badge: 'Gestor Financeiro' },
    { id: 'acad_4', title: 'Cultura de Liderança, Metas e Engajamento de Equipe', category: 'Gestão de Pessoas', duration: '2h 00m', modulesCount: 5, progressPercent: 15, description: 'Alinhamento de metas transparentes com comissionamento e retenção de talentos.', badge: 'Líder NEXORA' }
  );

  // 10. NEXORA EXPANSION (Filiais e Unidades)
  dataStore.expansionBranches.push(
    { id: 'br_1', companyId: 'comp_restaurante', name: 'Unidade Jardins (Matriz)', city: 'São Paulo', state: 'SP', isHeadquarters: true, monthlyRevenue: 185000.00, monthlyExpenses: 128000.00, staffCount: 14, status: 'operando' },
    { id: 'br_2', companyId: 'comp_restaurante', name: 'Unidade Alphaville (Filial 1)', city: 'Barueri', state: 'SP', isHeadquarters: false, monthlyRevenue: 98000.00, monthlyExpenses: 69000.00, staffCount: 8, status: 'operando' },
    { id: 'br_3', companyId: 'comp_restaurante', name: 'Unidade Vila Nova Conceição (Estudo de Viabilidade)', city: 'São Paulo', state: 'SP', isHeadquarters: false, monthlyRevenue: 0, monthlyExpenses: 12000.00, staffCount: 0, status: 'estudo' }
  );

  // 11. NEXORA GROWTH AI (Oportunidades mapeadas com dados reais)
  dataStore.growthOpportunities.push(
    {
      id: 'gro_1',
      companyId: 'comp_restaurante',
      question: 'Como vender mais neste mês aproveitando clientes que já conhecem a casa?',
      insight: 'Identificamos 42 clientes qualificados que não frequentam o restaurante há mais de 45 dias, representando um potencial de receita reprimida de R$ 7.740,00.',
      suggestedAction: 'Disparar campanha de reativação via WhatsApp Cloud oferecendo uma garrafa de vinho ou sobremesa do Chef no jantar de terça a quinta.',
      potentialRevenueGain: 7740.00,
      status: 'disponivel',
      actionPayload: { campaignType: 'reactivation_whatsapp', targetCount: 42, estimatedRoi: '4.8x' },
    },
    {
      id: 'gro_2',
      companyId: 'comp_restaurante',
      question: 'Onde estou gastando acima da média recomendada?',
      insight: 'O custo de insumos de carnes nobres subiu 6.2% este mês em relação ao faturamento, elevando o CMV para 28.5%.',
      suggestedAction: 'Renegociar tabela de cortes com frigorífico parceiro ou ajustar a precificação do menu degustação em 5%.',
      potentialRevenueGain: 2450.00,
      status: 'disponivel',
      actionPayload: { recommendationType: 'cost_reduction', supplier: 'Frigorífico Premium' },
    },
    {
      id: 'gro_3',
      companyId: 'comp_restaurante',
      question: 'Como aumentar o fechamento de orçamentos para eventos corporativos?',
      insight: 'Existem 2 propostas de eventos de confraternização somando R$ 16.200,00 aguardando follow-up há 4 dias.',
      suggestedAction: 'Enviar mensagem direta personalizada pelo WhatsApp oferecendo brinde de welcome drink se aprovado até esta sexta-feira.',
      potentialRevenueGain: 16200.00,
      status: 'disponivel',
      actionPayload: { actionType: 'followup_proposals', count: 2 },
    }
  );

  // 12. WhatsApp Connection
  companies.forEach((comp) => {
    dataStore.whatsappConnections.push({
      companyId: comp.id,
      wabaId: `waba_${comp.id}_99812`,
      phoneNumberId: `phone_id_${comp.id}`,
      displayPhoneNumber: comp.contactPhone,
      verifiedName: `${comp.name} Oficial`,
      status: 'conectado',
      qualityRating: 'GREEN',
      lastSyncAt: new Date().toISOString(),
      embeddedSignupActive: true,
    });
  });

  dataStore.whatsappTemplates.push(
    {
      id: 'tpl_lembrete_agenda',
      name: 'confirmacao_agendamento_nexora',
      category: 'UTILITY',
      status: 'APPROVED',
      language: 'pt_BR',
      content: 'Olá, {{1}}! Confirmamos seu compromisso na {{2}} para o dia {{3}} às {{4}}. Para confirmar digite 1, ou 2 para reagendar.',
      variables: ['Nome do Cliente', 'Nome da Empresa', 'Data', 'Horário'],
    },
    {
      id: 'tpl_orcamento_pronto',
      name: 'notificacao_orcamento_os',
      category: 'UTILITY',
      status: 'APPROVED',
      language: 'pt_BR',
      content: 'Olá, {{1}}! Seu orçamento {{2}} na {{3}} está disponível para aprovação. Valor total: {{4}}. Acesse o link seguro para visualizar o laudo técnico: {{5}}.',
      variables: ['Cliente', 'Código OS/Pedido', 'Empresa', 'Valor Total', 'Link de Aprovação'],
    },
    {
      id: 'tpl_cobranca_pix',
      name: 'lembrete_fatura_pix',
      category: 'UTILITY',
      status: 'APPROVED',
      language: 'pt_BR',
      content: 'Prezado(a) {{1}}, informamos que a fatura referente a {{2}} vence em {{3}}. Chave PIX: {{4}}. Dúvidas? Fale conosco por este canal.',
      variables: ['Sacado', 'Serviço/Produto', 'Data Vencimento', 'Chave Copia e Cola'],
    }
  );

  // Initial audit log
  dataStore.auditLogs.push(
    {
      id: 'aud_master_init',
      companyId: 'master',
      userId: 'alifer_madeiro_master',
      userName: 'Alifer Madeiro (Master Owner)',
      action: 'PLATFORM_SUPERVISION',
      entity: 'NEXORA BUSINESS Núcleo',
      details: 'Supervisão administrativa global e validação de isolamento multitenant.',
      ipAddress: '177.18.24.90',
      timestamp: new Date().toISOString(),
    }
  );
}

seedInitialData();

// ================= API ROUTES =================

// 1. Get all companies
app.get('/api/companies', (req, res) => {
  res.json({ success: true, data: companies });
});

// 2. Get specific company
app.get('/api/companies/:id', (req, res) => {
  const company = companies.find(c => c.id === req.params.id);
  if (!company) {
    return res.status(404).json({ success: false, message: 'Empresa não encontrada no banco isolado.' });
  }
  res.json({ success: true, data: company });
});

// 3. Register new company (Smart Onboarding)
app.post('/api/companies', (req, res) => {
  try {
    const {
      name,
      tradeName,
      cnpjCpf,
      segment,
      customSegmentName,
      activityDescription,
      staffCount,
      mainProductsOrServices,
      location,
      businessGoals,
      plan,
      terminology,
      enabledModules,
      kpis,
      contactEmail,
      contactPhone,
      address,
    } = req.body;

    if (!name || !cnpjCpf || !segment) {
      return res.status(400).json({ success: false, message: 'Dados cadastrais obrigatórios ausentes.' });
    }

    const newCompany: Company = {
      id: `comp_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      name,
      tradeName: tradeName || name,
      cnpjCpf,
      segment,
      customSegmentName,
      activityDescription: activityDescription || '',
      staffCount: Number(staffCount) || 1,
      mainProductsOrServices: mainProductsOrServices || '',
      location: location || 'Brasil',
      businessGoals: businessGoals || 'Crescimento e eficiência operacional',
      plan: plan || 'pro',
      status: 'ativo',
      createdAt: new Date().toISOString(),
      contactEmail: contactEmail || 'contato@empresa.com.br',
      contactPhone: contactPhone || '(11) 99999-9999',
      address: address || 'Brasil',
      terminology: terminology || {
        clientsLabel: 'Clientes & Contas',
        clientSingular: 'Cliente',
        salesLabel: 'Vendas & Negociações',
        saleSingular: 'Venda',
        itemsLabel: 'Produtos & Serviços',
        itemSingular: 'Item',
      },
      enabledModules: enabledModules && enabledModules.length > 0 ? enabledModules : ['dashboard', 'vendas', 'marketing', 'connect', 'financeiro', 'growth_ai', 'team'],
      kpis: kpis || [
        { id: 'k1', title: 'Faturamento Mensal', value: 'R$ 0,00', changePercent: 0, isPositive: true, description: 'Receitas consolidadas do mês' },
        { id: 'k2', title: 'Clientes Ativos', value: '0', changePercent: 0, isPositive: true, description: 'Base ativa de relacionamentos' },
        { id: 'k3', title: 'Taxa de Conversão', value: '0%', changePercent: 0, isPositive: true, description: 'Leads transformados em clientes' },
      ],
      usage: {
        usersCount: 1,
        aiQueriesThisMonth: 1,
        whatsappMessagesThisMonth: 0,
      },
    };

    companies.unshift(newCompany);

    // Provision isolated WhatsApp connection
    dataStore.whatsappConnections.push({
      companyId: newCompany.id,
      wabaId: `waba_${newCompany.id}`,
      phoneNumberId: `phone_${newCompany.id}`,
      displayPhoneNumber: newCompany.contactPhone,
      verifiedName: `${newCompany.name} Oficial`,
      status: 'conectado',
      qualityRating: 'GREEN',
      lastSyncAt: new Date().toISOString(),
      embeddedSignupActive: true,
    });

    // Provision headquarters branch in NEXORA EXPANSION
    dataStore.expansionBranches.push({
      id: `br_${newCompany.id}_matriz`,
      companyId: newCompany.id,
      name: `${newCompany.name} (Matriz)`,
      city: newCompany.location?.split('-')[0]?.trim() || 'São Paulo',
      state: newCompany.location?.split('-')[1]?.trim() || 'SP',
      isHeadquarters: true,
      monthlyRevenue: 0,
      monthlyExpenses: 0,
      staffCount: newCompany.staffCount,
      status: 'operando',
    });

    // Provision welcome audit log
    dataStore.auditLogs.unshift({
      id: `aud_${Date.now()}`,
      companyId: newCompany.id,
      userId: 'usr_onboarding',
      userName: 'NEXORA Smart Onboarding',
      action: 'TENANT_PROVISIONED',
      entity: 'Empresa',
      details: `Novo tenant provisionado para "${newCompany.name}" no plano ${newCompany.plan}.`,
      ipAddress: req.ip || '127.0.0.1',
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({ success: true, data: newCompany });
  } catch (error: any) {
    console.error('Error creating company:', error);
    res.status(500).json({ success: false, message: 'Erro ao provisionar empresa isolada.' });
  }
});

// 4. Update company (settings, status, plan, modules)
app.patch('/api/companies/:id', (req, res) => {
  const companyIndex = companies.findIndex(c => c.id === req.params.id);
  if (companyIndex === -1) {
    return res.status(404).json({ success: false, message: 'Empresa não encontrada.' });
  }

  const updatedCompany = {
    ...companies[companyIndex],
    ...req.body,
  };

  companies[companyIndex] = updatedCompany;

  dataStore.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    companyId: updatedCompany.id,
    userId: 'usr_manager',
    userName: 'Gestor Autorizado',
    action: 'COMPANY_UPDATED',
    entity: 'Configuração da Empresa',
    details: `Parâmetros atualizados para "${updatedCompany.name}".`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, data: updatedCompany });
});

// 5. Intelligent AI Recommendation Engine for Onboarding
app.post('/api/ai/recommend-setup', async (req, res) => {
  try {
    const { name, cnpjCpf, segment, customSegmentName, activityDescription, staffCount, mainProductsOrServices, location, businessGoals } = req.body;

    const prompt = `Você é o arquiteto sênior de negócios e IA da plataforma NEXORA BUSINESS.
Analise os dados cadastrais da empresa brasileira abaixo e proponha a configuração ideal, customizada para o seu nicho.

DADOS DA EMPRESA:
- Nome: ${name || 'Não informado'}
- CNPJ/CPF: ${cnpjCpf || 'Não informado'}
- Ramo/Segmento informado: ${segment === 'personalizado' ? customSegmentName : segment}
- Atividades: ${activityDescription || 'Não informada'}
- Funcionários: ${staffCount || 1}
- Produtos/Serviços: ${mainProductsOrServices || 'Não informado'}
- Localização: ${location || 'Brasil'}
- Objetivos: ${businessGoals || 'Crescimento e eficiência operacional'}

RETORNE RIGOROSAMENTE UM JSON com esta estrutura:
{
  "recommendedPlan": "start" | "pro" | "business" | "premium",
  "planJustification": "Explicação concisa e convincente em 1-2 frases sobre o porquê deste plano",
  "recommendedModules": ["dashboard", "vendas", "marketing", "connect", "financeiro", "fidelidade", "intelligence", "team", "growth_ai", ...outros],
  "terminology": {
    "clientsLabel": "Ex: Pacientes, Alunos, Comensais, Clientes, Inquilinos",
    "clientSingular": "Ex: Paciente, Aluno, Cliente, Inquilino",
    "salesLabel": "Ex: Consultas, Vendas, Matrículas, Ordens de Serviço, Contratos",
    "saleSingular": "Ex: Consulta, Venda, Matrícula, Pedido",
    "itemsLabel": "Ex: Procedimentos, Produtos, Cursos, Peças, Pratos",
    "itemSingular": "Ex: Procedimento, Produto, Curso, Peça, Prato"
  },
  "recommendedKpis": [
    {
      "title": "Nome do Indicador 1",
      "estimatedInitialTarget": "Meta inicial sugerida",
      "description": "Por que este KPI é crucial para este segmento"
    },
    {
      "title": "Nome do Indicador 2",
      "estimatedInitialTarget": "Meta inicial sugerida",
      "description": "Explicação da métrica"
    },
    {
      "title": "Nome do Indicador 3",
      "estimatedInitialTarget": "Meta inicial sugerida",
      "description": "Explicação da métrica"
    }
  ],
  "suggestedFinancialCategories": [
    "Receita Principal 1",
    "Receita Principal 2",
    "Custos de Insumos/Fornecedores",
    "Despesas com Equipe e Vendas"
  ],
  "aiExecutiveAdvice": "Mensagem executiva em 2 frases destacando como o NEXORA BUSINESS acelerará as vendas e o controle desta empresa."
}`;

    if (ai) {
      try {
        const aiResponse = await callGeminiWithTimeout(ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        }), 6000);

        const textOutput = aiResponse.text || '';
        const parsed = JSON.parse(textOutput);
        return res.json({ success: true, data: parsed, engine: 'gemini-3.8-flash' });
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to heuristic business rule engine:', err?.message || err);
      }
    }

    // High-precision heuristic fallback matrix
    const seg = (segment || 'comercio').toLowerCase();
    let modules = ['dashboard', 'vendas', 'marketing', 'connect', 'financeiro', 'fidelidade', 'intelligence', 'team', 'growth_ai'];
    let terminology = {
      clientsLabel: 'Clientes & Contas',
      clientSingular: 'Cliente',
      salesLabel: 'Vendas & Negociações',
      saleSingular: 'Venda',
      itemsLabel: 'Produtos & Serviços',
      itemSingular: 'Item',
    };
    let kpis = [
      { title: 'Faturamento Mensal', estimatedInitialTarget: 'R$ 35.000,00', description: 'Receita consolidada das operações' },
      { title: 'Ticket Médio', estimatedInitialTarget: 'R$ 180,00', description: 'Valor médio por transação concluída' },
      { title: 'Taxa de Conversão de Leads', estimatedInitialTarget: '28%', description: 'Oportunidades transformadas em clientes' },
    ];
    let recommendedPlan = (Number(staffCount) > 15 ? 'premium' : Number(staffCount) > 6 ? 'business' : Number(staffCount) > 2 ? 'pro' : 'start') as any;

    if (seg === 'alimentacao' || seg === 'restaurante') {
      modules = ['dashboard', 'vendas', 'marketing', 'connect', 'financeiro', 'fidelidade', 'intelligence', 'team', 'store', 'growth_ai', 'academy'];
      terminology = {
        clientsLabel: 'Comensais & Reservas',
        clientSingular: 'Cliente / Reserva',
        salesLabel: 'Comandas & Contas',
        saleSingular: 'Conta de Mesa',
        itemsLabel: 'Cardápio & Vinhos',
        itemSingular: 'Item do Cardápio',
      };
      kpis = [
        { title: 'Giro de Mesas', estimatedInitialTarget: '2.5x por noite', description: 'Rotatividade média do salão' },
        { title: 'Ticket Médio', estimatedInitialTarget: 'R$ 175,00', description: 'Consumo por comanda finalizada' },
        { title: 'CMV Estimado', estimatedInitialTarget: '28%', description: 'Custo de mercadoria sobre a receita' },
      ];
    } else if (seg === 'automotivo' || seg === 'oficina') {
      modules = ['dashboard', 'vendas', 'connect', 'financeiro', 'team', 'store', 'reputation', 'growth_ai'];
      terminology = {
        clientsLabel: 'Proprietários & Frotistas',
        clientSingular: 'Cliente Automotivo',
        salesLabel: 'Ordens de Serviço (OS)',
        saleSingular: 'Ordem de Serviço',
        itemsLabel: 'Peças & Estoque Técnico',
        itemSingular: 'Peça Automotiva',
      };
    } else if (seg === 'saude' || seg === 'clinica' || seg === 'beleza') {
      modules = ['dashboard', 'vendas', 'marketing', 'connect', 'financeiro', 'fidelidade', 'intelligence', 'team', 'reputation', 'growth_ai'];
      terminology = {
        clientsLabel: 'Pacientes & Clientes',
        clientSingular: 'Paciente',
        salesLabel: 'Consultas & Procedimentos',
        saleSingular: 'Atendimento',
        itemsLabel: 'Serviços & Protocolos',
        itemSingular: 'Procedimento',
      };
    }

    res.json({
      success: true,
      data: {
        recommendedPlan,
        planJustification: `Plano ${recommendedPlan.toUpperCase()} indicado para a equipe de ${staffCount || 1} pessoas, integrando automação de vendas, WhatsApp Cloud oficial e IA analítica.`,
        recommendedModules: modules,
        terminology,
        recommendedKpis: kpis,
        suggestedFinancialCategories: ['Receitas Operacionais', 'Custos Diretos com Fornecedores', 'Despesas com Pessoal & Comissões', 'Marketing & Aquisição'],
        aiExecutiveAdvice: `Bem-vindo ao NEXORA BUSINESS, ${name}! Sua estrutura multissetorial foi parametrizada com rigor técnico para maximizar conversões de vendas e clareza financeira.`,
      },
      engine: 'business-rules-matrix',
    });
  } catch (error: any) {
    console.error('Error recommending setup:', error);
    res.status(500).json({ success: false, message: 'Falha ao processar recomendação inteligente.' });
  }
});

// 6. NEXORA Copilot & Consultor Virtual
app.post('/api/ai/copilot', async (req, res) => {
  try {
    const { companyId, message, persona } = req.body;

    const company = companies.find(c => c.id === companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Empresa isolada não encontrada.' });
    }

    company.usage.aiQueriesThisMonth = (company.usage.aiQueriesThisMonth || 0) + 1;

    // Tenant data isolation context
    const tenantClients = dataStore.clients.filter(c => c.companyId === companyId);
    const tenantTransactions = dataStore.transactions.filter(t => t.companyId === companyId);
    const tenantRevenues = tenantTransactions.filter(t => t.type === 'receita' && t.status === 'pago').reduce((s, t) => s + t.amount, 0);
    const tenantExpenses = tenantTransactions.filter(t => t.type === 'despesa' && t.status === 'pago').reduce((s, t) => s + t.amount, 0);
    const tenantProfit = tenantRevenues - tenantExpenses;
    const tenantLeads = dataStore.leadOpportunities.filter(o => o.companyId === companyId);
    const tenantCampaigns = dataStore.marketingCampaigns.filter(m => m.companyId === companyId);

    const systemPrompt = `Você é o NEXORA Consultor Virtual — Assistente Corporativo Multimodal de Inteligência Artificial para "${company.name}".
Segmento da Empresa: ${company.segment.toUpperCase()} (${company.activityDescription}).
Plano: ${company.plan.toUpperCase()}.
Papel de Consultor Ativo: ${persona || 'Especialista em Gestão e Vendas'}.

DADOS REAIS E EXCLUSIVOS DESTA EMPRESA (ISOLAMENTO MULTITENANT RÍGIDO):
- Total de ${company.terminology.clientsLabel}: ${tenantClients.length} cadastrados.
- Faturamento consolidado: R$ ${tenantRevenues.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Despesas operacionais: R$ ${tenantExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Lucro líquido apurado: R$ ${tenantProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Funil de Vendas: ${tenantLeads.length} oportunidades ativas (R$ ${tenantLeads.reduce((s, l) => s + l.value, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em pipeline).
- Campanhas de Marketing ativas: ${tenantCampaigns.filter(c => c.status === 'ativo').length}.

REGRAS RÍGIDAS DE ATUAÇÃO:
1. Responda em português brasileiro de alto padrão executivo, claro, prático e analítico.
2. NUNCA cite dados de outras empresas.
3. Se o usuário solicitar ações que alterem dados financeiros, criem campanhas ou disparem mensagens WhatsApp, forneça uma "actionProposal" estruturada.
4. NENHUMA ação financeira ou operação importante é executada sem confirmação explícita do gestor humano!

FORMATO DE RESPOSTA (JSON):
{
  "response": "Texto formatado da sua resposta com análises executivas e passos recomendados.",
  "actionProposal": null ou {
    "actionType": "create_transaction" | "update_status" | "send_whatsapp" | "create_campaign" | "add_task",
    "title": "Título da ação para validação humana",
    "description": "Detalhes concisos",
    "payload": { ...dados a serem gravados... },
    "status": "pending"
  }
}`;

    if (ai) {
      try {
        const aiResponse = await callGeminiWithTimeout(ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${systemPrompt}\n\nPERGUNTA DO USUÁRIO GESTOR: "${message}"`,
          config: {
            responseMimeType: 'application/json',
          },
        }), 6000);

        const textOutput = aiResponse.text || '';
        const parsed = JSON.parse(textOutput);
        return res.json({ success: true, data: parsed });
      } catch (err: any) {
        console.warn('Gemini Copilot API call error, falling back to local contextual analyst:', err?.message || err);
      }
    }

    // Heuristic contextual fallback
    let responseText = `Olá! Como consultor virtual da **${company.name}**, analisei seus dados reais em tempo real.\n\nTemos **R$ ${tenantRevenues.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}** em faturamento liquidado e **R$ ${tenantProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}** de margem líquida positiva.\n\nNo funil de vendas, temos **${tenantLeads.length} oportunidades** registradas. Recomendo focar no follow-up dos orçamentos com probabilidade acima de 70% para acelerar a conversão esta semana.`;
    
    let actionProposal = null;

    if (message.toLowerCase().includes('campanha') || message.toLowerCase().includes('marketing') || message.toLowerCase().includes('anúncio')) {
      actionProposal = {
        actionType: 'create_campaign' as const,
        title: 'Criar Nova Campanha de Reativação no NEXORA Marketing',
        description: 'Campanha segmentada para clientes com mais de 30 dias sem compras',
        payload: {
          title: 'Reativação VIP - Desconto Especial',
          channel: 'whatsapp',
          objective: 'Aumentar recompra imediata',
          scheduledDate: new Date().toISOString().split('T')[0],
        },
        status: 'pending' as const,
      };
      responseText += '\n\nEstruturei uma proposta de campanha para sua aprovação obrigatória abaixo:';
    } else if (message.toLowerCase().includes('despesa') || message.toLowerCase().includes('gasto') || message.toLowerCase().includes('pagar')) {
      actionProposal = {
        actionType: 'create_transaction' as const,
        title: 'Registrar Nova Despesa Operacional',
        description: 'Lançar saída de caixa com conferência',
        payload: {
          type: 'despesa',
          category: 'Operacional',
          description: 'Despesa identificada pelo consultor',
          amount: 450.00,
          status: 'pendente',
        },
        status: 'pending' as const,
      };
      responseText += '\n\nPreparei a minuta do lançamento contábil para sua validação:';
    }

    res.json({
      success: true,
      data: {
        response: responseText,
        actionProposal,
      },
    });
  } catch (error: any) {
    console.error('Error in copilot:', error);
    res.status(500).json({ success: false, message: 'Erro no assistente de IA.' });
  }
});

// 7. NEXORA Growth AI — Generate analytical recommendations
app.post('/api/ai/growth-diagnostic', async (req, res) => {
  try {
    const { companyId, question } = req.body;
    const company = companies.find(c => c.id === companyId);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Empresa não encontrada.' });
    }

    const tenantTransactions = dataStore.transactions.filter(t => t.companyId === companyId);
    const revenues = tenantTransactions.filter(t => t.type === 'receita' && t.status === 'pago').reduce((s, t) => s + t.amount, 0);
    const clients = dataStore.clients.filter(c => c.companyId === companyId);

    const prompt = `Você é o NEXORA Growth AI, especialista em crescimento empresarial acelerado.
Responda à questão estratégica para a empresa "${company.name}" (Ramo: ${company.segment}):
Pergunta estratégica: "${question}"

DADOS REAIS:
- Faturamento consolidado: R$ ${revenues}
- Total de clientes: ${clients.length}

Retorne um JSON com:
{
  "insight": "Diagnóstico cirúrgico em 2 frases apontando a causa raiz ou oportunidade",
  "actionSteps": [
    "Passo 1 prático",
    "Passo 2 prático",
    "Passo 3 prático"
  ],
  "potentialGain": "Estimativa de ganho financeiro (ex: R$ 5.400,00)",
  "comparativeBeforeAfter": "Comparação de indicador antes e depois da ação"
}`;

    if (ai) {
      try {
        const resp = await callGeminiWithTimeout(ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        }), 6000);

        const parsed = JSON.parse(resp.text || '{}');
        return res.json({ success: true, data: parsed });
      } catch (e) {
        console.warn('Growth AI call failed, using heuristic:', e);
      }
    }

    res.json({
      success: true,
      data: {
        insight: `Identificamos que 35% dos clientes de ${company.name} têm potencial para aumento de recorrência com uma esteira automatizada de relacionamento via WhatsApp.`,
        actionSteps: [
          'Ativar o módulo NEXORA Fidelidade com cashback de 5% nas compras da semana',
          'Enviar mensagem de follow-up personalizada para orçamentos pendentes',
          'Criar um combo especial para elevar o ticket médio das vendas',
        ],
        potentialGain: 'R$ 8.500,00',
        comparativeBeforeAfter: 'Taxa de recompra salta de 22% para 41% em 30 dias',
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Erro no Growth AI.' });
  }
});

// 8. Get all tenant-isolated data (Consolidated)
app.get('/api/data/:companyId', (req, res) => {
  const { companyId } = req.params;
  const company = companies.find(c => c.id === companyId);
  if (!company) {
    return res.status(404).json({ success: false, message: 'Empresa não encontrada.' });
  }

  res.json({
    success: true,
    data: {
      company,
      clients: dataStore.clients.filter(c => c.companyId === companyId),
      transactions: dataStore.transactions.filter(t => t.companyId === companyId),
      restaurantTables: dataStore.restaurantTables.filter(t => t.companyId === companyId),
      workshopOrders: dataStore.workshopOrders.filter(o => o.companyId === companyId),
      clinicAppointments: dataStore.clinicAppointments.filter(a => a.companyId === companyId),
      realEstateProperties: dataStore.realEstateProperties.filter(p => p.companyId === companyId),
      retailProducts: dataStore.retailProducts.filter(p => p.companyId === companyId),
      serviceContracts: dataStore.serviceContracts.filter(c => c.companyId === companyId),
      whatsappConnection: dataStore.whatsappConnections.find(w => w.companyId === companyId) || {
        companyId,
        wabaId: `waba_${companyId}`,
        phoneNumberId: `phone_${companyId}`,
        displayPhoneNumber: company.contactPhone,
        verifiedName: `${company.name} Oficial`,
        status: 'conectado',
        qualityRating: 'GREEN',
        lastSyncAt: new Date().toISOString(),
        embeddedSignupActive: true,
      },
      whatsappMessages: dataStore.whatsappMessages.filter(m => m.companyId === companyId),
      whatsappTemplates: dataStore.whatsappTemplates,
      auditLogs: dataStore.auditLogs.filter(a => a.companyId === companyId || a.companyId === 'master'),
      // NEXORA BUSINESS new modules
      leadOpportunities: dataStore.leadOpportunities.filter(o => o.companyId === companyId),
      salesProposals: dataStore.salesProposals.filter(p => p.companyId === companyId),
      marketingCampaigns: dataStore.marketingCampaigns.filter(m => m.companyId === companyId),
      loyaltyCoupons: dataStore.loyaltyCoupons.filter(c => c.companyId === companyId),
      loyaltyConfig: dataStore.loyaltyConfigs[companyId] || { cashbackPercent: 5.0, pointsPerReal: 1, referralRewardBonus: 25.0, isActive: true },
      teamMembers: dataStore.teamMembers.filter(t => t.companyId === companyId),
      teamTasks: dataStore.teamTasks.filter(t => t.companyId === companyId),
      storeProducts: dataStore.storeProducts.filter(p => p.companyId === companyId),
      reputationReviews: dataStore.reputationReviews.filter(r => r.companyId === companyId),
      academyCourses: dataStore.academyCourses,
      expansionBranches: dataStore.expansionBranches.filter(b => b.companyId === companyId),
      growthOpportunities: dataStore.growthOpportunities.filter(g => g.companyId === companyId),
      planInfo: PLANS[company.plan] || PLANS.pro,
      availablePlans: PLANS,
    },
  });
});

// 9. Generic Create in Tenant Collection
app.post('/api/data/:companyId/:collection', (req, res) => {
  const { companyId, collection } = req.params;
  const company = companies.find(c => c.id === companyId);
  if (!company) {
    return res.status(404).json({ success: false, message: 'Empresa não encontrada.' });
  }

  const newItem = {
    id: `${collection.substring(0, 3)}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    companyId,
    createdAt: new Date().toISOString(),
    ...req.body,
  };

  switch (collection) {
    case 'clients':
      dataStore.clients.unshift(newItem as Client);
      break;
    case 'transactions':
      dataStore.transactions.unshift(newItem as FinancialTransaction);
      break;
    case 'leadOpportunities':
      dataStore.leadOpportunities.unshift(newItem as LeadOpportunity);
      break;
    case 'salesProposals':
      dataStore.salesProposals.unshift(newItem as SalesProposal);
      break;
    case 'marketingCampaigns':
      dataStore.marketingCampaigns.unshift(newItem as MarketingCampaign);
      break;
    case 'loyaltyCoupons':
      dataStore.loyaltyCoupons.unshift(newItem as LoyaltyCoupon);
      break;
    case 'teamMembers':
      dataStore.teamMembers.unshift(newItem as TeamMember);
      break;
    case 'teamTasks':
      dataStore.teamTasks.unshift(newItem as TeamTask);
      break;
    case 'storeProducts':
      dataStore.storeProducts.unshift(newItem as StoreProduct);
      break;
    case 'reputationReviews':
      dataStore.reputationReviews.unshift(newItem as ReputationReview);
      break;
    case 'expansionBranches':
      dataStore.expansionBranches.unshift(newItem as ExpansionBranch);
      break;
    case 'growthOpportunities':
      dataStore.growthOpportunities.unshift(newItem as GrowthOpportunity);
      break;
    case 'restaurantTables':
      dataStore.restaurantTables.push(newItem as RestaurantTable);
      break;
    case 'workshopOrders':
      dataStore.workshopOrders.unshift(newItem as WorkshopWorkOrder);
      break;
    case 'clinicAppointments':
      dataStore.clinicAppointments.unshift(newItem as ClinicAppointment);
      break;
    case 'realEstateProperties':
      dataStore.realEstateProperties.unshift(newItem as RealEstateProperty);
      break;
    case 'retailProducts':
      dataStore.retailProducts.unshift(newItem as RetailProduct);
      break;
    case 'serviceContracts':
      dataStore.serviceContracts.unshift(newItem as ServiceContract);
      break;
    default:
      return res.status(400).json({ success: false, message: `Coleção "${collection}" inválida.` });
  }

  dataStore.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    companyId,
    userId: 'usr_current',
    userName: 'Usuário Autorizado',
    action: `CREATE_${collection.toUpperCase()}`,
    entity: collection,
    details: `Novo registro criado com ID: ${newItem.id}`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString(),
  });

  res.status(201).json({ success: true, data: newItem });
});

// 10. Update Item in Tenant Collection
app.patch('/api/data/:companyId/:collection/:id', (req, res) => {
  const { companyId, collection, id } = req.params;

  let targetArray: any[] = [];
  if (collection === 'clients') targetArray = dataStore.clients;
  else if (collection === 'transactions') targetArray = dataStore.transactions;
  else if (collection === 'leadOpportunities') targetArray = dataStore.leadOpportunities;
  else if (collection === 'salesProposals') targetArray = dataStore.salesProposals;
  else if (collection === 'marketingCampaigns') targetArray = dataStore.marketingCampaigns;
  else if (collection === 'loyaltyCoupons') targetArray = dataStore.loyaltyCoupons;
  else if (collection === 'teamMembers') targetArray = dataStore.teamMembers;
  else if (collection === 'teamTasks') targetArray = dataStore.teamTasks;
  else if (collection === 'storeProducts') targetArray = dataStore.storeProducts;
  else if (collection === 'reputationReviews') targetArray = dataStore.reputationReviews;
  else if (collection === 'expansionBranches') targetArray = dataStore.expansionBranches;
  else if (collection === 'growthOpportunities') targetArray = dataStore.growthOpportunities;
  else if (collection === 'restaurantTables') targetArray = dataStore.restaurantTables;
  else if (collection === 'workshopOrders') targetArray = dataStore.workshopOrders;
  else if (collection === 'clinicAppointments') targetArray = dataStore.clinicAppointments;
  else if (collection === 'realEstateProperties') targetArray = dataStore.realEstateProperties;
  else if (collection === 'retailProducts') targetArray = dataStore.retailProducts;
  else if (collection === 'serviceContracts') targetArray = dataStore.serviceContracts;
  else return res.status(400).json({ success: false, message: 'Coleção inválida.' });

  const index = targetArray.findIndex(item => item.id === id && item.companyId === companyId);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item não encontrado nesta empresa.' });
  }

  targetArray[index] = { ...targetArray[index], ...req.body };

  dataStore.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    companyId,
    userId: 'usr_current',
    userName: 'Usuário Autorizado',
    action: `UPDATE_${collection.toUpperCase()}`,
    entity: collection,
    details: `Registro ${id} atualizado.`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, data: targetArray[index] });
});

// 11. Delete Item in Tenant Collection
app.delete('/api/data/:companyId/:collection/:id', (req, res) => {
  const { companyId, collection, id } = req.params;

  let key: keyof typeof dataStore;
  if (collection === 'clients') key = 'clients';
  else if (collection === 'transactions') key = 'transactions';
  else if (collection === 'leadOpportunities') key = 'leadOpportunities';
  else if (collection === 'salesProposals') key = 'salesProposals';
  else if (collection === 'marketingCampaigns') key = 'marketingCampaigns';
  else if (collection === 'loyaltyCoupons') key = 'loyaltyCoupons';
  else if (collection === 'teamMembers') key = 'teamMembers';
  else if (collection === 'teamTasks') key = 'teamTasks';
  else if (collection === 'storeProducts') key = 'storeProducts';
  else if (collection === 'reputationReviews') key = 'reputationReviews';
  else if (collection === 'expansionBranches') key = 'expansionBranches';
  else if (collection === 'restaurantTables') key = 'restaurantTables';
  else if (collection === 'workshopOrders') key = 'workshopOrders';
  else if (collection === 'clinicAppointments') key = 'clinicAppointments';
  else if (collection === 'realEstateProperties') key = 'realEstateProperties';
  else if (collection === 'retailProducts') key = 'retailProducts';
  else if (collection === 'serviceContracts') key = 'serviceContracts';
  else return res.status(400).json({ success: false, message: 'Coleção inválida.' });

  const initialLength = (dataStore[key] as any[]).length;
  (dataStore[key] as any[]) = (dataStore[key] as any[]).filter(item => !(item.id === id && item.companyId === companyId));

  if ((dataStore[key] as any[]).length === initialLength) {
    return res.status(404).json({ success: false, message: 'Registro não encontrado.' });
  }

  dataStore.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    companyId,
    userId: 'usr_current',
    userName: 'Usuário Autorizado',
    action: `DELETE_${collection.toUpperCase()}`,
    entity: collection,
    details: `Registro ${id} removido em conformidade com as regras de isolamento.`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, message: 'Registro excluído com sucesso.' });
});

// 12. WhatsApp Cloud API Dispatcher
app.post('/api/whatsapp/:companyId/send', (req, res) => {
  const { companyId } = req.params;
  const { contactName, contactPhone, content, isOfficialTemplate, templateName } = req.body;

  const company = companies.find(c => c.id === companyId);
  if (!company) {
    return res.status(404).json({ success: false, message: 'Empresa não encontrada.' });
  }

  company.usage.whatsappMessagesThisMonth = (company.usage.whatsappMessagesThisMonth || 0) + 1;

  const newMsg: WhatsAppMessage = {
    id: `wamsg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    companyId,
    contactName: contactName || 'Destinatário',
    contactPhone: contactPhone || '+55 11 99999-9999',
    direction: 'outbound',
    content: content || 'Mensagem oficial NEXORA BUSINESS',
    status: 'enviado',
    timestamp: new Date().toISOString(),
    isOfficialTemplate: !!isOfficialTemplate,
    templateName,
  };

  dataStore.whatsappMessages.unshift(newMsg);

  setTimeout(() => {
    newMsg.status = 'entregue';
    setTimeout(() => {
      newMsg.status = 'lido';
    }, 3500);
  }, 1800);

  dataStore.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    companyId,
    userId: 'usr_whatsapp',
    userName: 'Meta Cloud API Gateway',
    action: 'WHATSAPP_MESSAGE_SENT',
    entity: 'Central de Mensagens',
    details: `Disparo para ${contactPhone} (${templateName || 'Texto Livre'}).`,
    ipAddress: '157.240.1.1',
    timestamp: new Date().toISOString(),
  });

  res.status(201).json({ success: true, data: newMsg });
});

// 13. Master Owner Platform Global Dashboard (Alifer Madeiro)
app.get('/api/master/stats', (req, res) => {
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(c => c.status === 'ativo').length;
  const suspendedCompanies = companies.filter(c => c.status === 'suspenso').length;
  
  let mrr = 0;
  companies.forEach(c => {
    if (c.status === 'ativo') {
      const plan = PLANS[c.plan] || PLANS.pro;
      mrr += plan.priceMonthly;
    }
  });

  const arr = mrr * 12;
  const totalAiQueries = companies.reduce((sum, c) => sum + (c.usage.aiQueriesThisMonth || 0), 0);
  const totalWhatsapp = companies.reduce((sum, c) => sum + (c.usage.whatsappMessagesThisMonth || 0), 0);

  const planBreakdown = {
    start: companies.filter(c => c.plan === 'start' || c.plan === 'essencial').length,
    pro: companies.filter(c => c.plan === 'pro' || c.plan === 'profissional').length,
    business: companies.filter(c => c.plan === 'business' || c.plan === 'empresarial').length,
    premium: companies.filter(c => c.plan === 'premium').length,
  };

  const segmentBreakdown: Record<string, number> = {};
  companies.forEach(c => {
    segmentBreakdown[c.segment] = (segmentBreakdown[c.segment] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      masterOwner: 'Alifer Madeiro',
      masterEmail: 'alifer.madeiro@nexora.business',
      totalCompanies,
      activeCompanies,
      suspendedCompanies,
      mrr,
      arr,
      totalAiQueries,
      totalWhatsapp,
      planBreakdown,
      segmentBreakdown,
      plansConfig: PLANS,
      recentGlobalAudits: dataStore.auditLogs.slice(0, 20),
    },
  });
});

// 14. Master Owner Plan Configuration Update
app.post('/api/master/plans', (req, res) => {
  const { tier, priceMonthly, maxUsers, maxClients, aiQueriesPerMonth, whatsAppIntegrations } = req.body;
  if (!tier || !PLANS[tier]) {
    return res.status(400).json({ success: false, message: 'Plano inválido' });
  }

  PLANS[tier] = {
    ...PLANS[tier],
    priceMonthly: Number(priceMonthly) || PLANS[tier].priceMonthly,
    maxUsers: Number(maxUsers) || PLANS[tier].maxUsers,
    maxClients: Number(maxClients) || PLANS[tier].maxClients,
    aiQueriesPerMonth: Number(aiQueriesPerMonth) || PLANS[tier].aiQueriesPerMonth,
    whatsAppIntegrations: Number(whatsAppIntegrations) || PLANS[tier].whatsAppIntegrations,
  };

  dataStore.auditLogs.unshift({
    id: `aud_${Date.now()}`,
    companyId: 'master',
    userId: 'alifer_madeiro_master',
    userName: 'Alifer Madeiro (Master Owner)',
    action: 'PLAN_TERMS_UPDATED',
    entity: `Plano ${tier.toUpperCase()}`,
    details: `Novo valor: R$ ${PLANS[tier].priceMonthly}/mês, Limites: ${PLANS[tier].maxUsers} usuários, ${PLANS[tier].aiQueriesPerMonth} IA.`,
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString(),
  });

  res.json({ success: true, data: PLANS[tier] });
});

// Vite or static serving
async function setupViteOrStatic() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEXORA BUSINESS SaaS Server running at http://0.0.0.0:${PORT}`);
  });
}

setupViteOrStatic().catch(err => {
  console.error('Failed to start server:', err);
});
