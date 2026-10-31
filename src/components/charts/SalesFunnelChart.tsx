/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Filter, ArrowDown, ChevronRight } from 'lucide-react';

export interface FunnelStageData {
  id: string;
  label: string;
  count: number;
  value: number;
}

interface SalesFunnelChartProps {
  stages: FunnelStageData[];
  onStageClick?: (stageId: string) => void;
  currencyFormatter?: (val: number) => string;
}

export const SalesFunnelChart: React.FC<SalesFunnelChartProps> = ({
  stages,
  onStageClick,
  currencyFormatter = (v) => `R$ ${v.toLocaleString('pt-BR')}`,
}) => {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  const topCount = stages.length > 0 ? stages[0].count : 1;
  const wonStage = stages[stages.length - 1];
  const overallConversion = topCount > 0 ? ((wonStage.count / topCount) * 100).toFixed(1) : '0.0';

  return (
    <div className="nexora-card p-5 relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Funil de Vendas</span>
              <span aria-hidden="true">·</span>
              <span>Conversão Comercial</span>
            </div>
            <h4 className="text-sm font-bold text-white font-space mt-0.5">
              Passagem por Etapa do Pipeline
            </h4>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase block font-mono">Taxa Global</span>
            <span className="text-sm font-extrabold text-cyan-300 font-mono">{overallConversion}%</span>
          </div>
        </div>

        {/* Funnel Visual Bars */}
        <div className="space-y-2.5">
          {stages.map((stage, i) => {
            const nextStage = stages[i + 1];
            const dropoffPercent = nextStage 
              ? (100 - (nextStage.count / (stage.count || 1)) * 100).toFixed(0) 
              : null;

            // Width percentage calculated relative to top stage
            const widthRatio = Math.max((stage.count / (topCount || 1)) * 100, 22);
            const isHovered = hoveredStage === stage.id;

            return (
              <div
                key={stage.id}
                onMouseEnter={() => setHoveredStage(stage.id)}
                onMouseLeave={() => setHoveredStage(null)}
                onClick={() => onStageClick && onStageClick(stage.id)}
                className="group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300 group-hover:text-cyan-300 transition-colors">
                    {stage.label}
                  </span>
                  <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px] tabular-nums">
                    <span className="text-slate-200 font-bold">{stage.count} oportunidades</span>
                    <span>{currencyFormatter(stage.value)}</span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="h-5 w-full bg-[#080E1C] rounded-lg overflow-hidden border border-white/5 relative flex items-center">
                  <div
                    className={`h-full transition-all duration-300 rounded-md ${
                      i === stages.length - 1
                        ? 'bg-gradient-to-r from-emerald-500/80 to-emerald-400'
                        : i === 0
                        ? 'bg-gradient-to-r from-cyan-600/70 to-cyan-400/80'
                        : 'bg-gradient-to-r from-blue-600/70 to-indigo-500/70'
                    } ${isHovered ? 'brightness-125' : ''}`}
                    style={{ width: `${widthRatio}%` }}
                  />
                  <span className="absolute left-2.5 text-[10px] font-bold text-white/90 drop-shadow">
                    {((stage.count / (topCount || 1)) * 100).toFixed(0)}% do topo
                  </span>
                </div>

                {/* Step drop-off indicator */}
                {dropoffPercent !== null && (
                  <div className="flex items-center justify-center my-0.5 text-[10px] text-slate-500 gap-1">
                    <ArrowDown className="h-2.5 w-2.5 text-slate-600" />
                    <span>Drop-off: {dropoffPercent}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
        <span className="text-[11px]">Clique em uma etapa para filtrar no CRM</span>
        <span className="text-[11px] text-cyan-400 flex items-center gap-0.5">
          Ver Pipeline <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
};
