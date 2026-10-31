/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Sliders, 
  X, 
  ShieldCheck, 
  Bot, 
  CreditCard,
  Check,
  MapPin,
  Target
} from 'lucide-react';
import { BusinessSegment, PlanTier } from '../types/index.ts';
import { getAiRecommendation, registerNewCompany } from '../services/api.ts';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompanyCreated: (newCompanyId: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onCompanyCreated,
}) => {
  const [step, setStep] = useState<'form' | 'ai_analyzing' | 'approval'>('form');

  // Form Fields
  const [name, setName] = useState('');
  const [tradeName, setTradeName] = useState('');
  const [cnpjCpf, setCnpjCpf] = useState('');
  const [segment, setSegment] = useState<BusinessSegment>('alimentacao');
  const [customSegmentName, setCustomSegmentName] = useState('');
  const [activityDescription, setActivityDescription] = useState('');
  const [staffCount, setStaffCount] = useState<number>(5);
  const [mainProductsOrServices, setMainProductsOrServices] = useState('');
  const [location, setLocation] = useState('São Paulo - SP');
  const [businessGoals, setBusinessGoals] = useState('Aumentar vendas e organizar a gestão');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // AI Recommendation State
  const [aiResult, setAiResult] = useState<any>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('pro');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleStartAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cnpjCpf) return;

    setStep('ai_analyzing');
    try {
      const result = await getAiRecommendation({
        name,
        cnpjCpf,
        segment,
        customSegmentName,
        activityDescription,
        staffCount,
        mainProductsOrServices,
        location,
        businessGoals,
      });

      setAiResult(result);
      setSelectedModules(result.recommendedModules || ['dashboard', 'vendas', 'marketing', 'connect', 'financeiro', 'growth_ai', 'team']);
      setSelectedPlan(result.recommendedPlan || 'pro');
      setStep('approval');
    } catch (err) {
      console.error(err);
      setStep('approval');
    }
  };

  const handleApproveAndActivate = async () => {
    setIsSubmitting(true);
    try {
      const created = await registerNewCompany({
        name,
        tradeName: tradeName || name,
        cnpjCpf,
        segment,
        customSegmentName: segment === 'personalizado' ? customSegmentName : undefined,
        activityDescription,
        staffCount,
        mainProductsOrServices,
        location,
        businessGoals,
        plan: selectedPlan,
        terminology: aiResult?.terminology || {
          clientsLabel: 'Clientes & Contas',
          clientSingular: 'Cliente',
          salesLabel: 'Vendas & Negociações',
          saleSingular: 'Venda',
          itemsLabel: 'Produtos & Serviços',
          itemSingular: 'Item',
        },
        enabledModules: selectedModules,
        kpis: (aiResult?.recommendedKpis || []).map((k: any, i: number) => ({
          id: `kpi_${i}`,
          title: k.title,
          value: k.estimatedInitialTarget || '0',
          changePercent: 0,
          isPositive: true,
          description: k.description,
        })),
        contactEmail: contactEmail || 'contato@empresa.com.br',
        contactPhone: contactPhone || '(11) 99999-9999',
      });

      onCompanyCreated(created.id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleModule = (mod: string) => {
    if (selectedModules.includes(mod)) {
      setSelectedModules(selectedModules.filter(m => m !== mod));
    } else {
      setSelectedModules([...selectedModules, mod]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-cyan-500/40 bg-[#0B132B] p-6 sm:p-8 shadow-[0_0_60px_rgba(0,240,255,0.15)] my-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* STEP 1: FORM */}
        {step === 'form' && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1 rounded-full bg-cyan-500/15 px-3 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-500/40 font-space">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                NEXORA BUSINESS — Setup Inteligente
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-space mt-1">
              Provisionamento Empresarial com IA
            </h2>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Informe os dados da sua empresa. O modelo Gemini 3.8 Flash adaptará os módulos, indicadores e regras conforme o seu ramo de atuação.
            </p>

            <form onSubmit={handleStartAnalysis} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Razão Social / Nome da Empresa *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Prime Odontologia & Estética"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#16274E]/70 p-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Nome Fantasia (Opcional)</label>
                  <input
                    type="text"
                    value={tradeName}
                    onChange={(e) => setTradeName(e.target.value)}
                    placeholder="Ex: Prime Odonto"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#16274E]/70 p-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">CNPJ ou CPF Empresarial *</label>
                  <input
                    type="text"
                    required
                    value={cnpjCpf}
                    onChange={(e) => setCnpjCpf(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#16274E]/70 p-2.5 text-white font-mono placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Segmento de Atuação *</label>
                  <select
                    value={segment}
                    onChange={(e: any) => setSegment(e.target.value)}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#16274E]/70 p-2.5 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="alimentacao">Alimentação e Restaurantes</option>
                    <option value="automotivo">Automotivo & Oficinas</option>
                    <option value="beleza">Beleza e Estética</option>
                    <option value="saude">Saúde, Clínicas & Odontologia</option>
                    <option value="comercio">Comércio e Varejo</option>
                    <option value="logistica">Logística e Transportes</option>
                    <option value="imobiliaria">Imobiliárias e Corretores</option>
                    <option value="educacao">Escolas e Educação</option>
                    <option value="servicos">Serviços Profissionais & B2B</option>
                    <option value="construcao">Construção Civil & Engenharia</option>
                    <option value="petshop">Pet Shops & Clínicas Veterinárias</option>
                    <option value="hotelaria">Hotéis, Pousadas & Turismo</option>
                    <option value="digital">Negócios Digitais & SaaS</option>
                    <option value="personalizado">Outro Ramo Personalizado</option>
                  </select>
                </div>
              </div>

              {segment === 'personalizado' && (
                <div>
                  <label className="text-slate-300 font-medium">Qual o seu ramo?</label>
                  <input
                    type="text"
                    value={customSegmentName}
                    onChange={(e) => setCustomSegmentName(e.target.value)}
                    placeholder="Ex: Indústria Química, Academia"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#16274E]/70 p-2.5 text-white"
                  />
                </div>
              )}

              <div>
                <label className="text-slate-300 font-medium">Descrição das Atividades da Empresa</label>
                <textarea
                  rows={2}
                  value={activityDescription}
                  onChange={(e) => setActivityDescription(e.target.value)}
                  placeholder="Como o negócio opera, diferenciais e perfil de clientes..."
                  className="w-full mt-1 rounded-xl border border-white/10 bg-[#16274E]/70 p-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Principais Serviços ou Produtos</label>
                  <input
                    type="text"
                    value={mainProductsOrServices}
                    onChange={(e) => setMainProductsOrServices(e.target.value)}
                    placeholder="Ex: Implantes, clareamento e profilaxia"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#16274E]/70 p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Quantidade de Funcionários</label>
                  <input
                    type="number"
                    min={1}
                    value={staffCount}
                    onChange={(e) => setStaffCount(Number(e.target.value))}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#16274E]/70 p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Localização (Cidade - UF)</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: Curitiba - PR"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#16274E]/70 p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Principal Objetivo Empresarial</label>
                  <input
                    type="text"
                    value={businessGoals}
                    onChange={(e) => setBusinessGoals(e.target.value)}
                    placeholder="Ex: Dobrar número de clientes este ano"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#16274E]/70 p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">E-mail Principal</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contato@empresa.com.br"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#16274E]/70 p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">WhatsApp Comercial</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#16274E]/70 p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-cyan-500/20"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Analisar com IA</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: AI ANALYZING */}
        {step === 'ai_analyzing' && (
          <div className="py-14 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#1C2541] to-[#0B132B] border border-cyan-500/50 shadow-[0_0_40px_rgba(0,240,255,0.3)]">
              <Bot className="h-8 w-8 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-space">
                NEXORA AI Analisando Perfil Empresarial...
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Selecionando módulos, calibrando indicadores de desempenho e personalizando a terminologia para {name}.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: APPROVAL SCREEN */}
        {step === 'approval' && aiResult && (
          <div className="space-y-4 text-xs">
            <div>
              <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-300 uppercase tracking-wider font-mono">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Configuração Estratégica Proposta pela IA
              </span>
              <h2 className="text-xl font-bold text-white mt-1 font-space">
                Aprovação da Configuração do Sistema
              </h2>
              <p className="text-slate-300 mt-0.5">
                Revise os módulos, nomenclatura e plano comercial antes de ativar o tenant seguro da <b>{name}</b>.
              </p>
            </div>

            {aiResult.aiExecutiveAdvice && (
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-3 text-slate-200">
                <p className="italic leading-relaxed">"{aiResult.aiExecutiveAdvice}"</p>
              </div>
            )}

            {/* Plan Recommendation */}
            <div className="rounded-2xl border border-white/10 bg-[#16274E]/60 p-3.5">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  Plano Sugerido:
                </span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                  Recomendado
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase font-space">{selectedPlan}</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">{aiResult.planJustification}</p>
                </div>
                <select
                  value={selectedPlan}
                  onChange={(e: any) => setSelectedPlan(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#0B132B] px-3 py-1.5 text-xs text-[#F3C623] font-bold uppercase"
                >
                  <option value="start">Start (R$ 49,90)</option>
                  <option value="pro">Pro (R$ 99,90)</option>
                  <option value="business">Business (R$ 199,90)</option>
                  <option value="premium">Premium (R$ 299,90)</option>
                </select>
              </div>
            </div>

            {/* Modules Toggle */}
            <div>
              <h4 className="font-semibold text-slate-300 mb-2">
                Módulos Habilitados para {name}:
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'dashboard', label: 'Dashboard Inteligente' },
                  { id: 'vendas', label: 'NEXORA Vendas (CRM)' },
                  { id: 'marketing', label: 'NEXORA Marketing (IA)' },
                  { id: 'connect', label: 'NEXORA Connect (WhatsApp)' },
                  { id: 'financeiro', label: 'NEXORA Financeiro & DRE' },
                  { id: 'growth_ai', label: 'NEXORA Growth AI' },
                  { id: 'fidelidade', label: 'NEXORA Fidelidade' },
                  { id: 'team', label: 'NEXORA Team (Equipe)' },
                  { id: 'store', label: 'NEXORA Store (PDV)' },
                  { id: 'reputation', label: 'NEXORA Reputation' },
                  { id: 'academy', label: 'NEXORA Academy' },
                  { id: 'expansion', label: 'NEXORA Expansion' },
                ].map((mod) => {
                  const isChecked = selectedModules.includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      className={`flex items-center gap-2 rounded-xl p-2.5 text-left border transition ${
                        isChecked
                          ? 'border-cyan-500/50 bg-cyan-500/10 text-white font-medium'
                          : 'border-white/5 bg-white/5 text-slate-400'
                      }`}
                    >
                      <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
                        isChecked ? 'bg-cyan-500 text-slate-950' : 'border border-slate-600'
                      }`}>
                        {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span className="truncate text-[11px]">{mod.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Approval CTA */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('form')}
                className="text-slate-400 hover:text-white"
              >
                Voltar e Editar
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleApproveAndActivate}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isSubmitting ? 'Ativando Empresa...' : 'Aprovar Configuração & Ativar'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
