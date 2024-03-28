import { useState, useEffect } from 'react'

import { Editor } from './components/Editor'
import { ShotcutBar } from './components/ShotcutBar'

import { ElementTypes, Colors } from './constants'
import { TreeStateContext } from './context'


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
            childrens: [
              {
                type: ElementTypes.p,
                id: 4,
                editorData: {},
                childrens: []
              },    
            ]
          },
        ]
      } 
    ]
  })

  return (
    <TreeStateContext.Provider value={{ tree, setTree }} >
      <section className="w-screen h-screen grid grid-rows-[1fr_auto] p-1 gap-1 bg-white-700 dark:bg-gray-100">
        <Editor/>
        <ShotcutBar shotcuts={shotcuts}/>
      </section>
    </TreeStateContext.Provider>
  )
}
