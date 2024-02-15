// Fonction asynchrone pour récupérer la liste des projets depuis l'API
import { generateProjectElements } from "./projets.js"

async function getProjects() {

    try {

        const response = await fetch("http://localhost:5678/api/works/")
        const projects = await response.json()
        return projects

   } catch (error) {

       console.error("Erreur lors de la récupération des projets :", error)
       return []

   }

}


// Fonction pour générer les éléments HTML des projets dans la modal

function generateSmallProjectElements(projects) {
    
    const projectsModal = document.querySelector(".modal-projects")
    
    projectsModal.textContent = "" // Efface le contenu actuel de la galerie
    
            
    for (const project of projects) {
    
        const projectElement = document.createElement("article") 
        const imageElement = document.createElement("img")
        const recycleElement = document.createElement("button")        
        
        recycleElement.className = "deleteElement"
        recycleElement.classList.add("fa-solid", "fa-trash-can")
        recycleElement.id = project.id 

        imageElement.src = project.imageUrl        
       
        projectElement.appendChild(recycleElement)
        projectElement.appendChild(imageElement)      
        projectsModal.appendChild(projectElement)
    
    }
    
}


// Variables pour gérer l'état de la modal
    
let modal = null
const focusableSelector = "button, a"
let focusablesElements = []
let previouslyFocusElement = null


// Fonction pour ouvrir une modal

function openModal(event) {

    event.preventDefault()

    // Sélectionne la modal à partir de l'attribut href du lien cliqué

    modal = document.querySelector(event.target.getAttribute("href"))
    
    // Gère le focus

    focusablesElements = Array.from(modal.querySelectorAll(focusableSelector))
    previouslyFocusElement = document.querySelector(":focus")    
    focusablesElements[0].focus()

    // Gère l'affichage de la modal

    modal.style.display = null
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")

    // Ajoute des gestionnaires d'événements pour la fermeture de la modal

    modal.addEventListener("click", closeAllModal)    
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal)    
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
    document.querySelector(".js-allModal-close").addEventListener("click", closeAllModal)
    
    // Supprime les projets actuels dans la modal

    deleteProject()   
    
}


// Fonction pour fermer une modal

function closeModal(event) {

    event.preventDefault()

    if (modal === null) return
    if (previouslyFocusElement !== null) previouslyFocusElement.focus()    

    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")

    // Supprime les gestionnaires d'événements pour la fermeture de la modal

    modal.removeEventListener("click", closeAllModal)
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal)   
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)   
    document.querySelector(".js-allModal-close").removeEventListener("click", closeAllModal)
    
    // défini la valeur de la variable modal

    if (modal.id === "modal1") {
       
        modal = null

        console.log("fermeture modal 1")
        console.log(modal)

    } else {     

        modal = document.querySelector("#modal1")
                
        console.log("fermeture modal 2")
        console.log(modal.id)
        
    }    
   
    refresh()
    modal1()
}


// Fonction pour fermer toutes les modals

function closeAllModal(event) {

    event.preventDefault()

    if (modal === null) return    

    
    console.log(modal.id)

    document.querySelectorAll(".modal").forEach(allModal => {

        allModal.style.display = "none"
        modal = null

    }) 
    
    refresh()
    modal1()
    console.log(modal)
    
}


// Fonction pour arrêter la propagation des événements

function stopPropagation(event) {

    event.stopPropagation()

}


// Fonction pour gérer la navigation au clavier dans la modal

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


// Sélectionne tous les éléments avec la classe "js-modal" et ajoute des gestionnaires d'événements

document.querySelectorAll(".js-modal").forEach(a => {

    a.addEventListener("click", openModal)      

        // Affiche les projets au chargement de la page

        modal1()             
        
        
})

// Ajoute des gestionnaires d'événements pour la touche Escape et la navigation au clavier

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" || event.key === "Esc") {
        closeModal(event)
    }
    if (event.key === "Tab" && modal !== null) {
        focusInModal(event)
    }
})


// Fonction pour afficher les projets dans la modal

async function modal1() {    

    let projects = await getProjects();
    generateSmallProjectElements(projects);
}


// Fonction pour afficher le contenu dans la modal


async function refresh() {    

    let projects = await getProjects();
    generateProjectElements(projects)

}
    




async function deleteProject() {
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
                    modal1()
                }                
        })
    }    
}





const addImg = document.getElementById("addImg")
const imageFile = addImg.files[0]



function imgOk() {

    if(imageFile === "undefined" ) {

        throw new Error("Le champ image est vide")

    } 
}

let title = document.getElementById("formTitle")


function titleOk (title) {
    
    if (title.length < 1) {

        throw new Error("Le champ titre est vide")        

    } 
}

let category = document.getElementById("category")

function categoryOk (category) {
    if (category.value === "0") {

        throw new Error("Category non selectionné")

    } 
}


function addProjects () {

let addPics = document.querySelector(".addPics")
addPics.addEventListener("change", () => {

    const img = document.createElement("img")
    let masquerDiv = document.querySelector(".addPics div")
    masquerDiv.classList.add("masquerDiv")
    img.classList.add("toto")
    img.src = URL.createObjectURL(addImg.files[0])
    
    addPics.appendChild(img)
})

let form = document.querySelector(".formModal")

form.addEventListener("submit", (event) => {
    
    event.preventDefault()
    let valeurTitle = title.value
    let valueCategory = category.value
    
    try {

        imgOk()
        titleOk(valeurTitle)
        categoryOk(category)    

        const formData = new FormData();
        formData.append("image", addImg.files[0]);
        formData.append("title", valeurTitle);
        formData.append("category", valueCategory);    
               
    
        let token = localStorage.getItem("token")
        fetch("http://localhost:5678/api/works", {

            method: "POST",

            headers: {Authorization: `Bearer ${token}`},

            body: formData
            
        })

        document.formEnvoie.reset()
        
        let masquerDiv = document.querySelector(".addPics div")
        let img = document.querySelector(".addPics img")
        masquerDiv.classList.remove("masquerDiv")
        img.remove()
        

    
    } catch(erreur) {

        console.log(erreur)

    }      
    
})

}


/*document.getElementById('name').addEventListener('input', function(event) {
    document.getElementById('submit').disabled = !this.value;
}, false);*/

/*let btnValider = document.getElementById("valider")
if (title.length < 1 || category.value === "0" || imageFile === "undefined") {

    btnValider.disabled = true

} else {

    btnValider.disabled = false
}*/


addProjects()
     