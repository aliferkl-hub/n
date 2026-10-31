/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  CreditCard, 
  Check, 
  Crown, 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  Bot, 
  MessageSquare, 
  Users 
} from 'lucide-react';
import { Company, PlanTier } from '../types/index.ts';

interface PlansViewProps {
  company: Company;
  onUpdatePlan: (plan: PlanTier) => Promise<void>;
}

export const PlansView: React.FC<PlansViewProps> = ({
  company,
  onUpdatePlan,
}) => {
  const plans = [
    {
      id: 'essencial' as PlanTier,
      name: 'Essencial',
      price: 49.90,
      description: 'Ideal para profissionais autônomos, microempresas e pequenos negócios iniciando a gestão inteligente.',
      users: 2,
      clients: 200,
      aiQueries: 50,
      whatsappLines: 1,
      features: [
        'Isolamento completo de dados',
        'Módulo setorial adaptado',
        'Cadastro até 200 clientes',
        '50 consultas Copilot IA/mês',
        '1 conexão WhatsApp Business',
        'Suporte por Base de Conhecimento',
      ],
    },
    {
      id: 'profissional' as PlanTier,
      name: 'Profissional',
      price: 99.90,
      popular: true,
      description: 'Perfeito para clínicas, oficinas, restaurantes e comércios em franca expansão.',
      users: 5,
      clients: 1000,
      aiQueries: 250,
      whatsappLines: 1,
      features: [
        'Tudo do Essencial +',
        'Até 5 usuários simultâneos',
        'Cadastro até 1.000 clientes',
        '250 consultas Copilot IA/mês',
        'Relatórios DRE personalizados',
        'Templates homologados Meta Cloud',
        'Suporte por WhatsApp Comercial',
      ],
    },
    {
      id: 'empresarial' as PlanTier,
      name: 'Empresarial',
      price: 199.90,
      description: 'Para empresas consolidadas com múltiplos colaboradores e alta demanda operacional.',
      users: 15,
      clients: 5000,
      aiQueries: 1000,
      whatsappLines: 3,
      features: [
        'Tudo do Profissional +',
        'Até 15 usuários e funcionários',
        'Cadastro até 5.000 clientes',
        '1.000 consultas Copilot IA/mês',
        'Até 3 canais WhatsApp simultâneos',
        'Acesso completo a Webhooks & APIs',
        'Gerente de Contas Dedicado',
      ],
    },
    {
      id: 'premium' as PlanTier,
      name: 'Premium',
      price: 299.90,
      highlightGold: true,
      description: 'Capacidade máxima, inteligência contínua e prioridade absoluta para grandes operações.',
      users: 999,
      clients: 99999,
      aiQueries: 5000,
      whatsappLines: 10,
      features: [
        'Usuários e funcionários ilimitados',
        'Carteira ilimitada de clientes',
        '5.000 consultas Copilot IA/mês',
        'Até 10 números WhatsApp Cloud',
        'Modelos de IA prioritários sem fila',
        'SLA de atendimento 24/7',
        'Consultoria de engenharia de processos',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#F3C623] text-slate-950 font-bold">
              <CreditCard className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-white">Planos Comerciais & Assinatura</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestão transparente de limites, utilização de recursos de IA e canais WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Plano Atual:</span>
          <span className="text-xs font-bold uppercase px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#F3C623] border border-[#D4AF37]/40">
            {company.plan}
          </span>
        </div>
      </div>

      {/* Resource meters for active company */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Users className="h-4 w-4 text-blue-400" />
              Usuários Cadastrados
            </span>
            <span className="font-bold text-white font-mono">{company.usage.usersCount} ativos</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: '40%' }} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Bot className="h-4 w-4 text-[#F3C623]" />
              Consultas de IA Copilot
            </span>
            <span className="font-bold text-[#F3C623] font-mono">{company.usage.aiQueriesThisMonth || 0} consumidas</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3C623] rounded-full" style={{ width: '35%' }} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-emerald-400" />
              Disparos WhatsApp Cloud
            </span>
            <span className="font-bold text-emerald-400 font-mono">{company.usage.whatsappMessagesThisMonth || 0} mensagens</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '25%' }} />
          </div>
        </div>
      </div>

      {/* Commercial Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => {
          const isCurrent = company.plan === p.id;
          return (
            <div
              key={p.id}
              className={`relative rounded-3xl border p-6 flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'border-[#D4AF37] bg-gradient-to-b from-[#1C2541] to-[#0B132B] shadow-[0_0_30px_rgba(212,175,55,0.2)]'
                  : p.popular
                  ? 'border-blue-500/50 bg-[#1C2541]/60'
                  : 'border-white/10 bg-[#0B132B]/80 hover:border-white/20'
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3C623] px-3 py-0.5 text-[10px] font-bold text-slate-950 uppercase tracking-wider shadow">
                  Plano Ativo
                </div>
              )}

              {p.popular && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow">
                  Mais Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{p.name}</h3>
                  {p.highlightGold ? (
                    <Crown className="h-5 w-5 text-[#F3C623]" />
                  ) : (
                    <Zap className="h-4 w-4 text-slate-400" />
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-2 min-h-[36px]">{p.description}</p>

                <div className="my-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-slate-400">R$</span>
                    <span className="text-3xl font-extrabold text-white">
                      {p.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-xs text-slate-400">/mês</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-white/10">
                  {p.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  onClick={() => onUpdatePlan(p.id)}
                  disabled={isCurrent}
                  className={`w-full rounded-xl py-2.5 text-xs font-bold transition shadow ${
                    isCurrent
                      ? 'bg-white/10 text-slate-400 cursor-default'
                      : p.popular || p.highlightGold
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3C623] text-slate-950 hover:brightness-110'
                      : 'border border-white/15 bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {isCurrent ? 'Plano Atual da Empresa' : 'Migrar para este Plano'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
