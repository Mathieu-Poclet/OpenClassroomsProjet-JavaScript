async function getProjects() {

    try {

        const response = await fetch("http://localhost:5678/api/works/");
        const projects = await response.json();
       return projects;

   } catch (error) {

       console.error("Erreur lors de la récupération des projets :", error);
       return [];

   }

}

function generateProjectElements(projects) {
    
    const projectsModal = document.querySelector(".modal-projects");
    
    projectsModal.textContent = ""; // Efface le contenu actuel de la galerie
    
            
    for (const project of projects) {
    
        const projectElement = document.createElement("article") 
        const imageElement = document.createElement("img")
        const recycleElement = document.createElement("button")
        
        
        recycleElement.className = "deleteElement"
        recycleElement.classList.add("fa-solid", "fa-trash-can")

        imageElement.src = project.imageUrl
        recycleElement.id = project.id 

       
        projectElement.appendChild(recycleElement)
        projectElement.appendChild(imageElement)      
        projectsModal.appendChild(projectElement)
    
    }
    
}    
    
let modal = null
const focusableSelector = "button"
let focusablesElements = []
let previouslyFocusElement = null


function openModal(event) {
    event.preventDefault()
    modal = document.querySelector(event.target.getAttribute("href"))
    focusablesElements = Array.from(modal.querySelectorAll(focusableSelector))
    previouslyFocusElement = document.querySelector(":focus")    
    modal.style.display = null
    focusablesElements[0].focus()
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
    deletePojects()

    console.log(modal)
}

function closeModal(event) {
    if (modal === null) return
    if (previouslyFocusElement !== null) previouslyFocusElement.focus()
    event.preventDefault()
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
    modal = null

    console.log(modal)
}

function stopPropagation(event) {
    event.stopPropagation()
}

function focusInModal(event) {
    event.preventDefault()
    let index = focusablesElements.findIndex(f => f === modal.querySelector(":focus"))    
    if (event.shiftKey === true) {
        index--
    } else {
        index++    
    }
    if (index >= focusablesElements.length) {
        index = 0
    }
    if (index < 0) {
        index = focusablesElements.length - 1
    }
    focusablesElements[index].focus()
}

/**********Ouvrire une modal *************/

document.querySelectorAll(".js-modal").forEach(a => {

    a.addEventListener("click", openModal)     
        
        projectsDisplay()
        modal2()    
    
})

/***************Fermer la modal***********************/

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" || event.key === "Esc") {
        closeModal(event)
    }
    if (event.key === "Tab" && modal !== null) {
        focusInModal(event)
    }
})

function modal2() {
    const title = document.querySelector("#modal2 h2")
    const toto = document.querySelector("#modal2-title")
    title.textContent = "contenu"
    toto.appendChild(title)
}


async function projectsDisplay() {    

    let projects = await getProjects();
    generateProjectElements(projects);

}


async function deletePojects() {
    let btnSuprimer = modal.querySelectorAll(".deleteElement")

    for (let i = 0; i < btnSuprimer.length; i++) {

            btnSuprimer[i].addEventListener("click", async (event) => {
                event.preventDefault()     
                let id = btnSuprimer[i].id         
                console.log(id)
                let token = localStorage.getItem("token")
                const confirmer = confirm("voulez vous suprimer cette élément ?")
                if(confirmer){
                    
                    await fetch (`http://localhost:5678/api/works/${id}`,{
                    method: "DELETE",
                    
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }                    
                    })
                }                
        })
    }    
}



