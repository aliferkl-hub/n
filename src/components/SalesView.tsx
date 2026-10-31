/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Target, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Sparkles, 
  Filter, 
  Send, 
  ArrowRight,
  FileText,
  Phone,
  BarChart3,
  Percent
} from 'lucide-react';
import { Company, LeadOpportunity, FunnelStage } from '../types/index.ts';

interface SalesViewProps {
  company: Company;
  opportunities: LeadOpportunity[];
  onCreateOpportunity: (oppData: any) => Promise<void>;
  onUpdateOpportunity: (id: string, updates: any) => Promise<void>;
  onTriggerWhatsApp: (recipient: string, message: string) => void;
}

export const SalesView: React.FC<SalesViewProps> = ({
  company,
  opportunities,
  onCreateOpportunity,
  onUpdateOpportunity,
  onTriggerWhatsApp,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [value, setValue] = useState<number | ''>(2500);
  const [origin, setOrigin] = useState<'instagram' | 'google_ads' | 'whatsapp' | 'indicacao' | 'landing_page' | 'balcao'>('whatsapp');
  const [salesRepName, setSalesRepName] = useState('Guilherme Sampaio');
  const [commissionRate, setCommissionRate] = useState(5.0);
  const [probabilityPercent, setProbabilityPercent] = useState(70);

  const formatCurrency = (val: number) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const stages: { id: FunnelStage; label: string; color: string; border: string }[] = [
    { id: 'lead', label: '1. Novos Leads', color: 'bg-cyan-500/10 text-cyan-300', border: 'border-cyan-500/30' },
    { id: 'qualificacao', label: '2. Qualificação', color: 'bg-blue-500/10 text-blue-300', border: 'border-blue-500/30' },
    { id: 'proposta', label: '3. Proposta Enviada', color: 'bg-amber-500/10 text-amber-300', border: 'border-amber-500/30' },
    { id: 'negociacao', label: '4. Negociação', color: 'bg-purple-500/10 text-purple-300', border: 'border-purple-500/30' },
    { id: 'fechado_ganho', label: '5. Fechado / Ganho', color: 'bg-emerald-500/10 text-emerald-300', border: 'border-emerald-500/30' },
  ];

  // Pipeline metrics
  const totalPipelineValue = opportunities
    .filter(o => o.stage !== 'perdido')
    .reduce((sum, o) => sum + o.value, 0);

  const weightedForecast = opportunities
    .filter(o => o.stage !== 'perdido' && o.stage !== 'fechado_ganho')
    .reduce((sum, o) => sum + (o.value * (o.probabilityPercent / 100)), 0);

  const wonTotal = opportunities
    .filter(o => o.stage === 'fechado_ganho')
    .reduce((sum, o) => sum + o.value, 0);

  const totalCommissions = opportunities
    .filter(o => o.stage === 'fechado_ganho')
    .reduce((sum, o) => sum + (o.value * (o.commissionRate / 100)), 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !clientName) return;

    await onCreateOpportunity({
      title,
      clientName,
      clientPhone: clientPhone || '+55 11 99999-0000',
      value: Number(value) || 0,
      stage: 'lead',
      origin,
      salesRepName: salesRepName || 'Vendedor Comercial',
      commissionRate: Number(commissionRate) || 5.0,
      probabilityPercent: Number(probabilityPercent) || 50,
      expectedClosingDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    });

    setTitle('');
    setClientName('');
    setClientPhone('');
    setValue(2500);
    setIsModalOpen(false);
  };

  const advanceStage = (opp: LeadOpportunity) => {
    const stageOrder: FunnelStage[] = ['lead', 'qualificacao', 'proposta', 'negociacao', 'fechado_ganho'];
    const currentIdx = stageOrder.indexOf(opp.stage);
    if (currentIdx !== -1 && currentIdx < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIdx + 1];
      const newProb = nextStage === 'fechado_ganho' ? 100 : Math.min(95, opp.probabilityPercent + 15);
      onUpdateOpportunity(opp.id, { stage: nextStage, probabilityPercent: newProb });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-white font-space">
              NEXORA VENDAS — CRM & Funil Comercial
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestão de oportunidades comerciais, orçamentos, previsão de receitas e comissões de equipe.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Oportunidade</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase font-semibold tracking-wider">Pipeline em Aberto</span>
            <DollarSign className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-white font-space">
            {formatCurrency(totalPipelineValue)}
          </div>
          <span className="text-[10px] text-cyan-300 font-medium">
            {opportunities.filter(o => o.stage !== 'fechado_ganho' && o.stage !== 'perdido').length} negócios em negociação
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase font-semibold tracking-wider">Previsão Ponderada</span>
            <Target className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 font-space">
            {formatCurrency(weightedForecast)}
          </div>
          <span className="text-[10px] text-slate-400">
            Ajustada por probabilidade de fechamento
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase font-semibold tracking-wider">Vendas Fechadas (Mês)</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-space">
            {formatCurrency(wonTotal)}
          </div>
          <span className="text-[10px] text-emerald-300 font-medium">
            Taxa de conversão: ~32%
          </span>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-[#1C2541]/50 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase font-semibold tracking-wider">Comissões da Equipe</span>
            <Percent className="h-4 w-4 text-[#F3C623]" />
          </div>
          <div className="text-2xl font-bold text-[#F3C623] font-space">
            {formatCurrency(totalCommissions)}
          </div>
          <span className="text-[10px] text-slate-400">
            Provisionamento de comissionamento ativo
          </span>
        </div>
      </div>

      {/* Kanban Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {stages.map((stg) => {
          const stageOpps = opportunities.filter((o) => o.stage === stg.id);
          const stageTotal = stageOpps.reduce((s, o) => s + o.value, 0);

          return (
            <div
              key={stg.id}
              className="rounded-2xl border border-white/10 bg-[#0B132B]/90 p-3.5 flex flex-col min-w-[240px] space-y-3"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${stg.color} ${stg.border}`}>
                  {stg.label}
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                  {stageOpps.length}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-300 font-mono">
                {formatCurrency(stageTotal)}
              </div>

              {/* Opportunities Cards */}
              <div className="space-y-2.5 flex-1">
                {stageOpps.map((opp) => (
                  <div
                    key={opp.id}
                    className="rounded-xl border border-white/10 bg-[#1C2541]/80 p-3 space-y-2 hover:border-cyan-500/40 transition shadow-sm"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white truncate" title={opp.title}>
                        {opp.title}
                      </h4>
                      <p className="text-[11px] text-cyan-300 mt-0.5 font-medium truncate">
                        {opp.clientName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1 border-y border-white/5">
                      <span className="text-slate-400 text-[10px]">Origem: <b className="text-white capitalize">{opp.origin.replace('_', ' ')}</b></span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {formatCurrency(opp.value)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Vendedor: {opp.salesRepName}</span>
                      <span className="font-mono text-blue-300">{opp.probabilityPercent}% prob</span>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-1 border-t border-white/5">
                      <button
                        onClick={() => onTriggerWhatsApp(opp.clientPhone, `Olá ${opp.clientName}! Passando para dar continuidade à sua proposta de ${opp.title} com a ${company.name}. Quando podemos conversar?`)}
                        className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold"
                      >
                        <Phone className="h-3 w-3" />
                        <span>WhatsApp</span>
                      </button>

                      {opp.stage !== 'fechado_ganho' && (
                        <button
                          onClick={() => advanceStage(opp)}
                          className="flex items-center gap-1 text-[10px] text-cyan-300 hover:text-cyan-200 font-semibold"
                          title="Avançar para o próximo estágio do funil"
                        >
                          <span>Avançar</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal to add opportunity */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0B132B] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-1 font-space">
              Nova Oportunidade no Funil
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Cadastro de lead com cálculo automático de comissão e probabilidade.
            </p>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Título da Oportunidade *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Contrato Anual de Consultoria / Compra de 50x Unidades"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Cliente / Lead *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nome do cliente"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">WhatsApp</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+55 11 99999-0000"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Valor Estimado (R$)</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Canal de Origem</label>
                  <select
                    value={origin}
                    onChange={(e: any) => setOrigin(e.target.value)}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                  >
                    <option value="whatsapp">WhatsApp Direto</option>
                    <option value="instagram">Instagram Ads / Direct</option>
                    <option value="google_ads">Google Pesquisa</option>
                    <option value="indicacao">Indicação de Cliente</option>
                    <option value="landing_page">Landing Page NEXORA</option>
                    <option value="balcao">Atendimento Presencial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Vendedor Responsável</label>
                  <input
                    type="text"
                    value={salesRepName}
                    onChange={(e) => setSalesRepName(e.target.value)}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Comissão (%)</label>
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white hover:brightness-110"
                >
                  Salvar Oportunidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
