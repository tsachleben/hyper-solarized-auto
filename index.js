'use strict'

console.log("module init")
const {exec} = require('child_process')
exec('terminal-notifier -title "Test" -message "decorateConfig called"')
const defaults = require('osx-defaults')
console.log("imports complete")

const bgColorDark = '#002b36'
const bgColorLight = '#fdf6e3'
const defaultDarkNavColor = '#001f27'
const defaultLightNavColor = '#e6dfcb'
const defaultCursorColor = 'rgba(181, 137, 0, 0.6)'

const colors = {
  black: '#073642',
  red: '#dc322f',
  green: '#859900'
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
  lightWhite: '#fdf6e3',
}


function render(config, foregroundColor, backgroundColor, navBackgroundColor, inactiveTabBackground) {
  return Object.assign({}, config, {
    foregroundColor,
    backgroundColor,
    borderColor,
    colors,
    cursorColor: config.cursorColor || defaultCursorColor,
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

function renderSolarizedLight(config) {
  const foregroundColor = colors.lightBlue
  const backgroundColor = navBackgroundColor = bgColorLight
  const inactiveTabBackground = defaultLightNavColor
  return render(config, foregroundColor, backgroundColor, navBackgroundColor, inactiveTabBackground)
}

function renderSolarizedDark(config) {
  const foregroundColor = colors.lightBlue
  const backgroundColor = navBackgroundColor = bgColorDark
  const inactiveTabBackground = defaultDarkNavColor
  return render(config, foregroundColor, backgroundColor, navBackgroundColor, inactiveTabBackground)
}

exports.decorateConfig = (config) => {
  console.log("decorateConfig called")
  exec('terminal-notifier -title "Test" -message "decorateConfig called"')
  if (defaults.read('NSGlobalDomain', 'AppleInterfaceStyle') === "Dark") {
    return renderSolarizedDark(config)
  } else {
    return renderSolarizedLight(config)
  }
}
