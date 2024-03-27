import tailwindConfig from '../tailwind.config'

export const Colors = tailwindConfig.theme.extend.colors

export const ElementTypes = {
  root: "root",
  section: "section",
  div: "div",
  section: "section"
}

export const ElementProperties = {
  root: {
    name: "Root",
    color: Colors.blue,
  },
  div: {
    name: "Div",
    color: Colors.blue,
  },
  section: {
    name: "Section",
    color: Colors.green,
  },
  p: {
    name: "Para",
    color: Colors.pink,
  },
}
