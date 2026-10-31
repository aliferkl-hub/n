/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  FileSpreadsheet, 
  TrendingUp, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Company, CopilotMessage } from '../types/index.ts';

interface CopilotViewProps {
  company: Company;
  onAskCopilot: (message: string) => Promise<{
    response: string;
    actionProposal?: any;
  }>;
  onExecuteAction: (actionProposal: any) => Promise<void>;
}

export const CopilotView: React.FC<CopilotViewProps> = ({
  company,
  onAskCopilot,
  onExecuteAction,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'init_msg',
      sender: 'assistant',
      text: `Olá! Sou o **NEXORA Copilot**, seu assistente executivo de inteligência artificial.\n\nEstou conectado com isolamento total aos dados da **${company.name}** (Segmento: **${company.segment.toUpperCase()}**).\n\nPosso emitir relatórios de fechamento, analisar o faturamento e CMV, identificar pendências críticas e sugerir planos de ação. Como posso auxiliá-lo hoje?`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedPrompts = [
    'Elabore um relatório executivo do faturamento e despesas',
    'Identifique pendências críticas e gargalos de atendimento',
    'Sugira melhorias para aumentar a lucratividade do negócio',
    'Prepare um template de cobrança elegante para clientes',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: CopilotMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const result = await onAskCopilot(text);
      const assistantMsg: CopilotMessage = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: result.response,
        timestamp: new Date().toISOString(),
        actionProposal: result.actionProposal || undefined,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: `Desculpe, ocorreu uma instabilidade temporária ao consultar a inteligência artificial. Por favor, tente novamente em instantes.`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = async (msgId: string, proposal: any) => {
    await onExecuteAction(proposal);
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId && m.actionProposal) {
          return {
            ...m,
            actionProposal: {
              ...m.actionProposal,
              status: 'approved',
            },
          };
        }
        return m;
      })
    );
  };

  const handleRejectAction = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === msgId && m.actionProposal) {
          return {
            ...m,
            actionProposal: {
              ...m.actionProposal,
              status: 'rejected',
            },
          };
        }
        return m;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#F3C623] text-slate-950 font-bold shadow-sm">
              <Bot className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-bold text-white">Assistente IA Empresarial (Copilot)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Inteligência contextual baseada em Gemini 3.8 Flash com acesso estrito e seguro aos dados de {company.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1.5 text-xs text-[#F3C623] font-semibold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Ações Críticas com Confirmação Humana</span>
          </div>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-semibold text-slate-400 shrink-0">Sugestões Rápidas:</span>
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="shrink-0 rounded-xl border border-white/10 bg-[#1C2541]/60 hover:bg-[#1C2541] hover:border-[#D4AF37]/40 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition flex items-center gap-1.5"
          >
            <Sparkles className="h-3 w-3 text-[#F3C623]" />
            <span>{p}</span>
          </button>
        ))}
      </div>

      {/* Chat Conversation Box */}
      <div className="rounded-2xl border border-white/10 bg-[#0B132B]/95 h-[520px] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-3 border-b border-white/10 bg-[#1C2541]/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NEXORA Business Reasoning Engine • Tenant: {company.name}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {company.usage.aiQueriesThisMonth || 0} consultas realizadas no mês
          </span>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1C2541] to-[#0B132B] border border-[#D4AF37]/40 text-[#F3C623]">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs shadow-sm ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-[#1C2541]/80 text-slate-200 border border-white/10 rounded-tl-none'
                  }`}
                >
                  <div className="leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </div>

                  {/* Render Structured Action Proposal when suggested by AI */}
                  {msg.actionProposal && (
                    <div className="mt-4 rounded-xl border border-[#D4AF37]/40 bg-[#0B132B] p-3.5 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#F3C623]">
                          <AlertCircle className="h-4 w-4" />
                          <span>{msg.actionProposal.title}</span>
                        </div>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          msg.actionProposal.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                          msg.actionProposal.status === 'rejected' ? 'bg-rose-500/20 text-rose-300' :
                          'bg-amber-500/20 text-amber-300'
                        }`}>
                          {msg.actionProposal.status === 'approved' ? 'Executado & Auditado' :
                           msg.actionProposal.status === 'rejected' ? 'Cancelado pelo Gestor' :
                           'Confirmação Obrigatória'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 leading-normal">
                        {msg.actionProposal.description}
                      </p>

                      {msg.actionProposal.payload && (
                        <div className="mt-2 p-2 rounded-lg bg-white/5 font-mono text-[10px] text-slate-300 space-y-0.5">
                          {Object.entries(msg.actionProposal.payload).map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <span className="text-slate-400 capitalize">{k}:</span>
                              <span className="text-white font-semibold">{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {msg.actionProposal.status === 'pending' && (
                        <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                          <button
                            onClick={() => handleRejectAction(msg.id)}
                            className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Recusar</span>
                          </button>
                          <button
                            onClick={() => handleConfirmAction(msg.id, msg.actionProposal)}
                            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1.5 text-[11px] font-bold text-white hover:brightness-110 shadow transition"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Confirmar & Gravar no Banco</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-2 text-[10px] text-slate-400 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1C2541] border border-[#D4AF37]/30 text-[#F3C623] animate-pulse">
                <Sparkles className="h-4 w-4" />
              </div>
              <span>NEXORA Copilot analisando métricas da empresa...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 border-t border-white/10 bg-[#0B132B] flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            placeholder={`Faça uma pergunta sobre finanças, pendências, clientes ou estratégias...`}
            className="flex-1 rounded-xl border border-white/10 bg-[#1C2541] px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]/50"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3C623] px-4 py-2.5 text-xs font-bold text-slate-950 hover:brightness-110 disabled:opacity-40 transition shadow"
          >
            <Send className="h-4 w-4" />
            <span>Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
