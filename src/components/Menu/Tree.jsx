import { useContext } from 'react'

import { ElementProperties } from '../../constants' 
import { TreeStateContext } from '../../context'

export function Tree(){
  const { tree } = useContext(TreeStateContext) 

  return (
    <Element element={tree}/>
  )
}

function Element({ element }){
  const { tree, setTree } = useContext(TreeStateContext)

  const select = () =>{
    const removeSelectedTag = (element) =>{
      element.editorData.selected = false
      
      element.childrens.forEach((children)=>{
        removeSelectedTag(children)
      })
    }

    removeSelectedTag(tree)

    element.editorData.selected = true
    
    setTree({...tree})
  }

  const onClick = () => {
    const startTime = Date.now()
    select()
    console.log(Date.now() - startTime)
  }

  const onMouseEnter = () =>{
    const removeHoverTag = (element) =>{
      element.editorData.hovering = false
      
      element.childrens.forEach((children)=>{
        removeHoverTag(children)
      })
    }

    removeHoverTag(tree)

    element.editorData.hovering = true
    
    setTree({...tree}) 
  }

  const { color } = ElementProperties[element.type]
  const opacity = element.editorData.selected ? 1 : 0.7

  return (
    <div className="flex flex-col">
      <button className="flex flex-row gap-2 items-center" style={{opacity}} onClick={onClick} onMouseEnter={onMouseEnter}>
        <div className="w-4 h-4 rounded" style={{backgroundColor: color}}/>
        <span className="text-gray-200 dark:text-white">{`<${element.type}${element.childrens.length == 0 ? "/": ""}>`}</span>
      </button>
      { element.childrens.length > 0 &&
        <>
          <div className="flex flex-row gap-3">
            <div className="ml-[7.5px] w-0.5 rounded" style={{backgroundColor: color, opacity}}/>
            <div>
              {
                element.childrens.map((children)=>{
                  return <Element element={children} key={children.id}/>
                })
              }
            </div>
          </div>
          <button className="flex flex-row gap-2 items-center" style={{opacity}} onClick={onClick}>
            <div className="w-4 h-4 rounded" style={{backgroundColor: color}}/>
            <span className="text-gray-200 dark:text-white">{`</${element.type}>`}</span>
          </button>
        </>
      }
    </div>
  )
}
