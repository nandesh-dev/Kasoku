import * as Templates from './templates'

export class ShotcutBar{
  constructor(state){
    this._container = document.getElementById("shotcut-button-container") 
    this._state = state
    this._keybinds = {}

    this._addEventListener()
  }

  _update(){
    this._clear()
    
    if(typeof(this._keybinds[this._state]) !== 'object')  return

    Object.keys(this._keybinds[this._state]).forEach((key)=>{
      const { name } = this._keybinds[this._state][key]

      const button = Templates.ShotcutButton()
      button.querySelector(".shotcut-text").innerText = `[ ${key} ] ${name}`
        
      this._container.appendChild(button)
    })
  }

  _clear(){
    while (this._container.lastChild && this._container.lastChild.nodeName !== "TEMPLATE") {
      this._container.removeChild(this._container.lastChild);
    }
  }

  _onKeyPress(key){
    if(!this._keybinds[this._state]) return
    if(!this._keybinds[this._state][key]) return
    
    this._keybinds[this._state][key].listener()
  }

  _addEventListener(){
    window.addEventListener("keypress", ({key})=>{
      this._onKeyPress(key)
    })
  }

  attachKeybind(state, name, key, listener){
    if ( !this._keybinds[state] ) this._keybinds[state] = {}
    this._keybinds[state][key] = { name, listener }
    this._update()
  }

  setState(state){
    this._state = state
    this._update()
  }
}
