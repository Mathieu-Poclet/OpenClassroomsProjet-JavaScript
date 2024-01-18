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


// Partie filtre
const listeBtn = document.querySelectorAll(".filtre button")
    
for (let i = 0; i < listeBtn.length; i++) {
    listeBtn[i].addEventListener("click", () => {
        
        if (i === 0) {
            document.querySelector(".gallery").innerHTML = ""
            genererProjets(projets)
            
        }else if (i === 1) {
            const listeObjets = projets.filter (function (Objet) {
                return Objet.category.name === "Objets"
            }) 
            document.querySelector(".gallery").innerHTML = ""            
            genererProjets(listeObjets)

        }else if (i === 2) {
            const listeAppartement = projets.filter (function (appartement){
                return appartement.category.name === "Appartements"
            })
            document.querySelector(".gallery").innerHTML = ""            
            genererProjets(listeAppartement)

        }else if (i === 3) {
            const listeHotel = projets.filter (function (hotel) {
                return hotel.category.name === "Hotels & restaurants"
            })
            document.querySelector(".gallery").innerHTML = ""            
            genererProjets(listeHotel)
        }
    })
    
}


