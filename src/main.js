import { ShotcutBar } from './shotcutBar'
import { Preview } from './preview'
import { Popup } from './popup'
import * as Constants from './constants'

const shotcutBar = new ShotcutBar("home")

shotcutBar.attachKeybind("home", "Temp", "t")

shotcutBar.attachKeybind("selected", "New Element", " ", ()=>{
  shotcutBar.setState("new")
  shotcutBar.setSelectedKey("d")
})

shotcutBar.attachKeybind("selected", "Layout", "q", ()=>{
  popup.display("layout", previousMousePosition)
})

shotcutBar.attachKeybind("selected", "Unselect", "Escape", ()=>{
  preview.transverse((block)=>{
    block.selected = false
  })
  shotcutBar.setState("home")
  popup.hide()
})

Object.keys(Constants.Elements).forEach((type)=>{
  shotcutBar.attachKeybind("new", Constants.Elements[type].name, Constants.Elements[type].keybind, ()=>{
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
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
      ctx.fillRect(x - 4, y - 4, width, height)
    } else if ( block.near ) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
      ctx.fillRect(x - 4, y - 4, width, height)
    } 
  })

  requestAnimationFrame(renderCanvas)
}

const previousMousePosition = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2 
}

canvas.addEventListener("mousemove", ({clientX, clientY})=>{
  previousMousePosition.x = clientX
  previousMousePosition.y = clientY

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

const popup = new Popup(preview)

canvas.addEventListener("click", ()=>{
  shotcutBar.setState("selected")
  popup.hide()

  preview.transverse((block, parent)=>{
    block.scrolled = false
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
        
        popup.display("tree", previousMousePosition, preview.tree)
        
        return true
      }
    })

  } else {
    preview.transverse((block, parent)=>{
      if ( !parent ) return
      if ( !parent.selected || !block.scrolled )  return
      
      parent.selected = false
      parent.scrolled = false
      block.selected = true
      
      popup.display("tree", previousMousePosition, preview.tree)
      return true
    })
  }
  preview.render()
})

renderCanvas()
