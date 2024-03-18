import * as Templates from './templates'
import tailwindConfig from '../tailwind.config'

const { theme: { extend: { colors } } } = tailwindConfig

export class Popup{
  constructor(preview){
    this._container = document.getElementById("popup-container")
    this._preview = preview
    this._timeout = null
  }

  showTree(position){
    this._clear()
    
    if ( !this._timeout ) { 
      this._container.style.display = "block"
      this._container.style.top = position.y + 10 + "px"
      this._container.style.left = position.x + 10 +"px"
    }

    this._preview.transverse((block, _, level)=>{
      const element = Templates.PopupTreeElement()
      const container = element.querySelector("#popup-tree-element-container")
      container.style.marginLeft = level * 8 + "px"
      if ( block.selected ) container.style.backgroundColor = colors["gray-500"]
      element.querySelector("#popup-tree-element-text").innerText = `<${block.type || "div"}/>`
      
      this._container.appendChild(element)
    })
    
    this._updateTime()
  }

  _clear(){
    while (this._container.lastChild && this._container.lastChild.nodeName !== "TEMPLATE") {
      this._container.removeChild(this._container.lastChild);
    } 
  }

  hide(){
    this._container.style.display = "none"
  }

  _updateTime(){
    if ( this._timeout ){ 
      clearInterval(this._timeout)
      this._timeout = null
    }
    this._timeout = setTimeout(()=>{
      this.hide()
      this._timeout = null
    }, 2000)
  }
}
