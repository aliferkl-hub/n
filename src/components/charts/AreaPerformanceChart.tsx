/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TrendingUp, Calendar, Filter } from 'lucide-react';

export type Timeframe = 'today' | '7d' | '30d' | 'year';

interface DataPoint {
  label: string;
  revenue: number;
  expense: number;
}

interface AreaPerformanceChartProps {
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  currencyFormatter?: (val: number) => string;
}

export const AreaPerformanceChart: React.FC<AreaPerformanceChartProps> = ({
  timeframe,
  onTimeframeChange,
  currencyFormatter = (v) => `R$ ${v.toLocaleString('pt-BR')}`,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [showRevenue, setShowRevenue] = useState(true);
  const [showExpense, setShowExpense] = useState(true);

  // Timeframe datasets based on realistic company cycles
  const datasets: Record<Timeframe, DataPoint[]> = {
    today: [
      { label: '08:00', revenue: 1450, expense: 420 },
      { label: '10:00', revenue: 3820, expense: 980 },
      { label: '12:00', revenue: 8940, expense: 2150 },
      { label: '14:00', revenue: 12400, expense: 3400 },
      { label: '16:00', revenue: 18200, expense: 4600 },
      { label: '18:00', revenue: 24650, expense: 6200 },
      { label: '20:00', revenue: 29800, expense: 7100 },
    ],
    '7d': [
      { label: 'Seg', revenue: 14200, expense: 4800 },
      { label: 'Ter', revenue: 18600, expense: 5200 },
      { label: 'Qua', revenue: 22400, expense: 6100 },
      { label: 'Qui', revenue: 27900, expense: 7300 },
      { label: 'Sex', revenue: 35800, expense: 9200 },
      { label: 'Sáb', revenue: 42100, expense: 11400 },
      { label: 'Dom', revenue: 38900, expense: 8800 },
    ],
    '30d': [
      { label: 'Sem 1', revenue: 58400, expense: 18200 },
      { label: 'Sem 2', revenue: 74200, expense: 22100 },
      { label: 'Sem 3', revenue: 89500, expense: 26800 },
      { label: 'Sem 4', revenue: 112800, expense: 32400 },
    ],
    year: [
      { label: 'Jan', revenue: 125000, expense: 48000 },
      { label: 'Fev', revenue: 138000, expense: 52000 },
      { label: 'Mar', revenue: 162000, expense: 58000 },
      { label: 'Abr', revenue: 178000, expense: 61000 },
      { label: 'Mai', revenue: 195000, expense: 64000 },
      { label: 'Jun', revenue: 224000, expense: 71000 },
      { label: 'Jul', revenue: 248000, expense: 76000 },
      { label: 'Ago', revenue: 271000, expense: 82000 },
      { label: 'Set', revenue: 295000, expense: 89000 },
      { label: 'Out', revenue: 328000, expense: 95000 },
    ],
  };

  const data = datasets[timeframe];
  const maxVal = Math.max(...data.map((d) => Math.max(d.revenue, d.expense))) * 1.15;

  // Chart coordinates
  const svgWidth = 720;
  const svgHeight = 260;
  const paddingX = 40;
  const paddingY = 30;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingY * 2;

  const getX = (index: number) => paddingX + (index / (data.length - 1)) * chartWidth;
  const getY = (val: number) => paddingY + chartHeight - (val / maxVal) * chartHeight;

  // Generate smooth SVG paths
  const revenuePoints = data.map((d, i) => ({ x: getX(i), y: getY(d.revenue) }));
  const expensePoints = data.map((d, i) => ({ x: getX(i), y: getY(d.expense) }));

  const createSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    return points.reduce((acc, point, i, arr) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const prev = arr[i - 1];
      const cx1 = prev.x + (point.x - prev.x) / 2;
      const cy1 = prev.y;
      const cx2 = prev.x + (point.x - prev.x) / 2;
      const cy2 = point.y;
      return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${point.x},${point.y}`;
    }, '');
  };

  const revenueLinePath = createSmoothPath(revenuePoints);
  const expenseLinePath = createSmoothPath(expensePoints);

  const revenueAreaPath = `${revenueLinePath} L ${getX(data.length - 1)},${paddingY + chartHeight} L ${getX(0)},${paddingY + chartHeight} Z`;
  const expenseAreaPath = `${expenseLinePath} L ${getX(data.length - 1)},${paddingY + chartHeight} L ${getX(0)},${paddingY + chartHeight} Z`;

  const activePoint = hoverIndex !== null ? data[hoverIndex] : data[data.length - 1];
  const activeNetProfit = activePoint.revenue - activePoint.expense;

  return (
    <div className="nexora-card p-5 sm:p-6 relative overflow-hidden">
      {/* Header with Title, Series Toggles and Timeframe Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Desempenho Financeiro</span>
            <span aria-hidden="true">·</span>
            <span>Evolução Real de Fluxo</span>
          </div>
          <h3 className="text-lg font-bold text-white font-space mt-0.5">
            Faturamento vs Despesas Operacionais
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Series Toggles */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowRevenue(!showRevenue)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition ${
                showRevenue 
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' 
                  : 'border-white/5 bg-transparent text-slate-500'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span>Receitas</span>
            </button>
            <button
              onClick={() => setShowExpense(!showExpense)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition ${
                showExpense 
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-300' 
                  : 'border-white/5 bg-transparent text-slate-500'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              <span>Despesas</span>
            </button>
          </div>

          {/* Timeframe Selectors */}
          <div className="flex items-center bg-[#070D1A] border border-white/10 rounded-xl p-0.5">
            {[
              { id: 'today', label: 'Hoje' },
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: 'year', label: 'Ano' },
            ].map((tf) => (
              <button
                key={tf.id}
                onClick={() => onTimeframeChange(tf.id as Timeframe)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  timeframe === tf.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI highlight ribbon for inspected point */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 rounded-xl bg-[#091022] border border-white/5">
        <div>
          <span className="text-[11px] text-slate-400 block">Ponto em Análise</span>
          <span className="text-xs font-bold text-slate-200 font-mono">{activePoint.label}</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block">Receita no Ponto</span>
          <span className="text-sm font-bold text-cyan-300 font-mono tabular-nums">
            {currencyFormatter(activePoint.revenue)}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block">Margem Líquida</span>
          <span className={`text-sm font-bold font-mono tabular-nums ${activeNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {currencyFormatter(activeNetProfit)}
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[500px]"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingY + chartHeight * ratio;
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4 4"
                />
              </g>
            );
          })}

          {/* Expense Area & Line */}
          {showExpense && (
            <>
              <path d={expenseAreaPath} fill="url(#expenseGrad)" />
              <path
                d={expenseLinePath}
                fill="none"
                stroke="#F43F5E"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Revenue Area & Line */}
          {showRevenue && (
            <>
              <path d={revenueAreaPath} fill="url(#revenueGrad)" />
              <path
                d={revenueLinePath}
                fill="none"
                stroke="#06B6D4"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Interactive vertical hover scrub and data markers */}
          {data.map((d, i) => {
            const x = getX(i);
            const isHovered = hoverIndex === i;

            return (
              <g key={i} className="cursor-pointer" onMouseEnter={() => setHoverIndex(i)}>
                {/* Transparent hit area */}
                <rect
                  x={x - (chartWidth / (data.length - 1)) / 2}
                  y={paddingY}
                  width={chartWidth / (data.length - 1)}
                  height={chartHeight}
                  fill="transparent"
                />

                {/* X Axis Label */}
                <text
                  x={x}
                  y={svgHeight - 10}
                  textAnchor="middle"
                  className={`text-[11px] font-mono transition-colors ${
                    isHovered ? 'fill-cyan-300 font-bold' : 'fill-slate-400'
                  }`}
                >
                  {d.label}
                </text>

                {/* Hover vertical line and markers */}
                {isHovered && (
                  <>
                    <line
                      x1={x}
                      y1={paddingY}
                      x2={x}
                      y2={paddingY + chartHeight}
                      stroke="rgba(6, 182, 212, 0.4)"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />

                    {showRevenue && (
                      <circle
                        cx={x}
                        cy={getY(d.revenue)}
                        r="5"
                        fill="#06B6D4"
                        stroke="#060B14"
                        strokeWidth="2"
                      />
                    )}

                    {showExpense && (
                      <circle
                        cx={x}
                        cy={getY(d.expense)}
                        r="5"
                        fill="#F43F5E"
                        stroke="#060B14"
                        strokeWidth="2"
                      />
                    )}
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
