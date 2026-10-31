/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Megaphone, 
  Sparkles, 
  Plus, 
  Calendar, 
  Share2, 
  Instagram, 
  MessageSquare, 
  Layers, 
  Copy, 
  Check, 
  DollarSign,
  TrendingUp,
  Target
} from 'lucide-react';
import { Company, MarketingCampaign } from '../types/index.ts';

interface MarketingViewProps {
  company: Company;
  campaigns: MarketingCampaign[];
  onCreateCampaign: (campaignData: any) => Promise<void>;
  onTriggerWhatsApp: (recipient: string, message: string) => void;
}

export const MarketingView: React.FC<MarketingViewProps> = ({
  company,
  campaigns,
  onCreateCampaign,
  onTriggerWhatsApp,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [channel, setChannel] = useState<'instagram' | 'whatsapp' | 'meta_ads' | 'email'>('instagram');
  const [targetAudience, setTargetAudience] = useState('');
  const [copyText, setCopyText] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [budget, setBudget] = useState<number | ''>(500);

  const formatCurrency = (val: number) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const generateAiCopy = () => {
    const drafts = [
      `🚀 Quer elevar seus resultados com a ${company.name}? Conheça nossos serviços exclusivos desenhados para quem busca excelência e rapidez. Toque no link e fale agora no WhatsApp com nossos especialistas!`,
      `✨ Oferta Especial de Temporada na ${company.name}! Condições exclusivas para os primeiros 20 clientes desta semana. Garanta seu atendimento com atendimento prioritário.`,
      `💼 Você sabia que a ${company.name} atende clientes em todo o segmento de ${company.segment}? Solicite hoje mesmo uma proposta personalizada sem compromisso pelo nosso canal oficial.`,
    ];
    const picked = drafts[Math.floor(Math.random() * drafts.length)];
    setCopyText(picked);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !copyText) return;

    await onCreateCampaign({
      title,
      objective: objective || 'Aquisição de novos clientes',
      channel,
      targetAudience: targetAudience || 'Público qualificado',
      copyText,
      callToAction: callToAction || 'Chamar no WhatsApp',
      status: 'ativo',
      budget: Number(budget) || 0,
      scheduledDate: new Date().toISOString().split('T')[0],
      leadsGenerated: 0,
    });

    setTitle('');
    setObjective('');
    setCopyText('');
    setCallToAction('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
              <Megaphone className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-white font-space">
              NEXORA MARKETING — Campanhas & Copywriting IA
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Geração de copies persuasivas com inteligência artificial, calendário de postagens e segmentação de público.
          </p>
        </div>

        <button
          onClick={() => {
            generateAiCopy();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-purple-500/20"
        >
          <Sparkles className="h-4 w-4" />
          <span>Criar Campanha com IA</span>
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="rounded-3xl border border-white/10 bg-[#0B132B]/90 p-5 space-y-4 flex flex-col justify-between hover:border-purple-500/40 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  camp.channel === 'instagram' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40' :
                  camp.channel === 'whatsapp' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                  'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                }`}>
                  {camp.channel.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {camp.scheduledDate}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-1">{camp.title}</h3>
              <p className="text-[11px] text-slate-400 mb-3">{camp.objective}</p>

              {/* Copy preview box */}
              <div className="rounded-2xl border border-white/5 bg-[#1C2541]/70 p-3.5 text-xs text-slate-200 leading-relaxed font-sans relative group">
                <p className="line-clamp-4">{camp.copyText}</p>
                <button
                  onClick={() => handleCopy(camp.id, camp.copyText)}
                  className="mt-2.5 flex items-center gap-1.5 text-[10px] text-purple-300 hover:text-purple-200 font-semibold"
                >
                  {copiedId === camp.id ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Texto Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copiar Texto Publicitário</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400">Verba / Investimento:</span>
                <p className="font-bold text-[#F3C623]">{formatCurrency(camp.budget || 0)}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400">Leads Conquistados:</span>
                <p className="font-bold text-emerald-400 font-mono">{camp.leadsGenerated || 0} leads</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-purple-500/40 bg-[#0B132B] p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1 text-[11px] font-bold text-purple-400 uppercase">
                <Sparkles className="h-3.5 w-3.5" />
                NEXORA Marketing Engine
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mb-4 font-space">
              Nova Campanha Publicitária
            </h2>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Nome / Título da Campanha *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Festival de Inverno / Promoção Black Week"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Canal Principal</label>
                  <select
                    value={channel}
                    onChange={(e: any) => setChannel(e.target.value)}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                  >
                    <option value="instagram">Instagram (Feed/Stories/Reels)</option>
                    <option value="whatsapp">WhatsApp Business Oficial</option>
                    <option value="meta_ads">Meta Ads (Facebook & Instagram)</option>
                    <option value="email">E-mail Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Orçamento Estimado (R$)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span>Texto Publicitário (Copywriting) *</span>
                  <button
                    type="button"
                    onClick={generateAiCopy}
                    className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    Regenerar com IA
                  </button>
                </div>
                <textarea
                  rows={4}
                  required
                  value={copyText}
                  onChange={(e) => setCopyText(e.target.value)}
                  placeholder="Texto gerado com gatilhos de atenção, interesse e desejo..."
                  className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Chamada para Ação (CTA)</label>
                <input
                  type="text"
                  value={callToAction}
                  onChange={(e) => setCallToAction(e.target.value)}
                  placeholder="Ex: Fale com um Especialista no WhatsApp"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                />
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
                  className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white hover:brightness-110"
                >
                  Ativar Campanha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
