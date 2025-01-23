'use strict'

const util = require('util')
const exec = util.promisify(require('child_process').exec)

const bgColorDark = '#002b36'
const bgColorLight = '#fdf6e3'
const cursorColor = 'rgba(181, 137, 0, 0.6)'
const defaultDarkNavColor = '#001f27'
const defaultLightNavColor = '#e6dfcb'

const colors = {
  black: '#073642',
  red: '#dc322f',
  green: '#859900',
  yellow: '#b58900',
  blue: '#268bd2',
  magenta: '#d33682',
  cyan: '#2aa198',
  white: '#eee8d5',

  lightBlack: '#586e75',
  lightRed: '#cb4b16',
  lightGreen: '#586e75',
  lightYellow: '#657b83',
  lightBlue: '#839496',
  lightMagenta: '#6c71c4',
  lightCyan: '#93a1a1',
  lightWhite: '#fdf6e3'
}

async function getMode () {
  return exec('defaults read -g AppleInterfaceStyle', {}).then(
    ({ stdout, stderr }) => {
      return stdout.trim()
    }
  ).catch(
    (err) => {
      console.log(err)
      return ''
    }
  )
}

function render (config, foregroundColor, backgroundColor, navBackgroundColor, inactiveTabBackground) {
  return Object.assign({}, config, {
    foregroundColor,
    backgroundColor,
    borderColor: 'transparent' || config.borderColor,
    colors,
    cursorColor: config.cursorColor || cursorColor,
    css: `${config.css || ''}
      * {
        text-rendering: optimizeLegibility;
        font-weight: 500;
      }
      .tabs_list {
        border: 0;
      }
      .tabs_nav {
        background-color: ${navBackgroundColor};
      }
      .tab_tab {
        color: ${foregroundColor} !important;
        background-color: ${inactiveTabBackground};
        border-color: transparent;
      }
      .tab_tab:before {
        border: 0;
      }
      .tab_tab.tab_active {
        border: transparent;
        font-weight: bold;
        color: #b3b3b3;
        background-color: ${backgroundColor};
      }
      .splitpane_divider {
        background-color: ${navBackgroundColor};
      }`
  })
}

function renderSolarizedLight (config) {
  const foregroundColor = colors.lightBlue
  const backgroundColor = bgColorLight
  const navBackgroundColor = bgColorLight
  const inactiveTabBackground = defaultLightNavColor
  return render(config, foregroundColor, backgroundColor, navBackgroundColor, inactiveTabBackground)
}

function renderSolarizedDark (config) {
  const foregroundColor = colors.lightBlue
  const backgroundColor = bgColorDark
  const navBackgroundColor = bgColorDark
  const inactiveTabBackground = defaultDarkNavColor
  return render(config, foregroundColor, backgroundColor, navBackgroundColor, inactiveTabBackground)
}

exports.decorateConfig = (config) => {
  if (getMode() === 'Dark') {
    return renderSolarizedDark(config)
  } else {
    return renderSolarizedLight(config)
  }
}
