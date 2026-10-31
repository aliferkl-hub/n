/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  MessageSquareText, 
  Bot, 
  CreditCard, 
  ShieldAlert, 
  UtensilsCrossed, 
  Wrench, 
  Stethoscope, 
  Home, 
  ShoppingBag, 
  Briefcase,
  Sparkles,
  TrendingUp,
  Megaphone,
  Gift,
  Star,
  GraduationCap,
  Building2,
  ChevronRight,
  Layers,
  BarChart3
} from 'lucide-react';
import { Company } from '../types/index.ts';

export type NavTab = 
  | 'dashboard' 
  | 'analytics'
  | 'copilot'
  | 'segment_module'
  | 'vendas'
  | 'growth_ai'
  | 'marketing'
  | 'whatsapp'
  | 'clients'
  | 'fidelidade'
  | 'reputation'
  | 'financial'
  | 'store'
  | 'team'
  | 'expansion'
  | 'academy'
  | 'plans' 
  | 'audit';

interface SidebarProps {
  currentCompany: Company | null;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  mobileMenuOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentCompany,
  activeTab,
  onSelectTab,
  mobileMenuOpen,
  onCloseMobile,
}) => {
  if (!currentCompany) return null;

  const getSegmentIcon = () => {
    switch (currentCompany.segment) {
      case 'alimentacao':
      case 'restaurante': return UtensilsCrossed;
      case 'automotivo':
      case 'oficina': return Wrench;
      case 'saude':
      case 'clinica':
      case 'beleza': return Stethoscope;
      case 'imobiliaria': return Home;
      case 'comercio': return ShoppingBag;
      case 'servicos': return Briefcase;
      default: return Layers;
    }
  };

  const SegmentIcon = getSegmentIcon();

  interface MenuItem {
    id: NavTab;
    label: string;
    icon: any;
    badge?: string;
    highlightCyan?: boolean;
    highlightGold?: boolean;
  }

  interface MenuSection {
    title: string;
    items: MenuItem[];
  }

  const menuSections: MenuSection[] = [
    {
      title: 'Comando & Inteligência',
      items: [
        { id: 'dashboard' as NavTab, label: 'Central de Comando', icon: LayoutDashboard },
        { id: 'analytics' as NavTab, label: 'NEXORA Analytics (BI)', icon: BarChart3, highlightCyan: true, badge: 'BI' },
        { id: 'copilot' as NavTab, label: 'Consultor Virtual IA', icon: Bot, highlightGold: true, badge: 'Copilot' },
        { id: 'segment_module' as NavTab, label: `Operação ${currentCompany.segment}`, icon: SegmentIcon, badge: 'Nicho' },
      ],
    },
    {
      title: 'Vendas & Crescimento',
      items: [
        { id: 'vendas' as NavTab, label: 'NEXORA Vendas (CRM)', icon: TrendingUp, badge: 'Funil' },
        { id: 'growth_ai' as NavTab, label: 'NEXORA Growth AI', icon: Sparkles, badge: 'Estratégia' },
        { id: 'marketing' as NavTab, label: 'NEXORA Marketing', icon: Megaphone },
      ],
    },
    {
      title: 'Comunicação & Retenção',
      items: [
        { id: 'whatsapp' as NavTab, label: 'NEXORA Connect', icon: MessageSquareText, badge: 'Meta Cloud' },
        { id: 'clients' as NavTab, label: currentCompany.terminology.clientsLabel || 'Clientes', icon: Users },
        { id: 'fidelidade' as NavTab, label: 'NEXORA Fidelidade', icon: Gift },
        { id: 'reputation' as NavTab, label: 'NEXORA Reputation', icon: Star },
      ],
    },
    {
      title: 'Gestão Operacional',
      items: [
        { id: 'financial' as NavTab, label: 'Financeiro & DRE', icon: Wallet },
        { id: 'store' as NavTab, label: 'Catálogo & PDV', icon: ShoppingBag },
        { id: 'team' as NavTab, label: 'Equipe & Metas', icon: Users },
      ],
    },
    {
      title: 'Escala & Governança',
      items: [
        { id: 'expansion' as NavTab, label: 'NEXORA Expansion', icon: Building2 },
        { id: 'academy' as NavTab, label: 'NEXORA Academy', icon: GraduationCap },
        { id: 'plans' as NavTab, label: 'Planos Comerciais', icon: CreditCard },
        { id: 'audit' as NavTab, label: 'Auditoria & LGPD', icon: ShieldAlert },
      ],
    },
  ];

  const planLimits: Record<string, { maxAi: number; maxWa: number; maxUsers: number }> = {
    start: { maxAi: 80, maxWa: 300, maxUsers: 2 },
    pro: { maxAi: 350, maxWa: 1500, maxUsers: 6 },
    business: { maxAi: 1500, maxWa: 8000, maxUsers: 20 },
    premium: { maxAi: 6000, maxWa: 30000, maxUsers: 999 },
    // Aliases
    essencial: { maxAi: 80, maxWa: 300, maxUsers: 2 },
    profissional: { maxAi: 350, maxWa: 1500, maxUsers: 6 },
    empresarial: { maxAi: 1500, maxWa: 8000, maxUsers: 20 },
  };

  const currentLimits = planLimits[currentCompany.planTier || currentCompany.plan] || planLimits.pro;
  const aiUsagePercent = Math.min(100, Math.round(((currentCompany.usage?.aiQueriesThisMonth || 0) / currentLimits.maxAi) * 100));

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-[61px] left-0 z-50 lg:z-30 h-full lg:h-[calc(100vh-61px)] w-72 shrink-0 border-r border-white/10 bg-[#060B14] p-3.5 flex flex-col justify-between overflow-y-auto transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Active Company Badge */}
          <div className="rounded-xl border border-white/10 bg-gradient-to-b from-[#0C1527] to-[#070D1B] p-3 shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-cyan-400">
                Instância Ativa
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentCompany.cnpjOrCpf || currentCompany.cnpjCpf || 'Ativo'}
              </span>
            </div>
            <h3 className="font-bold text-white text-xs truncate font-space" title={currentCompany.name}>
              {currentCompany.name}
            </h3>
            <p className="text-[10px] text-slate-400 truncate capitalize mt-0.5">
              Segmento: {currentCompany.segment}
            </p>
          </div>

          {/* Categorized Menu Navigation */}
          <div className="space-y-4">
            {menuSections.map((sec, secIdx) => (
              <div key={secIdx} className="space-y-1">
                <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  {sec.title}
                </div>
                <div className="space-y-0.5">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id);
                          onCloseMobile();
                        }}
                        className={`group relative flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 font-semibold'
                            : item.highlightCyan
                            ? 'text-cyan-300 hover:bg-cyan-500/10'
                            : item.highlightGold
                            ? 'text-[#F3C623] hover:bg-[#D4AF37]/10'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-1">
                          <Icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-105 ${
                            isActive 
                              ? 'text-white' 
                              : item.highlightCyan 
                              ? 'text-cyan-400' 
                              : item.highlightGold 
                              ? 'text-[#F3C623]' 
                              : 'text-slate-400 group-hover:text-white'
                          }`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.badge && (
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0 ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.highlightCyan
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : item.highlightGold
                              ? 'bg-[#D4AF37]/20 text-[#F3C623] border border-[#D4AF37]/30'
                              : 'bg-white/5 text-slate-400'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Usage Footer */}
        <div className="pt-3 border-t border-white/10 space-y-2 mt-4">
          <div className="rounded-xl border border-white/5 bg-[#091122]/70 p-2.5">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-cyan-400" />
                Cota de IA
              </span>
              <span className="text-cyan-300 font-mono text-[10px]">
                {currentCompany.usage?.aiQueriesThisMonth || 0} / {currentLimits.maxAi}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                style={{ width: `${aiUsagePercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 text-[10px] text-slate-400">
              <span>Plano: <b className="text-white uppercase font-mono">{currentCompany.planTier || currentCompany.plan}</b></span>
              <button 
                onClick={() => onSelectTab('plans')}
                className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-0.5"
              >
                Gerenciar
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
