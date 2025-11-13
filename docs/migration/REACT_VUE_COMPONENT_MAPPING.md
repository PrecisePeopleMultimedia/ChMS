# React to Vue Component Mapping Guide
## Exact Styling Equivalents for Pixel-Perfect Conversion

**Purpose**: Direct mapping from React prototype components to Vue+Quasar equivalents with exact styling.

---

## 🎯 Core Principle
**React Component Implementation = Vue Implementation**
Every visual aspect, state, and interaction must match exactly.

---

## 📋 Layout Components

### AppLayout → PrototypeLayout

**React Component Structure:**
```jsx
// ChMS-by-Make/src/components/AppLayout.tsx
<div className="min-h-screen bg-background">
  <div className="flex">
    <Sidebar />
    <main className="flex-1">
      <AppHeader />
      <Outlet />
    </main>
    <SecondarySidebar />
  </div>
  <MobileBottomNav />
</div>
```

**Vue Implementation:**
```vue
<!-- frontend/src/layouts/PrototypeLayout.vue -->
<template>
  <q-layout
    class="prototype-layout"
    view="hHh lpR fFf"
    :style="{ minHeight: '100vh', background: 'var(--background)' }"
  >
    <!-- Left Sidebar (280px) -->
    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      :width="280"
      :breakpoint="1024"
      overlay
      behavior="desktop"
      class="left-drawer"
    >
      <LeftSidebar />
    </q-drawer>

    <!-- Main Content -->
    <q-page-container class="main-content">
      <AppHeader />
      <router-view />
    </q-page-container>

    <!-- Right Sidebar (320px) -->
    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      :width="320"
      :breakpoint="1024"
      overlay
      behavior="desktop"
      class="right-drawer"
    >
      <RightSidebar />
    </q-drawer>

    <!-- Mobile Bottom Navigation -->
    <q-footer class="mobile-bottom-nav" v-model="mobileNavOpen">
      <MobileBottomNav />
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useLayoutStore } from '@/stores/layout';
import LeftSidebar from '@/components/layout/LeftSidebar.vue';
import RightSidebar from '@/components/layout/RightSidebar.vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import MobileBottomNav from '@/components/layout/MobileBottomNav.vue';

const layoutStore = useLayoutStore();
const { leftDrawerOpen, rightDrawerOpen, mobileNavOpen } = storeToRefs(layoutStore);
</script>

<style lang="scss">
.prototype-layout {
  min-height: 100vh;
  background: var(--background);

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .q-drawer {
    background: var(--card);
    border-right: 1px solid oklch(0.2809 0 0 / 0.2);
  }

  .mobile-bottom-nav {
    background: var(--card);
    border-top: 1px solid oklch(0.2809 0 0 / 0.2);
    height: 64px;

    @media (min-width: 768px) {
      display: none;
    }
  }
}
</style>
```

---

## 🧩 Base UI Components

### 1. Button → BaseButton

**React Component:**
```jsx
// ChMS-by-Make/src/components/ui/Button.tsx
interface ButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  children: React.ReactNode;
}

export const Button = ({ variant = 'default', size = 'default', children }: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    link: "underline-offset-4 hover:underline text-primary"
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10"
  };

  return (
    <button className={cn(baseClasses, variants[variant], sizes[size])}>
      {children}
    </button>
  );
}
```

