import gsap from 'https://cdn.skypack.dev/gsap@3.13.0'
import Draggable from 'https://cdn.skypack.dev/gsap@3.13.0/Draggable'
import { Pane } from 'https://cdn.skypack.dev/tweakpane@4.0.4'
gsap.registerPlugin(Draggable)

const config = {
  theme: 'system',
  blur: 8,
  saturate: 2.8,
  brightness: 1.25,
  contrast: 1,
  disable: false,
  border: 2,
}

const ctrl = new Pane({
  title: 'config',
  expanded: true,
})

const update = () => {
  document.documentElement.dataset.theme = config.theme
  document.documentElement.dataset.disable = config.disable
  document.documentElement.style.setProperty('--blur', config.blur)
  document.documentElement.style.setProperty('--saturate', config.saturate)
  document.documentElement.style.setProperty('--brightness', config.brightness)
    document.documentElement.style.setProperty('--contrast', config.contrast)
  document.documentElement.style.setProperty('--border', config.border)
}

const sync = (event) => {
  if (
    !document.startViewTransition ||
    event.target.controller.view.labelElement.innerText !== 'theme'
  )
    return update()
  document.startViewTransition(() => update())
}

ctrl.addBinding(config, 'blur', {
  label: 'blur',
  min: 0,
  max: 20,
  step: 1,
})

ctrl.addBinding(config, 'saturate', {
  label: 'saturate',
  min: 0,
  max: 10,
  step: 0.1,
})
ctrl.addBinding(config, 'brightness', {
  label: 'brightness',
  min: 0,
  max: 2,
  step: 0.01,
})
ctrl.addBinding(config, 'contrast', {
  label: 'contrast',
  min: 0,
  max: 3,
  step: 0.1,
})
ctrl.addBinding(config, 'border', {
  label: 'border',
  min: 0,
  max: 10,
  step: 1,
})
ctrl.addBinding(config, 'disable')

ctrl.addBinding(config, 'theme', {
  label: 'theme',
  options: {
    system: 'system',
    light: 'light',
    dark: 'dark',
  },
})

ctrl.on('change', sync)
update()

// make tweakpane panel draggable
const tweakClass = 'div.tp-dfwv'
const d = Draggable.create(tweakClass, {
  type: 'x,y',
  allowEventDefault: true,
  trigger: tweakClass + ' button.tp-rotv_b',
})
document.querySelector(tweakClass).addEventListener('dblclick', () => {
  gsap.to(tweakClass, {
    x: `+=${d[0].x * -1}`,
    y: `+=${d[0].y * -1}`,
    onComplete: () => {
      gsap.set(tweakClass, { clearProps: 'all' })
    },
  })
})

const aside = document.querySelector('aside')
const a = Draggable.create(aside, {
  type: 'x,y',
  allowEventDefault: true,
})
aside.addEventListener('dblclick', () => {
  gsap.to(aside, {
    x: `+=${a[0].x * -1}`,
    y: `+=${a[0].y * -1}`,
    onComplete: () => {
      gsap.set(aside, { clearProps: 'all' })
    },
  })
})
