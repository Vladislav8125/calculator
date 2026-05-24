import type { CalculatorResult } from '../types'
import { formatCurrency, formatNumber } from '../utils/calculations'
import styles from './ExpensesSection.module.css'

interface Props {
  result: CalculatorResult
}

export function ExpensesSection({ result }: Props) {
  const { project, costs, client } = result

  const expenseRows = [
    {
      label: 'Стоимость обработки 1 часа видео',
      value: formatCurrency(costs.processingCostPerHourRub),
    },
    {
      label: 'Подписка на сервисы (в месяц)',
      value: formatCurrency(costs.monthlySubscriptionRub),
    },
    {
      label: 'Стоимость обработки проекта',
      value: formatCurrency(costs.projectProcessingCostRub),
      highlight: true,
    },
    {
      label: 'Автоматизация',
      value: formatCurrency(costs.automationCostRub),
      hint: `2 000 ₽ × ${formatNumber(project.totalVideoHours / 3, 1)} (на каждые 3 ч видео)`,
    },
    {
      label: 'Итого с автоматизацией',
      value: formatCurrency(costs.projectCostWithAutomationRub),
      highlight: true,
    },
  ]

  const clientRows = [
    {
      label: 'Стоимость часа обработки для клиента',
      value: formatCurrency(client.clientPricePerHour),
    },
    {
      label: 'Цена 1 рилса для клиента',
      value: formatCurrency(client.reelPriceForClient),
      hint: `${formatCurrency(client.clientPricePerHour)} ÷ 30 рилсов`,
    },
    {
      label: 'Стоимость проекта для клиента',
      value: formatCurrency(client.projectPriceForClient),
      highlight: true,
      hint: `${formatCurrency(client.clientPricePerHour)} × ${formatNumber(project.totalVideoHours, 1)} ч`,
    },
  ]

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.block}>
          <h2 className={styles.sectionTitle}>💰 Расходы</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <tbody>
                {expenseRows.map((row) => (
                  <tr
                    key={row.label}
                    className={row.highlight ? styles.highlightRow : ''}
                  >
                    <td className={styles.td}>{row.label}</td>
                    <td className={styles.tdValue}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {expenseRows
            .filter((r) => r.hint)
            .map((r) => (
              <p key={r.label} className={styles.rowHint}>
                {r.label}: {r.hint}
              </p>
            ))}
        </div>

        <div className={styles.block}>
          <h2 className={styles.sectionTitle}>🤝 Для клиента</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <tbody>
                {clientRows.map((row) => (
                  <tr
                    key={row.label}
                    className={row.highlight ? styles.highlightRow : ''}
                  >
                    <td className={styles.td}>{row.label}</td>
                    <td className={styles.tdValue}>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {clientRows
            .filter((r) => r.hint)
            .map((r) => (
              <p key={r.label} className={styles.rowHint}>
                {r.label}: {r.hint}
              </p>
            ))}
        </div>
      </div>
    </section>
  )
}
