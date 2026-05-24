import { useState } from 'react'
import type { CalculatorInputs, UnitEconomicsResult } from '../types'
import { formatCurrency, formatNumber } from '../utils/calculations'
import styles from './UnitEconomicsSection.module.css'

interface Props {
  economics: UnitEconomicsResult
  inputs: CalculatorInputs
}

export function UnitEconomicsSection({ economics, inputs }: Props) {
  const [mode, setMode] = useState<'automated' | 'manual'>('automated')
  const rows = mode === 'automated' ? economics.automated : economics.manual

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Юнит-экономика</h2>
        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${mode === 'automated' ? styles.active : ''}`}
            onClick={() => setMode('automated')}
          >
            🤖 Авто
          </button>
          <button
            className={`${styles.toggleBtn} ${mode === 'manual' ? styles.active : ''}`}
            onClick={() => setMode('manual')}
          >
            🖊 Ручной
          </button>
        </div>
      </div>

      <p className={styles.note}>
        Текущая цена для клиента: <strong>{formatCurrency(inputs.clientPricePerHour)}</strong> за час
        &nbsp;·&nbsp; Объём: <strong>{formatNumber(inputs.videoHours)}</strong> ч/проект
        &nbsp;·&nbsp; <strong>{formatNumber(inputs.projectsPerMonth, 0)}</strong> проектов/мес
      </p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Маржа</th>
              <th className={styles.th}>Цена за час</th>
              <th className={styles.th}>Выручка / проект</th>
              <th className={styles.th}>Прибыль / проект</th>
              <th className={styles.th}>Выручка / мес</th>
              <th className={styles.th}>Прибыль / мес</th>
              <th className={styles.th}>Безубыточность</th>
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
                  {formatCurrency(row.sellingPricePerHour)}
                </td>
                <td className={styles.td}>
                  {formatCurrency(row.revenuePerProject)}
                </td>
                <td
                  className={`${styles.td} ${row.profitPerProject >= 0 ? styles.positive : styles.negative}`}
                >
                  {formatCurrency(row.profitPerProject)}
                </td>
                <td className={styles.td}>
                  {formatCurrency(row.monthlyRevenue)}
                </td>
                <td
                  className={`${styles.td} ${row.monthlyProfit >= 0 ? styles.positive : styles.negative}`}
                >
                  {formatCurrency(row.monthlyProfit)}
                </td>
                <td className={styles.td}>
                  {row.breakEvenProjects === Infinity
                    ? '—'
                    : `${row.breakEvenProjects} проект.`}
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
