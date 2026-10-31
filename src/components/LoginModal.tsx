/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  Sparkles, 
  KeyRound, 
  X, 
  CheckCircle2, 
  Mail, 
  ArrowRight,
  Crown,
  Building2,
  Fingerprint
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginAsMaster: () => void;
  onLoginAsCompany: (companyId: string) => void;
  companies: any[];
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginAsMaster,
  onLoginAsCompany,
  companies,
}) => {
  const [mode, setMode] = useState<'login' | 'recovery'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

  if (!isOpen) return null;

  const handleRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setRecoverySuccess(true);
    setTimeout(() => {
      setRecoverySuccess(false);
      setMode('login');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-in fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-[#0F1E3D] via-[#0A1128] to-[#050811] p-6 sm:p-8 shadow-[0_0_60px_rgba(0,240,255,0.15)]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Branding header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1C2541] to-[#0B132B] border border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.25)] mb-3">
            <span className="font-cinzel text-xl font-extrabold text-[#F3C623]">N</span>
          </div>
          <h2 className="font-space text-lg font-bold tracking-wider text-white">
            NEXORA BUSINESS
          </h2>
          <p className="text-[11px] text-cyan-400 tracking-wide mt-0.5">
            Acesso Restrito & Autenticação Criptográfica
          </p>
        </div>

        {mode === 'login' ? (
          <div className="space-y-4">
            {/* Quick Access Roles */}
            <div className="p-3 rounded-2xl border border-white/10 bg-white/5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Perfis Rápidos de Demonstração Segura:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onLoginAsMaster();
                    onClose();
                  }}
                  className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 p-2 text-left hover:bg-amber-500/20 transition"
                >
                  <Crown className="h-4 w-4 text-[#F3C623] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-amber-300 truncate">Alifer Madeiro</p>
                    <p className="text-[9px] text-slate-400">Master Owner</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (companies[0]) onLoginAsCompany(companies[0].id);
                    onClose();
                  }}
                  className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-2 text-left hover:bg-cyan-500/20 transition"
                >
                  <Building2 className="h-4 w-4 text-cyan-300 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-cyan-300 truncate">Gestor Tenant</p>
                    <p className="text-[9px] text-slate-400">Empresa Ativa</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Standard Credential Form */}
            <form onSubmit={(e) => { e.preventDefault(); onClose(); }} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">E-mail Corporativo</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="gestor@empresa.com.br"
                    className="w-full rounded-xl border border-white/10 bg-[#0B132B] pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-300 font-medium">
                  <span>Senha</span>
                  <button
                    type="button"
                    onClick={() => setMode('recovery')}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-white/10 bg-[#0B132B] pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 py-2.5 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-cyan-500/20 transition"
                >
                  <Fingerprint className="h-4 w-4" />
                  <span>Autenticar no Ambiente Seguro</span>
                </button>
              </div>
            </form>

            <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Conexão criptografada ponta a ponta com token LGPD</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRecovery} className="space-y-4 text-xs">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Recuperação de Acesso</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Informe o e-mail cadastrado na sua empresa. Enviaremos um link de autenticação segura de uso único.
              </p>
            </div>

            <div>
              <label className="text-slate-300 font-medium">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu-email@dominio.com.br"
                className="w-full mt-1 rounded-xl border border-white/10 bg-[#0B132B] p-2.5 text-white"
              />
            </div>

            {recoverySuccess && (
              <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>Instruções de redefinição enviadas com sucesso!</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-slate-400 hover:text-white"
              >
                Voltar ao Login
              </button>

              <button
                type="submit"
                className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400"
              >
                Enviar Link Seguro
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
