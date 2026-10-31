/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Target, 
  ShieldCheck, 
  Award, 
  Briefcase, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Company, TeamMember, TeamTask } from '../types/index.ts';

interface TeamViewProps {
  company: Company;
  members: TeamMember[];
  tasks: TeamTask[];
  onCreateMember: (memberData: any) => Promise<void>;
  onCreateTask: (taskData: any) => Promise<void>;
  onUpdateTask: (id: string, updates: any) => Promise<void>;
}

export const TeamView: React.FC<TeamViewProps> = ({
  company,
  members,
  tasks,
  onCreateMember,
  onCreateTask,
  onUpdateTask,
}) => {
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Member form
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('Vendas & Atendimento');
  const [commissionRate, setCommissionRate] = useState(5.0);
  const [salesGoal, setSalesGoal] = useState(50000);

  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState(members[0]?.name || 'Equipe');
  const [priority, setPriority] = useState<'baixa' | 'media' | 'alta' | 'critica'>('alta');

  const formatCurrency = (val: number) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;

    await onCreateMember({
      name,
      role,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@${company.id}.nexora.com`,
      phone: company.contactPhone,
      department,
      commissionRate: Number(commissionRate),
      salesGoalMonth: Number(salesGoal),
      salesCurrentMonth: 0,
      tasksCompleted: 0,
      status: 'ativo',
    });

    setName('');
    setRole('');
    setIsMemberModalOpen(false);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    await onCreateTask({
      title: taskTitle,
      assignedTo,
      priority,
      status: 'pendente',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    });

    setTaskTitle('');
    setIsTaskModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-white font-space">
              NEXORA TEAM — Equipe, Metas & Comissões
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestão de colaboradores, metas de vendas, tarefas prioritárias e comissões automáticas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition"
          >
            + Nova Tarefa
          </button>
          <button
            onClick={() => setIsMemberModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-blue-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Colaborador</span>
          </button>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => {
          const progressPercent = m.salesGoalMonth > 0 ? Math.min(100, Math.round((m.salesCurrentMonth / m.salesGoalMonth) * 100)) : 0;
          const commissionEarned = m.salesCurrentMonth * (m.commissionRate / 100);

          return (
            <div
              key={m.id}
              className="rounded-3xl border border-white/10 bg-[#0B132B]/90 p-5 space-y-4 hover:border-blue-500/40 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{m.name}</h3>
                  <p className="text-[11px] text-blue-300 font-medium">{m.role}</p>
                  <span className="text-[10px] text-slate-400">{m.department}</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {m.status}
                </span>
              </div>

              {/* Sales Goal Meter */}
              <div className="space-y-1.5 bg-white/5 p-3 rounded-2xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium flex items-center gap-1">
                    <Target className="h-3.5 w-3.5 text-blue-400" />
                    Meta de Vendas:
                  </span>
                  <span className="font-mono text-white font-bold">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>Atual: {formatCurrency(m.salesCurrentMonth)}</span>
                  <span>Meta: {formatCurrency(m.salesGoalMonth)}</span>
                </div>
              </div>

              {/* Commission & Tasks stats */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-white/5">
                <div>
                  <span className="text-[10px] text-slate-400">Comissão Acumulada ({m.commissionRate}%):</span>
                  <p className="font-bold text-[#F3C623]">{formatCurrency(commissionEarned)}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400">Tarefas Entregues:</span>
                  <p className="font-bold text-emerald-400 font-mono">{m.tasksCompleted} concluídas</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tasks Board */}
      <div className="rounded-3xl border border-white/10 bg-[#0B132B]/90 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Quadro de Tarefas Operacionais</h2>
            <p className="text-xs text-slate-400">Acompanhamento de entregas prioritárias da equipe</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {tasks.length} tarefas
          </span>
        </div>

        <div className="space-y-2">
          {tasks.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#1C2541]/40 p-3.5 hover:bg-[#1C2541]/70 transition"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onUpdateTask(t.id, {
                    status: t.status === 'concluida' ? 'pendente' : 'concluida',
                  })}
                  className={`flex h-6 w-6 items-center justify-center rounded-lg border transition ${
                    t.status === 'concluida'
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'border-slate-600 text-transparent hover:border-emerald-400'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                </button>
                <div>
                  <p className={`text-xs font-semibold ${t.status === 'concluida' ? 'line-through text-slate-400' : 'text-white'}`}>
                    {t.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                    <span>Responsável: <b className="text-slate-300">{t.assignedTo}</b></span>
                    <span>•</span>
                    <span>Prazo: {t.dueDate}</span>
                  </div>
                </div>
              </div>

              <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                t.priority === 'critica' ? 'bg-rose-500/20 text-rose-300' :
                t.priority === 'alta' ? 'bg-amber-500/20 text-amber-300' :
                'bg-blue-500/20 text-blue-300'
              }`}>
                {t.priority}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Modal */}
      {isMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-blue-500/40 bg-[#0B132B] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-1 font-space">Adicionar Colaborador</h2>
            <p className="text-xs text-slate-400 mb-4">Cadastro de colaborador no ambiente com controle de acesso.</p>

            <form onSubmit={handleCreateMember} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Carlos Albuquerque"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium">Cargo / Função *</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Ex: Vendedor Sênior, Mecânico Líder"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Comissão (%)</label>
                  <input
                    type="number"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Meta Mensal (R$)</label>
                  <input
                    type="number"
                    value={salesGoal}
                    onChange={(e) => setSalesGoal(Number(e.target.value))}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
                >
                  Salvar Colaborador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#0B132B] p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-1 font-space">Nova Tarefa para a Equipe</h2>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs mt-3">
              <div>
                <label className="text-slate-300 font-medium">Descrição da Tarefa *</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Ex: Entregar relatório de conciliação fiscal"
                  className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-medium">Responsável</label>
                  <select
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-medium">Prioridade</label>
                  <select
                    value={priority}
                    onChange={(e: any) => setPriority(e.target.value)}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                  >
                    <option value="critica">Crítica</option>
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
                >
                  Criar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
