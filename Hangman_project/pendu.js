// ==== Initialisation des éléments DOM et variables globales ====
// On sélectionne les éléments HTML pour pouvoir les manipuler dans notre code.
const welcome = document.getElementById("welcome-screen");
const niveauFacile = document.querySelector(".facile");
const niveauMoyen = document.querySelector(".moyen");
const niveauDifficile = document.querySelector(".difficile");

const suitcaseBox = document.querySelector(".suitcase-box");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");
const wordContainer = document.getElementById("word");

const boutons = document.querySelectorAll("button");
const recommencerBouton = document.getElementById("recommencer");

const canvas = document.getElementById("confetti");
const jsConfetti = new JSConfetti(); // permet de créer un élément HTML Canvas et l'ajouter à la page

// Déclaration des variables globales du jeu
let niveauChoisi = null; // Stocke le niveau de difficulté choisi par le joueur
let motATrouver = ""; // Le mot à deviner
const erreursAutorisees = 10; // Nombre d'erreurs maximum avant de perdre
let erreursCommises = 0;
let lettresDevinees = []; // Lettres devinées par le joueur
let motTrouve = ""; // Le mot deviné actuel (avec des tirets pour les lettres non trouvées)
let partieEnCours = false; // variable qui va nous permettre de gérer le fait de ne pas pouvoir sélectionner d'autre niveau pendant la partie (indique si une partie est en cours)

// On crée l'image de la valise qui sera mise à jour en fonction des erreurs commises
const suitcaseImage = document.createElement("img");
suitcaseImage.id = "suitcase-image";
suitcaseBox.appendChild(suitcaseImage);

// ==== Fonctions utilitaires ====
// Fonction qui permet de sélectionner un mot aléatoire parmi les 3 niveaux
function motAleatoire(niveauChoisi) {
  const mots = niveau[niveauChoisi];
  const idxAleatoire = Math.floor(Math.random() * mots.length);
  return mots[idxAleatoire];
}
// const niveauChoisi = "facile";
// const mot = motAleatoire(niveauChoisi);
// console.log(mot);

// Fonction qui va gérer l'emplacement des lettres (affiche les lettres trouvées et les tirets pour les lettres non trouvées)
function lettresPlacees(motComplet, lettresTrouvees) {
  let affichage = "";
  for (let lettre of motComplet) {
    if (lettresTrouvees.includes(lettre)) {
      affichage += lettre; // si true affiche la lettre
    } else {
      affichage += " _ "; // si false affiche un tiret
    }
  }
  return affichage;
}

// let motComplet = "MEXIQUE";
// let lettresTrouvees = "v";
// console.log(lettresPlacees(motComplet, lettresTrouvees));

// Fonction pour mettre à jour l'image de la valise en fonction des erreurs

function mettreAJourValise() {
  const numeroImage = erreursCommises; // Le numéro d'image correspond aux erreurs commises
  if (numeroImage > 10) {
    suitcaseImage.src = "images/suitcase10.png"; // Affiche l'image finale de la valise
  } else {
    suitcaseImage.src = `images/suitcase${numeroImage}.png`; // Affiche l'image correspondante
  }
}

// Fonction pour désactiver le clavier une fois la partie terminée
function desactiverClavier() {
  const keys = document.querySelectorAll(".key");
  for (let i = 0; i < keys.length; i++) {
    keys[i].disabled = true; // Désactive chaque touche du clavier
    keys[i].classList.add("disabled"); // Ajoute la classe CSS pour les boutons désactivés
  }
}

// Fonction qui permet de désactiver les boutons de difficultés
function desactiverBoutonsDifficulte() {
  niveauFacile.disabled = true;
  niveauMoyen.disabled = true;
  niveauDifficile.disabled = true;
}

// Fonction pour réactiver les boutons de difficulté en début de partie
function activerBoutonsDifficulte() {
  niveauFacile.disabled = false;
  niveauMoyen.disabled = false;
  niveauDifficile.disabled = false;
}

// ==== Gestion du jeu ====

// Fonction pour gérer le choix d'une lettre par le joueur
function devinerLettre(lettre) {
  if (erreursCommises >= erreursAutorisees || motTrouve === motATrouver) {
    // Si le joueur a déjà atteint le nombre d'erreurs maximum ou trouvé le mot
    return; // si oui la fonction s'arrête
  }

  if (lettresDevinees.includes(lettre)) {
    // On vérifie si la lettre a déjà été devinée
    return; // si oui la fonction s'arrête
  }
  lettresDevinees.push(lettre); // Ajoute la lettre aux lettres devinées

  if (motATrouver.includes(lettre)) {
    // on va vérifier si la lettre fait partie du mot à deviner
    motTrouve = lettresPlacees(motATrouver, lettresDevinees); // on va mettre à jour le mot trouvé en appelant la fonction lettresPlacees qui gère l'emplacement des lettres.
  } else {
    erreursCommises++; // Incrémente les erreurs si la lettre est fausse
    mettreAJourValise(); // Met à jour l'image de la valise
  }
  wordContainer.innerText = motTrouve; // on va mettre à jour l'affichage du mot
  verifierFinDePartie(); // Vérifie si la partie est terminée
}

