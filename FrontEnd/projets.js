// Récupération des projets
const reponse = await fetch("http://localhost:5678/api/works/")
const projets = await reponse.json()

function genererProjets(projets) {
    for (let i = 0; i < projets.length; i++) {

        const projet = projets[i]
        // Récupération de l'élément du DOM qui accueillera les projets
        const sectionPortfolio = document.querySelector(".gallery")
        // Création d’une balise dédiée à un projet
        const projetElement = document.createElement("article")
        // Création des balises 
        const imageElement = document.createElement("img")
        imageElement.src = projet.imageUrl
        const titreElement = document.createElement("p")
        titreElement.innerText = projet.title

         // On rattache la balise article a la section gallery
         sectionPortfolio.appendChild(projetElement)

         // On rattache les balises img et p à la balise article
         projetElement.appendChild(imageElement)
         projetElement.appendChild(titreElement)
    }
}

genererProjets(projets)
console.log(projets)