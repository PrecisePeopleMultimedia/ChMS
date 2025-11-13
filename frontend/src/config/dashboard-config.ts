/**
 * Dashboard Configuration
 * Default KPI card definitions and dashboard settings
 */

import type { TrendDirection } from '@/components/dashboard/KPICard.vue'

export interface KPICardData {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  trend?: TrendDirection
  icon: string
  color?: 'primary' | 'success' | 'accent' | 'info' | 'warning'
  subtitle?: string
  loading?: boolean
}

export interface KPICardDefinition {
  id: string
  title: string
  category: 'membership' | 'attendance' | 'giving' | 'engagement' | 'events'
  recommended: boolean
  cardProps: KPICardData
}

export interface DashboardConfig {
  cardsPerRow: 2 | 3 | 4
  rowCount: 1 | 2
  density: 'compact' | 'standard' | 'comfortable'
  visibleCards: string[]
}

export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  cardsPerRow: 3,
  rowCount: 2,
  density: 'standard',
  visibleCards: [
    'total-members',
    'weekly-attendance',
    'monthly-giving',
    'active-groups',
    'upcoming-events',
    'first-timers',
  ],
}

// All available KPI cards
export const AVAILABLE_KPI_CARDS: KPICardDefinition[] = [
  // Membership Cards
  {
    id: 'total-members',
    title: 'Total Members',
    category: 'membership',
    recommended: true,
    cardProps: {
      title: 'Total Members',
      value: '1,248',
      change: 12,
      changeLabel: 'vs last month',
      trend: 'up',
      icon: 'people',
      color: 'primary',
      subtitle: 'Active members',
    },
  },
  {
    id: 'new-members',
    title: 'New Members',
    category: 'membership',
    recommended: true,
    cardProps: {
      title: 'New Members',
      value: '32',
      change: 28,
      changeLabel: 'this month',
      trend: 'up',
      icon: 'person_add',
      color: 'success',
      subtitle: 'Monthly additions',
    },
  },
  {
    id: 'member-retention',
    title: 'Member Retention',
    category: 'membership',
    recommended: false,
    cardProps: {
      title: 'Member Retention',
      value: '94.2%',
      change: 2.1,
      changeLabel: 'vs last quarter',
      trend: 'up',
      icon: 'shield',
      color: 'info',
      subtitle: '90-day retention',
    },
  },
  {
    id: 'inactive-members',
    title: 'Inactive Members',
    category: 'membership',
    recommended: false,
    cardProps: {
      title: 'Inactive Members',
      value: '87',
      change: -5,
      changeLabel: 'vs last month',
      trend: 'down',
      icon: 'warning',
      color: 'warning',
      subtitle: '30+ days inactive',
    },
  },

  // Attendance Cards
  {
    id: 'weekly-attendance',
    title: 'Weekly Attendance',
    category: 'attendance',
    recommended: true,
    cardProps: {
      title: 'Weekly Attendance',
      value: '342',
      change: 8,
      changeLabel: 'vs last week',
      trend: 'up',
      icon: 'trending_up',
      color: 'success',
      subtitle: 'Sunday service',
    },
  },
  {
    id: 'attendance-rate',
    title: 'Attendance Rate',
    category: 'attendance',
    recommended: false,
    cardProps: {
      title: 'Attendance Rate',
      value: '68%',
      change: 3,
      changeLabel: 'vs last month',
      trend: 'up',
      icon: 'bar_chart',
      color: 'info',
      subtitle: 'Average weekly',
    },
  },
  {
    id: 'midweek-attendance',
    title: 'Midweek Service',
    category: 'attendance',
    recommended: false,
    cardProps: {
      title: 'Midweek Service',
      value: '124',
      change: -2,
      changeLabel: 'vs last week',
      trend: 'down',
      icon: 'schedule',
      color: 'accent',
      subtitle: 'Wednesday service',
    },
  },
  {
    id: 'first-timers',
    title: 'First Timers',
    category: 'attendance',
    recommended: true,
    cardProps: {
      title: 'First Timers',
      value: '23',
      change: 18,
      changeLabel: 'this month',
      trend: 'up',
      icon: 'target',
      color: 'success',
      subtitle: 'New visitors',
    },
  },

  // Giving & Finance Cards
  {
    id: 'monthly-giving',
    title: 'Monthly Giving',
    category: 'giving',
    recommended: true,
    cardProps: {
      title: 'Monthly Giving',
      value: '₦89.8k',
      change: 15,
      changeLabel: 'vs last month',
      trend: 'up',
      icon: 'payments',
      color: 'primary',
      subtitle: 'All sources',
    },
  },
  {
    id: 'online-giving',
    title: 'Online Giving',
    category: 'giving',
    recommended: false,
    cardProps: {
      title: 'Online Giving',
      value: '₦42.3k',
      change: 22,
      changeLabel: 'vs last month',
      trend: 'up',
      icon: 'credit_card',
      color: 'success',
      subtitle: 'Digital payments',
    },
  },
  {
    id: 'pledges',
    title: 'Active Pledges',
    category: 'giving',
    recommended: false,
    cardProps: {
      title: 'Active Pledges',
      value: '₦156k',
      change: 8,
      changeLabel: 'vs last month',
      trend: 'up',
      icon: 'card_giftcard',
      color: 'accent',
      subtitle: 'Commitment total',
    },
  },
  {
    id: 'donors',
    title: 'Active Donors',
    category: 'giving',
    recommended: false,
    cardProps: {
      title: 'Active Donors',
      value: '284',
      change: 6,
      changeLabel: 'this month',
      trend: 'up',
      icon: 'favorite',
      color: 'primary',
      subtitle: 'Monthly givers',
    },
  },

  // Engagement Cards
  {
    id: 'active-groups',
    title: 'Active Groups',
    category: 'engagement',
    recommended: true,
    cardProps: {
      title: 'Active Groups',
      value: '24',
      change: 2,
      changeLabel: 'new this month',
      trend: 'up',
      icon: 'groups',
      color: 'info',
      subtitle: 'Fellowship groups',
    },
  },
  {
    id: 'group-participation',
    title: 'Group Participation',
    category: 'engagement',
    recommended: false,
    cardProps: {
      title: 'Group Participation',
      value: '456',
      change: 12,
      changeLabel: 'active members',
      trend: 'up',
      icon: 'star',
      color: 'accent',
      subtitle: 'In small groups',
    },
  },
  {
    id: 'volunteers',
    title: 'Active Volunteers',
    category: 'engagement',
    recommended: false,
    cardProps: {
      title: 'Active Volunteers',
      value: '89',
      change: 7,
      changeLabel: 'this month',
      trend: 'up',
      icon: 'workspace_premium',
      color: 'success',
      subtitle: 'Serving regularly',
    },
  },
  {
    id: 'prayer-requests',
    title: 'Prayer Requests',
    category: 'engagement',
    recommended: false,
    cardProps: {
      title: 'Prayer Requests',
      value: '34',
      change: 5,
      changeLabel: 'this week',
      trend: 'up',
      icon: 'message',
      color: 'info',
      subtitle: 'Needs attention',
    },
  },

  // Events & Programs Cards
  {
    id: 'upcoming-events',
    title: 'Upcoming Events',
    category: 'events',
    recommended: true,
    cardProps: {
      title: 'Upcoming Events',
      value: '8',
      change: -1,
      changeLabel: 'vs last month',
      trend: 'down',
      icon: 'event',
      color: 'accent',
      subtitle: 'Next 30 days',
    },
  },
  {
    id: 'event-registrations',
    title: 'Event Registrations',
    category: 'events',
    recommended: false,
    cardProps: {
      title: 'Event Registrations',
      value: '156',
      change: 34,
      changeLabel: 'this week',
      trend: 'up',
      icon: 'check_circle',
      color: 'success',
      subtitle: 'Upcoming events',
    },
  },
  {
    id: 'sunday-school',
    title: 'Sunday School',
    category: 'events',
    recommended: false,
    cardProps: {
      title: 'Sunday School',
      value: '78',
      change: 4,
      changeLabel: 'this week',
      trend: 'up',
      icon: 'menu_book',
      color: 'info',
      subtitle: 'Children enrolled',
    },
  },
  {
    id: 'ministry-programs',
    title: 'Ministry Programs',
    category: 'events',
    recommended: false,
    cardProps: {
      title: 'Ministry Programs',
      value: '12',
      change: 1,
      changeLabel: 'active',
      trend: 'up',
      icon: 'church',
      color: 'primary',
      subtitle: 'Running programs',
    },
  },
]

/**
 * Get card data by ID
 */
export function getCardDataById(cardId: string): KPICardData | null {
  const card = AVAILABLE_KPI_CARDS.find(c => c.id === cardId)
  return card?.cardProps || null
}

/**
 * Get all card definitions
 */
export function getCardDefinitions(): KPICardDefinition[] {
  return AVAILABLE_KPI_CARDS
}

/**
 * Get recommended cards
 */
export function getRecommendedCards(): KPICardDefinition[] {
  return AVAILABLE_KPI_CARDS.filter(card => card.recommended)
}

