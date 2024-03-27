export function ShotcutBar({ shotcuts }){
  if ( typeof(shotcuts) == 'undefined' || shotcuts.length == 0) {
    return (
      <div className="bg-white dark:bg-gray-300 border-l-4 border-orange rounded py-1 px-4">
        <p className="text-gray-500 dark:text-gray-800 text-nowrap">Kasoku</p>
      </div>
    )
  }

  return (
    <section className="flex flex-row flex-wrap-reverse gap-1">
      {
        shotcuts.map(({ key, name, color })=>{
          return (
            <div key={key} className="flex-1 bg-white dark:bg-gray-300 border-l-4 border-red rounded py-1 px-4" style={{borderColor: color }}>

              <p className="text-gray-500 dark:text-gray-800 text-nowrap">{`[ ${key} ] ${name}`}</p>
            </div>
          )
        }) 
      }
    </section>
  )
}