**Vue Implementation:**
```vue
<!-- frontend/src/components/ui/BaseButton.vue -->
<template>
  <q-btn
    :class="buttonClasses"
    :disable="disabled"
    :loading="loading"
    @click="handleClick"
    v-bind="$attrs"
  >
    <slot />
  </q-btn>
</template>

<script setup>
import { computed } from 'vue';

interface Props {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'link';
  size?: 'sm' | 'default' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  disabled: false,
  loading: false
});

const emit = defineEmits<{
  click: [event: Event];
}>();

const buttonClasses = computed(() => {
  const baseClasses = [
    'base-button',
    `base-button--${props.variant}`,
    `base-button--${props.size}`,
    { 'base-button--disabled': props.disabled }
  ];

  return baseClasses.join(' ');
});

const handleClick = (event: Event) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<style lang="scss">
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  font-weight: 500;
  transition: all 150ms ease-out;
  cursor: pointer;
  border: none;
  outline: none;

  // Remove Quasar default styles
  background: none;
  box-shadow: none;
  text-transform: none;
  letter-spacing: normal;

  &:focus-visible {
    outline: 2px solid var(--primary);
    outline-offset: 2px;
  }

  // Size variants
  &--sm {
    height: 36px;
    padding: 0 12px;
    font-size: 0.875rem;
  }

  &--default {
    height: 40px;
    padding: 0 16px;
    font-size: 0.875rem;
  }

  &--lg {
    height: 44px;
    padding: 0 32px;
    font-size: 0.875rem;
  }

  &--icon {
    height: 40px;
    width: 40px;
    padding: 0;
  }

  // Variant styles
  &--default {
    background: var(--primary);
    color: oklch(0.098 0 0);

    &:hover:not(.base-button--disabled) {
      background: oklch(0.4835 0.1152 156.7556); // 10% lighter
    }
  }

  &--outline {
    background: transparent;
    color: var(--foreground);
    border: 1px solid var(--border);

    &:hover:not(.base-button--disabled) {
      background: oklch(0.2046 0 0);
      color: var(--foreground);
    }
  }

  &--ghost {
    background: transparent;
    color: var(--foreground);

    &:hover:not(.base-button--disabled) {
      background: oklch(0.2046 0 0);
    }
  }

  &--destructive {
    background: var(--destructive);
    color: oklch(0.98 0 0);

    &:hover:not(.base-button--disabled) {
      background: oklch(0.3435 0.0937 29.7877); // 10% lighter
    }
  }

  &--secondary {
    background: oklch(0.2809 0 0);
    color: var(--foreground);

    &:hover:not(.base-button--disabled) {
      background: oklch(0.3090 0 0); // 10% lighter
    }
  }

  &--link {
    background: transparent;
    color: var(--primary);
    text-decoration: underline;
    text-underline-offset: 4px;

    &:hover:not(.base-button--disabled) {
      text-decoration: none;
    }
  }

  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
}
</style>
```

### 2. Card → BaseCard

**React Component:**
```jsx
// ChMS-by-Make/src/components/ui/Card.tsx
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
```

**Vue Implementation:**
```vue
<!-- frontend/src/components/ui/BaseCard.vue -->
<template>
  <div :class="cardClasses" v-bind="$attrs">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue';

interface Props {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'default';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'default'
});

const cardClasses = computed(() => {
  return [
    'base-card',
    `base-card--${props.variant}`,
    `base-card--${props.padding}`
  ].join(' ');
});
</script>

<style lang="scss">
.base-card {
  border-radius: var(--radius);
  color: var(--foreground);
  transition: all 150ms ease-out;

  &--default {
    background: var(--card);
    border: 1px solid oklch(0.2809 0 0 / 0.5);
    box-shadow: var(--shadow-sm);
  }

  &--elevated {
    background: var(--card);
    border: 1px solid oklch(0.2809 0 0 / 0.2);
    box-shadow: var(--shadow-lg);
  }

  &--outlined {
    background: oklch(0.1822 0 0);
    border: 1px solid oklch(0.2809 0 0 / 0.8);
    box-shadow: none;
  }

  &--sm {
    padding: 16px;
  }

  &--default {
    padding: 24px;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
}
</style>
```

---

## 📱 Layout Components

### 1. Sidebar → LeftSidebar

**React Component:**
```jsx
// ChMS-by-Make/src/components/layout/Sidebar.tsx
const Sidebar = () => {
  return (
    <div className="w-72 bg-card border-r border-border/50 h-screen sticky top-0 flex flex-col">
      <div className="p-4 border-b border-border/50">
        <div className="font-semibold text-foreground">ChMS</div>
        <div className="text-sm text-muted-foreground">Church Name</div>
      </div>
      <nav className="flex-1 p-4">
        {/* Navigation items */}
      </nav>
    </div>
  );
}
```

