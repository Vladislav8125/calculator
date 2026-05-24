import { useState, useMemo } from 'react'
import type { CalculatorInputs } from './types'
import { DEFAULT_INPUTS } from './types'
import { calculateComparison, calculateUnitEconomics } from './utils/calculations'
import { InputSection } from './components/InputSection'
import { ComparisonSection } from './components/ComparisonSection'
import { UnitEconomicsSection } from './components/UnitEconomicsSection'
import { SummaryCards } from './components/SummaryCards'
import styles from './App.module.css'

function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS)

  const comparison = useMemo(() => calculateComparison(inputs), [inputs])
  const unitEconomics = useMemo(
    () => calculateUnitEconomics(inputs, comparison),
    [inputs, comparison],
  )

  const handleChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Калькулятор экономики проектов</h1>
          <p className={styles.subtitle}>
            Расчёт затрат на расшифровку видео: ручной vs автоматизированный подход
          </p>
        </div>
      </header>

      <main className={styles.main}>
        <InputSection inputs={inputs} onChange={handleChange} />
        <SummaryCards comparison={comparison} inputs={inputs} />
        <ComparisonSection comparison={comparison} />
        <UnitEconomicsSection economics={unitEconomics} inputs={inputs} />
      </main>

      <footer className={styles.footer}>
        <p>Калькулятор экономики проектов &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
