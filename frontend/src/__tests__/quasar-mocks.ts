import { vi } from 'vitest'

// Comprehensive Quasar Framework mocks for testing
export const quasarMocks = {
  // Core Quasar components
  QApp: {
    name: 'QApp',
    template: '<div class="q-app"><slot /></div>',
  },
  QLayout: {
    name: 'QLayout',
    template: '<div class="q-layout"><slot /></div>',
    props: ['view'],
  },
  QHeader: {
    name: 'QHeader',
    template: '<header class="q-header"><slot /></header>',
    props: ['elevated', 'bordered'],
  },
  QToolbar: {
    name: 'QToolbar',
    template: '<div class="q-toolbar"><slot /></div>',
  },
  QToolbarTitle: {
    name: 'QToolbarTitle',
    template: '<div class="q-toolbar-title"><slot /></div>',
  },
  QDrawer: {
    name: 'QDrawer',
    template: '<aside class="q-drawer" :class="{ \'q-drawer--mini\': mini }"><slot /></aside>',
    props: ['modelValue', 'side', 'overlay', 'persistent', 'mini', 'width'],
    emits: ['update:modelValue'],
  },
  QPageContainer: {
    name: 'QPageContainer',
    template: '<div class="q-page-container"><slot /></div>',
  },
  QPage: {
    name: 'QPage',
    template: '<div class="q-page"><slot /></div>',
    props: ['padding'],
  },

  // Form components
  QForm: {
    name: 'QForm',
    template: '<form @submit.prevent="handleSubmit"><slot /></form>',
    props: ['greedy'],
    emits: ['submit'],
    methods: {
      handleSubmit(this: any, event: Event) {
        this.$emit('submit', event)
      },
      validate: vi.fn(() => Promise.resolve(true)),
      resetValidation: vi.fn(),
    },
  },
  QInput: {
    name: 'QInput',
    template: `
      <div class="q-input" :class="{ 'q-input--error': hasError }">
        <label v-if="label" class="q-input__label">{{ label }}</label>
        <input 
          :type="computedType"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disable"
          :readonly="readonly"
          @input="handleInput"
          @focus="$emit('focus', $event)"
          @blur="handleBlur"
          class="q-input__native"
        />
        <div v-if="hasError" class="q-input__error">{{ errorMessage }}</div>
        <div v-else-if="hint" class="q-input__hint">{{ hint }}</div>
      </div>
    `,
    props: {
      modelValue: [String, Number],
      label: String,
      placeholder: String,
      type: { type: String, default: 'text' },
      rules: Array,
      lazyRules: Boolean,
      error: Boolean,
      errorMessage: String,
      hint: String,
      disable: Boolean,
      readonly: Boolean,
    },
    emits: ['update:modelValue', 'focus', 'blur'],
    data(this: any): any {
      return {
        hasError: false,
        computedType: this.type,
        errorMessage: '',
      }
    },
    methods: {
      handleInput(this: any, event: Event) {
        const value = (event.target as HTMLInputElement).value
        this.$emit('update:modelValue', value)
        if (!this.lazyRules) {
          this.validate()
        }
      },
      handleBlur(this: any, event: Event) {
        this.$emit('blur', event)
        if (this.lazyRules) {
          this.validate()
        }
      },
      validate(this: any) {
        if (!this.rules || this.rules.length === 0) {
          this.hasError = false
          return true
        }

        for (const rule of this.rules) {
          const result = rule(this.modelValue)
          if (result !== true) {
            this.hasError = true
            this.errorMessage = result
            return false
          }
        }

        this.hasError = false
        return true
      },
      resetValidation(this: any) {
        this.hasError = false
        this.errorMessage = ''
      },
    },
  },
  QBtn: {
    name: 'QBtn',
    template: `
      <button 
        :type="type || 'button'"
        :disabled="loading || disable"
        @click="handleClick"
        class="q-btn"
        :class="btnClasses"
      >
        <span v-if="loading" class="q-btn__loading">Loading...</span>
        <template v-else>
          <i v-if="icon" :class="icon"></i>
          <slot />
        </template>
      </button>
    `,
    props: {
      loading: Boolean,
      disable: Boolean,
      type: String,
      color: String,
      size: String,
      icon: String,
      flat: Boolean,
      outline: Boolean,
      push: Boolean,
      round: Boolean,
      fab: Boolean,
    },
    emits: ['click'],
    computed: {
      btnClasses(this: any): any {
        const classes = []
        if (this.color) classes.push(`bg-${this.color}`)
        if (this.size) classes.push(`q-btn--${this.size}`)
        if (this.flat) classes.push('q-btn--flat')
        if (this.outline) classes.push('q-btn--outline')
        if (this.push) classes.push('q-btn--push')
        if (this.round) classes.push('q-btn--round')
        if (this.fab) classes.push('q-btn--fab')
        return classes
      },
    },
    methods: {
      handleClick(this: any, event: Event) {
        if (!this.loading && !this.disable) {
          this.$emit('click', event)
        }
      },
    },
  },
  QCheckbox: {
    name: 'QCheckbox',
    template: `
      <label class="q-checkbox" :class="{ 'q-checkbox--disabled': disable }">
        <input 
          type="checkbox"
          :checked="modelValue"
          :disabled="disable"
          @change="handleChange"
          class="q-checkbox__native"
        />
        <div class="q-checkbox__inner">
          <div class="q-checkbox__bg"></div>
        </div>
        <div v-if="label || $slots.default" class="q-checkbox__label">
          <slot>{{ label }}</slot>
        </div>
      </label>
    `,
    props: {
      modelValue: Boolean,
      label: String,
      disable: Boolean,
    },
    emits: ['update:modelValue'],
    methods: {
      handleChange(this: any, event: Event) {
        const checked = (event.target as HTMLInputElement).checked
        this.$emit('update:modelValue', checked)
      },
    },
  },
  QSelect: {
    name: 'QSelect',
    template: `
      <div class="q-select">
        <label v-if="label" class="q-select__label">{{ label }}</label>
        <select 
          :value="modelValue"
          :disabled="disable"
          @change="handleChange"
          class="q-select__native"
        >
          <option value="" disabled>{{ placeholder || 'Select an option' }}</option>
          <option 
            v-for="option in normalizedOptions" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    `,
    props: {
      modelValue: [String, Number, Object],
      options: Array,
      label: String,
      placeholder: String,
      disable: Boolean,
      optionValue: { type: String, default: 'value' },
      optionLabel: { type: String, default: 'label' },
    },
    emits: ['update:modelValue'],
    computed: {
      normalizedOptions(this: any): any {
        if (!this.options) return []
        return this.options.map((option: any) => {
          if (typeof option === 'string') {
            return { value: option, label: option }
          }
          return {
            value: option[this.optionValue],
            label: option[this.optionLabel],
          }
        })
      },
    },
    methods: {
      handleChange(this: any, event: Event) {
        const value = (event.target as HTMLSelectElement).value
        this.$emit('update:modelValue', value)
      },
    },
  },

  // Layout components
  QCard: {
    name: 'QCard',
    template: '<div class="q-card" :class="cardClasses"><slot /></div>',
    props: {
      flat: Boolean,
      bordered: Boolean,
      square: Boolean,
    },
    computed: {
      cardClasses(this: any): string[] {
        const classes = []
        if (this.flat) classes.push('q-card--flat')
        if (this.bordered) classes.push('q-card--bordered')
        if (this.square) classes.push('q-card--square')
        return classes
      },
    },
  },
  QCardSection: {
    name: 'QCardSection',
    template: '<div class="q-card-section"><slot /></div>',
    props: {
      horizontal: Boolean,
    },
  },
  QSeparator: {
    name: 'QSeparator',
    template: '<hr class="q-separator" />',
    props: {
      spaced: Boolean,
      inset: Boolean,
      vertical: Boolean,
    },
  },

  // Display components
  QIcon: {
    name: 'QIcon',
    template: '<i :class="iconClasses" :style="iconStyle"><slot /></i>',
    props: {
      name: String,
      size: String,
      color: String,
    },
    computed: {
      iconClasses(this: any): string[] {
        const classes = ['q-icon']
        if (this.name) classes.push(this.name)
        if (this.color) classes.push(`text-${this.color}`)
        return classes
      },
      iconStyle(this: any): any {
        const style: any = {}
        if (this.size) {
          style.fontSize = this.size
        }
        return style
      },
    },
  },
  QSpinner: {
    name: 'QSpinner',
    template: '<div class="q-spinner" :style="spinnerStyle"></div>',
    props: {
      size: String,
      color: String,
    },
    computed: {
      spinnerStyle(): any {
        const style: any = {}
        if ((this as any).size) style.fontSize = (this as any).size
        if ((this as any).color) style.color = (this as any).color
        return style
      },
    },
  },

  // Modern UI Components
  ModernButton: {
    name: 'ModernButton',
    template: `
      <button
        :type="type || 'button'"
        :class="['modern-button', variant, size]"
        :disabled="disabled || loading"
        @click="$emit('click', $event)"
      >
        <span v-if="loading">Loading...</span>
        <slot name="icon" v-if="!loading"></slot>
        <slot v-if="!loading"></slot>
      </button>
    `,
    props: {
      variant: String,
      size: String,
      loading: Boolean,
      disabled: Boolean,
      type: String,
    },
    emits: ['click'],
  },

  ModernAlert: {
    name: 'ModernAlert',
    template: `
      <div :class="['modern-alert', variant]">
        <div v-if="title" class="alert-title">{{ title }}</div>
        <div class="alert-message">{{ message }}</div>
        <slot></slot>
        <button v-if="dismissible" @click="$emit('dismiss')" class="alert-dismiss">×</button>
      </div>
    `,
    props: {
      variant: String,
      message: String,
      title: String,
      dismissible: Boolean,
    },
    emits: ['dismiss'],
  },

  // Utility components
  QSpace: {
    name: 'QSpace',
    template: '<div class="q-space"></div>',
  },

  // Banner component
  QBanner: {
    name: 'QBanner',
    template: `
      <div class="q-banner" :class="bannerClasses">
        <div class="q-banner__avatar">
          <slot name="avatar">
            <q-icon v-if="icon" :name="icon" />
          </slot>
        </div>
        <div class="q-banner__content">
          <slot />
        </div>
        <div v-if="$slots.action" class="q-banner__actions">
          <slot name="action" />
        </div>
      </div>
    `,
    props: {
      icon: String,
      color: String,
      textColor: String,
      inline: Boolean,
      dense: Boolean,
      rounded: Boolean,
    },
    computed: {
      bannerClasses(this: any): string[] {
        const classes = []
        if (this.color) classes.push(`bg-${this.color}`)
        if (this.textColor) classes.push(`text-${this.textColor}`)
        if (this.inline) classes.push('q-banner--inline')
        if (this.dense) classes.push('q-banner--dense')
        if (this.rounded) classes.push('q-banner--rounded')
        return classes
      },
    },
  },

  // Toggle component
  QToggle: {
    name: 'QToggle',
    template: `
      <label class="q-toggle" :class="{ 'q-toggle--disabled': disable }">
        <input
          type="checkbox"
          :checked="modelValue"
          :disabled="disable"
          @change="handleChange"
          class="q-toggle__native"
        />
        <div class="q-toggle__track"></div>
        <div class="q-toggle__thumb"></div>
        <div v-if="label || $slots.default" class="q-toggle__label">
          <slot>{{ label }}</slot>
        </div>
      </label>
    `,
    props: {
      modelValue: Boolean,
      label: String,
      disable: Boolean,
      color: String,
    },
    emits: ['update:modelValue'],
    methods: {
      handleChange(this: any, event: Event) {
        const checked = (event.target as HTMLInputElement).checked
        this.$emit('update:modelValue', checked)
      },
    },
  },
}

// Quasar plugins mock
export const quasarPlugins = {
  Notify: {
    create: vi.fn(),
  },
  Dialog: {
    create: vi.fn(),
  },
  Loading: {
    show: vi.fn(),
    hide: vi.fn(),
  },
  Dark: {
    set: vi.fn(),
    toggle: vi.fn(),
    isActive: false,
  },
}

// useQuasar composable mock
export const useQuasarMock = () => ({
  notify: vi.fn(),
  dialog: vi.fn(),
  loading: {
    show: vi.fn(),
    hide: vi.fn(),
  },
  dark: {
    set: vi.fn(),
    toggle: vi.fn(),
    isActive: false,
  },
})

// Export useQuasar for direct import
export const useQuasar = useQuasarMock
