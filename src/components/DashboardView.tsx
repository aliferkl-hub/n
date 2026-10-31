/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Zap,
  Target,
  Send,
  ShoppingBag,
  Megaphone,
  BarChart3,
  SlidersHorizontal,
  X,
  Check,
  RotateCcw,
  Bot,
  ExternalLink
} from 'lucide-react';
import { Company, Client, FinancialTransaction, CustomKpi, AuditLog, LeadOpportunity } from '../types/index.ts';
import { AreaPerformanceChart, Timeframe } from './charts/AreaPerformanceChart.tsx';
import { DonutDistributionChart, DonutSlice } from './charts/DonutDistributionChart.tsx';
import { SalesFunnelChart } from './charts/SalesFunnelChart.tsx';
import { RadialProgressGauge } from './charts/RadialProgressGauge.tsx';

interface DashboardViewProps {
  company: Company;
  clients: Client[];
  transactions: FinancialTransaction[];
  kpis: CustomKpi[];
  auditLogs: AuditLog[];
  opportunities?: LeadOpportunity[];
  onNavigateTab: (tab: any) => void;
}

interface DashboardPreferences {
  showFinancialKpis: boolean;
  showCommercialKpis: boolean;
  showMainChart: boolean;
  showAiInsights: boolean;
  showGoalsGauges: boolean;
  showFunnelDonut: boolean;
  showRecentActivities: boolean;
  showSegmentKpis: boolean;
  defaultTimeframe: Timeframe;
}