**Vue Implementation:**
```vue
<!-- frontend/src/components/layout/LeftSidebar.vue -->
<template>
  <div class="left-sidebar">
    <!-- Church Info Header -->
    <div class="church-info">
      <div class="church-name">ChMS</div>
      <div class="church-location">{{ organizationStore.organization?.name }}</div>
    </div>

    <!-- Navigation -->
    <nav class="nav-menu">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ 'nav-item--active': isActive(item.path) }"
      >
        <q-icon :name="item.icon" class="nav-item__icon" />
        <span class="nav-item__label">{{ item.label }}</span>
      </router-link>
    </nav>

    <!-- User Profile -->
    <div class="user-profile">
      <q-avatar size="32px">
        <img :src="userStore.user?.avatar" :alt="userStore.user?.name" />
      </q-avatar>
      <div class="user-info">
        <div class="user-name">{{ userStore.user?.name }}</div>
        <div class="user-role">{{ userStore.user?.role }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useOrganizationStore } from '@/stores/organization';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const organizationStore = useOrganizationStore();
const userStore = useUserStore();

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { path: '/members', label: 'Members', icon: 'people' },
  { path: '/attendance', label: 'Attendance', icon: 'event_available' },
  { path: '/giving', label: 'Giving', icon: 'payments' },
  { path: '/events', label: 'Events', icon: 'calendar_today' },
  { path: '/reports', label: 'Reports', icon: 'assessment' },
  { path: '/settings', label: 'Settings', icon: 'settings' }
];

const isActive = (path: string) => {
  return route.path === path;
};
</script>

<style lang="scss">
.left-sidebar {
  width: 280px;
  height: 100vh;
  background: var(--card);
  border-right: 1px solid oklch(0.2809 0 0 / 0.5);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;

  .church-info {
    padding: 16px;
    border-bottom: 1px solid oklch(0.2809 0 0 / 0.5);

    .church-name {
      font-weight: 600;
      font-size: 0.875rem;
      color: var(--foreground);
    }

    .church-location {
      font-size: 0.75rem;
      color: var(--muted-foreground);
      margin-top: 2px;
    }
  }

  .nav-menu {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
  }

  .nav-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    margin-bottom: 4px;
    border-radius: calc(var(--radius) - 4px);
    color: var(--muted-foreground);
    text-decoration: none;
    transition: all 150ms ease-out;

    &:hover {
      background: oklch(0.2246 0 0);
      color: var(--foreground);
    }

    &--active {
      background: var(--primary);
      color: oklch(0.098 0 0);
    }

    .nav-item__icon {
      margin-right: 12px;
      font-size: 20px;
    }

    .nav-item__label {
      font-size: 0.875rem;
      font-weight: 500;
    }
  }

  .user-profile {
    padding: 16px;
    border-top: 1px solid oklch(0.2809 0 0 / 0.5);
    display: flex;
    align-items: center;
    gap: 12px;

    .user-info {
      flex: 1;

      .user-name {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--foreground);
      }

      .user-role {
        font-size: 0.75rem;
        color: var(--muted-foreground);
        margin-top: 2px;
      }
    }
  }
}
</style>
```

---

## 🎯 Critical Implementation Notes

### 1. Color Implementation

**Always use CSS custom properties with OKLCH values:**

```scss
// styles/globals.css
:root {
  --primary: oklch(0.4365 0.1044 156.7556);
  --background: oklch(0.1822 0 0);
  --card: oklch(0.2046 0 0);
  --foreground: oklch(0.9288 0.0126 255.5078);
  --muted-foreground: oklch(0.7122 0 0);
  --border: oklch(0.2809 0 0);
  --shadow-sm: 0px 1px 3px 0px hsl(0 0% 0% / 0.17);
  --radius: 0.5rem;
}

/* Fallbacks for older browsers */
@supports not (color: oklch(0 0 0)) {
  :root {
    --primary: #1CE479;
    --background: #0A0A0F;
    --card: #1A1A20;
    --foreground: #FFFFFF;
    --muted-foreground: #A0A0A0;
    --border: #404040;
  }
}
```

### 2. Typography Implementation

**Use Geist font with exact weights:**

```scss
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800&display=swap');

:root {
  --font-sans: 'Geist', system-ui, sans-serif;
  --tracking-normal: 0.025em;
}

body {
  font-family: var(--font-sans);
  font-size: 15px; /* Base font size */
  line-height: 1.5;
  letter-spacing: var(--tracking-normal);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* All headings use light weight */
h1, h2, h3, h4, h5, h6 {
  font-weight: 300; /* Light weight */
}
```

### 3. Spacing System

**Use exact 4px base scale:**

```scss
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
}
```

### 4. Animation System

**Match exact timings from prototype:**

```scss
:root {
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;

  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
}

.transition-base {
  transition: all var(--duration-normal) var(--ease-out);
}

.transition-sidebar {
  transition: all var(--duration-slow) var(--ease-in-out);
}

.transition-button {
  transition: all var(--duration-fast) var(--ease-out);
}
```

---

## ✅ Implementation Checklist

For each component conversion:

- [ ] **Structure**: HTML/JSX structure matches exactly
- [ ] **Styling**: All visual properties match (colors, spacing, borders)
- [ ] **States**: All interactive states implemented (hover, active, disabled)
- [ ] **Responsive**: Breakpoints match prototype exactly
- [ ] **Accessibility**: ARIA labels, keyboard navigation, color contrast
- [ ] **Performance**: No layout shifts, efficient rendering
- [ ] **Cross-browser**: Works in Chrome, Firefox, Safari, Edge
- [ ] **Animation**: Transitions match prototype timing exactly

Remember: **The React prototype is the single source of truth**. No deviations allowed!