// Constantes pour les expressions régulières

const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+/
const passwordRegex = /^.{6,}$/


// Récupération du formulaire du DOM

const form = document.querySelector("#log-in form")


// Ajout d'un écouteur d'événements pour la soumission du formulaire

form.addEventListener("submit", (event) => {

    // Empêcher le comportement par défaut du formulaire

    event.preventDefault()

    // Récupération des valeurs des champs du formulaire

    const email = form.querySelector("#email").value
    const password = form.querySelector("#motDePasse").value

    // Fonction pour gérer la connexion

    connexion(email, password)

})


// Fonction pour gérer la connexion

async function connexion(email, password) {

    // Sélection de l'élément d'affichage des erreurs

    const sectionErrorConnexion = document.querySelector(".errorConnexion")

    try {

        // Validation de l'email et du mot de passe avec les regex

        if (!emailRegex.test(email) || !passwordRegex.test(password)) {

            throw new Error("Veuillez saisir des informations valides.")

        }

        // Requête de connexion à l'API avec les informations du formulaire

        const loginResponse = await fetch("http://localhost:5678/api/users/login", {

            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "email": email, "password": password })

        })

        // Analyse de la réponse JSON

        const data = await loginResponse.json()

        // Vérification de la réussite de la connexion

        if (loginResponse.ok) {
         
            sectionErrorConnexion.textContent = ""

            // Stockage du token dans le localStorage
           
            window.localStorage.setItem("token", data.token)

            // Redirection vers la page d'accueil (index.html)

            window.location.href = "index.html"

        } else {

            // Affichage d'un message d'erreur en cas d'échec de connexion

            sectionErrorConnexion.textContent = "Erreur d'identifiant ou de mot de passe"

        }

    } catch (error) {

        // Gestion des erreurs liées à la requête

        console.error("Erreur lors de la connexion :", error)
        sectionErrorConnexion.textContent = error.message

    }
}


 

