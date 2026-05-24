import { useState, useMemo } from 'react'
import type { CalculatorInputs } from './types'
import { DEFAULT_INPUTS } from './types'
import { calculate, calculateSalesFunnel } from './utils/calculations'
import { InputSection } from './components/InputSection'
import { SummaryCards } from './components/SummaryCards'
import { ExpensesSection } from './components/ExpensesSection'
import { UnitEconomicsSection } from './components/UnitEconomicsSection'
import { SalesFunnelSection } from './components/SalesFunnelSection'
import styles from './App.module.css'

function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS)

  const result = useMemo(() => calculate(inputs), [inputs])
  const funnel = useMemo(() => calculateSalesFunnel(result), [result])

  const handleChange = (
    field: keyof CalculatorInputs,
    value: number | string | null,
  ) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Калькулятор экономики проектов</h1>
          <p className={styles.subtitle}>
            Расчёт стоимости обработки видео через AI-сервисы и юнит-экономика
            рилсов
          </p>
        </div>
      </header>

      <main className={styles.main}>
        <InputSection inputs={inputs} onChange={handleChange} />
        <SummaryCards result={result} />
        <ExpensesSection result={result} />
        <UnitEconomicsSection result={result} />
        <SalesFunnelSection funnel={funnel} />
      </main>

      <footer className={styles.footer}>
        <p>Калькулятор экономики проектов &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
