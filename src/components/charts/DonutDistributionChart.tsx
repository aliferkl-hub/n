/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutDistributionChartProps {
  title: string;
  subtitle?: string;
  slices: DonutSlice[];
  currencyFormatter?: (val: number) => string;
}

export const DonutDistributionChart: React.FC<DonutDistributionChartProps> = ({
  title,
  subtitle,
  slices,
  currencyFormatter = (v) => `R$ ${v.toLocaleString('pt-BR')}`,
}) => {
  const [activeSlice, setActiveSlice] = useState<number | null>(null);

  const total = slices.reduce((sum, s) => sum + s.value, 0);

  // SVG dimensions
  const size = 200;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const currentSelection = activeSlice !== null ? slices[activeSlice] : null;

  return (
    <div className="nexora-card p-5 relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white font-space">{title}</h4>
            {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            Total: {currencyFormatter(total)}
          </span>
        </div>

        {/* Donut graphic & center summary */}
        <div className="relative flex items-center justify-center my-4">
          <svg width={size} height={size} className="transform -rotate-90">
            {slices.map((slice, i) => {
              const slicePercent = slice.value / (total || 1);
              const strokeDasharray = `${slicePercent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += slicePercent;

              const isHovered = activeSlice === i;

              return (
                <circle
                  key={i}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => setActiveSlice(i)}
                  onMouseLeave={() => setActiveSlice(null)}
                />
              );
            })}
          </svg>

          {/* Center Callout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
            {currentSelection ? (
              <>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {currentSelection.label}
                </span>
                <span className="text-sm font-extrabold text-white font-space mt-0.5 tabular-nums">
                  {currencyFormatter(currentSelection.value)}
                </span>
                <span className="text-[11px] font-mono text-cyan-300">
                  {((currentSelection.value / (total || 1)) * 100).toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Volume Total
                </span>
                <span className="text-base font-extrabold text-white font-space tabular-nums">
                  {currencyFormatter(total)}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">100% Auditado</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Legend list */}
      <div className="space-y-1.5 pt-3 border-t border-white/5">
        {slices.map((slice, i) => {
          const percent = ((slice.value / (total || 1)) * 100).toFixed(1);
          const isSelected = activeSlice === i;

          return (
            <div
              key={i}
              onMouseEnter={() => setActiveSlice(i)}
              onMouseLeave={() => setActiveSlice(null)}
              className={`flex items-center justify-between text-xs p-1.5 rounded-lg cursor-pointer transition ${
                isSelected ? 'bg-white/5 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="truncate text-[11px] font-medium">{slice.label}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] tabular-nums">
                <span className="text-slate-300">{currencyFormatter(slice.value)}</span>
                <span className="text-slate-500 w-10 text-right">{percent}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
