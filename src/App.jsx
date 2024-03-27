import { useState, useEffect } from 'react'

import { Preview } from './components/Preview'
import { Editor } from './components/Editor'
import { ShotcutBar } from './components/ShotcutBar'

import { ElementTypes, Colors } from './constants'

export function App(){
  const [ shotcuts, setShotcuts ] = useState([])
  const [ tree, setTree ] = useState({
    type: ElementTypes.root,
    id: 0,
    editorData: {},
    childrens: [
      {
        type: ElementTypes.section,
        id: 1,
        editorData: {},
        childrens: []
      },
      {
        type: ElementTypes.section,
        id: 2,
        editorData: {},
        childrens: [
          {
            type: ElementTypes.div,
            id: 3,
            editorData: {},
            childrens: []
          },
        ]
      } 
    ]
  })

  useEffect(()=>{
    const eventListener = ({key})=>{
      setShotcuts((shotcuts)=>[...shotcuts, { key , name: "Help", color: Colors.sky }])
    }

    window.addEventListener("keydown", eventListener)

    return ()=>{
      window.removeEventListener("keydown", eventListener)
    }
  }, [])

  return (
    <section className="w-screen h-screen grid grid-rows-[1fr_auto] p-1 gap-1 bg-white-800 dark:bg-gray-100">
      <Editor tree={tree} setTree={setTree}/>
      <ShotcutBar shotcuts={shotcuts}/>
    </section>
  )
}
