import * as Templates from './templates'
import tailwindConfig from '../tailwind.config'
import * as Constants from './constants'
import { clear } from './utils'
const { theme: { extend: { colors } } } = tailwindConfig

export class Popup{
  constructor(preview){
    this._container = document.getElementById("popup-container")
    this._innerContainer = {
      tree: document.querySelector("#popup-tree-container"),
      layout: document.querySelector("#popup-layout-container"),
    }
    this._preview = preview
    this._timeout = null
    this._addEventListener()
  }

  display(type, position){    
    this._hideInnerContainersExcept(type)

    switch(type){
      case "tree":
        this._displayTree()
      break;
      case "layout":
        const container = document.querySelector("#popup-layout-container")
        console.log(container)
    }
    
    if ( !this._timeout ) { 
      this._container.style.display = "block"
      const { width, height } = this._container.getBoundingClientRect() 
      this._container.style.top = position.y + 10 + "px"
      this._container.style.left = position.x + 10 +"px"
      
      if ( position.x + width > window.innerWidth ) {
        this._container.style.left = position.x - width - 10 + "px"
      }

      if ( position.y + height > window.innerHeight ) {
        this._container.style.top = position.y - height - 10 + "px"
      }
    }


    this._updateTime()
  }

  _displayTree(){
    const container = this._innerContainer.tree
    clear(container)

    const renderNode = (node) =>{
      const element = Templates.PopupTreeElement()
      const innerContainer = element.querySelector("#popup-tree-element-inner")
      const textOpen = element.querySelector("#popup-tree-element-text-open")
      const textClose = element.querySelector("#popup-tree-element-text-close")
     
      const startBox = element.querySelector("#popup-tree-element-start-box")
      const endBox = element.querySelector("#popup-tree-element-end-box")
      const line = element.querySelector("#popup-tree-element-line")

      startBox.style.backgroundColor = Constants.Elements[node.type].color
      endBox.style.backgroundColor = Constants.Elements[node.type].color
      line.style.backgroundColor = Constants.Elements[node.type].color

      if ( node.selected ) {
        textOpen.style.color="white"
        textClose.style.color="white"
      }

      if ( node.children.length == 0 ) {
        const textCloseOuter = element.querySelector("#popup-tree-element-text-close-outer")
        textCloseOuter.style.display = "none"
        textOpen.innerText = `<${node.type}/>`
      } else {
        textOpen.innerText = `<${node.type}>`
        textClose.innerText = `</${node.type}>`
      }

      node.children.forEach((childrenNode)=>{
        innerContainer.appendChild(renderNode(childrenNode))
      })

      return element
    }

    container.appendChild(renderNode(this._preview.tree))
  }

  _hideInnerContainersExcept(type){
    Object.keys(this._innerContainer).forEach((key)=>{
      if( key == type ) return  this._innerContainer[key].style.display = ""
      this._innerContainer[key].style.display = "none"
    })
  }

  hide(){
    return
    this._container.style.display = "none"
    this._timeout = null
  }

  _addEventListener(){
    this._container.addEventListener("mouseleave", ()=>{
      this.hide()
      clearInterval(this._timeout)
      this._timeout = null 
    })
    this._container.addEventListener("mouseenter", ()=>{
      clearInterval(this._timeout)
      this._timeout = null 
    })
  }

  _updateTime(){
    if ( this._timeout ){ 
      clearInterval(this._timeout)
      this._timeout = null
    }
    this._timeout = setTimeout(()=>{
      this.hide()
      this._timeout = null
    }, 4000)
  }
}
