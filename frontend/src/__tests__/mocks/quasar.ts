import { vi } from 'vitest'

// Mock Quasar components
export const QIcon = {
  name: 'QIcon',
  props: ['name', 'class'],
  template: '<i :class="`q-icon q-icon-${name}`" v-bind="$attrs"><slot /></i>',
}

export const QForm = {
  name: 'QForm',
  props: ['model', 'rules'],
  template: '<form @submit.prevent="$emit(\'submit\')" v-bind="$attrs"><slot /></form>',
  emits: ['submit'],
}

export const QInput = {
  name: 'QInput',
  props: ['modelValue', 'type', 'label', 'outlined', 'rules', 'error', 'errorMessage', 'class'],
  template: `
    <div class="q-input">
      <label v-if="label" class="q-field__label">{{ label }}</label>
      <input 
        :value="modelValue" 
        :type="type" 
        :class="class"
        @input="$emit('update:modelValue', $event.target.value)"
        v-bind="$attrs"
      />
      <div v-if="error && errorMessage" class="q-field__messages">{{ errorMessage }}</div>
    </div>
  `,
  emits: ['update:modelValue'],
}

export const QBtn = {
  name: 'QBtn',
  props: ['color', 'icon', 'label', 'loading', 'disabled', 'class'],
  template: `
    <button 
      :class="class"
      :disabled="disabled || loading"
      @click="$emit('click')"
      v-bind="$attrs"
    >
      <i v-if="icon" :class="`q-icon q-icon-${icon}`"></i>
      <span v-if="label">{{ label }}</span>
      <slot />
    </button>
  `,
  emits: ['click'],
}

export const QCard = {
  name: 'QCard',
  props: ['class'],
  template: '<div :class="`q-card ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
}

export const QCardSection = {
  name: 'QCardSection',
  props: ['class'],
  template: '<div :class="`q-card__section ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
}

export const QLinearProgress = {
  name: 'QLinearProgress',
  props: ['value', 'color', 'trackColor', 'rounded', 'size'],
  template: '<div class="q-linear-progress" v-bind="$attrs"><div class="q-linear-progress__track"></div><div class="q-linear-progress__bar"></div></div>',
}

export const QBadge = {
  name: 'QBadge',
  props: ['color', 'icon', 'class'],
  template: '<span :class="`q-badge q-badge--${color} ${class || \'\'}`" v-bind="$attrs"><i v-if="icon" :class="`q-icon q-icon-${icon}`"></i><slot /></span>',
}

export const QSeparator = {
  name: 'QSeparator',
  props: ['dark'],
  template: '<hr :class="`q-separator ${dark ? \'q-separator--dark\' : \'\'}`" v-bind="$attrs" />',
}

export const QList = {
  name: 'QList',
  props: ['class'],
  template: '<div :class="`q-list ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
}

export const QItem = {
  name: 'QItem',
  props: ['clickable', 'class', 'activeClass'],
  template: '<div :class="`q-item ${clickable ? \'q-item--clickable\' : \'\'} ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
}

export const QItemSection = {
  name: 'QItemSection',
  props: ['avatar', 'class'],
  template: '<div :class="`q-item__section ${avatar ? \'q-item__section--avatar\' : \'\'} ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
}

export const QItemLabel = {
  name: 'QItemLabel',
  props: ['header', 'caption', 'class'],
  template: '<div :class="`q-item__label ${header ? \'q-item__label--header\' : \'\'} ${caption ? \'q-item__label--caption\' : \'\'} ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
}

export const QLayout = {
  name: 'QLayout',
  props: ['view', 'class'],
  template: '<div :class="`q-layout ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
}

export const QHeader = {
  name: 'QHeader',
  props: ['elevated', 'class'],
  template: '<header :class="`q-header ${elevated ? \'q-header--elevated\' : \'\'} ${class || \'\'}`" v-bind="$attrs"><slot /></header>',
}

export const QToolbar = {
  name: 'QToolbar',
  props: ['class'],
  template: '<div :class="`q-toolbar ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
}

export const QToolbarTitle = {
  name: 'QToolbarTitle',
  props: ['class'],
  template: '<div :class="`q-toolbar__title ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
}

export const QDrawer = {
  name: 'QDrawer',
  props: ['modelValue', 'showIfAbove', 'bordered', 'class'],
  template: '<aside :class="`q-drawer ${class || \'\'}`" v-bind="$attrs"><slot /></aside>',
}

