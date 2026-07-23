import type { Config } from './config'
import type { DailyResult } from './daily'

export type ComparisonRelation = 'longer' | 'shorter' | 'equal'
export type ComparisonTier = 'large' | 'medium' | 'small' | 'equal'

export interface ComparisonResult {
  relation: ComparisonRelation
  difference: number
  tier: ComparisonTier
}

function getDifferenceTier(difference: number): Exclude<ComparisonTier, 'equal'> {
  if (difference >= 21) return 'large'
  if (difference >= 11) return 'medium'
  return 'small'
}

export function compareDailyResults(
  current: DailyResult,
  target: DailyResult,
): ComparisonResult {
  const signedDifference = current.length - target.length
  const difference = Math.abs(signedDifference)

  if (signedDifference === 0) {
    return { relation: 'equal', difference, tier: 'equal' }
  }

  return {
    relation: signedDifference > 0 ? 'longer' : 'shorter',
    difference,
    tier: getDifferenceTier(difference),
  }
}

export function selectComparisonMessage(
  result: ComparisonResult,
  config: Config,
): string {
  if (result.relation === 'equal') {
    return '试试刺刀看看谁能赢吧！'
  }

  if (result.relation === 'longer') {
    if (result.tier === 'large') return config.longerLargeGapMessage
    if (result.tier === 'medium') return config.longerMediumGapMessage
    return config.longerSmallGapMessage
  }

  if (result.tier === 'large') return config.shorterLargeGapMessage
  if (result.tier === 'medium') return config.shorterMediumGapMessage
  return config.shorterSmallGapMessage
}
