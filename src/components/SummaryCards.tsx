import type { CalculatorInputs, ComparisonResult } from '../types'
import { formatCurrency, formatNumber, formatPercent } from '../utils/calculations'
import styles from './SummaryCards.module.css'

interface Props {
  comparison: ComparisonResult
  inputs: CalculatorInputs
}

export function SummaryCards({ comparison, inputs }: Props) {
  const monthlyRevenueManual =
    inputs.clientPricePerHour * inputs.videoHours * inputs.projectsPerMonth
  const monthlyProfitManual = monthlyRevenueManual - comparison.manual.totalMonthly
  const monthlyProfitAuto = monthlyRevenueManual - comparison.automated.totalMonthly

  return (
    <section className={styles.section}>
      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.savings}`}>
          <span className={styles.cardLabel}>Экономия в месяц</span>
          <span className={styles.cardValue}>
            {formatCurrency(comparison.savingsMonthly)}
          </span>
          <span className={styles.cardExtra}>
            {formatPercent(comparison.savingsPercent)} от затрат
          </span>
        </div>

        <div className={`${styles.card} ${styles.time}`}>
          <span className={styles.cardLabel}>Экономия времени</span>
          <span className={styles.cardValue}>
            {formatNumber(comparison.timeSavedPerProject)} ч / проект
          </span>
          <span className={styles.cardExtra}>
            {formatPercent(comparison.timeSavedPercent)} быстрее
          </span>
        </div>

        <div className={`${styles.card} ${styles.profit}`}>
          <span className={styles.cardLabel}>Прибыль (ручной)</span>
          <span className={styles.cardValue}>
            {formatCurrency(monthlyProfitManual)}
          </span>
          <span className={styles.cardExtra}>
            в месяц при текущей цене
          </span>
        </div>

        <div className={`${styles.card} ${styles.profitAuto}`}>
          <span className={styles.cardLabel}>Прибыль (авто)</span>
          <span className={styles.cardValue}>
            {formatCurrency(monthlyProfitAuto)}
          </span>
          <span className={styles.cardExtra}>
            + {formatCurrency(monthlyProfitAuto - monthlyProfitManual)} к ручному
          </span>
        </div>
      </div>
    </section>
  )
}
