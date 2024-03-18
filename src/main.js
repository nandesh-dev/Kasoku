import { ShotcutBar } from './shotcutBar'

const shotcutBar = new ShotcutBar()
shotcutBar.attachKeybind("default", "Test Button 1", "a", ()=>{
  console.log("Button 1 working!")
})
shotcutBar.attachKeybind("default", "Test Button 2", "b", ()=>{
  console.log("Button 2 working! Switch to empty state")
  shotcutBar.setState("empty")
})

shotcutBar.setState("default")
