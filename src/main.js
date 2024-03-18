import { ShotcutBar } from './shotcutBar'
import { Preview } from './preview'


const shotcutBar = new ShotcutBar()

shotcutBar.attachKeybind("home", "New Element", "n", ()=>{
  shotcutBar.setState("new")
})

let newElementType = "div"
shotcutBar.attachKeybind("new", "Div", "d", ()=>{
  newElementType = "div"
})
shotcutBar.attachKeybind("new", "P", "r", ()=>{
  newElementType = "p"
})
shotcutBar.attachKeybind("new", "Button", "b", ()=>{
  newElementType = "button"
})
shotcutBar.attachKeybind("new", "A", "a", ()=>{
  newElementType = "a"
})
shotcutBar.attachKeybind("new", "Section", "s", ()=>{
  newElementType = "section"
})
shotcutBar.attachKeybind("new", "Nav", "n", ()=>{
  newElementType = "nav"
})

shotcutBar.setState("home")


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
    block.children.push({ type: newElementType, children: []})
    preview.render()
    shotcutBar.setState("home")
  })

})

renderCanvas()
