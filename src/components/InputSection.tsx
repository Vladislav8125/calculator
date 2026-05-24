import type { CalculatorInputs } from '../types'
import styles from './InputSection.module.css'

interface Props {
  inputs: CalculatorInputs
  onChange: (field: keyof CalculatorInputs, value: number) => void
}

interface FieldConfig {
  key: keyof CalculatorInputs
  label: string
  hint: string
  min: number
  max: number
  step: number
  suffix: string
}

const PROJECT_FIELDS: FieldConfig[] = [
  {
    key: 'videoHours',
    label: 'Часов видео на проект',
    hint: 'Объём видео в одном проекте',
    min: 0.5,
    max: 100,
    step: 0.5,
    suffix: 'ч',
  },
  {
    key: 'projectsPerMonth',
    label: 'Проектов в месяц',
    hint: 'Среднее количество проектов',
    min: 1,
    max: 100,
    step: 1,
    suffix: 'шт',
  },
  {
    key: 'clientPricePerHour',
    label: 'Цена для клиента за час',
    hint: 'Сколько клиент платит за 1 час расшифровки',
    min: 0,
    max: 50000,
    step: 100,
    suffix: '₽',
  },
]

const COST_FIELDS: FieldConfig[] = [
  {
    key: 'manualCostPerHour',
    label: 'Ставка специалиста',
    hint: 'Оплата за час работы расшифровщика',
    min: 100,
    max: 5000,
    step: 50,
    suffix: '₽/ч',
  },
  {
    key: 'manualTimeMultiplier',
    label: 'Коэффициент ручной расшифровки',
    hint: 'Сколько часов работы на 1 час видео',
    min: 1,
    max: 10,
    step: 0.5,
    suffix: 'x',
  },
  {
    key: 'apiCostPerMinute',
    label: 'Стоимость API за минуту',
    hint: 'Цена распознавания 1 мин аудио через API',
    min: 0,
    max: 50,
    step: 0.1,
    suffix: '₽',
  },
  {
    key: 'monthlyServiceCost',
    label: 'Стоимость сервисов',
    hint: 'Подписки на SaaS-инструменты в месяц',
    min: 0,
    max: 100000,
    step: 500,
    suffix: '₽/мес',
  },
  {
    key: 'editTimeRatio',
    label: 'Время на редактуру после AI',
    hint: 'Доля часа на правку 1 часа расшифровки',
    min: 0,
    max: 3,
    step: 0.1,
    suffix: 'x',
  },
  {
    key: 'monthlyOverhead',
    label: 'Накладные расходы',
    hint: 'Аренда, связь, ПО, прочие постоянные расходы',
    min: 0,
    max: 500000,
    step: 1000,
    suffix: '₽/мес',
  },
]

function InputField({
  field,
  value,
  onChange,
}: {
  field: FieldConfig
  value: number
  onChange: (key: keyof CalculatorInputs, v: number) => void
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={field.key}>
        {field.label}
        <span className={styles.suffix}>{field.suffix}</span>
      </label>
      <input
        id={field.key}
        type="number"
        className={styles.input}
        value={value}
        min={field.min}
        max={field.max}
        step={field.step}
        onChange={(e) => onChange(field.key, parseFloat(e.target.value) || 0)}
      />
      <span className={styles.hint}>{field.hint}</span>
    </div>
  )
}

export function InputSection({ inputs, onChange }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Параметры расчёта</h2>
      <div className={styles.groups}>
        <div className={styles.group}>
          <h3 className={styles.groupTitle}>📋 Проект</h3>
          <div className={styles.fields}>
            {PROJECT_FIELDS.map((f) => (
              <InputField
                key={f.key}
                field={f}
                value={inputs[f.key]}
                onChange={onChange}
              />
            ))}
          </div>
        </div>
        <div className={styles.group}>
          <h3 className={styles.groupTitle}>💰 Затраты</h3>
          <div className={styles.fields}>
            {COST_FIELDS.map((f) => (
              <InputField
                key={f.key}
                field={f}
                value={inputs[f.key]}
                onChange={onChange}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
