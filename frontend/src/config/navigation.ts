/**
 * Navigation Configuration
 * Centralized navigation items for the application
 */

export interface NavigationItem {
  id: string
  label: string
  href: string
  icon: string // Quasar icon name
  roles?: string[] // Allowed roles (empty = all roles)
  badge?: number // Badge count
}

// Primary navigation (main sidebar)
export const primaryNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard'
  },
  {
    id: 'members',
    label: 'Members',
    href: '/members',
    icon: 'people'
  },
  {
    id: 'attendance',
    label: 'Attendance',
    to: '/attendance',
    icon: 'event_available'
  },
  {
    id: 'giving',
    label: 'Giving',
    href: '/giving',
    icon: 'payments',
    roles: ['admin', 'staff']
  },
  {
    id: 'events',
    label: 'Events',
    href: '/events',
    icon: 'event'
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: 'assessment',
    roles: ['admin', 'staff']
  }
]

// Secondary navigation (sidebar, below primary)
export const secondaryNavigation: NavigationItem[] = [
  {
    id: 'families',
    label: 'Families',
    href: '/families',
    icon: 'family_restroom'
  },
  {
    id: 'groups',
    label: 'Groups',
    href: '/groups',
    icon: 'groups'
  },
  {
    id: 'communication',
    label: 'Communication',
    href: '/communication',
    icon: 'chat'
  }
]

// Utility navigation (sidebar bottom)
export const utilityNavigation: NavigationItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: 'settings'
  },
  {
    id: 'help',
    label: 'Help & Support',
    href: '/help',
    icon: 'help'
  }
]

// Mobile bottom navigation (max 5 items)
export const mobileBottomNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Home',
    href: '/dashboard',
    icon: 'home'
  },
  {
    id: 'members',
    label: 'Members',
    href: '/members',
    icon: 'people'
  },
  {
    id: 'attendance',
    label: 'Check-in',
    href: '/attendance',
    icon: 'check_circle'
  },
  {
    id: 'chat',
    label: 'Chat',
    href: '/chat',
    icon: 'chat'
  },
  {
    id: 'more',
    label: 'More',
    href: '/more',
    icon: 'more_horiz'
  }
]

/**
 * Filter navigation items by user role
 */
export function filterNavigationByRole(
  items: NavigationItem[],
  userRole?: string | null
): NavigationItem[] {
  if (!userRole) {
    return items.filter(item => !item.roles || item.roles.length === 0)
  }
  
  return items.filter(
    item => !item.roles || item.roles.length === 0 || item.roles.includes(userRole)
  )
}

