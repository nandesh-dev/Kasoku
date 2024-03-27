import { useRef, useLayoutEffect, useEffect } from 'react'
import { ElementTypes, Colors } from '../constants'

export function Editor({ tree }){
  const canvasRef = useRef()
  const outerRef = useRef()

  useLayoutEffect(()=>{
    if (!outerRef.current || !canvasRef.current)  return
    
    const { height: heightString, width: widthString } = getComputedStyle(outerRef.current)

    canvasRef.current.height = parseInt(heightString, 10)
    canvasRef.current.width = parseInt(widthString, 10)
    console.log(tree)
  }, [outerRef])

  useEffect(()=>{
    const eventListener = ({ clientX: mouseX, clientY: mouseY }) =>{
      const { x: canvasX, y: canvasY } = canvasRef.current.getBoundingClientRect()
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

    window.addEventListener("mousemove", eventListener)

    return ()=>{
      removeEventListener("mousemove", eventListener)
    }
  })

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

        ctx.fillStyle = Colors["gray-500"]
        
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
    
          ctx.strokeStyle = Colors.white
          ctx.lineWidth = 2
          ctx.strokeRect(x - 4, y - 4, width, height)

          ctx.fillStyle = Colors.white
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
    const eventListener = () =>{
      const checkHover = (element, parent) =>{
        if ( element.editorData.hovering ) element.editorData.selected = true
        else element.editorData.selected = false
      
        element.childrens.forEach((children)=>{
          checkHover(children)
        })
      }
     
      checkHover(tree)
    }

    window.addEventListener("click", eventListener)

    return ()=>removeEventListener("click", eventListener)
  })

  return (
    <section className="grid grid-cols-2 gap-1">
      <section className="bg-white rounded relative">
        <Element element={tree}/>
      </section>
      <section className="bg-white dark:bg-gray-200 rounded overflow-hidden" ref={outerRef}>
        <canvas ref={canvasRef}/>
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
  }
}


