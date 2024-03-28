import tailwindConfig from '../tailwind.config'

export const Colors = tailwindConfig.theme.extend.colors

export const ElementTypes = {
  root: "root",
  section: "section",
  div: "div",
  p: "p"
}

export const ElementProperties = {
  root: {
    name: "Root",
    color: Colors.sky,
  },
  div: {
    name: "Div",
    color: Colors.yellow,
  },
  section: {
    name: "Section",
    color: Colors.pink,
  },
  p: {
    name: "Para",
    color: Colors.purple,
  },
}

export const Menu = {
  tree: "tree",
  layout: "layout",
  position: "position"
}

export const DarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
