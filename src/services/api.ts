/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Company, PlanLimit, WhatsAppMessage } from '../types/index.ts';

export async function fetchCompanies(): Promise<Company[]> {
  const res = await fetch('/api/companies');
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Erro ao carregar empresas');
  return data.data;
}

export async function fetchCompany(id: string): Promise<Company> {
  const res = await fetch(`/api/companies/${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Erro ao carregar empresa');
  return data.data;
}

export async function fetchTenantData(companyId: string) {
  const res = await fetch(`/api/data/${companyId}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Erro ao carregar dados isolados');
  return data.data;
}

export async function createTenantEntity(companyId: string, collection: string, payload: any) {
  const res = await fetch(`/api/data/${companyId}/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Erro ao salvar registro');
  return data.data;
}

export async function updateTenantEntity(companyId: string, collection: string, id: string, payload: any) {
  const res = await fetch(`/api/data/${companyId}/${collection}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Erro ao atualizar registro');
  return data.data;
}

export async function deleteTenantEntity(companyId: string, collection: string, id: string) {
  const res = await fetch(`/api/data/${companyId}/${collection}/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Erro ao excluir registro');
  return data.data;
}

export async function askCopilot(companyId: string, message: string, persona?: string) {
  const res = await fetch('/api/ai/copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyId, message, persona }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Erro ao consultar IA');
  return data.data;
}

export async function getAiRecommendation(companyData: {
  name: string;
  cnpjCpf: string;
  segment: string;
  customSegmentName?: string;
  activityDescription: string;
  staffCount: number;
  mainProductsOrServices: string;
  location?: string;
  businessGoals?: string;
}) {
  const res = await fetch('/api/ai/recommend-setup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(companyData),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Erro na recomendação por IA');
  return data.data;
}

export async function fetchGrowthDiagnostic(companyId: string, question: string) {
  const res = await fetch('/api/ai/growth-diagnostic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyId, question }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Erro no diagnóstico Growth');
  return data.data;
}

export async function registerNewCompany(companyPayload: any): Promise<Company> {
  const res = await fetch('/api/companies', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(companyPayload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Erro ao cadastrar empresa');
  return data.data;
}

export async function updateCompanyStatusOrPlan(id: string, updates: Partial<Company>): Promise<Company> {
  const res = await fetch(`/api/companies/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Erro ao atualizar status');
  return data.data;
}

export async function sendWhatsAppMessage(companyId: string, payload: {
  contactName: string;
  contactPhone: string;
  content: string;
  isOfficialTemplate?: boolean;
  templateName?: string;
}): Promise<WhatsAppMessage> {
  const res = await fetch(`/api/whatsapp/${companyId}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Erro no envio WhatsApp');
  return data.data;
}

export async function fetchMasterStats() {
  const res = await fetch('/api/master/stats');
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Erro ao carregar dados Master');
  return data.data;
}

export async function updateMasterPlan(planPayload: {
  tier: string;
  priceMonthly: number;
  maxUsers: number;
  maxClients: number;
  aiQueriesPerMonth: number;
  whatsAppIntegrations: number;
}) {
  const res = await fetch('/api/master/plans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(planPayload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Erro ao salvar configuração do plano');
  return data.data;
}
