/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  GraduationCap, 
  PlayCircle, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Company, AcademyCourse } from '../types/index.ts';

interface AcademyViewProps {
  company: Company;
  courses: AcademyCourse[];
}

export const AcademyView: React.FC<AcademyViewProps> = ({
  company,
  courses,
}) => {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <GraduationCap className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-white font-space">
              NEXORA ACADEMY — Capacitação & Playbooks Empresariais
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cursos operacionais, playbooks de vendas, padronização de processos e certificações para sua equipe.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#F3C623] bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-3 py-1.5 rounded-xl">
            <Award className="h-3.5 w-3.5" />
            Certificação Oficial NEXORA
          </span>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course) => (
          <div
            key={course.id}
            className="rounded-3xl border border-white/10 bg-[#0B132B]/90 p-5 space-y-4 flex flex-col justify-between hover:border-indigo-500/40 transition shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                  {course.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="h-3.5 w-3.5" />
                  {course.duration}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">
                {course.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {course.description}
              </p>

              {/* Progress bar */}
              <div className="space-y-1.5 bg-white/5 p-3 rounded-2xl">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Progresso da Equipe:</span>
                  <span className="font-mono text-cyan-300 font-bold">{course.progressPercent}%</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all"
                    style={{ width: `${course.progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>{course.modulesCount} módulos práticos</span>
                  <span className="text-[#F3C623] font-semibold">Distintivo: {course.badge}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">Disponível para todos os colaboradores</span>
              <button
                onClick={() => setActiveCourseId(course.id)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/30 px-3.5 py-1.5 text-xs font-bold transition"
              >
                <PlayCircle className="h-4 w-4" />
                <span>Acessar Playbook</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Operational Playbooks Strip */}
      <div className="rounded-3xl border border-white/10 bg-[#0B132B]/90 p-5 space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-cyan-400" />
          Manuais Operacionais Personalizados para {company.name}
        </h2>
        <p className="text-xs text-slate-400">
          Guias rápidos gerados com inteligência artificial para treinar novos funcionários no segmento de {company.segment}.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl border border-white/5 bg-[#1C2541]/50 text-xs">
            <span className="font-bold text-white block mb-1">Manual de Atendimento WhatsApp</span>
            <p className="text-[11px] text-slate-400">Roteiro padrão de respostas, tom de voz e envio de link de pagamento.</p>
          </div>
          <div className="p-3.5 rounded-2xl border border-white/5 bg-[#1C2541]/50 text-xs">
            <span className="font-bold text-white block mb-1">Guia de Fechamento de Vendas</span>
            <p className="text-[11px] text-slate-400">Como lidar com objeções de preço e negociar condições sem perder margem.</p>
          </div>
          <div className="p-3.5 rounded-2xl border border-white/5 bg-[#1C2541]/50 text-xs">
            <span className="font-bold text-white block mb-1">Protocolo LGPD & Dados do Cliente</span>
            <p className="text-[11px] text-slate-400">Termo de consentimento, registro de opt-in e sigilo de informações cadastrais.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
