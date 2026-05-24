export interface VideoService {
  id: string
  site: string
  name: string
  monthlyCostUsd: number
  hourlyCostUsd: number
  note?: string
  isCaptions?: boolean
}

export const VIDEO_SERVICES: VideoService[] = [
  {
    id: 'opus',
    site: 'opus.pro',
    name: 'OpusClip',
    monthlyCostUsd: 9,
    hourlyCostUsd: 3.6,
    note: 'Starter: 150 минут за $9',
  },
  {
    id: 'vizard',
    site: 'vizard.ai',
    name: 'Vizard',
    monthlyCostUsd: 20,
    hourlyCostUsd: 1.5,
    note: 'Creator: 800 минут за $20',
  },
  {
    id: 'klap',
    site: 'klap.app',
    name: 'Klap',
    monthlyCostUsd: 29,
    hourlyCostUsd: 7.25,
    note: 'Standard: ~$7.25/час по минутам; до $38.67/час по лимиту загрузки',
  },
  {
    id: 'sendshort',
    site: 'sendshort.ai',
    name: 'SendShort',
    monthlyCostUsd: 15,
    hourlyCostUsd: 5,
    note: 'Starter: 100 credits; точный пересчёт за час не подтверждён (~$5/час оценка)',
  },
  {
    id: 'captions',
    site: 'captions.ai',
    name: 'Captions',
    monthlyCostUsd: 15,
    hourlyCostUsd: 2,
    note: 'Субтитры и озвучка; оценочная стоимость',
    isCaptions: true,
  },
]

export const REELS_PER_HOUR = 30
export const AUTOMATION_COST_RUB = 2000
export const AUTOMATION_HOURS = 3
export const PROCESSING_MINUTES_ONE_SERVICE = 20
export const PROCESSING_MINUTES_TWO_SERVICES = 60

export function getServiceById(id: string | null): VideoService | undefined {
  if (!id) return undefined
  return VIDEO_SERVICES.find((s) => s.id === id)
}
