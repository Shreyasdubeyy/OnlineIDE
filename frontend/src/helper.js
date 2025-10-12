export const toggleClass=(el,className)=>{
    let elem=document.querySelector(el)
    elem.classList.toggle(className)
}

export const removeClass=(el,className)=>{
    let elem=document.querySelector(el)
    elem.classList.remove(className)
}
// Automatically pick backend depending on environment
const API_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL          // local backend
    : "https://onlineide-u37b.onrender.com";
    
export const api_base_url = API_URL;
