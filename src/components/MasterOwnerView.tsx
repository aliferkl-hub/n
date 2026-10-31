/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Building2, 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  Layers, 
  Search, 
  ExternalLink, 
  Lock, 
  RefreshCw,
  Sliders,
  Save,
  Check
} from 'lucide-react';
import { Company, PlanTier } from '../types/index.ts';
import { fetchMasterStats, updateCompanyStatusOrPlan, updateMasterPlan } from '../services/api.ts';

interface MasterOwnerViewProps {
  companies: Company[];
  onSelectCompany: (companyId: string) => void;
  onRefreshData: () => void;
}

export const MasterOwnerView: React.FC<MasterOwnerViewProps> = ({
  companies,
  onSelectCompany,
  onRefreshData,
}) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Editable plan parameters
  const [editingTier, setEditingTier] = useState<string | null>(null);
  const [planPrice, setPlanPrice] = useState<number>(49.90);
  const [planUsers, setPlanUsers] = useState<number>(2);
  const [planAiQueries, setPlanAiQueries] = useState<number>(80);
  const [planSaveSuccess, setPlanSaveSuccess] = useState(false);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await fetchMasterStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [companies]);

  const handleToggleStatus = async (company: Company) => {
    const newStatus = company.status === 'ativo' ? 'suspenso' : 'ativo';
    setActionLoadingId(company.id);
    try {
      await updateCompanyStatusOrPlan(company.id, { status: newStatus });
      await loadStats();
      onRefreshData();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleChangePlan = async (company: Company, newPlan: PlanTier) => {
    setActionLoadingId(company.id);
    try {
      await updateCompanyStatusOrPlan(company.id, { plan: newPlan });
      await loadStats();
      onRefreshData();
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSavePlanConfig = async (tier: string) => {
    try {
      await updateMasterPlan({
        tier,
        priceMonthly: planPrice,
        maxUsers: planUsers,
        maxClients: 5000,
        aiQueriesPerMonth: planAiQueries,
        whatsAppIntegrations: 2,
      });
      setPlanSaveSuccess(true);
      setTimeout(() => {
        setPlanSaveSuccess(false);
        setEditingTier(null);
      }, 2000);
      await loadStats();
    } catch (err) {
      alert('Erro ao salvar plano');
    }
  };

  const formatCurrency = (val: number) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const filteredCompanies = companies.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.cnpjCpf.includes(q) ||
      c.segment.toLowerCase().includes(q) ||
      c.contactEmail.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header with Master Owner Badge */}
      <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-[#1C2541] via-[#0A1128] to-[#1C2541] p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.2)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/25 to-yellow-500/15 px-3 py-1 text-xs font-bold text-[#F3C623] border border-[#D4AF37]/50 shadow-sm font-space">
                <Crown className="h-4 w-4 text-[#F3C623]" />
                Proprietário da Plataforma: Alifer Madeiro
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Superadmin Master • Acesso Vitalício Ilimitado
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-space">
              NEXORA BUSINESS — Centro de Comando Master
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Painel exclusivo para supervisão geral da infraestrutura multitenant, faturamento recorrente (MRR), parametrização dos planos comerciais e auditoria de segurança global.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadStats}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Atualizar Métricas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global SaaS Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MRR */}
        <div className="rounded-3xl border border-amber-500/40 bg-[#1C2541]/70 p-5 shadow-[0_0_25px_rgba(212,175,55,0.1)]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase font-semibold tracking-wider">MRR (Faturamento Recorrente)</span>
            <DollarSign className="h-4 w-4 text-[#F3C623]" />
          </div>
          <div className="text-3xl font-extrabold text-[#F3C623] font-space">
            {formatCurrency(stats?.mrr || 0)}
          </div>
          <p className="text-[11px] text-amber-200 mt-1.5 font-mono">
            ARR anualizado: <b>{formatCurrency(stats?.arr || 0)}</b>
          </p>
        </div>

        {/* Tenants */}
        <div className="rounded-3xl border border-white/10 bg-[#0B132B]/90 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase font-semibold tracking-wider">Empresas Cadastradas</span>
            <Building2 className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-space">
            {stats?.totalCompanies || companies.length}
          </div>
          <p className="text-[11px] text-emerald-400 mt-1.5">
            {stats?.activeCompanies || 0} ativas • {stats?.suspendedCompanies || 0} suspensas
          </p>
        </div>

        {/* Total AI Queries */}
        <div className="rounded-3xl border border-white/10 bg-[#0B132B]/90 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase font-semibold tracking-wider">Consumo Total de IA (Gemini)</span>
            <Sparkles className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-300 font-mono">
            {stats?.totalAiQueries || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5 font-mono">
            Inferências analíticas e Copilot executadas
          </p>
        </div>

        {/* Total WhatsApp Messages */}
        <div className="rounded-3xl border border-white/10 bg-[#0B132B]/90 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase font-semibold tracking-wider">Mensagens Meta Cloud API</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {stats?.totalWhatsapp || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            Tráfego oficial Meta WhatsApp Business
          </p>
        </div>
      </div>

      {/* Plan Limits & Pricing Configurator */}
      <div className="rounded-3xl border border-white/10 bg-[#0B132B]/90 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2 font-space">
              <Sliders className="h-4 w-4 text-[#F3C623]" />
              Configurador Master de Planos & Limites da Plataforma
            </h2>
            <p className="text-xs text-slate-400">
              Personalize o preço mensal, limite de colaboradores e cota de inteligência artificial de cada plano comercial
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { tier: 'start', name: 'Start', defaultPrice: 49.90, defaultUsers: 2, defaultAi: 80 },
            { tier: 'pro', name: 'Pro', defaultPrice: 99.90, defaultUsers: 6, defaultAi: 350 },
            { tier: 'business', name: 'Business', defaultPrice: 199.90, defaultUsers: 20, defaultAi: 1500 },
            { tier: 'premium', name: 'Premium', defaultPrice: 299.90, defaultUsers: 999, defaultAi: 6000 },
          ].map((pl) => {
            const config = stats?.plansConfig?.[pl.tier] || pl;
            const isEditing = editingTier === pl.tier;

            return (
              <div
                key={pl.tier}
                className={`rounded-2xl border p-4 space-y-3 transition ${
                  isEditing ? 'border-[#D4AF37] bg-[#1C2541]' : 'border-white/5 bg-[#1C2541]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase font-space">{pl.name}</h3>
                  <span className="text-[10px] text-cyan-300 font-mono">
                    {stats?.planBreakdown?.[pl.tier] || 0} assinantes
                  </span>
                </div>

                {isEditing ? (
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-slate-400 text-[10px]">Preço Mensal (R$)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={planPrice}
                        onChange={(e) => setPlanPrice(Number(e.target.value))}
                        className="w-full mt-0.5 rounded-lg border border-white/10 bg-[#0B132B] p-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-[10px]">Limite Colaboradores</label>
                      <input
                        type="number"
                        value={planUsers}
                        onChange={(e) => setPlanUsers(Number(e.target.value))}
                        className="w-full mt-0.5 rounded-lg border border-white/10 bg-[#0B132B] p-1.5 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-[10px]">Cota IA / Mês</label>
                      <input
                        type="number"
                        value={planAiQueries}
                        onChange={(e) => setPlanAiQueries(Number(e.target.value))}
                        className="w-full mt-0.5 rounded-lg border border-white/10 bg-[#0B132B] p-1.5 text-white font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-1.5 pt-2">
                      <button
                        onClick={() => setEditingTier(null)}
                        className="flex-1 py-1 rounded-lg border border-white/10 text-slate-400 text-[10px]"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleSavePlanConfig(pl.tier)}
                        className="flex-1 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center gap-1"
                      >
                        <Save className="h-3 w-3" />
                        Salvar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="text-xl font-bold text-white font-mono">
                      {formatCurrency(config.priceMonthly || pl.defaultPrice)}
                      <span className="text-[10px] text-slate-400 font-sans">/mês</span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-300">
                      <div>Usuários: <b className="text-white">{config.maxUsers || pl.defaultUsers}</b></div>
                      <div>Cota IA: <b className="text-cyan-300">{config.aiQueriesPerMonth || pl.defaultAi} reqs/mês</b></div>
                    </div>

                    <button
                      onClick={() => {
                        setEditingTier(pl.tier);
                        setPlanPrice(config.priceMonthly || pl.defaultPrice);
                        setPlanUsers(config.maxUsers || pl.defaultUsers);
                        setPlanAiQueries(config.aiQueriesPerMonth || pl.defaultAi);
                      }}
                      className="w-full py-1.5 rounded-xl border border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-white text-xs font-semibold transition"
                    >
                      Ajustar Parâmetros
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tenants Management Table */}
      <div className="rounded-3xl border border-white/10 bg-[#0B132B]/95 overflow-hidden">
        <div className="p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white font-space">Empresas Ativas & Licenças</h2>
            <p className="text-xs text-slate-400">Controle de ativação, suspensão e alteração de planos dos clientes</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, CNPJ, segmento..."
              className="w-full rounded-2xl border border-white/10 bg-[#16274E]/70 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1C2541]/60 text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-3.5 font-semibold">Empresa</th>
                <th className="p-3.5 font-semibold">Segmento</th>
                <th className="p-3.5 font-semibold">Plano</th>
                <th className="p-3.5 font-semibold">Situação</th>
                <th className="p-3.5 font-semibold">Consumo IA</th>
                <th className="p-3.5 font-semibold">WhatsApp</th>
                <th className="p-3.5 font-semibold text-right">Ações Master</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCompanies.map((comp) => {
                const isSuspended = comp.status === 'suspenso';
                const isBusy = actionLoadingId === comp.id;

                return (
                  <tr key={comp.id} className="hover:bg-[#1C2541]/40 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-white">{comp.name}</div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span className="font-mono">{comp.cnpjCpf}</span>
                        <span>•</span>
                        <span>{comp.contactEmail}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="inline-block rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 px-2 py-0.5 text-[11px] font-medium capitalize">
                        {comp.segment}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={comp.plan}
                        disabled={isBusy}
                        onChange={(e) => handleChangePlan(comp, e.target.value as PlanTier)}
                        className="rounded-lg border border-white/10 bg-[#0B132B] px-2 py-1 text-[11px] font-bold text-[#F3C623] uppercase"
                      >
                        <option value="start">START (R$ 49,90)</option>
                        <option value="pro">PRO (R$ 99,90)</option>
                        <option value="business">BUSINESS (R$ 199,90)</option>
                        <option value="premium">PREMIUM (R$ 299,90)</option>
                      </select>
                    </td>

                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        isSuspended ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {isSuspended ? 'Suspenso' : 'Ativo'}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-slate-300">
                      {comp.usage.aiQueriesThisMonth || 0} reqs
                    </td>

                    <td className="p-3.5 font-mono text-slate-300">
                      {comp.usage.whatsappMessagesThisMonth || 0} msgs
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(comp)}
                        disabled={isBusy}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                          isSuspended
                            ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30'
                            : 'bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30'
                        }`}
                      >
                        {isSuspended ? 'Ativar' : 'Suspender'}
                      </button>

                      <button
                        onClick={() => onSelectCompany(comp.id)}
                        className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-200"
                        title="Entrar no ambiente desta empresa"
                      >
                        Inspecionar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
