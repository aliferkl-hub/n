/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Gift, 
  Percent, 
  Coins, 
  Share2, 
  Plus, 
  Tag, 
  Users, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Company, LoyaltyCoupon, LoyaltyConfig, Client } from '../types/index.ts';

interface LoyaltyViewProps {
  company: Company;
  coupons: LoyaltyCoupon[];
  config: LoyaltyConfig;
  clients: Client[];
  onCreateCoupon: (couponData: any) => Promise<void>;
  onTriggerWhatsApp: (recipient: string, message: string) => void;
}

export const LoyaltyView: React.FC<LoyaltyViewProps> = ({
  company,
  coupons,
  config,
  clients,
  onCreateCoupon,
  onTriggerWhatsApp,
}) => {
  const [cashbackRate, setCashbackRate] = useState(config.cashbackPercent || 5.0);
  const [pointsRate, setPointsRate] = useState(config.pointsPerReal || 1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New coupon form
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState(10);
  const [newMinSpend, setNewMinSpend] = useState(100);

  const formatCurrency = (val: number) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const totalPointsDistributed = clients.reduce((s, c) => s + (c.loyaltyPoints || 0), 0);
  const totalCashbackReserved = clients.reduce((s, c) => s + (c.cashbackBalance || 0), 0);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;

    await onCreateCoupon({
      code: newCode.toUpperCase(),
      discountType: 'percentage',
      discountValue: Number(newDiscount),
      minSpend: Number(newMinSpend),
      active: true,
      usageCount: 0,
      expiresAt: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    });

    setNewCode('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400">
              <Gift className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-white font-space">
              NEXORA FIDELIDADE — Cashback & Recompensas
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mecanismo de retenção automática com cashback em saldo, pontos e cupons promocionais.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 px-4 py-2 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-pink-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Criar Novo Cupom</span>
        </button>
      </div>

      {/* Program Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-semibold tracking-wider">Cashback Configurável</span>
            <Percent className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-emerald-400 font-mono">{cashbackRate}%</span>
            <span className="text-[10px] text-slate-400">Retorno em compras</span>
          </div>
          <p className="text-[10px] text-slate-400">Saldo retido em carteira: <b>{formatCurrency(totalCashbackReserved)}</b></p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-semibold tracking-wider">Pontos Fidelidade</span>
            <Coins className="h-4 w-4 text-[#F3C623]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[#F3C623] font-mono">{pointsRate} pt / R$ 1</span>
            <span className="text-[10px] text-slate-400">Conversão direta</span>
          </div>
          <p className="text-[10px] text-slate-400">Pontos em circulação: <b>{totalPointsDistributed.toLocaleString()} pts</b></p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="uppercase font-semibold tracking-wider">Bônus por Indicação</span>
            <Share2 className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-cyan-400 font-mono">R$ 25,00</span>
            <span className="text-[10px] text-slate-400">Para cada amigo</span>
          </div>
          <p className="text-[10px] text-slate-400">Ativado quando o indicado realiza primeira compra</p>
        </div>
      </div>

      {/* Coupons List */}
      <div className="rounded-3xl border border-white/10 bg-[#0B132B]/90 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Cupons Promocionais Ativos</h2>
            <p className="text-xs text-slate-400">Códigos validados automaticamente no checkout ou WhatsApp</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {coupons.length} cupons cadastrados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-dashed border-[#D4AF37]/40 bg-[#1C2541]/60 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-extrabold text-[#F3C623] tracking-widest bg-black/40 px-2.5 py-1 rounded-lg border border-[#D4AF37]/30">
                  {c.code}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-500/20 text-emerald-300">
                  Ativo
                </span>
              </div>

              <div className="text-xs text-slate-200">
                <p className="font-bold text-white">{c.discountValue}% de Desconto</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Válido para compras acima de {formatCurrency(c.minSpend)}</p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                <span>Usado {c.usageCount} vezes</span>
                <span>Expira em: {c.expiresAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reengagement Table */}
      <div className="rounded-3xl border border-white/10 bg-[#0B132B]/90 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Clientes com Saldo de Cashback Disponível</h2>
            <p className="text-xs text-slate-400">Oportunidade para incentivar retorno ao salão ou nova compra</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1C2541]/60 text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-3 font-semibold">Cliente</th>
                <th className="p-3 font-semibold">Telefone</th>
                <th className="p-3 font-semibold">Saldo Cashback</th>
                <th className="p-3 font-semibold">Pontos Acumulados</th>
                <th className="p-3 font-semibold text-right">Ação de Reativação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clients.map((cli) => (
                <tr key={cli.id} className="hover:bg-[#1C2541]/40 transition">
                  <td className="p-3 font-semibold text-white">{cli.name}</td>
                  <td className="p-3 font-mono text-slate-400">{cli.phone}</td>
                  <td className="p-3 font-bold text-emerald-400">{formatCurrency(cli.cashbackBalance || 50)}</td>
                  <td className="p-3 font-mono text-[#F3C623]">{cli.loyaltyPoints || 100} pts</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onTriggerWhatsApp(cli.phone, `Olá ${cli.name}! Você tem ${formatCurrency(cli.cashbackBalance || 50)} em cashback acumulado na ${company.name} esperando por você. Que tal aproveitar essa semana?`)}
                      className="rounded-lg bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30 px-2.5 py-1 text-[11px] font-semibold"
                    >
                      Avisar via WhatsApp
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add coupon modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-pink-500/40 bg-[#0B132B] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-1 font-space">Novo Cupom de Desconto</h2>
            <p className="text-xs text-slate-400 mb-4">Crie um cupom exclusivo para campanhas de marketing ou fidelização.</p>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Código do Cupom *</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="Ex: NEXORA-CLIENTE10"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Desconto (%)</label>
                  <input
                    type="number"
                    value={newDiscount}
                    onChange={(e) => setNewDiscount(Number(e.target.value))}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Gasto Mínimo (R$)</label>
                  <input
                    type="number"
                    value={newMinSpend}
                    onChange={(e) => setNewMinSpend(Number(e.target.value))}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white font-mono"
                  />
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
                  className="rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 px-4 py-2 text-xs font-bold text-white hover:brightness-110"
                >
                  Criar Cupom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
