/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  ShieldCheck, 
  MessageSquare, 
  Tag, 
  Calendar, 
  Phone, 
  Mail, 
  CheckCircle2,
  FileCheck2
} from 'lucide-react';
import { Company, Client } from '../types/index.ts';

interface ClientsViewProps {
  company: Company;
  clients: Client[];
  onCreateClient: (clientData: any) => Promise<void>;
  onTriggerWhatsApp: (recipient: string, message: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  company,
  clients,
  onCreateClient,
  onTriggerWhatsApp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [segmentRole, setSegmentRole] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [lgpdConsent, setLgpdConsent] = useState(true);

  const term = company.terminology;

  const filteredClients = clients.filter((c) => {
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.document.includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const formatCurrency = (val: number) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    await onCreateClient({
      name,
      document: document || '000.000.000-00',
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone,
      segmentRole: segmentRole || term.clientSingular,
      tags: tagsInput ? tagsInput.split(',').map(t => t.trim()) : ['Ativo'],
      totalSpent: 0,
      lastInteraction: new Date().toISOString(),
      status: 'ativo',
      lgpdConsent: {
        granted: lgpdConsent,
        grantedAt: new Date().toISOString(),
        purpose: 'Comunicações transacionais, agendamentos e avisos contratuais autorizados',
      },
    });

    setName('');
    setDocument('');
    setEmail('');
    setPhone('');
    setSegmentRole('');
    setTagsInput('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-white">
              Gestão de {term.clientsLabel}
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Base segura de relacionamentos comerciais com histórico e conformidade estrita com a LGPD.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3C623] px-3.5 py-2 text-xs font-semibold text-slate-950 hover:brightness-110 shadow"
        >
          <Plus className="h-4 w-4" />
          <span>Cadastrar {term.clientSingular}</span>
        </button>
      </div>

      {/* Filter and search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Buscar por nome, CPF/CNPJ ou telefone...`}
            className="w-full rounded-xl border border-white/10 bg-[#0B132B]/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]/50"
          />
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400 shrink-0">
          <ShieldCheck className="h-4 w-4" />
          <span className="font-medium text-[11px]">LGPD Conforme</span>
        </div>
      </div>

      {/* Clients list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="rounded-2xl border border-white/10 bg-[#0B132B]/90 p-5 space-y-4 hover:border-[#D4AF37]/30 transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-sm truncate" title={client.name}>
                  {client.name}
                </h3>
                <span className="text-[11px] font-mono text-slate-400">{client.document}</span>
                {client.segmentRole && (
                  <p className="text-[10px] text-blue-300 font-medium mt-0.5">{client.segmentRole}</p>
                )}
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {client.status}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 truncate">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{client.email}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs py-2 border-y border-white/5">
              <span className="text-slate-400">Total Transacionado:</span>
              <span className="font-bold text-emerald-400">{formatCurrency(client.totalSpent)}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <FileCheck2 className="h-3.5 w-3.5" />
                Consentimento LGPD Ativo
              </span>
              <button
                onClick={() => onTriggerWhatsApp(client.phone, `Olá ${client.name}! Mensagem oficial da ${company.name}. Como podemos atendê-lo hoje?`)}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to add client */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0B132B] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-1">
              Cadastrar {term.clientSingular}
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Cadastro integrado ao banco de dados isolado da {company.name}.
            </p>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nome do cliente ou empresa"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">CPF ou CNPJ</label>
                  <input
                    type="text"
                    value={document}
                    onChange={(e) => setDocument(e.target.value)}
                    placeholder="000.000.000-00"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">WhatsApp / Telefone *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+55 11 99999-9999"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cliente@dominio.com.br"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Classificação Setorial</label>
                <input
                  type="text"
                  value={segmentRole}
                  onChange={(e) => setSegmentRole(e.target.value)}
                  placeholder="Ex: Paciente Convênio, Mesa VIP, Frotista"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={lgpdConsent}
                    onChange={(e) => setLgpdConsent(e.target.checked)}
                    className="rounded border-white/20 bg-slate-800 text-blue-500 focus:ring-0"
                  />
                  <span>Consentimento explícito LGPD para comunicações e notificações</span>
                </label>
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
                  className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3C623] px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110"
                >
                  Salvar {term.clientSingular}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
