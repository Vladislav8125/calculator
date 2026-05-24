import type { SalesFunnelResult } from '../types'
import { formatCurrency, formatNumber, formatPercent } from '../utils/calculations'
import styles from './SalesFunnelSection.module.css'

interface Props {
  funnel: SalesFunnelResult
}

export function SalesFunnelSection({ funnel }: Props) {
  const maxCount = funnel.steps[0]?.count ?? 1

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        Воронка продаж — цель {formatCurrency(funnel.targetRevenue)} выручки
      </h2>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Цена проекта</span>
          <span className={styles.summaryValue}>
            {formatCurrency(funnel.projectPrice)}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Нужно закрыть проектов</span>
          <span className={styles.summaryValue}>
            {formatNumber(funnel.projectsNeeded, 0)}
          </span>
        </div>
      </div>

      <div className={styles.funnel}>
        {funnel.steps.map((step, index) => {
          const widthPercent =
            maxCount > 0 ? Math.max(15, (step.count / maxCount) * 100) : 15
          const conversionRate = funnel.steps[index + 1]?.conversionRate

          return (
            <div key={step.stage} className={styles.step}>
              <div
                className={styles.stepBar}
                style={{ width: `${widthPercent}%` }}
              >
                <span className={styles.stepName}>{step.stage}</span>
                <span className={styles.stepCount}>
                  {formatNumber(step.count, 0)}
                </span>
              </div>
              {conversionRate !== null && conversionRate !== undefined && (
                <span className={styles.conversion}>
                  → {formatPercent(conversionRate * 100)}
                </span>
              )}
            </div>
          )
        })}
      </div>

      <p className={styles.note}>
        Конверсии: заявка → квалификация 40% · квалификация → встреча 50% ·
        встреча → КП 60% · КП → сделка 35%. Расчёт снизу вверх от нужного
        числа проектов.
      </p>
    </section>
  )
}
