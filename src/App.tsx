/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Sidebar, NavTab } from './components/Sidebar.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { SegmentView } from './components/SegmentView.tsx';
import { ClientsView } from './components/ClientsView.tsx';
import { FinancialView } from './components/FinancialView.tsx';
import { WhatsAppView } from './components/WhatsAppView.tsx';
import { CopilotView } from './components/CopilotView.tsx';
import { PlansView } from './components/PlansView.tsx';
import { AuditView } from './components/AuditView.tsx';
import { MasterOwnerView } from './components/MasterOwnerView.tsx';
import { OnboardingModal } from './components/OnboardingModal.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { SalesView } from './components/SalesView.tsx';
import { MarketingView } from './components/MarketingView.tsx';
import { GrowthAiView } from './components/GrowthAiView.tsx';
import { LoyaltyView } from './components/LoyaltyView.tsx';
import { TeamView } from './components/TeamView.tsx';
import { StoreView } from './components/StoreView.tsx';
import { ReputationView } from './components/ReputationView.tsx';
import { AcademyView } from './components/AcademyView.tsx';
import { ExpansionView } from './components/ExpansionView.tsx';
import { 
  Company, 
  PlanTier, 
  Client, 
  FinancialTransaction, 
  RestaurantTable, 
  WorkshopWorkOrder, 
  ClinicAppointment, 
  RealEstateProperty, 
  RetailProduct, 
  ServiceContract,
  WhatsAppConnection,
  WhatsAppMessage,
  WhatsAppTemplate,
  AuditLog,
  LeadOpportunity,
  SalesProposal,
  MarketingCampaign,
  LoyaltyCoupon,
  LoyaltyConfig,
  TeamMember,
  TeamTask,
  StoreProduct,
  ReputationReview,
  AcademyCourse,
  ExpansionBranch,
  GrowthOpportunity
} from './types/index.ts';
import { 
  fetchCompanies, 
  fetchTenantData, 
  createTenantEntity, 
  updateTenantEntity, 
  deleteTenantEntity,
  askCopilot, 
  sendWhatsAppMessage,
  updateCompanyStatusOrPlan 
} from './services/api.ts';
import { Menu, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentCompanyId, setCurrentCompanyId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isMasterOwnerMode, setIsMasterOwnerMode] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Tenant-isolated collections
  const [clients, setClients] = useState<Client[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [restaurantTables, setRestaurantTables] = useState<RestaurantTable[]>([]);
  const [workshopOrders, setWorkshopOrders] = useState<WorkshopWorkOrder[]>([]);
  const [clinicAppointments, setClinicAppointments] = useState<ClinicAppointment[]>([]);
  const [realEstateProperties, setRealEstateProperties] = useState<RealEstateProperty[]>([]);
  const [retailProducts, setRetailProducts] = useState<RetailProduct[]>([]);
  const [serviceContracts, setServiceContracts] = useState<ServiceContract[]>([]);
  const [whatsappConnection, setWhatsappConnection] = useState<WhatsAppConnection | null>(null);
  const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>([]);
  const [whatsappTemplates, setWhatsappTemplates] = useState<WhatsAppTemplate[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // NEXORA BUSINESS new collections
  const [leadOpportunities, setLeadOpportunities] = useState<LeadOpportunity[]>([]);
  const [salesProposals, setSalesProposals] = useState<SalesProposal[]>([]);
  const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>([]);
  const [loyaltyCoupons, setLoyaltyCoupons] = useState<LoyaltyCoupon[]>([]);
  const [loyaltyConfig, setLoyaltyConfig] = useState<LoyaltyConfig>({ cashbackPercent: 5.0, pointsPerReal: 1, referralRewardBonus: 25.0, isActive: true });
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamTasks, setTeamTasks] = useState<TeamTask[]>([]);
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);
  const [reputationReviews, setReputationReviews] = useState<ReputationReview[]>([]);
  const [academyCourses, setAcademyCourses] = useState<AcademyCourse[]>([]);
  const [expansionBranches, setExpansionBranches] = useState<ExpansionBranch[]>([]);
  const [growthOpportunities, setGrowthOpportunities] = useState<GrowthOpportunity[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Initial Load of Companies
  const loadCompanies = async () => {
    try {
      setLoading(true);
      const list = await fetchCompanies();
      setCompanies(list);
      if (list.length > 0 && !currentCompanyId) {
        setCurrentCompanyId(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  // 2. Load isolated tenant data whenever currentCompanyId changes
  const loadTenant = async (compId: string) => {
    if (!compId) return;
    try {
      const data = await fetchTenantData(compId);
      setClients(data.clients || []);
      setTransactions(data.transactions || []);
      setRestaurantTables(data.restaurantTables || []);
      setWorkshopOrders(data.workshopOrders || []);
      setClinicAppointments(data.clinicAppointments || []);
      setRealEstateProperties(data.realEstateProperties || []);
      setRetailProducts(data.retailProducts || []);
      setServiceContracts(data.serviceContracts || []);
      setWhatsappConnection(data.whatsappConnection || null);
      setWhatsappMessages(data.whatsappMessages || []);
      setWhatsappTemplates(data.whatsappTemplates || []);
      setAuditLogs(data.auditLogs || []);
      // NEXORA BUSINESS collections
      setLeadOpportunities(data.leadOpportunities || []);
      setSalesProposals(data.salesProposals || []);
      setMarketingCampaigns(data.marketingCampaigns || []);
      setLoyaltyCoupons(data.loyaltyCoupons || []);
      setLoyaltyConfig(data.loyaltyConfig || { cashbackPercent: 5.0, pointsPerReal: 1, referralRewardBonus: 25.0, isActive: true });
      setTeamMembers(data.teamMembers || []);
      setTeamTasks(data.teamTasks || []);
      setStoreProducts(data.storeProducts || []);
      setReputationReviews(data.reputationReviews || []);
      setAcademyCourses(data.academyCourses || []);
      setExpansionBranches(data.expansionBranches || []);
      setGrowthOpportunities(data.growthOpportunities || []);
    } catch (err) {
      console.error('Failed to load tenant data:', err);
    }
  };

  useEffect(() => {
    if (currentCompanyId) {
      loadTenant(currentCompanyId);
    }
  }, [currentCompanyId]);

  const currentCompany = companies.find((c) => c.id === currentCompanyId) || null;

  // Generic Entity Handlers
  const handleCreateEntity = async (collection: string, payload: any) => {
    if (!currentCompanyId) return;
    try {
      const created = await createTenantEntity(currentCompanyId, collection, payload);
      await loadTenant(currentCompanyId);
      showToast('Registro criado e gravado no banco isolado com sucesso!');
      return created;
    } catch (err: any) {
      alert(err.message || 'Erro ao criar registro');
    }
  };

  const handleUpdateEntity = async (collection: string, id: string, updates: any) => {
    if (!currentCompanyId) return;
    try {
      await updateTenantEntity(currentCompanyId, collection, id, updates);
      await loadTenant(currentCompanyId);
      showToast('Registro atualizado com sucesso!');
    } catch (err: any) {
      alert(err.message || 'Erro ao atualizar');
    }
  };

  const handleSendMessage = async (payload: {
    contactName: string;
    contactPhone: string;
    content: string;
    isOfficialTemplate?: boolean;
    templateName?: string;
  }) => {
    if (!currentCompanyId) return;
    try {
      await sendWhatsAppMessage(currentCompanyId, payload);
      await loadTenant(currentCompanyId);
      showToast('Mensagem enviada com carimbo oficial Meta Cloud API!');
    } catch (err: any) {
      alert(err.message || 'Falha no envio WhatsApp');
    }
  };

  const handleTriggerQuickWhatsApp = (recipient: string, message: string) => {
    setActiveTab('whatsapp');
    handleSendMessage({
      contactName: 'Contato Selecionado',
      contactPhone: recipient,
      content: message,
      isOfficialTemplate: false,
    });
  };

  const handleAskCopilot = async (message: string) => {
    if (!currentCompanyId) throw new Error('Selecione uma empresa');
    const result = await askCopilot(currentCompanyId, message);
    return result;
  };

  const handleExecuteCopilotAction = async (proposal: any) => {
    if (!currentCompanyId) return;
    if (proposal.actionType === 'create_transaction') {
      await handleCreateEntity('transactions', {
        ...proposal.payload,
        date: new Date().toISOString().split('T')[0],
      });
      showToast('Ação financeira aprovada e lançada no DRE!');
    } else if (proposal.actionType === 'create_campaign') {
      await handleCreateEntity('marketingCampaigns', {
        ...proposal.payload,
        status: 'ativo',
        scheduledDate: new Date().toISOString().split('T')[0],
      });
      showToast('Campanha aprovada e lançada no NEXORA Marketing!');
    } else if (proposal.actionType === 'send_whatsapp') {
      await handleSendMessage({
        contactName: 'Clientes Prioritários',
        contactPhone: currentCompany?.contactPhone || '+55 11 99999-9999',
        content: `Notificação oficial automática autorizada pelo gestor da ${currentCompany?.name}.`,
        isOfficialTemplate: true,
        templateName: proposal.payload.templateName || 'confirmacao_agendamento_nexora',
      });
      showToast('Disparo oficial de WhatsApp aprovado e emitido!');
    }
  };

  const handleUpdatePlan = async (plan: PlanTier) => {
    if (!currentCompanyId) return;
    try {
      await updateCompanyStatusOrPlan(currentCompanyId, { plan });
      await loadCompanies();
      await loadTenant(currentCompanyId);
      showToast(`Plano atualizado com sucesso para ${plan.toUpperCase()}!`);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-2xl border border-cyan-500/50 bg-[#0A1128]/95 px-4 py-3 text-xs font-semibold text-cyan-300 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        currentCompany={currentCompany}
        companies={companies}
        onSelectCompany={(id) => {
          setCurrentCompanyId(id);
          setIsMasterOwnerMode(false);
        }}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        isMasterOwnerMode={isMasterOwnerMode}
        onToggleMasterOwner={() => setIsMasterOwnerMode(!isMasterOwnerMode)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAiCopilot={() => setActiveTab('copilot')}
        onSearchSelectModule={(tabId) => setActiveTab(tabId as NavTab)}
      />

      {/* Mobile Menu Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2 bg-[#050811]/90 border-b border-white/5">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-1.5 text-xs text-slate-300"
        >
          <Menu className="h-4 w-4 text-cyan-400" />
          <span>Menu NEXORA</span>
        </button>

        <span className="text-xs text-cyan-300 font-bold truncate font-space">
          {isMasterOwnerMode ? 'Master Owner' : currentCompany?.name}
        </span>
      </div>

      {/* Main Layout Body */}
      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        {!isMasterOwnerMode && (
          <Sidebar
            currentCompany={currentCompany}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            mobileMenuOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
          {loading && (
            <div className="flex items-center justify-center py-24 text-slate-400 text-xs">
              <Sparkles className="h-5 w-5 text-cyan-400 animate-spin mr-2" />
              Carregando infraestrutura NEXORA BUSINESS...
            </div>
          )}

          {!loading && isMasterOwnerMode && (
            <MasterOwnerView
              companies={companies}
              onSelectCompany={(id) => {
                setCurrentCompanyId(id);
                setIsMasterOwnerMode(false);
              }}
              onRefreshData={loadCompanies}
            />
          )}

          {!loading && !isMasterOwnerMode && currentCompany && (
            <>
              {activeTab === 'dashboard' && (
                <DashboardView
                  company={currentCompany}
                  clients={clients}
                  transactions={transactions}
                  kpis={currentCompany.kpis}
                  auditLogs={auditLogs}
                  opportunities={leadOpportunities}
                  onNavigateTab={setActiveTab}
                />
              )}

              {activeTab === 'vendas' && (
                <SalesView
                  company={currentCompany}
                  opportunities={leadOpportunities}
                  onCreateOpportunity={(data) => handleCreateEntity('leadOpportunities', data)}
                  onUpdateOpportunity={(id, data) => handleUpdateEntity('leadOpportunities', id, data)}
                  onTriggerWhatsApp={handleTriggerQuickWhatsApp}
                />
              )}

              {activeTab === 'growth_ai' && (
                <GrowthAiView
                  company={currentCompany}
                  growthOpportunities={growthOpportunities}
                  onTriggerWhatsApp={handleTriggerQuickWhatsApp}
                  onExecuteAction={handleExecuteCopilotAction}
                />
              )}

              {activeTab === 'marketing' && (
                <MarketingView
                  company={currentCompany}
                  campaigns={marketingCampaigns}
                  onCreateCampaign={(data) => handleCreateEntity('marketingCampaigns', data)}
                  onTriggerWhatsApp={handleTriggerQuickWhatsApp}
                />
              )}

              {activeTab === 'fidelidade' && (
                <LoyaltyView
                  company={currentCompany}
                  coupons={loyaltyCoupons}
                  config={loyaltyConfig}
                  clients={clients}
                  onCreateCoupon={(data) => handleCreateEntity('loyaltyCoupons', data)}
                  onTriggerWhatsApp={handleTriggerQuickWhatsApp}
                />
              )}

              {activeTab === 'team' && (
                <TeamView
                  company={currentCompany}
                  members={teamMembers}
                  tasks={teamTasks}
                  onCreateMember={(data) => handleCreateEntity('teamMembers', data)}
                  onCreateTask={(data) => handleCreateEntity('teamTasks', data)}
                  onUpdateTask={(id, data) => handleUpdateEntity('teamTasks', id, data)}
                />
              )}

              {activeTab === 'store' && (
                <StoreView
                  company={currentCompany}
                  products={storeProducts}
                  onCreateProduct={(data) => handleCreateEntity('storeProducts', data)}
                  onSellProduct={async (prod) => {
                    if (prod.stockQty > 0) {
                      await handleUpdateEntity('storeProducts', prod.id, { stockQty: prod.stockQty - 1 });
                      await handleCreateEntity('transactions', {
                        type: 'receita',
                        category: 'Vendas Balcão Store',
                        description: `Venda balcão: ${prod.name} (${prod.sku})`,
                        amount: prod.sellPrice,
                        date: new Date().toISOString().split('T')[0],
                        status: 'pago',
                        isConciliated: true,
                        paymentMethod: 'pix',
                      });
                      showToast(`Venda de ${prod.name} registrada com sucesso!`);
                    }
                  }}
                />
              )}

              {activeTab === 'reputation' && (
                <ReputationView
                  company={currentCompany}
                  reviews={reputationReviews}
                  clients={clients}
                  onTriggerWhatsApp={handleTriggerQuickWhatsApp}
                  onRespondReview={async (id, note) => {
                    await handleUpdateEntity('reputationReviews', id, {
                      responded: true,
                      responseNote: note,
                    });
                  }}
                />
              )}

              {activeTab === 'academy' && (
                <AcademyView
                  company={currentCompany}
                  courses={academyCourses}
                />
              )}

              {activeTab === 'expansion' && (
                <ExpansionView
                  company={currentCompany}
                  branches={expansionBranches}
                  onCreateBranch={(data) => handleCreateEntity('expansionBranches', data)}
                />
              )}

              {activeTab === 'segment_module' && (
                <SegmentView
                  company={currentCompany}
                  restaurantTables={restaurantTables}
                  workshopOrders={workshopOrders}
                  clinicAppointments={clinicAppointments}
                  realEstateProperties={realEstateProperties}
                  retailProducts={retailProducts}
                  serviceContracts={serviceContracts}
                  onUpdateEntity={handleUpdateEntity}
                  onCreateEntity={handleCreateEntity}
                  onTriggerWhatsApp={handleTriggerQuickWhatsApp}
                />
              )}

              {activeTab === 'clients' && (
                <ClientsView
                  company={currentCompany}
                  clients={clients}
                  onCreateClient={(data) => handleCreateEntity('clients', data)}
                  onTriggerWhatsApp={handleTriggerQuickWhatsApp}
                />
              )}

              {activeTab === 'financial' && (
                <FinancialView
                  company={currentCompany}
                  transactions={transactions}
                  onCreateTransaction={(data) => handleCreateEntity('transactions', data)}
                  onUpdateTransaction={(id, data) => handleUpdateEntity('transactions', id, data)}
                />
              )}

              {activeTab === 'whatsapp' && whatsappConnection && (
                <WhatsAppView
                  company={currentCompany}
                  connection={whatsappConnection}
                  messages={whatsappMessages}
                  templates={whatsappTemplates}
                  clients={clients}
                  onSendMessage={handleSendMessage}
                />
              )}

              {activeTab === 'copilot' && (
                <CopilotView
                  company={currentCompany}
                  onAskCopilot={handleAskCopilot}
                  onExecuteAction={handleExecuteCopilotAction}
                />
              )}

              {activeTab === 'plans' && (
                <PlansView
                  company={currentCompany}
                  onUpdatePlan={handleUpdatePlan}
                />
              )}

              {activeTab === 'audit' && (
                <AuditView
                  company={currentCompany}
                  auditLogs={auditLogs}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Smart Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onCompanyCreated={async (newId) => {
          await loadCompanies();
          setCurrentCompanyId(newId);
          setActiveTab('dashboard');
          setIsMasterOwnerMode(false);
          showToast('Empresa criada com IA e ativada no ambiente isolado!');
        }}
      />

      {/* Login & Security Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginAsMaster={() => {
          setIsMasterOwnerMode(true);
          showToast('Sessão autenticada como Alifer Madeiro (Master Owner)!');
        }}
        onLoginAsCompany={(id) => {
          setCurrentCompanyId(id);
          setIsMasterOwnerMode(false);
          showToast('Sessão autenticada como Gestor do Tenant!');
        }}
        companies={companies}
      />
    </div>
  );
}
