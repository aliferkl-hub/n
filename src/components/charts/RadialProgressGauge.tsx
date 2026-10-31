/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface RadialProgressGaugeProps {
  title: string;
  subtitle?: string;
  current: number;
  target: number;
  unitPrefix?: string;
  unitSuffix?: string;
  color?: string;
}

export const RadialProgressGauge: React.FC<RadialProgressGaugeProps> = ({
  title,
  subtitle,
  current,
  target,
  unitPrefix = '',
  unitSuffix = '',
  color = '#06B6D4',
}) => {
  const percentage = Math.min(Math.round((current / (target || 1)) * 100), 100);

  // SVG parameters
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="nexora-card p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          {title}
        </span>
        <div className="text-xl font-bold text-white font-space mt-0.5 tabular-nums">
          {unitPrefix}{current.toLocaleString('pt-BR')}{unitSuffix}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Meta: <span className="text-slate-300 font-mono">{unitPrefix}{target.toLocaleString('pt-BR')}{unitSuffix}</span>
        </p>
        {subtitle && <p className="text-[10px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      {/* Circular Gauge */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Progress stroke */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-sm font-extrabold text-white font-mono tabular-nums">
            {percentage}%
          </span>
          <span className="text-[9px] text-slate-400 uppercase tracking-tighter">
            Alcançado
          </span>
        </div>
      </div>
    </div>
  );
};
