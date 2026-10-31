/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  AlertCircle, 
  ExternalLink, 
  Link2, 
  Check, 
  DollarSign, 
  Box, 
  CheckCircle2, 
  QrCode 
} from 'lucide-react';
import { Company, StoreProduct } from '../types/index.ts';

interface StoreViewProps {
  company: Company;
  products: StoreProduct[];
  onCreateProduct: (prodData: any) => Promise<void>;
  onSellProduct: (product: StoreProduct) => Promise<void>;
}

export const StoreView: React.FC<StoreViewProps> = ({
  company,
  products,
  onCreateProduct,
  onSellProduct,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Form states
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [costPrice, setCostPrice] = useState<number | ''>(50);
  const [sellPrice, setSellPrice] = useState<number | ''>(120);
  const [stockQty, setStockQty] = useState<number | ''>(20);
  const [minStockQty, setMinStockQty] = useState<number | ''>(5);
  const [unit, setUnit] = useState('UNIDADE');

  const formatCurrency = (val: number) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleCopyLink = (prod: StoreProduct) => {
    const link = prod.checkoutLink || `https://nexora.app/checkout/${company.id}/${prod.sku}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(prod.id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sellPrice) return;

    const generatedSku = sku || `NEX-${Math.floor(1000 + Math.random() * 9000)}`;

    await onCreateProduct({
      sku: generatedSku,
      name,
      category: category || 'Geral',
      costPrice: Number(costPrice) || 0,
      sellPrice: Number(sellPrice),
      stockQty: Number(stockQty) || 0,
      minStockQty: Number(minStockQty) || 0,
      unit,
      checkoutLink: `https://nexora.app/checkout/${company.id}/${generatedSku}`,
      active: true,
    });

    setName('');
    setSku('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-white font-space">
              NEXORA STORE — Catálogo Digital & Venda Rápida
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Catálogo unificado de produtos e serviços com links de pagamento seguros e frente de caixa.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Cadastrar Item no Catálogo</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl border border-white/10 bg-[#0B132B]/90 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1C2541]/60 text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-3.5 font-semibold">SKU</th>
                <th className="p-3.5 font-semibold">Produto / Serviço</th>
                <th className="p-3.5 font-semibold">Categoria</th>
                <th className="p-3.5 font-semibold">Custo</th>
                <th className="p-3.5 font-semibold">Preço Venda</th>
                <th className="p-3.5 font-semibold">Margem Bruta</th>
                <th className="p-3.5 font-semibold">Estoque</th>
                <th className="p-3.5 font-semibold text-right">Link de Venda & PDV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => {
                const margin = p.sellPrice > 0 ? (((p.sellPrice - p.costPrice) / p.sellPrice) * 100).toFixed(1) : 0;
                const isLowStock = p.stockQty <= p.minStockQty;

                return (
                  <tr key={p.id} className="hover:bg-[#1C2541]/40 transition">
                    <td className="p-3.5 font-mono text-cyan-300 font-bold">{p.sku}</td>
                    <td className="p-3.5 font-bold text-white">{p.name}</td>
                    <td className="p-3.5 text-slate-300">{p.category}</td>
                    <td className="p-3.5 text-slate-400">{formatCurrency(p.costPrice)}</td>
                    <td className="p-3.5 font-bold text-emerald-400 font-mono">{formatCurrency(p.sellPrice)}</td>
                    <td className="p-3.5 text-blue-300 font-medium">{margin}%</td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 font-bold font-mono text-[11px] ${
                        isLowStock ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-slate-800 text-slate-200'
                      }`}>
                        {p.stockQty} {p.unit}
                        {isLowStock && <AlertCircle className="h-3 w-3 text-rose-400" />}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleCopyLink(p)}
                        className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-2 py-1 text-[11px] text-slate-300 inline-flex items-center gap-1"
                        title="Copiar link de pagamento"
                      >
                        {copiedLink === p.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Link2 className="h-3 w-3" />}
                        <span>{copiedLink === p.id ? 'Copiado!' : 'Link'}</span>
                      </button>

                      <button
                        onClick={() => onSellProduct(p)}
                        className="rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold"
                      >
                        Venda Balcão (PDV)
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-cyan-500/40 bg-[#0B132B] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-1 font-space">Novo Item no Catálogo</h2>
            <p className="text-xs text-slate-400 mb-4">Adicione um item para vendas físicas e digitais.</p>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Nome do Produto ou Serviço *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Consulta Médica / Camisa / Troca de Óleo"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Categoria</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ex: Serviços / Premium"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Código SKU (Opcional)</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Gerado automático"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Custo de Aquisição (R$)</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Preço de Venda (R$) *</label>
                  <input
                    type="number"
                    required
                    value={sellPrice}
                    onChange={(e) => setSellPrice(Number(e.target.value))}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Quantidade em Estoque</label>
                  <input
                    type="number"
                    value={stockQty}
                    onChange={(e) => setStockQty(Number(e.target.value))}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Estoque Mínimo de Alerta</label>
                  <input
                    type="number"
                    value={minStockQty}
                    onChange={(e) => setMinStockQty(Number(e.target.value))}
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
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-white hover:brightness-110"
                >
                  Salvar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
