/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  UtensilsCrossed, 
  Wrench, 
  Stethoscope, 
  Home, 
  ShoppingBag, 
  Briefcase, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Eye, 
  Send, 
  FileText,
  Car,
  UserCheck,
  Building,
  Box,
  Layers
} from 'lucide-react';
import { 
  Company, 
  RestaurantTable, 
  WorkshopWorkOrder, 
  ClinicAppointment, 
  RealEstateProperty, 
  RetailProduct, 
  ServiceContract 
} from '../types/index.ts';

interface SegmentViewProps {
  company: Company;
  restaurantTables: RestaurantTable[];
  workshopOrders: WorkshopWorkOrder[];
  clinicAppointments: ClinicAppointment[];
  realEstateProperties: RealEstateProperty[];
  retailProducts: RetailProduct[];
  serviceContracts: ServiceContract[];
  onUpdateEntity: (collection: string, id: string, data: any) => Promise<void>;
  onCreateEntity: (collection: string, data: any) => Promise<void>;
  onTriggerWhatsApp: (recipient: string, message: string) => void;
}

export const SegmentView: React.FC<SegmentViewProps> = ({
  company,
  restaurantTables,
  workshopOrders,
  clinicAppointments,
  realEstateProperties,
  retailProducts,
  serviceContracts,
  onUpdateEntity,
  onCreateEntity,
  onTriggerWhatsApp,
}) => {
  const [modalType, setModalType] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form states for adding items
  const [newTableName, setNewTableName] = useState('');
  const [newTableSeats, setNewTableSeats] = useState(4);
  const [newOsPlate, setNewOsPlate] = useState('');
  const [newOsModel, setNewOsModel] = useState('');
  const [newOsClient, setNewOsClient] = useState('');
  const [newOsProblem, setNewOsProblem] = useState('');
  const [newOsValue, setNewOsValue] = useState(500);

  const formatCurrency = (val: number) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // 1. RESTAURANTE VIEW
  if (company.segment === 'restaurante') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <UtensilsCrossed className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold text-white">Salão de Mesas & Comandas</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Controle em tempo real de ocupação de salão, comandas eletrônicas e consumo.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              Ocupação: <b className="text-white">
                {restaurantTables.filter(t => t.status === 'ocupada').length} / {restaurantTables.length} mesas
              </b>
            </span>
            <button
              onClick={() => {
                const nextNum = restaurantTables.length + 1;
                onCreateEntity('restaurantTables', {
                  number: nextNum,
                  capacity: 4,
                  status: 'livre',
                  currentBillTotal: 0,
                  items: [],
                });
              }}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3C623] px-3.5 py-2 text-xs font-semibold text-slate-950 hover:brightness-110 shadow"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Mesa</span>
            </button>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {restaurantTables.map((table) => {
            const isFree = table.status === 'livre';
            const isOccupied = table.status === 'ocupada';
            const isClosing = table.status === 'fechando';
            const isReserved = table.status === 'reservada';

            return (
              <div
                key={table.id}
                className={`rounded-2xl border p-4 transition-all ${
                  isOccupied
                    ? 'border-amber-500/50 bg-[#1C2541]/90 shadow-lg shadow-amber-500/5'
                    : isClosing
                    ? 'border-indigo-500/50 bg-indigo-950/40'
                    : isReserved
                    ? 'border-blue-500/40 bg-blue-950/30'
                    : 'border-white/10 bg-[#0B132B]/70'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white font-mono">
                      #{table.number}
                    </span>
                    <span className="text-xs text-slate-400">{table.capacity} lugares</span>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                    isOccupied ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    isClosing ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' :
                    isReserved ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {table.status}
                  </span>
                </div>

                {isOccupied || isClosing ? (
                  <div className="space-y-2 mb-4">
                    <div className="text-xs text-slate-300 font-medium truncate">
                      {table.currentCustomerName || 'Comensal sem identificação'}
                    </div>
                    <div className="text-lg font-bold text-amber-300">
                      {formatCurrency(table.currentBillTotal)}
                    </div>
                    {table.openedAt && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>Aberta às {table.openedAt}</span>
                      </div>
                    )}
                    <div className="text-[11px] text-slate-400 truncate">
                      {table.items.length} itens lançados na comanda
                    </div>
                  </div>
                ) : isReserved ? (
                  <div className="space-y-1 mb-4">
                    <div className="text-xs text-blue-300 font-medium">
                      Reserva: {table.currentCustomerName}
                    </div>
                    <p className="text-[11px] text-slate-400">Aguardando chegada do comensal</p>
                  </div>
                ) : (
                  <div className="py-4 text-center text-xs text-slate-400">
                    Mesa higienizada e pronta para atendimento
                  </div>
                )}

                <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                  {isFree && (
                    <button
                      onClick={() => onUpdateEntity('restaurantTables', table.id, {
                        status: 'ocupada',
                        currentCustomerName: 'Cliente Salão',
                        currentBillTotal: 85.00,
                        openedAt: '20:30',
                        items: [{ name: 'Couvert da Casa & Bebidas', quantity: 1, unitPrice: 85.00 }]
                      })}
                      className="w-full rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 py-1.5 text-xs font-semibold transition"
                    >
                      Abrir Comanda
                    </button>
                  )}

                  {isOccupied && (
                    <>
                      <button
                        onClick={() => onUpdateEntity('restaurantTables', table.id, {
                          status: 'fechando',
                        })}
                        className="flex-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 py-1.5 text-xs font-semibold transition"
                      >
                        Fechar Conta
                      </button>
                      <button
                        onClick={() => {
                          const additional = 45.00;
                          onUpdateEntity('restaurantTables', table.id, {
                            currentBillTotal: table.currentBillTotal + additional,
                            items: [...table.items, { name: 'Sobremesa do Chef', quantity: 1, unitPrice: 45.00 }]
                          });
                        }}
                        className="rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 px-2 py-1.5 text-xs font-medium"
                        title="Adicionar item rápido"
                      >
                        + Item
                      </button>
                    </>
                  )}

                  {isClosing && (
                    <button
                      onClick={() => onUpdateEntity('restaurantTables', table.id, {
                        status: 'livre',
                        currentCustomerName: '',
                        currentBillTotal: 0,
                        items: [],
                      })}
                      className="w-full rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 py-1.5 text-xs font-semibold transition"
                    >
                      Confirmar Pagamento & Liberar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. OFICINA MECÂNICA VIEW
  if (company.segment === 'oficina') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Wrench className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold text-white">Quadro de Ordens de Serviço (OS)</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Acompanhamento de boxes, orçamentos mecânicos, peças e autorizações de clientes.
            </p>
          </div>

          <button
            onClick={() => setModalType('add_os')}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3C623] px-3.5 py-2 text-xs font-semibold text-slate-950 hover:brightness-110 shadow"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Ordem de Serviço</span>
          </button>
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl border border-white/10 bg-[#0B132B]/90 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1C2541]/60 text-slate-400 border-b border-white/10">
                <tr>
                  <th className="p-3.5 font-semibold">Código OS</th>
                  <th className="p-3.5 font-semibold">Veículo & Placa</th>
                  <th className="p-3.5 font-semibold">Cliente</th>
                  <th className="p-3.5 font-semibold">Diagnóstico / Problema</th>
                  <th className="p-3.5 font-semibold">Peças / Mão de Obra</th>
                  <th className="p-3.5 font-semibold">Total</th>
                  <th className="p-3.5 font-semibold">Status do Box</th>
                  <th className="p-3.5 font-semibold text-right">Ações Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {workshopOrders.map((os) => (
                  <tr key={os.id} className="hover:bg-[#1C2541]/40 transition">
                    <td className="p-3.5 font-mono font-bold text-white">
                      {os.code}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <Car className="h-3.5 w-3.5 text-blue-400" />
                        {os.vehicleModel}
                      </div>
                      <span className="inline-block mt-0.5 rounded bg-slate-800 px-1.5 py-0.2 font-mono text-[10px] text-amber-300 font-bold border border-slate-700">
                        {os.vehiclePlate}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-200">{os.clientName}</div>
                      <span className="text-[11px] text-slate-400">{os.clientPhone}</span>
                    </td>
                    <td className="p-3.5 max-w-xs">
                      <p className="text-slate-300 truncate" title={os.problemReported}>
                        {os.problemReported}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        Laudo: {os.diagnostic}
                      </p>
                    </td>
                    <td className="p-3.5">
                      <div className="text-slate-300">Peças: {formatCurrency(os.totalParts)}</div>
                      <div className="text-slate-400 text-[10px]">M.O.: {formatCurrency(os.totalLabor)}</div>
                    </td>
                    <td className="p-3.5 font-bold text-emerald-400">
                      {formatCurrency(os.total)}
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        os.status === 'concluido' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        os.status === 'em_execucao' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                        os.status === 'orcamento' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        'bg-purple-500/20 text-purple-300'
                      }`}>
                        {os.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      {os.status === 'orcamento' && (
                        <button
                          onClick={() => {
                            onUpdateEntity('workshopOrders', os.id, { status: 'em_execucao' });
                            onTriggerWhatsApp(os.clientPhone, `Olá ${os.clientName}! Seu orçamento da OS ${os.code} no valor de ${formatCurrency(os.total)} foi aprovado e o veículo entrou em execução.`);
                          }}
                          className="rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-2 py-1 text-[11px] font-medium"
                          title="Aprovar e avisar cliente"
                        >
                          Aprovar OS
                        </button>
                      )}
                      {os.status === 'em_execucao' && (
                        <button
                          onClick={() => {
                            onUpdateEntity('workshopOrders', os.id, { status: 'concluido' });
                            onTriggerWhatsApp(os.clientPhone, `Olá ${os.clientName}! A revisão do seu ${os.vehicleModel} foi CONCLUÍDA com sucesso. Aguardamos sua retirada!`);
                          }}
                          className="rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 px-2 py-1 text-[11px] font-medium"
                        >
                          Concluir Box
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for adding OS */}
        {modalType === 'add_os' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0B132B] p-6 shadow-2xl">
              <h2 className="text-lg font-bold text-white mb-4">Nova Ordem de Serviço Automotiva</h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400">Cliente / Proprietário</label>
                  <input
                    type="text"
                    value={newOsClient}
                    onChange={(e) => setNewOsClient(e.target.value)}
                    placeholder="Nome do cliente"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400">Modelo do Veículo</label>
                    <input
                      type="text"
                      value={newOsModel}
                      onChange={(e) => setNewOsModel(e.target.value)}
                      placeholder="Ex: Corolla XEi"
                      className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400">Placa Mercosul</label>
                    <input
                      type="text"
                      value={newOsPlate}
                      onChange={(e) => setNewOsPlate(e.target.value.toUpperCase())}
                      placeholder="Ex: ABC1D23"
                      className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white uppercase font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400">Problema Informado</label>
                  <input
                    type="text"
                    value={newOsProblem}
                    onChange={(e) => setNewOsProblem(e.target.value)}
                    placeholder="Ex: Barulho na suspensão e troca de óleo"
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Valor Estimado (R$)</label>
                  <input
                    type="number"
                    value={newOsValue}
                    onChange={(e) => setNewOsValue(Number(e.target.value))}
                    className="w-full mt-1 rounded-xl border border-white/10 bg-[#1C2541] p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2">
                <button
                  onClick={() => setModalType(null)}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    const code = `OS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
                    onCreateEntity('workshopOrders', {
                      code,
                      clientName: newOsClient || 'Cliente Balcão',
                      clientPhone: '+55 19 99999-0000',
                      vehiclePlate: newOsPlate || 'BRA0A00',
                      vehicleModel: newOsModel || 'Veículo Cadastrado',
                      problemReported: newOsProblem || 'Revisão periódica',
                      diagnostic: 'Em avaliação pelo mecânico responsável',
                      status: 'orcamento',
                      totalParts: newOsValue * 0.6,
                      totalLabor: newOsValue * 0.4,
                      total: newOsValue,
                      openedAt: new Date().toISOString(),
                      estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString(),
                    });
                    setModalType(null);
                  }}
                  className="rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3C623] px-4 py-2 text-xs font-bold text-slate-950 hover:brightness-110"
                >
                  Criar OS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. CLÍNICA & SAÚDE VIEW
  if (company.segment === 'clinica') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <Stethoscope className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold text-white">Agenda & Prontuário Clínico</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Agendamentos médicos, confirmação automática via WhatsApp e prontuário seguro com TCLE.
            </p>
          </div>

          <button
            onClick={() => {
              onCreateEntity('clinicAppointments', {
                patientName: 'Nova Paciente Estética',
                patientPhone: '+55 21 98888-0000',
                professionalName: 'Dra. Camila Albuquerque',
                specialtyOrProcedure: 'Consulta Dermatológica de Retorno',
                dateTime: new Date(Date.now() + 86400000).toISOString(),
                status: 'confirmado_whatsapp',
                value: 450.00,
                insuranceName: 'Particular',
                notes: 'Paciente orientada quanto ao preparo da pele.',
              });
            }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3C623] px-3.5 py-2 text-xs font-semibold text-slate-950 hover:brightness-110 shadow"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Agendamento Clínico</span>
          </button>
        </div>

        {/* Appointments Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clinicAppointments.map((app) => (
            <div key={app.id} className="rounded-2xl border border-white/10 bg-[#0B132B]/90 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm">{app.patientName}</h3>
                  <span className="text-xs text-slate-400">{app.patientPhone}</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  app.status === 'confirmado_whatsapp' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  app.status === 'em_atendimento' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {app.status === 'confirmado_whatsapp' ? 'Confirmado via WhatsApp' : app.status}
                </span>
              </div>

              <div className="rounded-xl border border-white/5 bg-[#1C2541]/50 p-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Procedimento:</span>
                  <span className="font-semibold text-white">{app.specialtyOrProcedure}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Médico Responsável:</span>
                  <span className="text-slate-200">{app.professionalName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Honorários / Valor:</span>
                  <span className="font-bold text-[#F3C623]">{formatCurrency(app.value)}</span>
                </div>
                {app.insuranceName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Modalidade:</span>
                    <span className="text-blue-300 font-medium">{app.insuranceName}</span>
                  </div>
                )}
              </div>

              {app.notes && (
                <p className="text-xs text-slate-400 italic bg-white/5 p-2 rounded-lg">
                  "{app.notes}"
                </p>
              )}

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => onTriggerWhatsApp(app.patientPhone, `Olá ${app.patientName}! Lembrando do seu procedimento de ${app.specialtyOrProcedure} agendado na clínica. Confirma sua presença?`)}
                  className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-300 transition"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Enviar Lembrete WhatsApp</span>
                </button>

                <button
                  onClick={() => onUpdateEntity('clinicAppointments', app.id, { status: 'concluido' })}
                  className="rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-1.5 text-xs font-medium"
                >
                  Finalizar Consulta
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. IMOBILIÁRIA VIEW
  if (company.segment === 'imobiliaria') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <Home className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold text-white">Carteira de Imóveis & VGV</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Captações de imóveis residenciais e comerciais, leads qualificados e negociações em andamento.
            </p>
          </div>

          <button
            onClick={() => {
              onCreateEntity('realEstateProperties', {
                code: `VG-AP-${Math.floor(100 + Math.random() * 900)}`,
                title: 'Nova Captação Alto Padrão',
                type: 'apartamento',
                purpose: 'venda',
                price: 1850000.00,
                address: 'Av. Afonso Pena, 3200',
                neighborhood: 'Funcionários, BH',
                bedrooms: 3,
                bathrooms: 4,
                areaM2: 180,
                status: 'disponivel',
                leadsCount: 1,
              });
            }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3C623] px-3.5 py-2 text-xs font-semibold text-slate-950 hover:brightness-110 shadow"
          >
            <Plus className="h-4 w-4" />
            <span>Cadastrar Imóvel</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {realEstateProperties.map((prop) => (
            <div key={prop.id} className="rounded-2xl border border-white/10 bg-[#0B132B]/90 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  {prop.code}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  prop.status === 'em_negociacao' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {prop.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-sm">{prop.title}</h3>
                <p className="text-xs text-slate-400">{prop.address} • {prop.neighborhood}</p>
              </div>

              <div className="flex items-center justify-between text-xs py-2 border-y border-white/5">
                <span className="text-slate-400">{prop.bedrooms} Suítes • {prop.areaM2} m²</span>
                <span className="text-lg font-bold text-emerald-400">{formatCurrency(prop.price)}</span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Interessados / Leads: <b>{prop.leadsCount} pessoas</b></span>
                <button
                  onClick={() => onUpdateEntity('realEstateProperties', prop.id, { leadsCount: prop.leadsCount + 1 })}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  + Adicionar Interessado
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. COMÉRCIO / VAREJO VIEW
  if (company.segment === 'comercio') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold text-white">Catálogo de Produtos & Frente de Caixa</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Controle de inventário com alerta de reposição, margem bruta e vendas imediatas.
            </p>
          </div>

          <button
            onClick={() => {
              onCreateEntity('retailProducts', {
                sku: `NK-SKU-${Math.floor(100 + Math.random() * 900)}`,
                name: 'Novo Item Comercial',
                category: 'Geral',
                costPrice: 50.00,
                sellPrice: 120.00,
                stockQty: 15,
                minStockQty: 5,
                unit: 'UN',
              });
            }}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3C623] px-3.5 py-2 text-xs font-semibold text-slate-950 hover:brightness-110 shadow"
          >
            <Plus className="h-4 w-4" />
            <span>Cadastrar Produto SKU</span>
          </button>
        </div>

        {/* Products Table */}
        <div className="rounded-2xl border border-white/10 bg-[#0B132B]/90 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1C2541]/60 text-slate-400 border-b border-white/10">
              <tr>
                <th className="p-3.5 font-semibold">SKU / Código</th>
                <th className="p-3.5 font-semibold">Produto</th>
                <th className="p-3.5 font-semibold">Categoria</th>
                <th className="p-3.5 font-semibold">Custo Compra</th>
                <th className="p-3.5 font-semibold">Preço Venda</th>
                <th className="p-3.5 font-semibold">Margem</th>
                <th className="p-3.5 font-semibold">Estoque Físico</th>
                <th className="p-3.5 font-semibold text-right">Ação PDV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {retailProducts.map((p) => {
                const margin = p.sellPrice > 0 ? (((p.sellPrice - p.costPrice) / p.sellPrice) * 100).toFixed(1) : 0;
                const isLowStock = p.stockQty <= p.minStockQty;

                return (
                  <tr key={p.id} className="hover:bg-[#1C2541]/40 transition">
                    <td className="p-3.5 font-mono text-amber-300 font-bold">{p.sku}</td>
                    <td className="p-3.5 font-semibold text-white">{p.name}</td>
                    <td className="p-3.5 text-slate-300">{p.category}</td>
                    <td className="p-3.5 text-slate-400">{formatCurrency(p.costPrice)}</td>
                    <td className="p-3.5 font-bold text-emerald-400">{formatCurrency(p.sellPrice)}</td>
                    <td className="p-3.5 text-blue-300 font-medium">{margin}%</td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-bold font-mono ${
                        isLowStock ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-200'
                      }`}>
                        {p.stockQty} {p.unit}
                        {isLowStock && <AlertCircle className="h-3 w-3 text-rose-400" />}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          if (p.stockQty > 0) {
                            onUpdateEntity('retailProducts', p.id, { stockQty: p.stockQty - 1 });
                            onCreateEntity('transactions', {
                              type: 'receita',
                              category: 'Vendas Balcão PDV',
                              description: `Venda balcão: ${p.name} (${p.sku})`,
                              amount: p.sellPrice,
                              date: new Date().toISOString().split('T')[0],
                              status: 'pago',
                              paymentMethod: 'pix',
                            });
                          }
                        }}
                        disabled={p.stockQty <= 0}
                        className="rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-3 py-1 text-xs font-semibold disabled:opacity-40"
                      >
                        Vender 1x (PDV)
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 6. PRESTADOR DE SERVIÇOS VIEW
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Briefcase className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-white">Contratos Corporativos & Recorrência</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestão de retainers mensais, vigência contratual e entregáveis acordados.
          </p>
        </div>

        <button
          onClick={() => {
            onCreateEntity('serviceContracts', {
              clientName: 'Novo Cliente Corporativo',
              contractTitle: 'Assessoria de Gestão e Processos',
              recurrence: 'mensal',
              value: 7500.00,
              status: 'ativo',
              startDate: new Date().toISOString().split('T')[0],
              renewalDate: new Date(Date.now() + 86400000 * 365).toISOString().split('T')[0],
              deliverables: ['Reunião de alinhamento mensal', 'Relatório DRE', 'Planejamento tático'],
            });
          }}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3C623] px-3.5 py-2 text-xs font-semibold text-slate-950 hover:brightness-110 shadow"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Contrato</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {serviceContracts.map((c) => (
          <div key={c.id} className="rounded-2xl border border-white/10 bg-[#0B132B]/90 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">{c.clientName}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {c.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium">{c.contractTitle}</p>

            <div className="flex items-center justify-between text-xs py-2 border-y border-white/5">
              <span className="text-slate-400">Honorários ({c.recurrence}):</span>
              <span className="text-lg font-bold text-[#F3C623]">{formatCurrency(c.value)}/mês</span>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Entregáveis acordados:</span>
              <ul className="mt-1 space-y-1">
                {c.deliverables.map((d, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