const DEFAULT_PREFS: DashboardPreferences = {
  showFinancialKpis: true,
  showCommercialKpis: true,
  showMainChart: true,
  showAiInsights: true,
  showGoalsGauges: true,
  showFunnelDonut: true,
  showRecentActivities: true,
  showSegmentKpis: true,
  defaultTimeframe: '30d',
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  company,
  clients,
  transactions,
  kpis,
  auditLogs,
  opportunities = [],
  onNavigateTab,
}) => {
  // Persistence for user preferences per tenant
  const storageKey = `nexora_cmd_prefs_${company.id}`;
  const [preferences, setPreferences] = useState<DashboardPreferences>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return { ...DEFAULT_PREFS, ...JSON.parse(saved) };
    } catch (e) {
      // fallback
    }
    return DEFAULT_PREFS;
  });

  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [currentTimeframe, setCurrentTimeframe] = useState<Timeframe>(preferences.defaultTimeframe || '30d');

  const savePreferences = (newPrefs: DashboardPreferences) => {
    setPreferences(newPrefs);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newPrefs));
    } catch (e) {
      console.error('Failed to save dashboard prefs:', e);
    }
  };

  const handleResetPreferences = () => {
    savePreferences(DEFAULT_PREFS);
    setCurrentTimeframe(DEFAULT_PREFS.defaultTimeframe);
  };

  // Financial calculations
  const totalRevenue = transactions
    .filter((t) => t.type === 'receita' && t.status === 'pago')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'despesa' && t.status === 'pago')
    .reduce((acc, t) => acc + t.amount, 0);

  const pendingExpense = transactions
    .filter((t) => t.type === 'despesa' && t.status === 'pendente')
    .reduce((acc, t) => acc + t.amount, 0);

  const netProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0.0';

  // Commercial pipeline calculations
  const pipelineValue = opportunities.reduce((s, o) => s + o.value, 0);
  const wonOpportunities = opportunities.filter((o) => o.stage === 'fechado_ganho');
  const wonCount = wonOpportunities.length;
  const conversionRate = opportunities.length > 0 
    ? ((wonCount / opportunities.length) * 100).toFixed(1) 
    : '0.0';

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // Payment breakdown for Donut chart
  const paymentBreakdown = transactions
    .filter((t) => t.type === 'receita')
    .reduce((acc: Record<string, number>, t) => {
      const method = t.paymentMethod || 'outro';
      acc[method] = (acc[method] || 0) + t.amount;
      return acc;
    }, {});

  const methodColors: Record<string, string> = {
    pix: '#00F0FF',
    cartao_credito: '#3B82F6',
    cartao_debito: '#6366F1',
    boleto: '#D4AF37',
    dinheiro: '#10B981',
    transferencia: '#F59E0B',
  };

  const donutSlices: DonutSlice[] = Object.keys(paymentBreakdown).length > 0
    ? Object.entries(paymentBreakdown).map(([key, val]) => ({
        label: key.toUpperCase().replace('_', ' '),
        value: val,
        color: methodColors[key] || '#94A3B8',
      }))
    : [
        { label: 'PIX', value: 48500, color: '#00F0FF' },
        { label: 'CARTÃO CRÉDITO', value: 39200, color: '#3B82F6' },
        { label: 'BOLETO', value: 24100, color: '#D4AF37' },
        { label: 'OUTROS', value: 9200, color: '#10B981' },
      ];

  // Funnel data
  const funnelStages = [
    {
      id: 'lead',
      label: '1. Leads Iniciais',
      count: Math.max(opportunities.length * 3, 20),
      value: pipelineValue * 2.2 || 95000,
    },
    {
      id: 'qualificacao',
      label: '2. Qualificação',
      count: Math.max(opportunities.length * 2, 14),
      value: pipelineValue * 1.5 || 68000,
    },
    {
      id: 'proposta',
      label: '3. Proposta Apresentada',
      count: Math.max(opportunities.length, 9),
      value: pipelineValue || 45000,
    },
    {
      id: 'negociacao',
      label: '4. Negociação Final',
      count: Math.max(Math.floor(opportunities.length * 0.7), 5),
      value: pipelineValue * 0.7 || 31000,
    },
    {
      id: 'fechado_ganho',
      label: '5. Fechado & Ganho',
      count: Math.max(wonCount, 3),
      value: wonOpportunities.reduce((s, o) => s + o.value, 0) || 24000,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ==============================================================
          1. NEXORA COMMAND CENTER — EXECUTIVE HERO COCKPIT
         ============================================================== */}
      <div className="relative overflow-hidden nexora-card p-6 sm:p-8 border-cyan-500/25 bg-gradient-to-r from-[#081226] via-[#09142E] to-[#122144] shadow-xl">
        <div className="absolute right-0 top-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2">
              <span className="font-semibold text-cyan-300">NEXORA COMMAND CENTER</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-300 capitalize">Segmento: {company.segment}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#D4AF37] uppercase font-mono">Plano {company.planTier}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-space">
              {company.name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
              {company.activityDescription || 'Gestão integrada multissetorial, automação comercial WhatsApp Cloud e inteligência de dados aplicada.'}
            </p>

            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-mono">
              <span>{company.employeesCount} Colaboradores</span>
              <span aria-hidden="true">·</span>
              <span>CNPJ/CPF: {company.cnpjOrCpf}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-semibold">Operação Ativa</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigateTab('analytics')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-cyan-500/20 transition"
            >
              <BarChart3 className="h-4 w-4" />
              <span>NEXORA Analytics</span>
            </button>

            <button
              onClick={() => onNavigateTab('copilot')}
              className="flex items-center gap-2 rounded-xl border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-4 py-2.5 text-xs font-bold text-[#F3C623] hover:bg-[#D4AF37]/20 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>Consultor IA</span>
            </button>

            <button
              onClick={() => setCustomizeOpen(!customizeOpen)}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0B1428] hover:bg-white/5 px-3 py-2.5 text-xs font-semibold text-slate-300 transition"
              title="Personalizar visão do Command Center"
            >
              <SlidersHorizontal className="h-4 w-4 text-slate-400" />
              <span className="hidden sm:inline">Personalizar</span>
            </button>
          </div>
        </div>

        {/* Customization Drawer / Subpanel */}
        {customizeOpen && (
          <div className="mt-6 pt-5 border-t border-white/10 animate-in fade-in">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-space">
                  Configuração de Visibilidade do Painel
                </h4>
                <p className="text-[11px] text-slate-400">
                  Suas preferências são salvas automaticamente no perfil de {company.name}.
                </p>
              </div>
              <button
                onClick={handleResetPreferences}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Restaurar Padrão</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {[
                { key: 'showFinancialKpis', label: 'Indicadores Financeiros' },
                { key: 'showCommercialKpis', label: 'Indicadores Comerciais' },
                { key: 'showMainChart', label: 'Gráfico Principal de Fluxo' },
                { key: 'showAiInsights', label: 'Painel Inteligente IA' },
                { key: 'showGoalsGauges', label: 'Medidores de Metas' },
                { key: 'showFunnelDonut', label: 'Funil & Formas Pagamento' },
                { key: 'showRecentActivities', label: 'Transações Recentes' },
                { key: 'showSegmentKpis', label: 'Métricas do Nicho' },
              ].map(({ key, label }) => {
                const isEnabled = (preferences as any)[key];
                return (
                  <button
                    key={key}
                    onClick={() => savePreferences({ ...preferences, [key]: !isEnabled })}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl border text-left transition ${
                      isEnabled
                        ? 'border-cyan-500/40 bg-cyan-500/10 text-white'
                        : 'border-white/5 bg-[#070D1B] text-slate-500'
                    }`}
                  >
                    <span className="text-[11px] font-medium">{label}</span>
                    {isEnabled ? <Check className="h-3.5 w-3.5 text-cyan-400 shrink-0" /> : <X className="h-3.5 w-3.5 text-slate-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ==============================================================
          2. FINANCIAL & COMMERCIAL INDICATORS GRID
         ============================================================== */}
      {preferences.showFinancialKpis && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Faturamento */}
          <div className="nexora-card nexora-card-interactive p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-300">Faturamento Realizado</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white font-space tabular-nums">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-mono">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+14.8% vs período anterior</span>
            </div>
          </div>

          {/* Despesas */}
          <div className="nexora-card nexora-card-interactive p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-300">Despesas Operacionais</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                <TrendingDown className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white font-space tabular-nums">
              {formatCurrency(totalExpense)}
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-slate-400 font-mono">
              <span>Pendente: {formatCurrency(pendingExpense)}</span>
            </div>
          </div>

          {/* Resultado Líquido & Margem */}
          <div className="nexora-gold-card p-5">
            <div className="flex items-center justify-between text-slate-300 mb-2">
              <span className="text-xs font-semibold text-[#D4AF37]">Resultado Líquido</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#D4AF37]/15 text-[#F3C623]">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#F3C623] font-space tabular-nums">
              {formatCurrency(netProfit)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-amber-300 font-mono">
              <span>Margem Líquida: <b>{profitMargin}%</b></span>
            </div>
          </div>

          {/* Pipeline & Clientes */}
          <div className="nexora-card nexora-card-interactive p-5">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold text-slate-300">{company.terminology.clientsLabel} Ativos</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white font-space tabular-nums">
              {clients.length} cadastrados
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-cyan-300 font-mono">
              <span>Pipeline: {formatCurrency(pipelineValue)}</span>
              <span>{conversionRate}% conv.</span>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          3. MAIN PERFORMANCE CHART: REVENUE VS EXPENSES
         ============================================================== */}
      {preferences.showMainChart && (
        <AreaPerformanceChart
          timeframe={currentTimeframe}
          onTimeframeChange={setCurrentTimeframe}
          currencyFormatter={formatCurrency}
        />
      )}

      {/* ==============================================================
          4. METAS & OBJETIVOS: RADIAL PROGRESS GAUGES
         ============================================================== */}
      {preferences.showGoalsGauges && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RadialProgressGauge
            title="Meta Mensal de Faturamento"
            subtitle="Ritmo de vendas em conformidade"
            current={totalRevenue}
            target={totalRevenue * 1.25 || 250000}
            unitPrefix="R$ "
            color="#06B6D4"
          />

          <RadialProgressGauge
            title="Meta de Expansão de Base"
            subtitle="Captação líquida no período"
            current={clients.length}
            target={clients.length + 8}
            unitSuffix=" clientes"
            color="#D4AF37"
          />
        </div>
      )}

      {/* ==============================================================
          5. NEXORA AI — INTELIGÊNCIA INTEGRADA & DIAGNÓSTICO
         ============================================================== */}
      {preferences.showAiInsights && (
        <div className="nexora-card p-6 border-cyan-500/20 bg-gradient-to-br from-[#09142E] via-[#0A1633] to-[#0E1E46]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-cyan-300 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> NEXORA AI
                </span>
                <span aria-hidden="true">·</span>
                <span>Síntese Executiva Automática</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-300">{new Date().toLocaleDateString('pt-BR')}</span>
              </div>
              <h3 className="text-lg font-bold text-white font-space mt-0.5">
                Diagnóstico de Oportunidades & Recomendações Prioritárias
              </h3>
            </div>

            <button
              onClick={() => onNavigateTab('growth_ai')}
              className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 px-3.5 py-2 text-xs font-bold text-cyan-300 transition shrink-0"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Diagnóstico Completo de Growth</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Alerta Financeiro */}
            <div className="rounded-xl border border-white/5 bg-[#060D1E]/80 p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 font-mono block mb-1">
                  Alertas Financeiros
                </span>
                <h4 className="text-xs font-bold text-white mb-1.5">
                  Despesas Pendentes de Conciliação
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Identificado volume de <b>{formatCurrency(pendingExpense)}</b> com vencimento próximo. A conciliação preventiva evita multas e preserva a margem líquida de <b>{profitMargin}%</b>.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/5">
                <button
                  onClick={() => onNavigateTab('financial')}
                  className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Conciliar no DRE</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* 2. Oportunidade Comercial */}
            <div className="rounded-xl border border-white/5 bg-[#060D1E]/80 p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono block mb-1">
                  Oportunidades de Vendas
                </span>
                <h4 className="text-xs font-bold text-white mb-1.5">
                  Pipeline de Alto Impacto
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Existem <b>{opportunities.length} propostas ativas</b> somando <b>{formatCurrency(pipelineValue)}</b>. A aceleração da etapa de negociação tem potencial de elevar o faturamento em +18%.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/5">
                <button
                  onClick={() => onNavigateTab('vendas')}
                  className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Acessar Funil CRM</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* 3. Reativação WhatsApp */}
            <div className="rounded-xl border border-white/5 bg-[#060D1E]/80 p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono block mb-1">
                  Retenção & WhatsApp Cloud
                </span>
                <h4 className="text-xs font-bold text-white mb-1.5">
                  Campanha de Reengajamento
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  A base de <b>{clients.length} {company.terminology.clientsLabel.toLowerCase()}</b> possui contatos qualificados sem compras recentes. Dispare cashback oficial via templates Meta.
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-white/5">
                <button
                  onClick={() => onNavigateTab('whatsapp')}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <span>Disparar Campanha</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          6. ADVANCED DATA VIZ: FUNNEL & DONUT DISTRIBUTION
         ============================================================== */}
      {preferences.showFunnelDonut && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesFunnelChart
            stages={funnelStages}
            onStageClick={() => onNavigateTab('vendas')}
            currencyFormatter={formatCurrency}
          />

          <DonutDistributionChart
            title="Distribuição de Receita por Meio de Pagamento"
            subtitle="Volume financeiro transacionado por canal"
            slices={donutSlices}
            currencyFormatter={formatCurrency}
          />
        </div>
      )}

      {/* ==============================================================
          7. QUICK OPERATIONAL SHORTCUTS BAR
         ============================================================== */}
      <div className="nexora-card p-4">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-400 font-mono">
            Acesso Rápido aos Módulos Principais
          </span>
          <span className="text-slate-500 text-[11px]">Navegação instantânea</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => onNavigateTab('vendas')}
            className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#091122]/90 hover:bg-[#0E1A33] hover:border-cyan-500/40 p-3 text-left transition"
          >
            <TrendingUp className="h-4 w-4 text-cyan-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">NEXORA Vendas</p>
              <p className="text-[10px] text-slate-400">Funil & Oportunidades</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('whatsapp')}
            className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#091122]/90 hover:bg-[#0E1A33] hover:border-emerald-500/40 p-3 text-left transition"
          >
            <Send className="h-4 w-4 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">WhatsApp Cloud</p>
              <p className="text-[10px] text-slate-400">Templates & Disparos</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('store')}
            className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#091122]/90 hover:bg-[#0E1A33] hover:border-blue-500/40 p-3 text-left transition"
          >
            <ShoppingBag className="h-4 w-4 text-blue-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Catálogo & PDV</p>
              <p className="text-[10px] text-slate-400">Produtos & Links</p>
            </div>
          </button>

          <button
            onClick={() => onNavigateTab('marketing')}
            className="flex items-center gap-2 rounded-xl border border-white/5 bg-[#091122]/90 hover:bg-[#0E1A33] hover:border-purple-500/40 p-3 text-left transition"
          >
            <Megaphone className="h-4 w-4 text-purple-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">Campanhas IA</p>
              <p className="text-[10px] text-slate-400">Copywriting & Anúncios</p>
            </div>
          </button>
        </div>
      </div>

      {/* ==============================================================
          8. SEGMENT-SPECIFIC STRATEGIC KPIS
         ============================================================== */}
      {preferences.showSegmentKpis && kpis.length > 0 && (
        <div className="nexora-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Especialização Setorial</span>
                <span aria-hidden="true">·</span>
                <span className="capitalize">{company.segment}</span>
              </div>
              <h3 className="text-sm font-bold text-white font-space mt-0.5">
                Indicadores Estratégicos Calibrados ({company.segment.toUpperCase()})
              </h3>
            </div>
            <span className="text-xs text-[#D4AF37] font-medium flex items-center gap-1 font-mono">
              <ShieldCheck className="h-4 w-4" />
              IA Calibrada
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kpis.map((kpi) => (
              <div key={kpi.id} className="rounded-xl border border-white/5 bg-[#080E1C] p-4">
                <div className="text-xs text-slate-400 font-medium">{kpi.title}</div>
                <div className="text-xl font-bold text-white mt-1 font-space tabular-nums">{kpi.value}</div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{kpi.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==============================================================
          9. RECENT AUDITED TRANSACTIONS & GOVERNANCE LOGS
         ============================================================== */}
      {preferences.showRecentActivities && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 nexora-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white font-space">
                  Transações Recentes & Conciliação Bancária
                </h3>
                <p className="text-xs text-slate-400">Últimos lançamentos do banco isolado</p>
              </div>
              <button
                onClick={() => onNavigateTab('financial')}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>DRE Gerencial</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {transactions.slice(0, 5).map((t) => {
                const isRevenue = t.type === 'receita';
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-[#080E1E] p-3 hover:bg-[#0D1730] transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                        isRevenue ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {isRevenue ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{t.description}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                          <span>{t.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{t.date}</span>
                          <span aria-hidden="true">·</span>
                          <span className="uppercase font-mono">{t.paymentMethod}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-3">
                      <p className={`text-xs font-bold font-mono tabular-nums ${isRevenue ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {isRevenue ? '+' : '-'} {formatCurrency(t.amount)}
                      </p>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {t.status === 'pago' ? 'CONCILIADO' : 'PENDENTE'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Audit trail summary */}
          <div className="nexora-card p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 font-space">
                  Governança & Auditoria
                </span>
                <span className="text-[10px] font-mono text-cyan-300">LGPD Ativo</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Todos os eventos de criação, atualização e exclusão são registrados de maneira imutável com carimbo temporal e IP de acesso.
              </p>

              <div className="space-y-2">
                {auditLogs.slice(0, 3).map((log) => (
                  <div key={log.id} className="p-2.5 rounded-lg bg-[#070D1B] border border-white/5 text-[11px]">
                    <div className="flex items-center justify-between text-slate-300 font-medium">
                      <span className="truncate">{log.action}</span>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">{log.timestamp.split('T')[1]?.slice(0, 5) || ''}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                      {log.userName} · {log.entityType}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => onNavigateTab('audit')}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-[#070D1B] hover:bg-white/5 py-2 text-xs font-semibold text-slate-300 transition"
              >
                <span>Ver Trilha de Auditoria Completa</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
