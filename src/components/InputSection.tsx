import type { CalculatorInputs } from '../types'
import { VIDEO_SERVICES } from '../data/services'
import { formatUsd } from '../utils/calculations'
import styles from './InputSection.module.css'

interface Props {
  inputs: CalculatorInputs
  onChange: (field: keyof CalculatorInputs, value: number | string | null) => void
}

interface NumberField {
  key: keyof CalculatorInputs
  label: string
  hint: string
  min: number
  max: number
  step: number
  suffix: string
}

const PROJECT_FIELDS: NumberField[] = [
  {
    key: 'videoCount',
    label: 'Число видео',
    hint: 'Количество исходных видео в проекте',
    min: 1,
    max: 100,
    step: 1,
    suffix: 'шт',
  },
  {
    key: 'videoDurationMinutes',
    label: 'Длительность 1 видео',
    hint: 'Средняя длина одного исходного видео',
    min: 1,
    max: 600,
    step: 1,
    suffix: 'мин',
  },
  {
    key: 'clientPricePerHour',
    label: 'Цена для клиента за час',
    hint: 'Сколько клиент платит за 1 час обработки видео',
    min: 0,
    max: 100000,
    step: 100,
    suffix: '₽',
  },
]

function NumberInput({
  field,
  value,
  onChange,
}: {
  field: NumberField
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

function ServiceSelect({
  id,
  label,
  hint,
  value,
  allowEmpty,
  emptyLabel,
  onChange,
}: {
  id: string
  label: string
  hint: string
  value: string | null
  allowEmpty?: boolean
  emptyLabel?: string
  onChange: (value: string | null) => void
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className={styles.select}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || null)}
      >
        {allowEmpty && <option value="">{emptyLabel ?? 'Не выбран'}</option>}
        {VIDEO_SERVICES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.site}) — {formatUsd(s.monthlyCostUsd)}/мес, ~
            {formatUsd(s.hourlyCostUsd)}/час
          </option>
        ))}
      </select>
      <span className={styles.hint}>{hint}</span>
    </div>
  )
}

export function InputSection({ inputs, onChange }: Props) {
  const primary = VIDEO_SERVICES.find((s) => s.id === inputs.primaryServiceId)
  const secondary = inputs.secondaryServiceId
    ? VIDEO_SERVICES.find((s) => s.id === inputs.secondaryServiceId)
    : null

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Параметры расчёта</h2>
      <div className={styles.groups}>
        <div className={styles.group}>
          <h3 className={styles.groupTitle}>📋 Проект</h3>
          <div className={styles.fields}>
            {PROJECT_FIELDS.map((f) => (
              <NumberInput
                key={f.key}
                field={f}
                value={inputs[f.key] as number}
                onChange={onChange}
              />
            ))}
            <ServiceSelect
              id="primaryService"
              label="Сервис обработки видео"
              hint={
                primary?.note ??
                'Основной сервис для нарезки и обработки видео'
              }
              value={inputs.primaryServiceId}
              onChange={(v) => v && onChange('primaryServiceId', v)}
            />
            <ServiceSelect
              id="secondaryService"
              label="Сервис субтитров (опционально)"
              hint={
                secondary?.note ??
                'Captions или другой сервис для субтитров; увеличивает время обработки'
              }
              value={inputs.secondaryServiceId}
              allowEmpty
              emptyLabel="Не используется"
              onChange={(v) => onChange('secondaryServiceId', v)}
            />
          </div>
        </div>

        <div className={styles.group}>
          <h3 className={styles.groupTitle}>💱 Настройки</h3>
          <div className={styles.fields}>
            <NumberInput
              field={{
                key: 'usdToRubRate',
                label: 'Курс USD → RUB',
                hint: 'Для пересчёта стоимости сервисов в рубли',
                min: 50,
                max: 200,
                step: 1,
                suffix: '₽/$',
              }}
              value={inputs.usdToRubRate}
              onChange={onChange}
            />
            <div className={styles.infoBox}>
              <p>
                <strong>Автоматизация:</strong> 2 000 ₽ на каждые 3 часа видео
              </p>
              <p>
                <strong>Рилсы:</strong> 30 шт. из 1 часа исходного видео
              </p>
              <p>
                <strong>Время обработки:</strong> 20 мин/час (1 сервис) или 60
                мин/час (2 сервиса)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
