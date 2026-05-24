export interface CalculatorInputs {
  videoCount: number
  videoDurationMinutes: number
  primaryServiceId: string
  secondaryServiceId: string | null
  clientPricePerHour: number
  usdToRubRate: number
}

export interface ProjectMetrics {
  totalVideoHours: number
  totalReels: number
  processingMinutesPerHour: number
  totalProcessingMinutes: number
  timePerReelMinutes: number
}

export interface CostMetrics {
  processingCostPerHourRub: number
  monthlySubscriptionRub: number
  projectProcessingCostRub: number
  automationCostRub: number
  projectCostWithoutAutomationRub: number
  projectCostWithAutomationRub: number
  reelCostWithoutAutomationRub: number
  reelCostWithAutomationRub: number
}

export interface ClientMetrics {
  clientPricePerHour: number
  reelPriceForClient: number
  projectPriceForClient: number
  marginWithoutAutomation: number
  marginWithAutomation: number
}

export interface CalculatorResult {
  project: ProjectMetrics
  costs: CostMetrics
  client: ClientMetrics
}

export interface UnitEconomicsRow {
  margin: number
  sellingPricePerReel: number
  revenuePerProject: number
  profitPerProject: number
  profitPerReel: number
  roi: number
}

export interface SalesFunnelStep {
  stage: string
  count: number
  conversionRate: number | null
}

export interface SalesFunnelResult {
  targetRevenue: number
  projectPrice: number
  projectsNeeded: number
  steps: SalesFunnelStep[]
}

export const DEFAULT_INPUTS: CalculatorInputs = {
  videoCount: 5,
  videoDurationMinutes: 60,
  primaryServiceId: 'vizard',
  secondaryServiceId: null,
  clientPricePerHour: 5000,
  usdToRubRate: 95,
}

export const MARGINS = [10, 20, 30, 40, 50, 60]

export const FUNNEL_CONVERSION_RATES = {
  leadToQualified: 0.4,
  qualifiedToMeeting: 0.5,
  meetingToProposal: 0.6,
  proposalToDeal: 0.35,
}
