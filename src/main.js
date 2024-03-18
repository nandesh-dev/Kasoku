import { ShotcutBar } from './shotcutBar'
import { Preview } from './preview'


const shotcutBar = new ShotcutBar("home")

shotcutBar.attachKeybind("home", "Temp", "t")

shotcutBar.attachKeybind("selected", "New Element", " ", ()=>{
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

elementTypes.forEach(({ name, keybind, type })=>{
  shotcutBar.attachKeybind("new", name, keybind, ()=>{
    preview.transverse((block, parent)=>{
      if ( !block.selected ) return
      block.children.push({ type , children: []})
      block.selected = false
      preview.render()
      shotcutBar.setState("home")
    }) 
  })
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
    ctx.strokeStyle = "white"
    ctx.strokeRect(x - 4, y - 4, width, height)
    
    if ( block.selected ) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
      ctx.fillRect(x - 4, y - 4, width, height)
    } else if ( block.near ) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
      ctx.fillRect(x - 4, y - 4, width, height)
    } 
  })

  requestAnimationFrame(renderCanvas)
}

canvas.addEventListener("mousemove", ({clientX, clientY})=>{
  const mouseX = clientX - containerX
  const mouseY = clientY - containerY

  preview.transverse((block, parent)=>{
    if ( !parent )  return
    const { x, y, width, height } = block.element.getBoundingClientRect()
    if (
      x < mouseX && 
      x + width > mouseX && 
      y < mouseY && 
      y + height > mouseY
    ){
      block.near = true
      parent.near = false
    } else {
      block.near = false  
    }
  })

})

canvas.addEventListener("click", ({clientX, clientY})=>{
  shotcutBar.setState("selected")

  preview.transverse((block, parent)=>{
    if ( block.selected ) {
      block.selected = false
      block.near = true
    } else {
      block.selected = block.near
    }
  })
})

canvas.addEventListener("wheel", ({ deltaY })=>{
  const up = deltaY > 0
  
  if ( up ) {
    preview.transverse((block, parent)=>{
      if ( !parent ) return
      if ( block.selected ) {
        block.selected = false
        block.scrolled = true
        parent.selected = true
      }
    })

    preview.render()
  } else {
    preview.transverse((block, parent)=>{
      if ( !parent ) return
      if ( !parent.selected || !block.scrolled )  return
      parent.selected = false
      parent.scrolled = false
      block.selected = true

      return true
    })
  }
  console.log(preview._tree, null, 3)
})

renderCanvas()
