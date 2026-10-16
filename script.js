const temaknapp = document.querySelector("#tema");
temaknapp.hidden = false;

function bytTema() {
    document.body.classList.toggle("morkt");
    if (document.body.classList.contains("morkt")) {
        temaknapp.textContent = "Byt till ljust läge";
    } else {
        temaknapp.textContent = "Byt till mörkt läge";
    }
}

temaknapp.addEventListener("click", bytTema);

// ==========================================================================
// Kontaktformulär: Validering och bekräftelse
// ==========================================================================
const kontaktForm = document.querySelector("#kontakt-formular");
const statusMeddelande = document.querySelector("#formular-status");

if (kontaktForm) {
    kontaktForm.addEventListener("submit", function (handelse) {
        handelse.preventDefault();

        // Kontrollera att alla obligatoriska fält är korrekt ifyllda
        if (!kontaktForm.checkValidity()) {
            kontaktForm.reportValidity();
            return;
        }

        const namnFalt = document.querySelector("#namn");
        const namn = namnFalt ? namnFalt.value.trim() : "";

        if (statusMeddelande) {
            statusMeddelande.textContent = `Tack för ditt meddelande${namn ? ', ' + namn : ''}! Jag återkommer till dig så snart som möjligt.`;
            statusMeddelande.hidden = false;
            statusMeddelande.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }

        kontaktForm.reset();
    });
}