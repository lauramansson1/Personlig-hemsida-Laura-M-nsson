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
// Kontaktformulär: Validering och koppling till HubSpot Forms API
// ==========================================================================
const kontaktForm = document.querySelector("#kontakt-formular");
const statusMeddelande = document.querySelector("#formular-status");

if (kontaktForm) {
    kontaktForm.addEventListener("submit", async function (handelse) {
        handelse.preventDefault();

        // Kontrollera att alla obligatoriska fält är korrekt ifyllda
        if (!kontaktForm.checkValidity()) {
            kontaktForm.reportValidity();
            return;
        }

        const skickaKnapp = kontaktForm.querySelector("button[type='submit']");
        const ursprungligKnappText = skickaKnapp ? skickaKnapp.textContent : "Skicka meddelande";

        const namnFalt = document.querySelector("#namn");
        const epostFalt = document.querySelector("#epost");
        const meddelandeFalt = document.querySelector("#meddelande");

        const fulltNamn = namnFalt ? namnFalt.value.trim() : "";
        const epost = epostFalt ? epostFalt.value.trim() : "";
        const meddelande = meddelandeFalt ? meddelandeFalt.value.trim() : "";

        // Dela upp förnamn och efternamn för HubSpot CRM
        let fornamn = fulltNamn;
        let efternamn = "";
        const forstaMellanslag = fulltNamn.indexOf(" ");
        if (forstaMellanslag > 0) {
            fornamn = fulltNamn.slice(0, forstaMellanslag);
            efternamn = fulltNamn.slice(forstaMellanslag + 1).trim();
        }

        // Fält för HubSpot Forms API v3
        const fields = [
            { name: "email", value: epost },
            { name: "firstname", value: fornamn },
            { name: "message", value: meddelande }
        ];

        if (efternamn) {
            fields.push({ name: "lastname", value: efternamn });
        }

        // Hämta HubSpot-spårningskaka om den finns på besökarens webbläsare
        function getHubspotCookie() {
            const match = document.cookie.match(/(?:^|; )hubspotutk=([^;]*)/);
            return match ? decodeURIComponent(match[1]) : null;
        }

        const portalId = "149565924";
        const formGuid = "2f66df68-4e1f-4a9c-9e4e-f693f6a61e99";
        const hubspotUrl = `https://api-eu1.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

        const context = {
            pageUri: window.location.href,
            pageName: document.title
        };

        const hutk = getHubspotCookie();
        if (hutk) {
            context.hutk = hutk;
        }

        const payload = {
            fields: fields,
            context: context
        };

        // Indikera laddningsstatus i knappen
        if (skickaKnapp) {
            skickaKnapp.disabled = true;
            skickaKnapp.textContent = "Skickar...";
        }

        if (statusMeddelande) {
            statusMeddelande.hidden = true;
            statusMeddelande.classList.remove("fel");
        }

        try {
            const respons = await fetch(hubspotUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!respons.ok) {
                throw new Error(`HubSpot API svarade med status: ${respons.status}`);
            }

            if (statusMeddelande) {
                statusMeddelande.textContent = `Tack för ditt meddelande${fornamn ? ', ' + fornamn : ''}! Jag återkommer till dig så snart som möjligt.`;
                statusMeddelande.classList.remove("fel");
                statusMeddelande.hidden = false;
                statusMeddelande.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }

            kontaktForm.reset();
        } catch (error) {
            console.error("Fel vid inskickning till HubSpot:", error);
            if (statusMeddelande) {
                statusMeddelande.innerHTML = `Ett fel uppstod när meddelandet skulle skickas. Vänligen försök igen eller maila mig direkt på <a href="mailto:Lauramansson1@gmail.com" style="text-decoration:underline;color:inherit;font-weight:600;">Lauramansson1@gmail.com</a>.`;
                statusMeddelande.classList.add("fel");
                statusMeddelande.hidden = false;
                statusMeddelande.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
        } finally {
            if (skickaKnapp) {
                skickaKnapp.disabled = false;
                skickaKnapp.textContent = ursprungligKnappText;
            }
        }
    });
}