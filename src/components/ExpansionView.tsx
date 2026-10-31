/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  Plus, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  BarChart2, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Company, ExpansionBranch } from '../types/index.ts';

interface ExpansionViewProps {
  company: Company;
  branches: ExpansionBranch[];
  onCreateBranch: (branchData: any) => Promise<void>;
}

export const ExpansionView: React.FC<ExpansionViewProps> = ({
  company,
  branches,
  onCreateBranch,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('SP');
  const [staffCount, setStaffCount] = useState<number>(6);

  const formatCurrency = (val: number) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const totalNetworkRevenue = branches.reduce((s, b) => s + b.monthlyRevenue, 0);
  const totalNetworkExpenses = branches.reduce((s, b) => s + b.monthlyExpenses, 0);
  const totalNetworkStaff = branches.reduce((s, b) => s + b.staffCount, 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city) return;

    await onCreateBranch({
      name,
      city,
      state,
      isHeadquarters: false,
      monthlyRevenue: 0,
      monthlyExpenses: 15000,
      staffCount: Number(staffCount) || 1,
      status: 'em_implantacao',
    });

    setName('');
    setCity('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Building2 className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-white font-space">
              NEXORA EXPANSION — Gestão Multi-Unidades & Filiais
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Planejamento de abertura de filiais, comparação de faturamento entre unidades e projeções de investimento.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Cadastrar Nova Unidade / Filial</span>
        </button>
      </div>

      {/* Network Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase font-semibold tracking-wider">Faturamento Consolidado Rede</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-space">
            {formatCurrency(totalNetworkRevenue)}
          </div>
          <span className="text-[10px] text-slate-400">Somatório de todas as unidades operando</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase font-semibold tracking-wider">Unidades Cadastradas</span>
            <Building2 className="h-4 w-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-space">
            {branches.length} unidades
          </div>
          <span className="text-[10px] text-blue-300 font-medium">
            {branches.filter(b => b.status === 'operando').length} operando • {branches.filter(b => b.status === 'estudo').length} em estudo
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="uppercase font-semibold tracking-wider">Quadro Total de Colaboradores</span>
            <Users className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-space">
            {totalNetworkStaff} profissionais
          </div>
          <span className="text-[10px] text-slate-400">Distribuídos na rede empresarial</span>
        </div>
      </div>

      {/* Branches List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {branches.map((b) => {
          const profit = b.monthlyRevenue - b.monthlyExpenses;
          const margin = b.monthlyRevenue > 0 ? ((profit / b.monthlyRevenue) * 100).toFixed(1) : 0;

          return (
            <div
              key={b.id}
              className={`rounded-3xl border p-5 space-y-4 flex flex-col justify-between transition ${
                b.isHeadquarters
                  ? 'border-cyan-500/40 bg-gradient-to-b from-[#1C2541] to-[#0B132B] shadow-lg shadow-cyan-500/10'
                  : 'border-white/10 bg-[#0B132B]/90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    b.isHeadquarters ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                    b.status === 'operando' ? 'bg-emerald-500/20 text-emerald-300' :
                    'bg-amber-500/20 text-amber-300'
                  }`}>
                    {b.isHeadquarters ? 'Matriz Principal' : b.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {b.city} - {b.state}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{b.name}</h3>

                <div className="space-y-2 bg-white/5 p-3 rounded-2xl text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Faturamento Mensal:</span>
                    <span className="font-bold text-emerald-400 font-mono">{formatCurrency(b.monthlyRevenue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Custos & Despesas:</span>
                    <span className="font-mono text-rose-300">{formatCurrency(b.monthlyExpenses)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-slate-400 font-medium">Margem Operacional:</span>
                    <span className="font-bold text-[#F3C623]">{margin}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span>{b.staffCount} colaboradores</span>
                <span className="text-cyan-400 font-semibold text-[11px]">Relatório Consolidado</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Branch Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-emerald-500/40 bg-[#0B132B] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-1 font-space">Cadastrar Nova Unidade</h2>
            <p className="text-xs text-slate-400 mb-4">Estruture a abertura ou estudo de viabilidade de uma nova filial.</p>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Identificação da Unidade *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Unidade Zona Sul / Filial Campinas"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Cidade *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Campinas"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Estado (UF)</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    placeholder="SP"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white uppercase font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium">Quadro de Colaboradores Inicial</label>
                <input
                  type="number"
                  value={staffCount}
                  onChange={(e) => setStaffCount(Number(e.target.value))}
                  className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white font-mono"
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
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-white hover:brightness-110"
                >
                  Salvar Unidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
