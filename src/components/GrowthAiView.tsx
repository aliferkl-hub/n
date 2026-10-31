/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle, 
  DollarSign, 
  BarChart, 
  Target,
  Clock,
  Layers,
  Send
} from 'lucide-react';
import { Company, GrowthOpportunity } from '../types/index.ts';
import { fetchGrowthDiagnostic } from '../services/api.ts';

interface GrowthAiViewProps {
  company: Company;
  growthOpportunities: GrowthOpportunity[];
  onTriggerWhatsApp: (recipient: string, message: string) => void;
  onExecuteAction: (proposal: any) => Promise<void>;
}

export const GrowthAiView: React.FC<GrowthAiViewProps> = ({
  company,
  growthOpportunities,
  onTriggerWhatsApp,
  onExecuteAction,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>('');
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const strategicQuestions = [
    'Como vender mais neste mês?',
    'Quais clientes estão inativos há mais de 45 dias?',
    'Onde estou gastando acima do recomendado?',
    'Quais orçamentos comerciais não foram fechados?',
    'Como conquistar novos clientes qualificados?',
    'Qual campanha de marketing devo realizar agora?',
  ];

  const handleRunDiagnostic = async (question: string) => {
    setSelectedQuestion(question);
    setLoading(true);
    try {
      const res = await fetchGrowthDiagnostic(company.id, question);
      setDiagnosticResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-[#0F1E3D] via-[#0A1128] to-[#0F1E3D] p-6 shadow-[0_0_50px_rgba(0,240,255,0.15)]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1.5 rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/40">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                Motor de Inteligência de Crescimento
              </span>
              <span className="text-xs text-slate-400">
                Base Analítica de Dados Reais
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-white font-space">
              NEXORA GROWTH AI
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Diagnósticos preditivos, planos de ação orientados por dados e estratégias de aceleração de receita para a {company.name}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-right">
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Potencial Mapeado</span>
              <p className="text-xl font-bold text-emerald-400 font-space">+ R$ 26.390,00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Questions Bar */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Selecione uma Pergunta Estratégica para o Algoritmo:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {strategicQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleRunDiagnostic(q)}
              className={`rounded-2xl border p-3 text-left text-xs font-medium transition flex items-center justify-between ${
                selectedQuestion === q
                  ? 'border-cyan-400 bg-cyan-500/15 text-white shadow-md shadow-cyan-500/10'
                  : 'border-white/10 bg-[#0B132B]/80 text-slate-300 hover:border-cyan-500/30 hover:bg-[#1C2541]'
              }`}
            >
              <span>{q}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-cyan-400 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Diagnostic Interactive Terminal */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 rounded-3xl border border-white/10 bg-[#0B132B]/90">
          <Sparkles className="h-8 w-8 text-cyan-400 animate-spin" />
          <p className="text-xs font-semibold text-white">NEXORA Growth AI processando correlações financeiras e operacionais...</p>
          <span className="text-[11px] text-slate-400">Verificando inadimplência, pipeline de vendas e giro de clientes em tempo real.</span>
        </div>
      )}

      {diagnosticResult && !loading && (
        <div className="rounded-3xl border border-cyan-500/40 bg-[#0B132B]/95 p-6 space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                Diagnóstico Estratégico Concluído
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                "{selectedQuestion}"
              </h3>
            </div>
            <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl">
              Ganho Estimado: {diagnosticResult.potentialGain}
            </span>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#1C2541]/70 p-4">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1">
              1. Causa Raiz & Oportunidade Identificada:
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              {diagnosticResult.insight}
            </p>
          </div>

          {/* Action Steps */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              2. Plano de Ação Estruturado (Passo a Passo):
            </h4>
            <div className="space-y-2">
              {diagnosticResult.actionSteps?.map((step: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 rounded-xl border border-white/5 bg-[#1C2541]/40 p-3 text-xs text-slate-200">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 font-bold font-mono text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Before & After comparison */}
          {diagnosticResult.comparativeBeforeAfter && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase">Projeção Comparativa (Antes vs Depois)</span>
                <p className="text-slate-200 font-medium mt-0.5">{diagnosticResult.comparativeBeforeAfter}</p>
              </div>
              <button
                onClick={() => onExecuteAction({
                  actionType: 'create_campaign',
                  title: `Plano de Ação: ${selectedQuestion}`,
                  payload: { details: diagnosticResult.actionSteps },
                })}
                className="shrink-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-bold text-white hover:brightness-110 shadow"
              >
                Aprovar & Iniciar Execução
              </button>
            </div>
          )}
        </div>
      )}

      {/* Persistent Growth Opportunities Table */}
      <div className="rounded-3xl border border-white/10 bg-[#0B132B]/90 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Oportunidades de Receita Mapeadas</h2>
            <p className="text-xs text-slate-400">Calculadas continuamente a partir do fluxo de transações e clientes</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {growthOpportunities.length} prontas para execução
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {growthOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="rounded-2xl border border-white/10 bg-[#1C2541]/60 p-4 space-y-3 flex flex-col justify-between hover:border-cyan-500/40 transition"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-cyan-300 font-bold mb-1.5">
                  <span>OPORTUNIDADE RECOMENDADA</span>
                  <span className="text-emerald-400 font-mono">+{formatCurrency(opp.potentialRevenueGain)}</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-2 leading-snug">
                  {opp.question}
                </h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {opp.insight}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Ação de impacto rápido</span>
                <button
                  onClick={() => handleRunDiagnostic(opp.question)}
                  className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Executar</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
