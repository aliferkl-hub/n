/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export interface BarDataPoint {
  label: string;
  actual: number;
  projected: number;
}

interface BarComparisonChartProps {
  title: string;
  subtitle?: string;
  data: BarDataPoint[];
  currencyFormatter?: (val: number) => string;
}

export const BarComparisonChart: React.FC<BarComparisonChartProps> = ({
  title,
  subtitle,
  data,
  currencyFormatter = (v) => `R$ ${v.toLocaleString('pt-BR')}`,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxVal = Math.max(...data.map((d) => Math.max(d.actual, d.projected))) * 1.15;

  return (
    <div className="nexora-card p-5 relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-white font-space">{title}</h4>
            {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <div className="flex items-center gap-1.5 text-cyan-300">
              <span className="h-2 w-2 rounded-sm bg-cyan-400" />
              <span>Realizado</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="h-2 w-2 rounded-sm bg-slate-600" />
              <span>Meta Prevista</span>
            </div>
          </div>
        </div>

        {/* Bars Container */}
        <div className="flex items-end justify-between gap-2 h-44 pt-6 pb-2 px-2 border-b border-white/5">
          {data.map((item, i) => {
            const actualHeight = (item.actual / (maxVal || 1)) * 100;
            const projectedHeight = (item.projected / (maxVal || 1)) * 100;
            const isHovered = hoveredIdx === i;

            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Hover Tooltip Callout */}
                {isHovered && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#080E1E] border border-cyan-500/40 px-3 py-1.5 rounded-xl shadow-xl z-20 text-center animate-in fade-in">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">
                      {item.label}
                    </span>
                    <span className="text-xs font-bold text-cyan-300 font-mono tabular-nums block">
                      Realizado: {currencyFormatter(item.actual)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono tabular-nums block">
                      Meta: {currencyFormatter(item.projected)}
                    </span>
                  </div>
                )}

                {/* Bars Pair */}
                <div className="flex items-end justify-center gap-1.5 w-full h-full">
                  {/* Actual bar */}
                  <div
                    className={`w-3 sm:w-4 rounded-t-sm transition-all duration-300 ${
                      item.actual >= item.projected
                        ? 'bg-gradient-to-t from-cyan-600 to-cyan-400'
                        : 'bg-gradient-to-t from-blue-700 to-blue-500'
                    } ${isHovered ? 'brightness-125' : ''}`}
                    style={{ height: `${actualHeight}%` }}
                  />
                  {/* Projected bar */}
                  <div
                    className="w-3 sm:w-4 rounded-t-sm bg-slate-700/60 border-t border-dashed border-slate-400/50 transition-all duration-300"
                    style={{ height: `${projectedHeight}%` }}
                  />
                </div>

                {/* Label */}
                <span className="text-[10px] font-mono text-slate-400 mt-2 truncate max-w-full">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-3">
        <span>Acurácia média de planejamento: <b className="text-white font-mono">94.2%</b></span>
        <span className="text-[11px] text-emerald-400 font-mono">+12.6% vs meta acumulada</span>
      </div>
    </div>
  );
};
