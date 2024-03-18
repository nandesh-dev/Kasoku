export class Preview{
  constructor(){
    this._container = document.getElementById("preview-container")
    
    this._tree = {
      element: this._container,
      scrolled: false,
      children: [
        {
          scrolled: false,
          children: []
        },
        {
          scrolled: false,
          children: [
            {
              scrolled: false,
              children: []
            },
            {
              scrolled: false,
              children: []
            }
          ]
        }
      ]
    }

    this.render()
  }

  render(){
    this.transverse((block, parent)=>{
      if(!block.element){
        const element = document.createElement(block.type || "div")
        block.element = element
        element.className = "flex flex-1 min-w-10 min-h-10"
        parent.element.appendChild(element)    
      }
    }) 
  }

  transverse(func, block = this._tree, parent){
    if ( func(block, parent) ) return // if function returns true, stop the recussion

    block.children.forEach((child)=>{
      this.transverse(func, child, block)
    })      
  }
}
