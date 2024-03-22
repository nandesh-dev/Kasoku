import * as Templates from './templates'

export class ShotcutBar{
  constructor(homeState){
    this._container = document.getElementById("shotcut-button-container") 
    this._state = homeState
    this._homeState = homeState
    this._selectedKey = null
    this._keybinds = {}
    
    this._addEventListener()
  }

  get state(){
    return this._state
  }

  get selectedKey(){
    return this._selectedKey
  }

  setSelectedKey(key){
    this._selectedKey = key
    this._update()
  }

  _update(){
    this._clear()
    
    if(typeof(this._keybinds[this._state]) !== 'object')  return

    Object.keys(this._keybinds[this._state]).forEach((key)=>{
      const { name } = this._keybinds[this._state][key]

      const button = key == this._selectedKey ? Templates.SelectedShotcutButton() : Templates.ShotcutButton()
      button.querySelector(".shotcut-text").innerText = `[ ${key == " " ? "Space" : key} ] ${name}`
        
      this._container.appendChild(button)
    })

    if ( this._state == this._homeState ) return
  }

  _clear(){
    while (this._container.lastChild && this._container.lastChild.nodeName !== "TEMPLATE") {
      this._container.removeChild(this._container.lastChild);
    }
  }

  _onKeyPress(key){
    if(!this._keybinds[this._state]) return
    if(!this._keybinds[this._state][key]) return
    
    this._selectedKey = key
    this._update()
    
    const listener = this._keybinds[this._state][key].listener
    if ( listener ) listener()
  }

  _addEventListener(){
    window.addEventListener("keydown", ({key})=>{
      this._onKeyPress(key)
    })
  }

  attachKeybind(state, name, key, listener){
    if ( !this._keybinds[state] ) this._keybinds[state] = {}
    this._keybinds[state][key] = { name, listener }
    this._update()
  }

  setState(state){
    if ( state == this._state ) return
    this._selectedKey = null
    this._state = state
    this._update()
  }
}