// Fonction qui vérifie si le joueur a gagné ou perdu
function verifierFinDePartie() {
  if (motTrouve === motATrouver) {
    // Si le joueur a trouvé toutes les lettres
    document.getElementById("message").textContent =
      "Bien joué, ne ratez pas votre vol !";
    suitcaseImage.src = "images/suitcase10.png"; // Affiche l'image finale de la valise
    jsConfetti.addConfetti(); // Ajoute les confettis pour fêter la victoire
    desactiverBoutonsDifficulte(); // Désactive les boutons de difficulté
    partieEnCours = false; // Fin de la partie
    recommencerJeu(); // Affiche le bouton pour recommencer
  } else if (erreursCommises >= erreursAutorisees) {
    document.getElementById(
      "message"
    ).textContent = `Perdu, le taxi vous attend, le pays qu'il fallait trouver était ${motATrouver}`;
    suitcaseImage.classList.add("shake"); // Secoue la valise pour montrer l'échec
    desactiverClavier(); // Désactive le clavier
    desactiverBoutonsDifficulte(); // Désactive les boutons de difficulté
    partieEnCours = false; // Fin de la partie
    recommencerJeu(); // Affiche le bouton pour recommencer
  }
}

// Fonction pour initialiser une nouvelle partie
function initNvellePartie() {
  erreursCommises = 0; // Réinitialise les erreurs
  lettresDevinees = []; // Réinitialise les lettres devinées
  motATrouver = motAleatoire(niveauChoisi); // Sélectionne un nouveau mot
  motTrouve = lettresPlacees(motATrouver, lettresDevinees); // Met à jour l'affichage du mot avec des tirets
  wordContainer.innerText = motTrouve; // Affiche le mot avec des tirets
  genererClavier(); // Génère un nouveau clavier
  partieEnCours = true; // Démarre une nouvelle partie
  suitcaseImage.src = ""; // Réinitialise l'image de la valise
  message.innerHTML = ""; // Vide les messages
  suitcaseImage.classList.remove("shake"); // Retire l'effet de secousse
  desactiverBoutonsDifficulte(); // Désactive les boutons de difficulté
}

// ==== Gestion de l'interface utilisateur ====

// Affichage de la keyboard
function genererClavier() {
  keyboard.innerHTML = ""; // Vide le clavier pour chaque nouvelle partie
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  alphabet.split("").forEach((lettre) => {
    // va diviser la chaine alphabet en un tableau de lettres individuelles
    const keyElement = document.createElement("button");
    keyElement.className = "key";
    keyElement.textContent = lettre;
    keyElement.addEventListener("click", () => {
      keyElement.disabled = true; // désactive le bouton pour empêcher de cliquer à nouveau dessus
      keyElement.classList.add("disabled"); // permet d'ajouter la classe css disabled au bouton
      devinerLettre(lettre); // appelle de la fonction qui gère la logique de deviner une lettre dans le jeu
    });
    keyboard.appendChild(keyElement);
  });
}

// Ajoute un événement pour chaque bouton de niveau de difficulté
niveauFacile.addEventListener("click", () => {
  if (!partieEnCours) {
    // Vérifie si une partie est en cours pour empêcher le changement de niveau
    niveauFacile.style.color = "blue";
    niveauChoisi = "facile";
    initNvellePartie();
  }
});

niveauMoyen.addEventListener("click", () => {
  if (!partieEnCours) {
    niveauMoyen.style.color = "blue";
    niveauChoisi = "moyen";
    initNvellePartie();
  }
});

niveauDifficile.addEventListener("click", () => {
  if (!partieEnCours) {
    niveauDifficile.style.color = "blue";
    niveauChoisi = "difficile";
    initNvellePartie();
  }
});

// Fonction pour démarrer le jeu et cacher l'écran de bienvenue
function startAudio() {
  document.getElementById("background-music").play();
  welcome.style.display = "none"; // Cache l'écran de bienvenue
}

// Fonction pour recommencer le jeu
function recommencerJeu() {
  recommencerBouton.style.display = "block"; // Affiche le bouton recommencer
  recommencerBouton.addEventListener("click", () => {
    recommencerBouton.style.display = "none"; // Cache le bouton recommencer après le clic
    initNvellePartie(); // Initialise une nouvelle partie
    suitcaseImage.classList.remove("shake"); // Enlève l'animation de secousse
    partieEnCours = false; // Remet la partie à l'état initial
    niveauChoisi = null;
    activerBoutonsDifficulte(); // Réactive les boutons de difficulté
    niveauFacile.style.color = "";
    niveauMoyen.style.color = "";
    niveauDifficile.style.color = "";
  });
}
