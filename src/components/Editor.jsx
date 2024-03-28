import { useRef, useLayoutEffect, useEffect, useState, useContext } from 'react'

import { ElementTypes, Colors, Menu, DarkMode } from '../constants'
import { TreeStateContext } from '../context'

import { Tree } from './Menu/Tree'

export function Editor(){
  const { tree, setTree } = useContext(TreeStateContext)
  const canvasRef = useRef()
  const outerRef = useRef()

  const [ mousePosition, setMousePosition ] = useState()

  const menuRef = useRef()
  const [ menuTimeout, setMenuTimeout ] = useState()
  const [ menuState, setMenuState ] = useState(Menu.hidden)

  useLayoutEffect(()=>{
    if (!outerRef.current || !canvasRef.current)  return
    
    const { height: heightString, width: widthString } = getComputedStyle(outerRef.current)

    canvasRef.current.height = parseInt(heightString, 10)
    canvasRef.current.width = parseInt(widthString, 10)
  }, [outerRef])

  useEffect(()=>{
    let running = true

    const render = ()=>{
      if (!running )  return
      requestAnimationFrame(render)
      if (!canvasRef.current) return

      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  
      const drawOutline = (element) =>{
        const { x, y, width, height } = element.ref.current.getBoundingClientRect()
        
        ctx.strokeStyle = Colors.sky
        ctx.lineWidth = 2

        ctx.fillStyle = DarkMode ? Colors["gray-400"] : Colors["white-700"]
        
        if ( element.editorData.hovering ) ctx.fillRect(x-4, y-4, width, height)
        ctx.strokeRect(x - 4, y - 4, width, height)

        for ( let c = 0; c < element.childrens.length; c++){
          drawOutline(element.childrens[c])
        }
        element.childrens.forEach((children)=>{
          drawOutline(children)
        })
      }

      drawOutline(tree)
      
      const drawSelectedOutline = (element) => {
        if ( element.editorData.selected ) {
          const { x, y, width, height } = element.ref.current.getBoundingClientRect()
    
          ctx.strokeStyle = DarkMode ? Colors.white : Colors["gray-700"]
          ctx.lineWidth = 2
          ctx.strokeRect(x - 4, y - 4, width, height)

          ctx.fillStyle = DarkMode ? Colors.white : Colors["gray-700"]
          const a = 8
          ctx.fillRect(x - 4 - (a / 2), y - 4 - (a/2), a, a)
          ctx.fillRect(x - 4 + width - (a / 2), y - 4 - (a/2), a, a)
          ctx.fillRect(x - 4 + width - (a / 2), y - 4 + height - (a/2), a, a)
          ctx.fillRect(x - 4 - (a / 2), y - 4 + height - (a/2), a, a)
        }

        element.childrens.forEach((children)=>{
          drawSelectedOutline(children)
        })
      }

      drawSelectedOutline(tree)
    }

    render()

    return ()=>{
      running = false
    }
  })

  useEffect(()=>{
    if (menuState == Menu.hidden) return
    if (!menuRef.current || !mousePosition) return
    const menu = menuRef.current
    
    const { width: canvasWidth, height: canvasHeight } = canvasRef.current.getBoundingClientRect()
    const { width: menuWidth, height: menuHeight } = menu.getBoundingClientRect()
    
    if (mousePosition.x > canvasWidth - menuWidth) {
      menu.style.left = mousePosition.x - menuWidth + "px"
    } else {
      menu.style.left = mousePosition.x + "px"
    }

    if (mousePosition.y > canvasHeight - menuHeight) {
      menu.style.top = mousePosition.y - menuHeight + "px" 
    } else {
      menu.style.top = mousePosition.y + "px"
    }

    setMenuTimeout(setTimeout(()=>{
      setMenuState(Menu.hidden)
    }, 3000))

    return () =>{
      clearTimeout(menuTimeout)
    }
  }, [menuState])

  const onMouseMove = ({ clientX: mouseX, clientY: mouseY }) =>{
    const { x: canvasX, y: canvasY } = canvasRef.current.getBoundingClientRect()
    setMousePosition({ x: mouseX - canvasX, y: mouseY - canvasY })
    const checkHover = (element, parent) =>{
      const { x, y, width, height } = element.ref.current.getBoundingClientRect()
      
      if ( 
        mouseX - canvasX > x &&
        mouseX - canvasX < x + width &&
        mouseY - canvasY > y &&
        mouseY - canvasY < y + height
      ) {
        if (parent) parent.editorData.hovering = false
        element.editorData.hovering = true
      } else {
        element.editorData.hovering = false
      }

      element.childrens.forEach((children)=>{
        checkHover(children, element)
      })
    }
   
    checkHover(tree)
  }
  

  const onClick = () =>{
    const checkHover = (element) =>{
      if ( element.editorData.hovering ) element.editorData.selected = true
      else element.editorData.selected = false
    
      element.childrens.forEach((children)=>{
        checkHover(children)
      })
    }
   
    checkHover(tree)
    setTree({...tree})
    
    setMenuState(Menu.tree)
  }

  const onMouseEnterMenu = () =>{
    if (!menuTimeout) return
    clearTimeout(menuTimeout)
    setMenuTimeout(null)
  }

  const onMouseLeaveMenu = () =>{
    setMenuState(Menu.hidden)
  }
  
  return (
    <section className="grid grid-cols-2 gap-1">
      <section className="bg-white rounded">
        <Element element={tree}/>
      </section>
      <section className="relative bg-white dark:bg-gray-200 rounded overflow-hidden" ref={outerRef}>
        <canvas ref={canvasRef} onClick={onClick} onMouseMove={onMouseMove}/>
        <div className="absolute top-0 bg-white-900 dark:bg-gray-500 p-4 rounded" 
          style={{ display: menuState === Menu.hidden ? "none": "block" }} 
          ref={menuRef}
          onMouseLeave={onMouseLeaveMenu}
          onMouseEnter={onMouseEnterMenu}>
          {
            (()=>{
              switch(menuState){
                case Menu.tree:
                  return <Tree tree={tree} />
                case Menu.layout:
                  return "Layout"
              }
            })()
          }
        </div>
      </section>
    </section>
  )
}

function Element({element}){
  const ref = useRef()
  const children = element.childrens.map((children)=><Element key={children.id} element={children}/>)

  element.ref = ref

  switch(element.type){
    case ElementTypes.root:
      return <div ref={ref}>{children}</div>
    case ElementTypes.div:
      return <div className="w-28 h-28 bg-orange animate-bounce" ref={ref}>{children}</div>
    case ElementTypes.section:
      return <section className="flex gap-2 w-36 h-72 bg-sky" ref={ref}>{children}</section>
    case ElementTypes.p:
      return <p ref={ref}>{children}</p>
  }
}


