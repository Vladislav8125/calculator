import { useState } from 'react'
import type { CalculatorResult } from '../types'
import {
  calculateUnitEconomics,
  formatCurrency,
  formatNumber,
} from '../utils/calculations'
import styles from './UnitEconomicsSection.module.css'

interface Props {
  result: CalculatorResult
}

export function UnitEconomicsSection({ result }: Props) {
  const [withAutomation, setWithAutomation] = useState(true)
  const rows = calculateUnitEconomics(result, withAutomation)

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Юнит-экономика по маржинальности</h2>
        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${withAutomation ? styles.active : ''}`}
            onClick={() => setWithAutomation(true)}
          >
            🤖 С автоматизацией
          </button>
          <button
            className={`${styles.toggleBtn} ${!withAutomation ? styles.active : ''}`}
            onClick={() => setWithAutomation(false)}
          >
            📦 Без автоматизации
          </button>
        </div>
      </div>

      <p className={styles.note}>
        Себестоимость проекта:{' '}
        <strong>
          {formatCurrency(
            withAutomation
              ? result.costs.projectCostWithAutomationRub
              : result.costs.projectCostWithoutAutomationRub,
          )}
        </strong>
        &nbsp;·&nbsp; Рилсов:{' '}
        <strong>{formatNumber(result.project.totalReels, 0)}</strong>
        &nbsp;·&nbsp; Часов видео:{' '}
        <strong>{formatNumber(result.project.totalVideoHours, 1)}</strong>
      </p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Маржа</th>
              <th className={styles.th}>Цена за рилс</th>
              <th className={styles.th}>Выручка / проект</th>
              <th className={styles.th}>Прибыль / проект</th>
              <th className={styles.th}>Прибыль / рилс</th>
              <th className={styles.th}>ROI</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.margin}>
                <td className={`${styles.td} ${styles.marginCell}`}>
                  {row.margin}%
                </td>
                <td className={styles.td}>
                  {formatCurrency(row.sellingPricePerReel)}
                </td>
                <td className={styles.td}>
                  {formatCurrency(row.revenuePerProject)}
                </td>
                <td
                  className={`${styles.td} ${row.profitPerProject >= 0 ? styles.positive : styles.negative}`}
                >
                  {formatCurrency(row.profitPerProject)}
                </td>
                <td
                  className={`${styles.td} ${row.profitPerReel >= 0 ? styles.positive : styles.negative}`}
                >
                  {formatCurrency(row.profitPerReel)}
                </td>
                <td className={styles.td}>{formatNumber(row.roi)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
