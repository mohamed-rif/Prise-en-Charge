// Import jsPDF
const { jsPDF } = window.jspdf;

// Initialiser le compteur de fiches dans LocalStorage
if (!localStorage.getItem("ficheCounter")) {
    localStorage.setItem("ficheCounter", 1);
}

// Événement pour générer le PDF
document.getElementById("generatePdf").addEventListener("click", () => {
    const formData = getFormData();

    if (!isFormDataValid(formData)) {
        showAlert("Veuillez remplir tous les champs correctement.", "error");
        return;
    }

    showLoader();

    // Récupérer le numéro actuel de la fiche et l'incrémenter
    const ficheNumber = localStorage.getItem("ficheCounter");
    localStorage.setItem("ficheCounter", parseInt(ficheNumber) + 1);

    // Génération du PDF avec le numéro unique
    const pdf = new jsPDF();
    addContentToPdf(pdf, formData, ficheNumber);

    hideLoader();
    resetForm();
    showAlert(`PDF généré avec succès : Fiche N° ${ficheNumber} !`, "success");
});

// Fonction pour récupérer les données du formulaire
function getFormData() {
    return {
        nom: document.getElementById("nom").value.trim(),
        adresse: document.getElementById("adresse").value.trim(),
        telephone: document.getElementById("telephone").value.trim(),
        typeAppareil: document.getElementById("typeAppareil").value.trim(),
        marque: document.getElementById("marque").value.trim(),
        chargeur:
            document.getElementById("avecChargeur").checked ? "Avec chargeur" :
            document.getElementById("sansChargeur").checked ? "Sans chargeur" : "",
        description: document.getElementById("description").value.trim(),
        dateDepot: document.getElementById("dateDepot").value.trim(),
    };
}

// Validation des données du formulaire
function isFormDataValid(data) {
    return Object.values(data).every((field) => field.trim() !== "") && data.chargeur !== "";
}

// Ajout de contenu au PDF
function addContentToPdf(pdf, formData, ficheNumber) {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Ajout du logo
    const logoPath = "logo.png"; // Remplacez par le chemin de votre logo
    const logoSize = 30;
    pdf.addImage(logoPath, "PNG", 10, 10, logoSize, logoSize);

    // Titre avec numéro de fiche
    pdf.setFont("Helvetica", "bold");
    pdf.setFontSize(20);
    pdf.setTextColor("#004085");
    pdf.text(`Fiche de Prise en Charge N° ${ficheNumber}`, pageWidth / 2, 30, { align: "center" });

    // Ligne de séparation
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(10, 35, pageWidth - 10, 35);

    // Informations client et appareil
    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor("#000");

    let y = 45;
    const tableData = [
        ["Nom", formData.nom],
        ["Adresse", formData.adresse],
        ["Téléphone", formData.telephone],
        ["Type d'appareil", formData.typeAppareil],
        ["Marque", formData.marque],
        ["Chargeur", formData.chargeur],
        ["Description de la panne", formData.description],
        ["Date de dépôt", formData.dateDepot],
    ];

    // Ajout des données
    tableData.forEach(([key, value]) => {
        pdf.text(`${key} :`, 10, y);
        pdf.text(value, 70, y);
        y += 10;
    });

    // Espace pour signature client
    const signatureY = y + 35;
    pdf.setFont("Helvetica", "bold");
    pdf.text("Signature du client :", 10, signatureY);
    pdf.line(50, signatureY + 2, 150, signatureY + 2); // Ligne pour la signature

    // Espace pour le tampon
    const tamponY = signatureY + 30;
    pdf.text("Tampon de l'entreprise :", 10, tamponY);
    pdf.rect(65, tamponY - 5, 60, 30); // Rectangle pour le tampon

    // Conditions générales en bas de la page
    const conditionsY = pageHeight - 50;
    const conditions = `Conditions Générales :
- Ce document est à conserver pour toute référence future.
- Les réparations non récupérées dans les 90 jours seront considérées comme abandonnées.
- Rif Informatique décline toute responsabilité en cas de perte de données.`;

    pdf.setFontSize(10);
    pdf.setFont("Helvetica", "normal");
    pdf.setTextColor("#555");
    pdf.text(conditions, 10, conditionsY);

    // Informations de contact
    const contactInfo = "Contactez-nous : 04 37 47 21 21 | contact@rifinformatique.fr | www.rifinfo.fr";
    pdf.setFontSize(10);
    pdf.setTextColor("#004085");
    pdf.text(contactInfo, pageWidth / 2, pageHeight - 30, { align: "center" });

    // Pied de page
    const footerText = "© 2024 Rif Informatique - Tous droits réservés";
    pdf.setFontSize(10);
    pdf.setTextColor("#333");
    pdf.text(footerText, pageWidth / 2, pageHeight - 15, { align: "center" });

    // Sauvegarder le PDF
    pdf.save(`Fiche_N${ficheNumber}.pdf`);
}

// Réinitialisation du formulaire
function resetForm() {
    document.getElementById("form").reset();
}

// Gestion des alertes
function showAlert(message, type) {
    const alertBox = document.createElement("div");
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    document.body.appendChild(alertBox);

    setTimeout(() => alertBox.remove(), 3000);
}

// Afficher le chargement
function showLoader() {
    const loader = document.createElement("div");
    loader.className = "loader";
    loader.innerHTML = "<div></div>";
    document.body.appendChild(loader);
}

// Cacher le chargement
function hideLoader() {
    const loader = document.querySelector(".loader");
    if (loader) loader.remove();
}
