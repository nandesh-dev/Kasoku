import { ElementProperties } from '../../constants' 

export function Tree({ tree }){
  return (
    <Element element={tree}/>
  )
}

function Element({ element }){
  const { color } = ElementProperties[element.type] 
  return (
    <div>
      <div className="flex flex-row gap-2 items-center">
        <div className="w-4 h-4 rounded" style={{backgroundColor: color}}/>
        <span className="text-gray-400 dark:text-white">{`<${element.type}${element.childrens.length == 0 ? "/": ""}>`}</span>
      </div>
      { element.childrens.length > 0 &&
        <>
          <div className="flex flex-row gap-3">
            <div className="ml-[7.5px] w-0.5 rounded" style={{backgroundColor: color}}/>
            <div>
              {
                element.childrens.map((children)=>{
                  return <Element element={children}/>
                })
              }
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="w-4 h-4 rounded" style={{backgroundColor: color}}/>
            <span className="text-gray-400 dark:text-white">{`</${element.type}>`}</span>
          </div>
        </>
      }
    </div>
  )
}