export const QPageContainer = {
  name: 'QPageContainer',
  props: ['class'],
  template: '<div :class="`q-page-container ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
}

export const QPage = {
  name: 'QPage',
  props: ['class'],
  template: '<div :class="`q-page ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
}

export const QAvatar = {
  name: 'QAvatar',
  props: ['size', 'class'],
  template: '<div :class="`q-avatar ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
}

export const QMenu = {
  name: 'QMenu',
  props: ['class'],
  template: '<div :class="`q-menu ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
}

export const QBtnDropdown = {
  name: 'QBtnDropdown',
  props: ['flat', 'round', 'dense', 'icon', 'class', 'contentClass'],
  template: `
    <div class="q-btn-dropdown">
      <button :class="class" v-bind="$attrs">
        <i v-if="icon" :class="\`q-icon q-icon-\${icon}\`"></i>
        <slot />
      </button>
      <div :class="\`q-dropdown \${contentClass || ''}\`" v-if="false"><slot name="dropdown" /></div>
    </div>
  `,
}

export const QChip = {
  name: 'QChip',
  props: ['color', 'icon', 'dense', 'class'],
  template: '<span :class="`q-chip q-chip--${color || 'default'} ${dense ? \'q-chip--dense\' : \'\'} ${class || \'\'}`" v-bind="$attrs"><i v-if="icon" :class="\`q-icon q-icon-\${icon}\`"></i><slot /></span>',
}

export const QSpinner = {
  name: 'QSpinner',
  props: ['size', 'color', 'class'],
  template: '<div :class="`q-spinner q-spinner--${color || 'primary'} ${class || \'\'}`" v-bind="$attrs"><div class="q-spinner__path"></div></div>',
}

export const QDialog = {
  name: 'QDialog',
  props: ['modelValue', 'class'],
  template: '<div :class="`q-dialog ${class || \'\'}`" v-bind="$attrs" v-if="modelValue"><slot /></div>',
  emits: ['update:modelValue'],
}

export const QStepper = {
  name: 'QStepper',
  props: ['modelValue', 'class'],
  template: '<div :class="`q-stepper ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
}

export const QStep = {
  name: 'QStep',
  props: ['name', 'title', 'class'],
  template: '<div :class="`q-step ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
}

export const QStepperNavigation = {
  name: 'QStepperNavigation',
  props: ['class'],
  template: '<div :class="`q-stepper__navigation ${class || \'\'}`" v-bind="$attrs"><slot /></div>',
}

export const QField = {
  name: 'QField',
  props: ['modelValue', 'label', 'error', 'errorMessage', 'class'],
  template: `
    <div :class="\`q-field \${error ? 'q-field--error' : ''} \${class || ''}\`" v-bind="$attrs">
      <label v-if="label" class="q-field__label">{{ label }}</label>
      <slot />
      <div v-if="error && errorMessage" class="q-field__messages">{{ errorMessage }}</div>
    </div>
  `,
}

export const QSelect = {
  name: 'QSelect',
  props: ['modelValue', 'options', 'label', 'outlined', 'rules', 'error', 'errorMessage', 'class'],
  template: `
    <div class="q-select">
      <label v-if="label" class="q-field__label">{{ label }}</label>
      <select 
        :value="modelValue" 
        :class="class"
        @change="$emit('update:modelValue', $event.target.value)"
        v-bind="$attrs"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
      <div v-if="error && errorMessage" class="q-field__messages">{{ errorMessage }}</div>
    </div>
  `,
  emits: ['update:modelValue'],
}

export const QTime = {
  name: 'QTime',
  props: ['modelValue', 'label', 'outlined', 'rules', 'error', 'errorMessage', 'class'],
  template: `
    <div class="q-time">
      <label v-if="label" class="q-field__label">{{ label }}</label>
      <input 
        type="time"
        :value="modelValue" 
        :class="class"
        @input="$emit('update:modelValue', $event.target.value)"
        v-bind="$attrs"
      />
      <div v-if="error && errorMessage" class="q-field__messages">{{ errorMessage }}</div>
    </div>
  `,
  emits: ['update:modelValue'],
}

export const QCheckbox = {
  name: 'QCheckbox',
  props: ['modelValue', 'label', 'class'],
  template: `
    <div class="q-checkbox">
      <input 
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        v-bind="$attrs"
      />
      <label v-if="label" class="q-checkbox__label">{{ label }}</label>
    </div>
  `,
  emits: ['update:modelValue'],
}

