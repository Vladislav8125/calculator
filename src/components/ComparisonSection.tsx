import type { ComparisonResult } from '../types'
import { formatCurrency, formatNumber } from '../utils/calculations'
import styles from './ComparisonSection.module.css'

interface Props {
  comparison: ComparisonResult
}

export function ComparisonSection({ comparison }: Props) {
  const { manual, automated } = comparison

  const rows = [
    {
      label: 'Трудозатраты (часы)',
      manual: `${formatNumber(manual.laborHours)} ч`,
      auto: `${formatNumber(automated.laborHours)} ч`,
    },
    {
      label: 'Оплата труда',
      manual: formatCurrency(manual.laborCost),
      auto: formatCurrency(automated.laborCost),
    },
    {
      label: 'Стоимость API',
      manual: '—',
      auto: formatCurrency(automated.apiCost),
    },
    {
      label: 'Сервисы (в месяц)',
      manual: '—',
      auto: formatCurrency(automated.serviceCost),
    },
    {
      label: 'Себестоимость проекта',
      manual: formatCurrency(manual.totalPerProject),
      auto: formatCurrency(automated.totalPerProject),
      highlight: true,
    },
    {
      label: 'Себестоимость 1 часа видео',
      manual: formatCurrency(manual.costPerVideoHour),
      auto: formatCurrency(automated.costPerVideoHour),
    },
    {
      label: 'Затраты в месяц',
      manual: formatCurrency(manual.totalMonthly),
      auto: formatCurrency(automated.totalMonthly),
      highlight: true,
    },
  ]

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>
        Сравнение: ручной vs автоматизированный подход
      </h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Показатель</th>
              <th className={`${styles.th} ${styles.manual}`}>
                🖊 Без автоматизации
              </th>
              <th className={`${styles.th} ${styles.auto}`}>
                🤖 С автоматизацией
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.label}
                className={row.highlight ? styles.highlightRow : ''}
              >
                <td className={styles.td}>{row.label}</td>
                <td className={`${styles.td} ${styles.manualCell}`}>
                  {row.manual}
                </td>
                <td className={`${styles.td} ${styles.autoCell}`}>
                  {row.auto}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
