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

  get tree(){
    return this._tree
  }

  render(){
    this.transverse((block, parent)=>{
      if(!block.element){
        const element = document.createElement(block.type || "div")
        block.element = element
        element.className = "flex flex-1 min-w-10 min-h-10 p-10"
        parent.element.appendChild(element)    
      }
    }) 
  }

  transverse(func, block = this._tree, parent, level = 0){
    if ( func(block, parent, level) ) return // if function returns true, stop the recussion

    block.children.forEach((child)=>{
      this.transverse(func, child, block, level + 1)
    })      
  }
}