export const QRadio = {
  name: 'QRadio',
  props: ['modelValue', 'val', 'label', 'class'],
  template: `
    <div class="q-radio">
      <input 
        type="radio"
        :checked="modelValue === val"
        @change="$emit('update:modelValue', val)"
        v-bind="$attrs"
      />
      <label v-if="label" class="q-radio__label">{{ label }}</label>
    </div>
  `,
  emits: ['update:modelValue'],
}

export const QToggle = {
  name: 'QToggle',
  props: ['modelValue', 'label', 'class'],
  template: `
    <div class="q-toggle">
      <input 
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        v-bind="$attrs"
      />
      <label v-if="label" class="q-toggle__label">{{ label }}</label>
    </div>
  `,
  emits: ['update:modelValue'],
}

export const QSlider = {
  name: 'QSlider',
  props: ['modelValue', 'min', 'max', 'step', 'class'],
  template: `
    <div class="q-slider">
      <input 
        type="range"
        :value="modelValue"
        :min="min"
        :max="max"
        :step="step"
        @input="$emit('update:modelValue', Number($event.target.value))"
        v-bind="$attrs"
      />
    </div>
  `,
  emits: ['update:modelValue'],
}

export const QTable = {
  name: 'QTable',
  props: ['data', 'columns', 'class'],
  template: `
    <table :class="\`q-table \${class || ''}\`" v-bind="$attrs">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.name">{{ column.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.id">
          <td v-for="column in columns" :key="column.name">{{ row[column.field] }}</td>
        </tr>
      </tbody>
    </table>
  `,
}

export const QTh = {
  name: 'QTh',
  props: ['class'],
  template: '<th :class="\`q-table__th \${class || \'\'}\`" v-bind="$attrs"><slot /></th>',
}

export const QTr = {
  name: 'QTr',
  props: ['class'],
  template: '<tr :class="\`q-table__tr \${class || \'\'}\`" v-bind="$attrs"><slot /></tr>',
}

export const QTd = {
  name: 'QTd',
  props: ['class'],
  template: '<td :class="\`q-table__td \${class || \'\'}\`" v-bind="$attrs"><slot /></td>',
}

export const QThead = {
  name: 'QThead',
  props: ['class'],
  template: '<thead :class="\`q-table__thead \${class || \'\'}\`" v-bind="$attrs"><slot /></thead>',
}

export const QTbody = {
  name: 'QTbody',
  props: ['class'],
  template: '<tbody :class="\`q-table__tbody \${class || \'\'}\`" v-bind="$attrs"><slot /></tbody>',
}

export const QScrollArea = {
  name: 'QScrollArea',
  props: ['class'],
  template: '<div :class="\`q-scrollarea \${class || \'\'}\`" v-bind="$attrs"><slot /></div>',
}

export const QInnerLoading = {
  name: 'QInnerLoading',
  props: ['showing', 'class'],
  template: '<div :class="\`q-inner-loading \${class || \'\'}\`" v-bind="$attrs" v-if="showing"><slot /></div>',
}

export const QSpinnerDots = {
  name: 'QSpinnerDots',
  props: ['size', 'color', 'class'],
  template: '<div :class="\`q-spinner-dots q-spinner-dots--\${color || \'primary\'} \${class || \'\'}\`" v-bind="$attrs"></div>',
}

export const QSpinnerGears = {
  name: 'QSpinnerGears',
  props: ['size', 'color', 'class'],
  template: '<div :class="\`q-spinner-gears q-spinner-gears--\${color || \'primary\'} \${class || \'\'}\`" v-bind="$attrs"></div>',
}

export const QSpinnerHourglass = {
  name: 'QSpinnerHourglass',
  props: ['size', 'color', 'class'],
  template: '<div :class="\`q-spinner-hourglass q-spinner-hourglass--\${color || \'primary\'} \${class || \'\'}\`" v-bind="$attrs"></div>',
}

export const QSpinnerInfinity = {
  name: 'QSpinnerInfinity',
  props: ['size', 'color', 'class'],
  template: '<div :class="\`q-spinner-infinity q-spinner-infinity--\${color || \'primary\'} \${class || \'\'}\`" v-bind="$attrs"></div>',
}

