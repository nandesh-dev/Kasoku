export function clear(element){
  while (element.lastChild && element.lastChild.nodeName !== "TEMPLATE") {
    element.removeChild(element.lastChild);
  } 
}
