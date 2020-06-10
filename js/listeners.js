const emailRegex = /^\w+([-+.'][^\s]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

var incidents = null;
var contacts = null;
var template = null;

$("#return").click(() => {
    $("#feedback").fadeOut(500, () => {
        $("#form-content-wrapper ").fadeIn(500);
    });
});

$("#launch").click(() => {
    let results = verify();
    if (results !== null && template !== null) {
        // Template emails
        results.officials = findOfficials(contacts, results.state, results.city);
        results.incidents = findIncidents(incidents, results.state, results.city);
        let emails = draftEmails(results, template);
        
        // Sync new email count to Firebase and update DOM
        addNumEmails(Object.keys(emails).length).then((numEmails) => {
            console.log(numEmails);
            $("#email-counter span").text(numEmails)
        });
        
        // Add listeners
        $("#email-results li").remove();
        for (let [destination, body] of Object.entries(emails)) {
            createEmailLink(destination, body);
        }
        $("#gmail").click(() => {
            for (let [destination, body] of Object.entries(emails)) {
                send(destination, body);
            }
        });
        
        // Fade in feedback and fade out form 
        $("#form-content-wrapper").fadeOut(500, () => {
            $("#feedback").fadeIn(500);
        });
    }
});

$(document).ready(() => {
    // Start loading in header images
    cycleBackground();
    // Read data from Firebase
    getNumEmails().then((numEmails) => {
        $("#email-counter span").text(numEmails)
    });

    $.getJSON("https://raw.githubusercontent.com/mattzh72/Think-Globally-Act-Vocally/master/data/incidents.json", function (rawIncidentsData) {
        $("#data-update").text(rawIncidentsData.updated_at);
        $.getJSON("https://raw.githubusercontent.com/mattzh72/Think-Globally-Act-Vocally/master/data/contacts.json", function (rawContactsData) {
            incidents = indexIncidents(rawIncidentsData);
            contacts = indexContacts(rawContactsData);
            populateStates(incidents);
        });
    });
    $.get('https://raw.githubusercontent.com/mattzh72/Think-Globally-Act-Vocally/master/resources/template.txt', function (data) {
        template = data;
    });
});


$("#state").on('change', () => {
    if (incidents !== null && contacts !== null) {
        populateCities(incidents, $("#state").val());
        populateIncidents(incidents, $("#state").val(), $("#city").val());
        populateOfficials(contacts, $("#state").val(), $("#city").val());

        $("#city").change(() => {
            populateIncidents(incidents, $("#state").val(), $("#city").val());
            populateOfficials(contacts, $("#state").val(), $("#city").val());
        });
    }
});
