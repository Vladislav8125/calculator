import type {
  CalculatorInputs,
  CostBreakdown,
  ComparisonResult,
  UnitEconomicsRow,
  UnitEconomicsResult,
} from '../types'
import { MARGINS } from '../types'

function calcManual(inputs: CalculatorInputs): CostBreakdown {
  const laborHours = inputs.videoHours * inputs.manualTimeMultiplier
  const laborCost = laborHours * inputs.manualCostPerHour
  const overheadPerProject = inputs.monthlyOverhead / inputs.projectsPerMonth
  const totalPerProject = laborCost + overheadPerProject
  const totalMonthly =
    laborCost * inputs.projectsPerMonth + inputs.monthlyOverhead

  return {
    laborHours,
    laborCost,
    apiCost: 0,
    serviceCost: 0,
    totalPerProject,
    totalMonthly,
    costPerVideoHour: totalPerProject / inputs.videoHours,
    timePerProject: laborHours,
  }
}

function calcAutomated(inputs: CalculatorInputs): CostBreakdown {
  const apiCost = inputs.videoHours * 60 * inputs.apiCostPerMinute
  const editHours = inputs.videoHours * inputs.editTimeRatio
  const laborCost = editHours * inputs.manualCostPerHour
  const servicePerProject = inputs.monthlyServiceCost / inputs.projectsPerMonth
  const overheadPerProject = inputs.monthlyOverhead / inputs.projectsPerMonth
  const totalPerProject = apiCost + laborCost + servicePerProject + overheadPerProject
  const totalMonthly =
    (apiCost + laborCost) * inputs.projectsPerMonth +
    inputs.monthlyServiceCost +
    inputs.monthlyOverhead

  return {
    laborHours: editHours,
    laborCost,
    apiCost,
    serviceCost: inputs.monthlyServiceCost,
    totalPerProject,
    totalMonthly,
    costPerVideoHour: totalPerProject / inputs.videoHours,
    timePerProject: editHours,
  }
}

export function calculateComparison(
  inputs: CalculatorInputs,
): ComparisonResult {
  const manual = calcManual(inputs)
  const automated = calcAutomated(inputs)

  const savingsPerProject = manual.totalPerProject - automated.totalPerProject
  const savingsMonthly = manual.totalMonthly - automated.totalMonthly
  const savingsPercent =
    manual.totalMonthly > 0 ? (savingsMonthly / manual.totalMonthly) * 100 : 0
  const timeSavedPerProject = manual.timePerProject - automated.timePerProject
  const timeSavedPercent =
    manual.timePerProject > 0
      ? (timeSavedPerProject / manual.timePerProject) * 100
      : 0

  return {
    manual,
    automated,
    savingsPerProject,
    savingsMonthly,
    savingsPercent,
    timeSavedPerProject,
    timeSavedPercent,
  }
}

function calcUnitEconomicsRow(
  margin: number,
  costPerProject: number,
  videoHours: number,
  projectsPerMonth: number,
  fixedMonthlyCost: number,
): UnitEconomicsRow {
  const marginFraction = margin / 100
  const sellingPricePerHour =
    costPerProject / videoHours / (1 - marginFraction)
  const revenuePerProject = sellingPricePerHour * videoHours
  const profitPerProject = revenuePerProject - costPerProject
  const monthlyRevenue = revenuePerProject * projectsPerMonth
  const monthlyProfit = profitPerProject * projectsPerMonth
  const breakEvenProjects =
    profitPerProject > 0
      ? Math.ceil(fixedMonthlyCost / profitPerProject)
      : Infinity
  const roi =
    costPerProject > 0 ? (profitPerProject / costPerProject) * 100 : 0

  return {
    margin,
    sellingPricePerHour,
    revenuePerProject,
    profitPerProject,
    monthlyRevenue,
    monthlyProfit,
    breakEvenProjects,
    roi,
  }
}

export function calculateUnitEconomics(
  inputs: CalculatorInputs,
  comparison: ComparisonResult,
): UnitEconomicsResult {
  const manualFixed = inputs.monthlyOverhead
  const autoFixed = inputs.monthlyServiceCost + inputs.monthlyOverhead

  const manual = MARGINS.map((m) =>
    calcUnitEconomicsRow(
      m,
      comparison.manual.totalPerProject,
      inputs.videoHours,
      inputs.projectsPerMonth,
      manualFixed,
    ),
  )

  const automated = MARGINS.map((m) =>
    calcUnitEconomicsRow(
      m,
      comparison.automated.totalPerProject,
      inputs.videoHours,
      inputs.projectsPerMonth,
      autoFixed,
    ),
  )

  return { manual, automated }
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
