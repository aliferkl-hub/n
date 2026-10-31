/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  ChevronDown, 
  Plus, 
  Crown, 
  CheckCircle2, 
  Sparkles,
  Search,
  Bell,
  Fingerprint,
  Bot,
  BarChart3,
  X
} from 'lucide-react';
import { Company } from '../types/index.ts';

interface HeaderProps {
  currentCompany: Company | null;
  companies: Company[];
  onSelectCompany: (companyId: string) => void;
  onOpenOnboarding: () => void;
  isMasterOwnerMode: boolean;
  onToggleMasterOwner: () => void;
  onOpenLogin: () => void;
  onOpenAiCopilot: () => void;
  onSearchSelectModule?: (tabId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCompany,
  companies,
  onSelectCompany,
  onOpenOnboarding,
  isMasterOwnerMode,
  onToggleMasterOwner,
  onOpenLogin,
  onOpenAiCopilot,
  onSearchSelectModule,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultsOpen, setSearchResultsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchableModules = [
    { id: 'dashboard', label: 'Central de Comando (Dashboard)', group: 'Comando' },
    { id: 'analytics', label: 'NEXORA Analytics (BI & Gráficos)', group: 'Inteligência' },
    { id: 'copilot', label: 'NEXORA Consultor Virtual IA', group: 'Inteligência' },
    { id: 'vendas', label: 'NEXORA Vendas (Pipeline & CRM)', group: 'Vendas' },
    { id: 'growth_ai', label: 'NEXORA Growth AI (Diagnóstico)', group: 'Inteligência' },
    { id: 'marketing', label: 'NEXORA Marketing (Copywriting & Campanhas)', group: 'Crescimento' },
    { id: 'whatsapp', label: 'NEXORA Connect (WhatsApp Business Cloud)', group: 'Comunicação' },
    { id: 'financial', label: 'NEXORA Financeiro & DRE Conciliado', group: 'Finanças' },
    { id: 'fidelidade', label: 'NEXORA Fidelidade & Cashback', group: 'Retenção' },
    { id: 'team', label: 'NEXORA Team (Equipe, Metas & Comissões)', group: 'Pessoas' },
    { id: 'store', label: 'NEXORA Store (Catálogo & Links de Venda)', group: 'Vendas' },
    { id: 'reputation', label: 'NEXORA Reputation (NPS & Avaliações)', group: 'Qualidade' },
    { id: 'academy', label: 'NEXORA Academy (Playbooks & Cursos)', group: 'Educação' },
    { id: 'expansion', label: 'NEXORA Expansion (Filiais & Multi-unidades)', group: 'Escala' },
    { id: 'plans', label: 'Planos Comerciais & Assinatura', group: 'Gestão' },
    { id: 'audit', label: 'Auditoria & Conformidade LGPD', group: 'Segurança' },
  ];

  const filteredSearch = searchableModules.filter(m => 
    m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.group.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Command+K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchResultsOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchResultsOpen(false);
        setDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const notifications = [
    { id: '1', title: 'Conciliação preventiva', desc: 'R$ 7.100 em contas a pagar com vencimento em 48h', time: '14:20' },
    { id: '2', title: 'Meta de Vendas', desc: 'Ritmo mensal em 82% da meta projetada', time: '11:05' },
    { id: '3', title: 'Auditoria LGPD', desc: 'Consentimento de 100% dos novos contatos registrado', time: 'Ontem' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#060B14]/95 backdrop-blur-xl px-4 sm:px-6 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Zone 1: Single-Element Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#121E38] to-[#0A1020] border border-[#D4AF37]/40 shadow-sm">
              <span className="font-cinzel text-base font-bold text-[#F3C623] tracking-wider">N</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-space text-base font-extrabold tracking-wider text-white">
                  NEXORA
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-cyan-400 font-mono">
                  ONE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wide font-sans hidden sm:block">
                Inteligência Empresarial & Gestão
              </p>
            </div>
          </div>
        </div>

        {/* Zone 2: Global Command Search */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setSearchResultsOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchResultsOpen(true);
              }}
              placeholder="Buscar módulos, indicadores, relatórios... (Ctrl+K)"
              className="w-full rounded-xl border border-white/10 bg-[#0A1120] pl-9 pr-14 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400/60 focus:bg-[#0D162B] transition"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[10px] font-mono text-slate-500 border border-white/10 rounded px-1">
              ⌘K
            </div>
          </div>

          {searchResultsOpen && searchQuery && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-xl border border-white/10 bg-[#0A1120] p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 border-b border-white/5">
                Módulos & Comandos Encontrados
              </div>
              <div className="max-h-60 overflow-y-auto py-1 space-y-1">
                {filteredSearch.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      if (onSearchSelectModule) onSearchSelectModule(m.id);
                      setSearchResultsOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-1.5 text-left text-xs text-slate-200 hover:bg-white/5 hover:text-cyan-300 transition"
                  >
                    <span>{m.label}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{m.group}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Zone 3: Actions & Tenant Selection */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick AI Trigger */}
          <button
            onClick={onOpenAiCopilot}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 text-xs font-bold text-cyan-300 shadow-sm transition"
            title="Assistente Virtual NEXORA AI"
          >
            <Bot className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">NEXORA AI</span>
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="flex items-center justify-center h-8 w-8 rounded-xl border border-white/10 bg-[#0A1120] text-slate-300 hover:text-white transition"
              title="Notificações e Alertas"
            >
              <Bell className="h-3.5 w-3.5" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-[#0A1120] p-3 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-white/5">
                  <span className="text-xs font-bold text-white font-space">Notificações Executivas</span>
                  <span className="text-[10px] font-mono text-cyan-300">{notifications.length} ativas</span>
                </div>
                <div className="space-y-2 py-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-xl bg-[#060D1B] border border-white/5 text-xs">
                      <div className="flex items-center justify-between font-semibold text-slate-200">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tenant Switcher */}
          {!isMasterOwnerMode && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0E172C] px-3 py-1.5 text-left hover:border-cyan-500/40 transition shadow-sm"
              >
                <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-white max-w-[130px] truncate">
                    {currentCompany?.name || 'Selecione'}
                  </div>
                </div>
                <ChevronDown className="h-3 w-3 text-slate-400 ml-0.5" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 bg-[#0A1120] p-3 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in">
                  <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Tenants Multissetoriais Isolados
                      </span>
                      <p className="text-[10px] text-slate-500">
                        Segregação lógica de banco de dados
                      </p>
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto py-2 space-y-1">
                    {companies.map((comp) => {
                      const isSelected = currentCompany?.id === comp.id;
                      return (
                        <button
                          key={comp.id}
                          onClick={() => {
                            onSelectCompany(comp.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-left transition ${
                            isSelected
                              ? 'bg-cyan-500/15 border border-cyan-500/40 text-white'
                              : 'text-slate-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold truncate">{comp.name}</span>
                              {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0" />}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono capitalize">
                              {comp.segment} · {comp.cnpjOrCpf || comp.cnpjCpf}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold uppercase text-[#D4AF37] font-mono">
                            {comp.planTier || comp.plan}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenOnboarding();
                      }}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-xs font-bold text-white hover:brightness-110 transition shadow-md"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Provisionar Nova Empresa (IA)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Master Owner Toggle */}
          <button
            onClick={onToggleMasterOwner}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition border ${
              isMasterOwnerMode
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                : 'border-white/10 bg-[#0A1120] text-slate-300 hover:border-amber-400/50 hover:text-amber-300'
            }`}
          >
            <Crown className={`h-3.5 w-3.5 ${isMasterOwnerMode ? 'text-slate-950' : 'text-[#F3C623]'}`} />
            <span className="hidden lg:inline">
              {isMasterOwnerMode ? 'Alifer Madeiro (Master)' : 'Master Owner'}
            </span>
          </button>

          {/* Biometric/Auth Trigger */}
          <button
            onClick={onOpenLogin}
            className="flex items-center justify-center h-8 w-8 rounded-xl border border-white/10 bg-[#0A1120] text-slate-300 hover:text-white hover:border-cyan-400/40 transition"
            title="Autenticação e Perfis Seguros"
          >
            <Fingerprint className="h-3.5 w-3.5 text-cyan-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
