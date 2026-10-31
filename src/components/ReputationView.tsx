/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { Company, ReputationReview, Client } from '../types/index.ts';

interface ReputationViewProps {
  company: Company;
  reviews: ReputationReview[];
  clients: Client[];
  onTriggerWhatsApp: (recipient: string, message: string) => void;
  onRespondReview: (id: string, responseNote: string) => Promise<void>;
}

export const ReputationView: React.FC<ReputationViewProps> = ({
  company,
  reviews,
  clients,
  onTriggerWhatsApp,
  onRespondReview,
}) => {
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  // NPS Calculation
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1) : '5.0';
  const promoters = reviews.filter(r => r.npsScore >= 9).length;
  const detractors = reviews.filter(r => r.npsScore <= 6).length;
  const npsScore = totalReviews > 0 ? Math.round(((promoters - detractors) / totalReviews) * 100) : 90;

  const handleSendResponse = async (reviewId: string) => {
    if (!responseText.trim()) return;
    await onRespondReview(reviewId, responseText);
    setResponseText('');
    setSelectedReviewId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Star className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-white font-space">
              NEXORA REPUTATION — Avaliações, NPS & Satisfação
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitoramento de satisfação do cliente, cálculo de NPS e solicitação automatizada de reviews via WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (clients[0]) {
                onTriggerWhatsApp(clients[0].phone, `Olá ${clients[0].name}! Como foi sua experiência recente com a ${company.name}? Poderia nos avaliar em 1 minuto? Sua opinião é fundamental para nós: https://nexora.app/review/${company.id}`);
              }
            }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110 shadow"
          >
            <Send className="h-4 w-4" />
            <span>Disparar Pesquisa de Satisfação WhatsApp</span>
          </button>
        </div>
      </div>

      {/* NPS and Rating Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-amber-500/30 bg-[#1C2541]/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-semibold tracking-wider">Nota Média de Satisfação</span>
            <div className="flex items-center text-amber-400">
              <Star className="h-4 w-4 fill-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-space">{averageRating}</span>
            <span className="text-xs text-slate-400">de 5.0 estrelas</span>
          </div>
          <div className="flex gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-cyan-500/30 bg-[#1C2541]/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-semibold tracking-wider">Net Promoter Score (NPS)</span>
            <ThumbsUp className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-400 font-space">{npsScore}</span>
            <span className="text-xs text-emerald-400 font-bold uppercase">Zona de Excelência</span>
          </div>
          <p className="text-[10px] text-slate-400">{promoters} promotores (9-10) • {detractors} detratores</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#1C2541]/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-semibold tracking-wider">Taxa de Resposta a Clientes</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-space">
              {totalReviews > 0 ? Math.round((reviews.filter(r => r.responded).length / totalReviews) * 100) : 100}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400">Nenhum feedback com pendência de retorno</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="rounded-3xl border border-white/10 bg-[#0B132B]/90 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Últimas Avaliações Recebidas</h2>
            <p className="text-xs text-slate-400">Comentários e notas registradas por canais oficiais</p>
          </div>
        </div>

        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-white/5 bg-[#1C2541]/40 p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{r.clientName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">NPS: {r.npsScore}/10</span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[10px] text-slate-400">{r.date}</span>
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white/5 text-slate-300 border border-white/10">
                  {r.channel.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs text-slate-200 italic leading-relaxed">
                "{r.comment}"
              </p>

              {r.responded && r.responseNote && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-[11px] text-emerald-200">
                  <span className="font-bold text-emerald-300 block mb-0.5">Resposta Oficial da {company.name}:</span>
                  {r.responseNote}
                </div>
              )}

              {!r.responded && (
                <div>
                  {selectedReviewId === r.id ? (
                    <div className="space-y-2 pt-2">
                      <textarea
                        rows={2}
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Escreva uma resposta cortês e agradeça o cliente..."
                        className="w-full rounded-xl border border-white/10 bg-[#0B132B] p-2.5 text-xs text-white"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedReviewId(null)}
                          className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={() => handleSendResponse(r.id)}
                          className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500"
                        >
                          Publicar Resposta
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedReviewId(r.id)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      Responder Avaliação
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