export const QSpinnerIos = {
  name: 'QSpinnerIos',
  props: ['size', 'color', 'class'],
  template: '<div :class="\`q-spinner-ios q-spinner-ios--\${color || \'primary\'} \${class || \'\'}\`" v-bind="$attrs"></div>',
}

export const QSpinnerOrbit = {
  name: 'QSpinnerOrbit',
  props: ['size', 'color', 'class'],
  template: '<div :class="\`q-spinner-orbit q-spinner-orbit--\${color || \'primary\'} \${class || \'\'}\`" v-bind="$attrs"></div>',
}

export const QSpinnerOval = {
  name: 'QSpinnerOval',
  props: ['size', 'color', 'class'],
  template: '<div :class="\`q-spinner-oval q-spinner-oval--\${color || \'primary\'} \${class || \'\'}\`" v-bind="$attrs"></div>',
}

export const QSpinnerPie = {
  name: 'QSpinnerPie',
  props: ['size', 'color', 'class'],
  template: '<div :class="\`q-spinner-pie q-spinner-pie--\${color || \'primary\'} \${class || \'\'}\`" v-bind="$attrs"></div>',
}

export const QSpinnerPuff = {
  name: 'QSpinnerPuff',
  props: ['size', 'color', 'class'],
  template: '<div :class="\`q-spinner-puff q-spinner-puff--\${color || \'primary\'} \${class || \'\'}\`" v-bind="$attrs"></div>',
}

export const QSpinnerRadio = {
  name: 'QSpinnerRadio',
  props: ['size', 'color', 'class'],
  template: '<div :class="\`q-spinner-radio q-spinner-radio--\${color || \'primary\'} \${class || \'\'}\`" v-bind="$attrs"></div>',
}

export const QSpinnerRings = {
  name: 'QSpinnerRings',
  props: ['size', 'color', 'class'],
  template: '<div :class="\`q-spinner-rings q-spinner-rings--\${color || \'primary\'} \${class || \'\'}\`" v-bind="$attrs"></div>',
}

export const QSpinnerTail = {
  name: 'QSpinnerTail',
  props: ['size', 'color', 'class'],
  template: '<div :class="\`q-spinner-tail q-spinner-tail--\${color || \'primary\'} \${class || \'\'}\`" v-bind="$attrs"></div>',
}

// Mock Quasar main object
export const Quasar = {
  install: vi.fn(),
}

// Export all components
export default {
  QIcon,
  QForm,
  QInput,
  QBtn,
  QCard,
  QCardSection,
  QLinearProgress,
  QBadge,
  QSeparator,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QLayout,
  QHeader,
  QToolbar,
  QToolbarTitle,
  QDrawer,
  QPageContainer,
  QPage,
  QAvatar,
  QMenu,
  QBtnDropdown,
  QChip,
  QSpinner,
  QDialog,
  QStepper,
  QStep,
  QStepperNavigation,
  QField,
  QSelect,
  QTime,
  QCheckbox,
  QRadio,
  QToggle,
  QSlider,
  QTable,
  QTh,
  QTr,
  QTd,
  QThead,
  QTbody,
  QScrollArea,
  QInnerLoading,
  QSpinnerDots,
  QSpinnerGears,
  QSpinnerHourglass,
  QSpinnerInfinity,
  QSpinnerIos,
  QSpinnerOrbit,
  QSpinnerOval,
  QSpinnerPie,
  QSpinnerPuff,
  QSpinnerRadio,
  QSpinnerRings,
  QSpinnerTail,
  Dark,
  Notify,
  useQuasar,
  Quasar,
}

// Mock Quasar plugins
export const Dark = {
  set: vi.fn(),
  toggle: vi.fn(),
  isActive: false,
}

export const Notify = {
  create: vi.fn(),
}

// Mock Quasar utils
export const useQuasar = () => ({
  $q: {
    notify: vi.fn(),
    dark: {
      isActive: false,
    },
  },
})

// Export all components
export default {
  QIcon,
  QForm,
  QInput,
  QBtn,
  QCard,
  QCardSection,
  QLinearProgress,
  QBadge,
  QSeparator,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QLayout,
  QHeader,
  QToolbar,
  QToolbarTitle,
  QDrawer,
  QPageContainer,
  QPage,
  QAvatar,
  QMenu,
  QBtnDropdown,
  Dark,
  Notify,
  useQuasar,
}
