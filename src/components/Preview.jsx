import { useRef } from 'react'

import { ElementTypes } from '../constants'

export function Preview({ tree }){
  return (
    <Element element={tree}/>
  )
}

function Element({element}){
  const ref = useRef()
  const children = element.childrens.map((children)=><Element key={children.id} element={children}/>)

  switch(element.type){
    case ElementTypes.root:
      return <div ref={ref}>{children}</div>
    case ElementTypes.div:
      return <div ref={ref}>{children}</div>
    case ElementTypes.section:
      return <section ref={ref}>{children}</section>
  }

  element.ref = ref
}
