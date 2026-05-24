export interface CalculatorInputs {
  videoHours: number
  projectsPerMonth: number
  manualCostPerHour: number
  manualTimeMultiplier: number
  apiCostPerMinute: number
  monthlyServiceCost: number
  editTimeRatio: number
  clientPricePerHour: number
  monthlyOverhead: number
}

export interface CostBreakdown {
  laborHours: number
  laborCost: number
  apiCost: number
  serviceCost: number
  totalPerProject: number
  totalMonthly: number
  costPerVideoHour: number
  timePerProject: number
}

export interface ComparisonResult {
  manual: CostBreakdown
  automated: CostBreakdown
  savingsPerProject: number
  savingsMonthly: number
  savingsPercent: number
  timeSavedPerProject: number
  timeSavedPercent: number
}

export interface UnitEconomicsRow {
  margin: number
  sellingPricePerHour: number
  revenuePerProject: number
  profitPerProject: number
  monthlyRevenue: number
  monthlyProfit: number
  breakEvenProjects: number
  roi: number
}

export interface UnitEconomicsResult {
  manual: UnitEconomicsRow[]
  automated: UnitEconomicsRow[]
}

export const DEFAULT_INPUTS: CalculatorInputs = {
  videoHours: 10,
  projectsPerMonth: 8,
  manualCostPerHour: 500,
  manualTimeMultiplier: 4,
  apiCostPerMinute: 0.6,
  monthlyServiceCost: 3000,
  editTimeRatio: 0.5,
  clientPricePerHour: 2500,
  monthlyOverhead: 15000,
}

export const MARGINS = [10, 20, 30, 40, 50, 60]
