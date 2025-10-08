<template>
  <q-btn-dropdown
    flat
    dense
    round
    :icon="modeIcon"
    dropdown-icon="expand_more"
    data-testid="theme-switcher"
    :aria-label="`Current theme: ${themeStore.currentTheme.name}, ${themeStore.mode} mode`"
  >
    <q-list style="min-width: 280px">
      <!-- Theme Selection -->
      <q-item-label header class="text-weight-bold">Select Theme</q-item-label>
      <q-item
        v-for="theme in themeStore.availableThemes"
        :key="theme.id"
        clickable
        v-close-popup
        @click="themeStore.setTheme(theme.id)"
        :active="themeStore.currentThemeId === theme.id"
        class="theme-item"
      >
        <q-item-section avatar>
          <q-icon :name="getThemeIcon(theme.id)" :color="getThemeColor(theme.id)" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ theme.name }}</q-item-label>
          <q-item-label caption lines="1">{{ theme.description }}</q-item-label>
        </q-item-section>
        <q-item-section side v-if="themeStore.currentThemeId === theme.id">
          <q-icon name="check" color="positive" />
        </q-item-section>
      </q-item>

      <q-separator class="q-my-sm" />

      <!-- Mode Selection -->
      <q-item-label header class="text-weight-bold">Color Mode</q-item-label>
      <q-item
        v-for="modeOption in modes"
        :key="modeOption.value"
        clickable
        v-close-popup
        @click="themeStore.setMode(modeOption.value)"
        :active="themeStore.mode === modeOption.value"
        class="mode-item"
      >
        <q-item-section avatar>
          <q-icon :name="modeOption.icon" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ modeOption.label }}</q-item-label>
          <q-item-label caption>{{ modeOption.description }}</q-item-label>
        </q-item-section>
        <q-item-section side v-if="themeStore.mode === modeOption.value">
          <q-icon name="check" color="positive" />
        </q-item-section>
      </q-item>

      <q-separator class="q-my-sm" />

      <!-- Quick Preview -->
      <q-item>
        <q-item-section>
          <q-item-label caption class="text-weight-medium q-mb-xs">Theme Preview</q-item-label>
          <div class="theme-preview">
            <div class="preview-colors">
              <div
                v-for="(value, key) in previewColors"
                :key="key"
                class="color-swatch"
                :style="{ backgroundColor: value }"
                :title="key"
              >
                <q-tooltip>{{ key }}</q-tooltip>
              </div>
            </div>
          </div>
        </q-item-section>
      </q-item>

      <q-separator class="q-my-sm" />

      <!-- Theme Info -->
      <q-item v-if="themeStore.currentTheme.author">
        <q-item-section>
          <q-item-label caption>
            <strong>Author:</strong> {{ themeStore.currentTheme.author }}
          </q-item-label>
          <q-item-label caption v-if="themeStore.currentTheme.version">
            <strong>Version:</strong> {{ themeStore.currentTheme.version }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import type { ThemeMode } from '@/themes/types'

const themeStore = useThemeStore()

const modes = [
  {
    value: 'light' as ThemeMode,
    label: 'Light',
    description: 'Bright theme for daytime',
    icon: 'light_mode'
  },
  {
    value: 'dark' as ThemeMode,
    label: 'Dark',
    description: 'Easier on the eyes at night',
    icon: 'dark_mode'
  },
  {
    value: 'system' as ThemeMode,
    label: 'System',
    description: 'Follow system preferences',
    icon: 'brightness_auto'
  },
]

const modeIcon = computed(() => {
  if (themeStore.mode === 'system') return 'brightness_auto'
  return themeStore.isDark ? 'dark_mode' : 'light_mode'
})

const previewColors = computed(() => {
  const colors = themeStore.currentColors
  return {
    Primary: colors.primary,
    Secondary: colors.secondary,
    Accent: colors.accent,
    Positive: colors.positive,
    Negative: colors.negative,
  }
})

const getThemeIcon = (themeId: string): string => {
  const iconMap: Record<string, string> = {
    'quasar-admin': 'admin_panel_settings',
    'garnet-night': 'nights_stay',
    'default': 'palette'
  }
  return iconMap[themeId || 'default'] || iconMap.default || 'palette'
}

const getThemeColor = (themeId: string): string => {
  if (themeId === themeStore.currentThemeId) {
    return 'primary'
  }
  return undefined as any
}
</script>

<style lang="scss" scoped>
.theme-item,
.mode-item {
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &.q-item--active {
    background-color: rgba(var(--q-primary-rgb), 0.1);
  }
}

.theme-preview {
  padding: 8px 0;
}

.preview-colors {
  display: flex;
  gap: 6px;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.color-swatch {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

html.dark {
  .theme-item,
  .mode-item {
    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }

  .color-swatch {
    border-color: rgba(255, 255, 255, 0.2);
  }
}
</style>
