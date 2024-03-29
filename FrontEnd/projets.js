// Récupération des projets depuis l'API

export async function getProjects() {

    try {

        const response = await fetch("http://localhost:5678/api/works/")
        const projects = await response.json()

        return projects;

   } catch (error) {

       console.error("Erreur lors de la récupération des projets :", error)

       return []

   }

}



// Génération des éléments HTML pour les projets

export function generateProjectElements(projects) {

    const gallery = document.querySelector(".gallery")

    gallery.textContent = "" // Efface le contenu actuel de la galerie

    for (const project of projects) {

        const projectElement = document.createElement("article")
        const imageElement = document.createElement("img")
        const titleElement = document.createElement("p")

        imageElement.src = project.imageUrl
        titleElement.innerText = project.title

        projectElement.appendChild(imageElement)
        projectElement.appendChild(titleElement)
        gallery.appendChild(projectElement)

    }
}


// Filtrage des projets en fonction de la catégorie

function filterProjects(category) {

    const filteredProjects = projects.filter(project => project.category.name === category)
    generateProjectElements(filteredProjects)

}


// Initialisation

let projects = []

async function initialize() {

    projects = await getProjects()
    generateProjectElements(projects)

    const filterButtons = document.querySelectorAll(".filtre button")

    filterButtons.forEach((button, index) => {

        button.addEventListener("click", () => {

            if (index === 0) {

                generateProjectElements(projects)

            } else {

                filterProjects(button.textContent)

            }

        })

    })

    const utilisateurConnecter = window.localStorage.getItem("token")

    if(utilisateurConnecter !== null) {

        document.querySelector(".js-login").hidden = true
        document.querySelector(".filtre").hidden = true
    
    } else {

        document.querySelector(".js-logout").hidden = true
        document.querySelector(".mode-edition").hidden = true    
        document.querySelector(".modify p").hidden = true

    }

    const deconnexion = document.querySelector(".js-logout")

    deconnexion.addEventListener("click", () => {

        window.localStorage.removeItem("token")

    })
}


initialize()


