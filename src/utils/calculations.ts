import {
  AUTOMATION_COST_RUB,
  AUTOMATION_HOURS,
  getServiceById,
  PROCESSING_MINUTES_ONE_SERVICE,
  PROCESSING_MINUTES_TWO_SERVICES,
  REELS_PER_HOUR,
} from '../data/services'
import type {
  CalculatorInputs,
  CalculatorResult,
  SalesFunnelResult,
  SalesFunnelStep,
  UnitEconomicsRow,
} from '../types'
import { FUNNEL_CONVERSION_RATES, MARGINS } from '../types'

function getSelectedServices(inputs: CalculatorInputs) {
  const primary = getServiceById(inputs.primaryServiceId)
  const secondary = getServiceById(inputs.secondaryServiceId)
  return { primary, secondary }
}

export function calculate(inputs: CalculatorInputs): CalculatorResult {
  const { primary, secondary } = getSelectedServices(inputs)
  const rate = inputs.usdToRubRate

  const totalVideoHours =
    inputs.videoCount * (inputs.videoDurationMinutes / 60)
  const totalReels = totalVideoHours * REELS_PER_HOUR
  const hasTwoServices = Boolean(secondary)
  const processingMinutesPerHour = hasTwoServices
    ? PROCESSING_MINUTES_TWO_SERVICES
    : PROCESSING_MINUTES_ONE_SERVICE
  const totalProcessingMinutes = totalVideoHours * processingMinutesPerHour
  const timePerReelMinutes =
    totalReels > 0 ? totalProcessingMinutes / totalReels : 0

  const hourlyUsd =
    (primary?.hourlyCostUsd ?? 0) + (secondary?.hourlyCostUsd ?? 0)
  const monthlyUsd =
    (primary?.monthlyCostUsd ?? 0) + (secondary?.monthlyCostUsd ?? 0)

  const processingCostPerHourRub = hourlyUsd * rate
  const monthlySubscriptionRub = monthlyUsd * rate
  const variableProjectCostRub = processingCostPerHourRub * totalVideoHours
  const projectProcessingCostRub =
    variableProjectCostRub + monthlySubscriptionRub
  const automationCostRub =
    (totalVideoHours / AUTOMATION_HOURS) * AUTOMATION_COST_RUB
  const projectCostWithoutAutomationRub = projectProcessingCostRub
  const projectCostWithAutomationRub =
    projectProcessingCostRub + automationCostRub

  const reelCostWithoutAutomationRub =
    totalReels > 0 ? projectCostWithoutAutomationRub / totalReels : 0
  const reelCostWithAutomationRub =
    totalReels > 0 ? projectCostWithAutomationRub / totalReels : 0

  const reelPriceForClient = inputs.clientPricePerHour / REELS_PER_HOUR
  const projectPriceForClient = inputs.clientPricePerHour * totalVideoHours

  const marginWithoutAutomation =
    projectPriceForClient > 0
      ? ((projectPriceForClient - projectCostWithoutAutomationRub) /
          projectPriceForClient) *
        100
      : 0
  const marginWithAutomation =
    projectPriceForClient > 0
      ? ((projectPriceForClient - projectCostWithAutomationRub) /
          projectPriceForClient) *
        100
      : 0

  return {
    project: {
      totalVideoHours,
      totalReels,
      processingMinutesPerHour,
      totalProcessingMinutes,
      timePerReelMinutes,
    },
    costs: {
      processingCostPerHourRub,
      monthlySubscriptionRub,
      projectProcessingCostRub,
      automationCostRub,
      projectCostWithoutAutomationRub,
      projectCostWithAutomationRub,
      reelCostWithoutAutomationRub,
      reelCostWithAutomationRub,
    },
    client: {
      clientPricePerHour: inputs.clientPricePerHour,
      reelPriceForClient,
      projectPriceForClient,
      marginWithoutAutomation,
      marginWithAutomation,
    },
  }
}

export function calculateUnitEconomics(
  result: CalculatorResult,
  withAutomation: boolean,
): UnitEconomicsRow[] {
  const costPerProject = withAutomation
    ? result.costs.projectCostWithAutomationRub
    : result.costs.projectCostWithoutAutomationRub
  const totalReels = result.project.totalReels

  return MARGINS.map((margin) => {
    const marginFraction = margin / 100
    const sellingPricePerReel =
      totalReels > 0
        ? costPerProject / totalReels / (1 - marginFraction)
        : 0
    const revenuePerProject = sellingPricePerReel * totalReels
    const profitPerProject = revenuePerProject - costPerProject
    const profitPerReel =
      totalReels > 0 ? profitPerProject / totalReels : 0
    const roi =
      costPerProject > 0 ? (profitPerProject / costPerProject) * 100 : 0

    return {
      margin,
      sellingPricePerReel,
      revenuePerProject,
      profitPerProject,
      profitPerReel,
      roi,
    }
  })
}

function funnelStep(
  stage: string,
  count: number,
  conversionRate: number | null,
): SalesFunnelStep {
  return { stage, count, conversionRate }
}

export function calculateSalesFunnel(
  result: CalculatorResult,
  targetRevenue = 1_000_000,
): SalesFunnelResult {
  const projectPrice = result.client.projectPriceForClient
  const projectsNeeded =
    projectPrice > 0 ? Math.ceil(targetRevenue / projectPrice) : Infinity

  const deals = projectsNeeded
  const proposals = Math.ceil(deals / FUNNEL_CONVERSION_RATES.proposalToDeal)
  const meetings = Math.ceil(
    proposals / FUNNEL_CONVERSION_RATES.meetingToProposal,
  )
  const qualified = Math.ceil(
    meetings / FUNNEL_CONVERSION_RATES.qualifiedToMeeting,
  )
  const leads = Math.ceil(qualified / FUNNEL_CONVERSION_RATES.leadToQualified)

  return {
    targetRevenue,
    projectPrice,
    projectsNeeded: deals,
    steps: [
      funnelStep('Сделки (закрытые проекты)', deals, null),
      funnelStep(
        'Коммерческие предложения',
        proposals,
        FUNNEL_CONVERSION_RATES.proposalToDeal,
      ),
      funnelStep(
        'Встречи / демо',
        meetings,
        FUNNEL_CONVERSION_RATES.meetingToProposal,
      ),
      funnelStep(
        'Квалифицированные лиды',
        qualified,
        FUNNEL_CONVERSION_RATES.qualifiedToMeeting,
      ),
      funnelStep(
        'Заявки (лиды)',
        leads,
        FUNNEL_CONVERSION_RATES.leadToQualified,
      ),
    ],
  }
}

export function formatCurrency(value: number): string {
  if (!isFinite(value)) return '—'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number, decimals = 1): string {
  if (!isFinite(value)) return '—'
  return new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatPercent(value: number): string {
  if (!isFinite(value)) return '—'
  return `${formatNumber(value, 1)}%`
}

export function formatMinutes(value: number): string {
  if (!isFinite(value)) return '—'
  if (value < 60) return `${formatNumber(value, 1)} мин`
  const hours = Math.floor(value / 60)
  const mins = Math.round(value % 60)
  return mins > 0 ? `${hours} ч ${mins} мин` : `${hours} ч`
}

export function formatUsd(value: number): string {
  if (!isFinite(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}
