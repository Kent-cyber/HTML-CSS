const participants = [
    {nom: "Quentin", telephone: "+33679657837"},
    {nom: "Muriel", telephone: "+33608523072"},
    {nom: "Guy", telephone: "+33633359822"},
    {nom: "Johan", telephone: "+33678951186"},
    {nom: "Fanny", telephone: "+33632886619"},
    {nom: "Francine", telephone: "+33607499809"},
    {nom: "Emile", telephone: "+33652106254"}
];
const exclusions = {
    "Quentin": ["Muriel", "Guy"],
    "Muriel": ["Quentin", "Guy"],
    "Guy": ["Quentin", "Muriel"],
    "Johan": ["Fanny"],
    "Fanny": ["Johan"],
    "Francine": ["Emile"],
    "Emile": ["Francine"]
};

function shuffle(array) { // Fonction de tirage au hasard
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function isValidPairing(givers, receivers) { // Vérifie si ça correspond au règle et exclusions
    for (let i = 0; i < givers.length; i++) {
        const giver = givers[i];
        const receiver = receivers[i];
        if (giver === receiver || (exclusions[giver] && exclusions[giver].includes(receiver))) {
            return false;
        }
    }
    return true;
}

function generateValidPairing() {
    let attempts = 0;
    const maxAttempts = 1000;
    while (attempts < maxAttempts) {
        const shuffled = shuffle([...participants]);
        if (isValidPairing(participants, shuffled)) {
            return shuffled;
        }
        attempts++;
    }
    return null;
}

function downloadJSON(data, filename) { // télécharge le fichier téléchargé du tirage
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

function runSecretSanta() {
    const receivers = generateValidPairing();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    if (!receivers) {
        resultsDiv.innerHTML = "<p style='color: #ffdddd;'>Tirage impossible avec les règles données.</p>";
        return;
    }

    const tirages = [];

    participants.forEach((giver, index) => {
        const receiver = receivers[index];
        const pair = document.createElement("div");
        pair.className = "pair";
        pair.textContent = `${giver} offre un cadeau à ${receiver}`;
        resultsDiv.appendChild(pair);

        tirages.push({
            nom: giver.nom,
            telephone: giver.telephone,
            destinataire: giver.receiver
        });
    });

    downloadJSON(tirages, "tirages.json"); // Génére le fichier json

    document.querySelector("button").disabled = true; // Empêche le nouveau tirage
}