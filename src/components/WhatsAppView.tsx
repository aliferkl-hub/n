/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  CheckCheck, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck, 
  Phone, 
  Users, 
  Sparkles,
  Wifi,
  ExternalLink,
  Bot
} from 'lucide-react';
import { Company, WhatsAppConnection, WhatsAppMessage, WhatsAppTemplate, Client } from '../types/index.ts';

interface WhatsAppViewProps {
  company: Company;
  connection: WhatsAppConnection;
  messages: WhatsAppMessage[];
  templates: WhatsAppTemplate[];
  clients: Client[];
  onSendMessage: (payload: {
    contactName: string;
    contactPhone: string;
    content: string;
    isOfficialTemplate?: boolean;
    templateName?: string;
  }) => Promise<void>;
}

export const WhatsAppView: React.FC<WhatsAppViewProps> = ({
  company,
  connection,
  messages,
  templates,
  clients,
  onSendMessage,
}) => {
  const [selectedContactPhone, setSelectedContactPhone] = useState<string>(
    clients[0]?.phone || '+55 11 99123-4455'
  );
  const [selectedContactName, setSelectedContactName] = useState<string>(
    clients[0]?.name || 'Cliente Notificado'
  );
  const [messageText, setMessageText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Group messages for active contact
  const activeConversation = messages.filter(
    (m) => m.contactPhone === selectedContactPhone || m.contactName === selectedContactName
  );

  const handleSendCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSending(true);
    try {
      await onSendMessage({
        contactName: selectedContactName,
        contactPhone: selectedContactPhone,
        content: messageText,
        isOfficialTemplate: false,
      });
      setMessageText('');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendTemplate = async (template: WhatsAppTemplate) => {
    setIsSending(true);
    try {
      const renderedContent = template.content
        .replace('{{1}}', selectedContactName)
        .replace('{{2}}', company.name)
        .replace('{{3}}', 'amanhã')
        .replace('{{4}}', '14:30')
        .replace('{{5}}', 'https://nexora.app/aprovar/token-seguro');

      await onSendMessage({
        contactName: selectedContactName,
        contactPhone: selectedContactPhone,
        content: renderedContent,
        isOfficialTemplate: true,
        templateName: template.name,
      });
      setSelectedTemplate(null);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Cloud API Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <MessageSquare className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-white">Central WhatsApp Business Cloud API</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Canal oficial individual da {company.name} integrado diretamente aos servidores da Meta Graph API.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 font-semibold">
            <Wifi className="h-3.5 w-3.5 animate-pulse" />
            <span>Meta Cloud API Online</span>
          </div>
        </div>
      </div>

      {/* Cloud API Connection Meta Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Número Oficial Verificado</span>
          <p className="text-sm font-bold text-white mt-1">{connection.displayPhoneNumber}</p>
          <span className="text-[10px] text-emerald-400 font-medium">Nome: {connection.verifiedName}</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">WABA ID (Conta WhatsApp)</span>
          <p className="text-sm font-mono text-slate-200 mt-1 truncate">{connection.wabaId}</p>
          <span className="text-[10px] text-blue-400">Isolado para {company.name}</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Classificação de Qualidade Meta</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="text-sm font-bold text-emerald-300">GREEN (Excelente)</span>
          </div>
          <span className="text-[10px] text-slate-400">Zero bloqueios ou restrições</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Conformidade LGPD & Opt-in</span>
          <div className="flex items-center gap-1.5 mt-1">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-bold text-white">100% Auditado</span>
          </div>
          <span className="text-[10px] text-slate-400">Consentimento ativo</span>
        </div>
      </div>

      {/* Main Workspace: Contacts List + Chat Window + Templates Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[580px]">
        {/* Contact Selector (Left col) */}
        <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-[#0B132B]/90 p-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-blue-400" />
              Contatos com Opt-in ({clients.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {clients.map((c) => {
              const isSelected = selectedContactPhone === c.phone;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedContactPhone(c.phone);
                    setSelectedContactName(c.name);
                  }}
                  className={`w-full flex items-center justify-between rounded-xl p-2.5 text-left transition ${
                    isSelected
                      ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold truncate">{c.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{c.phone}</p>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                    LGPD OK
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Conversation Window (Center col) */}
        <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-[#0B132B]/95 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-white/10 bg-[#1C2541]/40 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white">{selectedContactName}</h3>
              <p className="text-[10px] text-slate-400 font-mono">{selectedContactPhone}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                Sessão WhatsApp Cloud Ativa
              </span>
            </div>
          </div>

          {/* Chat Message History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#1C2541_1px,transparent_1px)] [background-size:16px_16px]">
            {activeConversation.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <MessageSquare className="h-8 w-8 text-slate-600 mb-2" />
                <p className="text-xs font-medium text-slate-300">Inicie uma conversa ou selecione um template homologado abaixo.</p>
                <p className="text-[11px] text-slate-500 mt-1">Todas as mensagens são registradas com carimbo de entrega da Meta.</p>
              </div>
            ) : (
              activeConversation.map((msg) => {
                const isOutbound = msg.direction === 'outbound';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isOutbound ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 text-xs shadow-sm ${
                        isOutbound
                          ? 'bg-[#1C2541] border border-[#D4AF37]/30 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 rounded-bl-none border border-white/10'
                      }`}
                    >
                      {msg.isOfficialTemplate && (
                        <div className="flex items-center gap-1 text-[9px] text-[#F3C623] font-bold uppercase tracking-wider mb-1">
                          <FileCheck className="h-3 w-3" />
                          Template Homologado: {msg.templateName}
                        </div>
                      )}
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      
                      <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] text-slate-400">
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {isOutbound && (
                          <span title={msg.status}>
                            {msg.status === 'lido' ? (
                              <CheckCheck className="h-3.5 w-3.5 text-blue-400" />
                            ) : msg.status === 'entregue' ? (
                              <CheckCheck className="h-3.5 w-3.5 text-slate-400" />
                            ) : (
                              <Clock className="h-3 w-3 text-slate-400" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Official Templates Quick Bar */}
          <div className="p-2.5 bg-[#1C2541]/70 border-t border-white/10">
            <div className="text-[10px] text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#F3C623]" />
                Templates Homologados Meta:
              </span>
              <span className="text-slate-400">Disparo automático em 1 clique</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => handleSendTemplate(tpl)}
                  disabled={isSending}
                  className="shrink-0 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-500/40 px-2.5 py-1 text-[11px] text-slate-200 transition font-medium flex items-center gap-1.5"
                >
                  <Send className="h-3 w-3 text-emerald-400" />
                  <span>{tpl.name.replace(/_/g, ' ')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendCustom} className="p-3 border-t border-white/10 bg-[#0B132B] flex items-center gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Escreva uma mensagem oficial para ${selectedContactName}...`}
              className="flex-1 rounded-xl border border-white/10 bg-[#1C2541] px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]/50"
            />
            <button
              type="submit"
              disabled={isSending || !messageText.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3C623] px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110 disabled:opacity-40 transition shadow"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
