import { ShotcutBar } from './shotcutBar'
import { Preview } from './preview'


const shotcutBar = new ShotcutBar("home")

shotcutBar.attachKeybind("home", "New Element", "n", ()=>{
  shotcutBar.setState("new")
  shotcutBar.setSelectedKey("d")
})

const elementTypes = [
  {
    name: "Div",
    keybind: "d",
    type: "div"
  },
  {
    name: "Para",
    keybind: "r",
    type: "p"
  },
  {
    name: "Button",
    keybind: "b",
    type: "button"
  },
  {
    name: "Anchor",
    keybind: "a",
    type: "a"
  },
  {
    name: "Section",
    keybind: "s",
    type: "section"
  },
  {
    name: "Nav",
    keybind: "n",
    type: "nav"
  },
]

elementTypes.forEach(({ name, keybind })=>{
  shotcutBar.attachKeybind("new", name, keybind)
})

const preview = new Preview()

const canvas = document.getElementById("editor-canvas")
const editorContainer = document.getElementById("editor-container")

const { height, width, x: containerX, y: containerY } = editorContainer.getBoundingClientRect()
canvas.height = height
canvas.width = width

const ctx = canvas.getContext('2d')

function renderCanvas(){
  ctx.clearRect(0, 0, width, height)

  preview.transverse((block)=>{
    const { x, y, width, height } = block.element.getBoundingClientRect()
    ctx.strokeStyle = "cyan"
    ctx.strokeRect(x - 4, y - 4, width, height)

    if ( block.selected ) {
      ctx.fillStyle = "rgba(0, 200, 150, 0.1)"
      ctx.fillRect(x - 4, y - 4, width, height)
    }
  })

  requestAnimationFrame(renderCanvas)
}

canvas.addEventListener("mousemove", ({clientX, clientY})=>{
  const mouseX = clientX - containerX
  const mouseY = clientY - containerY
  
  preview.transverse((block, parent)=>{
    const { x, y, width, height } = block.element.getBoundingClientRect()
    if (
      x < mouseX && 
      x + width > mouseX && 
      y < mouseY && 
      y + height > mouseY
    ){
      if ( shotcutBar.state == "new" ) block.selected = true
      else block.selected = false
      parent.selected = false
    } else {
      block.selected = false  
    }
  })

})

canvas.addEventListener("click", ({clientX, clientY})=>{
  if ( shotcutBar.state !== "new" ) return
  
  preview.transverse((block, parent)=>{
    if ( !block.selected ) return
    const { type } = elementTypes.find(({keybind}) => keybind == shotcutBar.selectedKey) 
    block.children.push({ type , children: []})
    preview.render()
    shotcutBar.setState("home")
  })

})

renderCanvas()
