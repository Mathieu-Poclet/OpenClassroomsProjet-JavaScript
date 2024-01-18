const login = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: '{"email": "sophie.bluel@test.tld", "password": "S0phie"}'
});

const reponse = await login.json()
console.log(reponse.token)


const form = document.querySelector("#login form")

form.addEventListener("submit", (event) => {
    // On empêche le comportement par défaut
    event.preventDefault()    
    
    connexion(email, motDePasse)    
})


function connexion(email, motDePasse) {
    const sectionErreurConnexion = document.querySelector(".erreurConnexion")
    const messageErreur = document.createElement("p")

    if(email.value === "sophie.bluel@test.tld" && motDePasse.value === "S0phie" ) {
        console.log("connexion ok ")
        sectionErreurConnexion.innerHTML = ""
        window.location.href = "index.html"
        window.localStorage.setItem("token", data.token)

    } else {
        console.log("erreur de saisie")        
        sectionErreurConnexion.innerHTML = ""
        messageErreur.innerText = "Erreur dans l’identifiant ou le mot de passe"
        sectionErreurConnexion.appendChild(messageErreur)
    }
}


 

