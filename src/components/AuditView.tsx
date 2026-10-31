/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileCheck2, 
  Activity, 
  Server, 
  CheckCircle,
  Database,
  KeyRound
} from 'lucide-react';
import { Company, AuditLog } from '../types/index.ts';

interface AuditViewProps {
  company: Company;
  auditLogs: AuditLog[];
}

export const AuditView: React.FC<AuditViewProps> = ({
  company,
  auditLogs,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-white">Segurança, Auditoria & LGPD</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Trilha de auditoria imutável e comprovação técnica de isolamento lógico de banco de dados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            <Lock className="h-3.5 w-3.5" />
            Isolamento de Dados Criptográfico
          </span>
        </div>
      </div>

      {/* Security Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Database className="h-4 w-4 text-blue-400" />
            Isolamento Lógico Multitenant
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Todas as transações, contatos e configurações filtram exclusivamente pelo identificador único <code className="text-[#F3C623]">{company.id}</code>. Acesso cruzado bloqueado no nível de roteamento.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <FileCheck2 className="h-4 w-4 text-emerald-400" />
            Conformidade Rigorosa com a LGPD
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Registro explícito de consentimento (opt-in), finalidade de tratamento de dados cadastrais e registro de envio de mensagens no canal WhatsApp.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#1C2541]/50 p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <KeyRound className="h-4 w-4 text-amber-400" />
            Confirmação de Ações Críticas
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Nenhuma ação financeira de valor ou alteração contratual é executada autonomamente pela IA sem a aprovação explícita e autenticada do gestor humano.
          </p>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-white/10 bg-[#0B132B]/90 overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-400" />
              Logs de Atividades Auditadas da Empresa
            </h2>
            <p className="text-xs text-slate-400">
              Registros imutáveis com autor, carimbo de data/hora e endereço IP
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {auditLogs.length} eventos registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1C2541]/60 text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-3.5 font-semibold">Data & Hora</th>
                <th className="p-3.5 font-semibold">Usuário / Sistema</th>
                <th className="p-3.5 font-semibold">Ação Executada</th>
                <th className="p-3.5 font-semibold">Entidade</th>
                <th className="p-3.5 font-semibold">Detalhes Técnicos</th>
                <th className="p-3.5 font-semibold font-mono">IP de Origem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#1C2541]/40 transition">
                  <td className="p-3.5 text-slate-400">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </td>
                  <td className="p-3.5 font-sans font-semibold text-slate-200">
                    {log.userName}
                  </td>
                  <td className="p-3.5">
                    <span className="inline-block rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 font-bold text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-sans text-slate-300">
                    {log.entity}
                  </td>
                  <td className="p-3.5 font-sans text-slate-400 max-w-sm truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
