/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Filter, 
  DollarSign, 
  PieChart, 
  CheckCircle2, 
  Clock, 
  FileText
} from 'lucide-react';
import { Company, FinancialTransaction } from '../types/index.ts';

interface FinancialViewProps {
  company: Company;
  transactions: FinancialTransaction[];
  onCreateTransaction: (transaction: any) => Promise<void>;
  onUpdateTransaction: (id: string, updates: any) => Promise<void>;
}

export const FinancialView: React.FC<FinancialViewProps> = ({
  company,
  transactions,
  onCreateTransaction,
  onUpdateTransaction,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'receita' | 'despesa' | 'pendente'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [type, setType] = useState<'receita' | 'despesa'>('receita');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<'pago' | 'pendente'>('pago');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao_credito' | 'cartao_debito' | 'boleto' | 'transferencia' | 'dinheiro'>('pix');
  const [clientName, setClientName] = useState('');

  const formatCurrency = (val: number) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const revenues = transactions.filter(t => t.type === 'receita' && t.status === 'pago').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'despesa' && t.status === 'pago').reduce((s, t) => s + t.amount, 0);
  const pendingExpenses = transactions.filter(t => t.type === 'despesa' && t.status === 'pendente').reduce((s, t) => s + t.amount, 0);
  const balance = revenues - expenses;

  const filtered = transactions.filter((t) => {
    if (filterType === 'receita') return t.type === 'receita';
    if (filterType === 'despesa') return t.type === 'despesa';
    if (filterType === 'pendente') return t.status === 'pendente';
    return true;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    await onCreateTransaction({
      type,
      category: category || (type === 'receita' ? 'Venda/Serviço' : 'Custos Gerais'),
      description,
      amount: Number(amount),
      date,
      status,
      paymentMethod,
      clientName: clientName || undefined,
    });

    setDescription('');
    setAmount('');
    setCategory('');
    setClientName('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Wallet className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-white">Gestão Financeira & Fluxo de Caixa</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Controle de receitas, despesas operacionais e apuração do resultado contábil.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3C623] px-3.5 py-2 text-xs font-semibold text-slate-950 hover:brightness-110 shadow"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Lançamento Financeiro</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Receitas Realizadas</span>
            <ArrowUpRight className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">
            {formatCurrency(revenues)}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Despesas Baixadas</span>
            <ArrowDownRight className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400">
            {formatCurrency(expenses)}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Contas a Pagar Pendentes</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400">
            {formatCurrency(pendingExpenses)}
          </div>
        </div>

        <div className="rounded-2xl border border-[#D4AF37]/30 bg-gradient-to-br from-[#1C2541] to-[#0B132B] p-4">
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span>Saldo Líquido</span>
            <DollarSign className="h-4 w-4 text-[#F3C623]" />
          </div>
          <div className="text-xl font-bold text-[#F3C623]">
            {formatCurrency(balance)}
          </div>
        </div>
      </div>

      {/* DRE Summary Strip */}
      <div className="rounded-2xl border border-white/10 bg-[#0B132B]/80 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <PieChart className="h-4 w-4 text-blue-400" />
            Demonstração de Resultado Sintética (DRE Gerencial)
          </h2>
          <span className="text-[11px] text-slate-400">Ambiente: {company.name}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-white/5">
            <span className="text-slate-400">1. Receita Bruta</span>
            <p className="font-bold text-white mt-0.5">{formatCurrency(revenues)}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <span className="text-slate-400">2. (-) Custos & Despesas</span>
            <p className="font-bold text-rose-300 mt-0.5">{formatCurrency(expenses)}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <span className="text-slate-400">3. Resultado Operacional</span>
            <p className="font-bold text-emerald-300 mt-0.5">{formatCurrency(balance)}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/5">
            <span className="text-slate-400">4. Margem Líquida</span>
            <p className="font-bold text-[#F3C623] mt-0.5">
              {revenues > 0 ? `${((balance / revenues) * 100).toFixed(1)}%` : '0.0%'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Transactions Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0B132B]/90 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs font-medium text-slate-300">Filtrar:</span>
            {(['all', 'receita', 'despesa', 'pendente'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                  filterType === f
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {f === 'all' ? 'Todas' : f === 'receita' ? 'Receitas' : f === 'despesa' ? 'Despesas' : 'Pendentes'}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400">
            {filtered.length} lançamentos registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1C2541]/60 text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-3.5 font-semibold">Tipo</th>
                <th className="p-3.5 font-semibold">Descrição</th>
                <th className="p-3.5 font-semibold">Categoria</th>
                <th className="p-3.5 font-semibold">Data</th>
                <th className="p-3.5 font-semibold">Método</th>
                <th className="p-3.5 font-semibold">Valor</th>
                <th className="p-3.5 font-semibold">Situação</th>
                <th className="p-3.5 font-semibold text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((t) => {
                const isRev = t.type === 'receita';
                return (
                  <tr key={t.id} className="hover:bg-[#1C2541]/40 transition">
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 font-bold text-[10px] uppercase px-2 py-0.5 rounded ${
                        isRev ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {isRev ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {t.type}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-white">{t.description}</td>
                    <td className="p-3.5 text-slate-300">{t.category}</td>
                    <td className="p-3.5 font-mono text-slate-400">{t.date}</td>
                    <td className="p-3.5 font-mono uppercase text-[11px] text-slate-400">{t.paymentMethod}</td>
                    <td className="p-3.5 font-bold">
                      <span className={isRev ? 'text-emerald-400' : 'text-slate-200'}>
                        {isRev ? '+' : '-'} {formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        t.status === 'pago' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {t.status === 'pago' ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {t.status === 'pendente' && (
                        <button
                          onClick={() => onUpdateTransaction(t.id, { status: 'pago' })}
                          className="rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-2 py-1 text-[11px] font-semibold"
                        >
                          Dar Baixa
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0B132B] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-1">Novo Lançamento Financeiro</h2>
            <p className="text-xs text-slate-400 mb-4">
              Lançamento com registro auditado para {company.name}.
            </p>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('receita')}
                  className={`p-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                    type === 'receita' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                  Receita
                </button>
                <button
                  type="button"
                  onClick={() => setType('despesa')}
                  className={`p-2 rounded-xl font-bold transition flex items-center justify-center gap-1.5 ${
                    type === 'despesa' ? 'bg-rose-600 text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  <ArrowDownRight className="h-4 w-4" />
                  Despesa
                </button>
              </div>

              <div>
                <label className="text-slate-300 font-medium">Descrição *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Faturamento de vendas, Fornecedor X, Aluguel"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Valor (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="0,00"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Categoria</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ex: Operacional, Insumos"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Meio de Pagamento</label>
                  <select
                    value={paymentMethod}
                    onChange={(e: any) => setPaymentMethod(e.target.value)}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                  >
                    <option value="pix">PIX</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="boleto">Boleto Bancário</option>
                    <option value="transferencia">TED / Transferência</option>
                    <option value="dinheiro">Dinheiro em Espécie</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Situação</label>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                  >
                    <option value="pago">Liquidado / Pago</option>
                    <option value="pendente">Pendente / A Pagar</option>
                  </select>
                </div>
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
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
