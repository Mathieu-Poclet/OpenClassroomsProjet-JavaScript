import { generateProjectElements } from "./projets.js"
import { getProjects } from "./projets.js"


// Fonction pour générer les éléments HTML des projets dans la modal

function generateProjectModal(projects) {
    
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

    } else {     

        modal = document.querySelector("#modal1")
        
    }    
    
    refresh()
    modal1()
    resetForm()
    

}


// Fonction pour fermer toutes les modals

function closeAllModal(event) {

    event.preventDefault()

    if (modal === null) return    

    document.querySelectorAll(".modal").forEach(allModal => {

        allModal.style.display = "none"
        modal = null

    }) 
    
    refresh()
    modal1()
    resetForm()
    
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


// Fonction pour afficher les projets dans la modal

async function modal1() {    

    let projects = await getProjects()
    generateProjectModal(projects)

}


// Fonction pour actualiser l'affichage des projets

async function refresh() {    

    let projects = await getProjects()
    generateProjectElements(projects)

}
    

// Fonction pour supprimer des projets dans la modal

async function deleteProject() {

    let btnDelete = modal.querySelectorAll(".deleteElement")

    for (let i = 0; i < btnDelete.length; i++) {

            btnDelete[i].addEventListener("click", async (event) => {

                event.preventDefault()

                let id = btnDelete[i].id         
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

                    modal1()    // Actualise l'affichage des projets dans la modal

                }                
        })
    }    
}


let addImg = document.getElementById("addImg")

// Vérifie si une image a bien été selectionnée

function imgOk() {

    if(addImg.files[0] === undefined ) {

        throw new Error("Le champ image est vide")

    } 
}


let title = document.getElementById("formTitle")

// Vérifie si le champ titre a bien été rempli

function titleOk (title) {
    
    if (title.length < 1) {

        throw new Error("Le champ titre est vide")        

    } 
}


let category = document.getElementById("category")

// Vérifie si une categorie a bien été selectionnée

function categoryOk (category) {

    if (category.value === "0") {

        throw new Error("Category non selectionné")

    } 
}


function addProjects () {

    let addPics = document.querySelector(".addPics")

    // affiche l'image selectionnée 

    addPics.addEventListener("change", () => {

        const img = document.createElement("img")
        let addPicsDiv = document.querySelector(".addPics div")

        addPicsDiv.classList.add("hideDiv") // efface le contenu de la div en ajoutant la class "hideDiv"
        img.classList.add("maxHeightImg")

        img.src = URL.createObjectURL(addImg.files[0])
        
        addPics.appendChild(img)
    })

    let formModal = document.querySelector(".js-formModal")
    let btnValidate = document.getElementById("validate")

    btnValidate.disabled = true    // rendre le bouton valider non cliquable 

    // teste que le formulaire soit bien rempli pour activer le bouton valider

    formModal.addEventListener("change", () => {

        if ( addImg.files[0] !== undefined && title.value !=="" && category.value !== "0") {

            btnValidate.style = "background-color: #1D6154"  // Change la couleur du bouton valider
            btnValidate.disabled = false                     // rend le btn valider actif
            
        } else {

            btnValidate.disabled = true
            btnValidate.style = "background-color: #A7A7A7"

        }

    })

    
    // Ajoute un gestionnaire d'événement sur le submit

    let form = document.querySelector(".js-formModal")
    
    form.addEventListener("submit", (event) => {
        
        event.preventDefault()        
        
        let valueTitle = title.value
        let valueCategory = category.value
        
        try {

            imgOk()
            titleOk(title)
            categoryOk(category)    

            const formData = new FormData();
            formData.append("image", addImg.files[0])
            formData.append("title", valueTitle)
            formData.append("category", valueCategory)                   
        
            let token = localStorage.getItem("token")
            fetch("http://localhost:5678/api/works", {

                method: "POST",

                headers: {Authorization: `Bearer ${token}`},

                body: formData
                
            })
            
            closeModal(event)  // ferme la modal 2 une fois l'ajout du nouveau projet
    
        } catch(erreur) {

            console.log(erreur)

        }                     
    })
}


// efface le contenu du formulaire

function resetForm() {

    document.formEnvoie.reset()
        
        let addPicsDiv = document.querySelector(".addPics div")
        let img = document.querySelector(".addPics img")
        const btnValidate = document.getElementById("validate")

        
        if(img !== null) {

            addPicsDiv.classList.remove("hideDiv")  // retirer la class "hideDiv"
            img.remove() // retire l'élément du DOM

        }

        btnValidate.style = "background-color: #A7A7A7"
        btnValidate.disabled = true
        
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


resetForm()
addProjects()


