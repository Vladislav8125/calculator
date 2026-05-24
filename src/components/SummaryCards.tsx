import type { CalculatorResult } from '../types'
import {
  formatCurrency,
  formatMinutes,
  formatNumber,
  formatPercent,
} from '../utils/calculations'
import styles from './SummaryCards.module.css'

interface Props {
  result: CalculatorResult
}

export function SummaryCards({ result }: Props) {
  const { project, costs, client } = result

  const cards = [
    {
      label: 'Время обработки проекта',
      value: formatMinutes(project.totalProcessingMinutes),
      extra: `${formatNumber(project.processingMinutesPerHour, 0)} мин на 1 час видео`,
      className: styles.time,
    },
    {
      label: 'Время создания 1 рилса',
      value: formatMinutes(project.timePerReelMinutes),
      extra: `${formatNumber(project.totalReels, 0)} рилсов в проекте`,
      className: styles.time,
    },
    {
      label: 'Стоимость 1 рилса для клиента',
      value: formatCurrency(client.reelPriceForClient),
      extra: `Проект: ${formatCurrency(client.projectPriceForClient)}`,
      className: styles.client,
    },
    {
      label: 'Себестоимость 1 рилса (без авто)',
      value: formatCurrency(costs.reelCostWithoutAutomationRub),
      extra: `Проект: ${formatCurrency(costs.projectCostWithoutAutomationRub)}`,
      className: styles.cost,
    },
    {
      label: 'Себестоимость 1 рилса (с авто)',
      value: formatCurrency(costs.reelCostWithAutomationRub),
      extra: `+ ${formatCurrency(costs.automationCostRub)} на автоматизацию`,
      className: styles.costAuto,
    },
    {
      label: 'Маржинальность',
      value: formatPercent(client.marginWithAutomation),
      extra: `Без авто: ${formatPercent(client.marginWithoutAutomation)}`,
      className: styles.margin,
    },
  ]

  return (
    <section className={styles.section}>
      <div className={styles.cards}>
        {cards.map((card) => (
          <div key={card.label} className={`${styles.card} ${card.className}`}>
            <span className={styles.cardLabel}>{card.label}</span>
            <span className={styles.cardValue}>{card.value}</span>
            <span className={styles.cardExtra}>{card.extra}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
