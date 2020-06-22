var incidents = null;
var contacts = null;
var template = null;

const FADE_RATE = 300;

$("#return-search").click(() => {
    // Reset sent button
    $("#feedback").fadeOut(FADE_RATE, () => {
        $("#search-results").fadeIn(FADE_RATE);
        $("#send").text("Send");
    });
});

$("#return-form").click(() => {
    // Reset sent button
    $("#search-results").fadeOut(FADE_RATE, () => {
        $("#form").fadeIn(FADE_RATE);
    });
});

$("#launch").click(() => {
    let results = verify();
    if (results !== null && template !== null) {
        // Template emails
        results.officials = findOfficials(contacts, results.state, results.city);
        results.incidents = findIncidents(incidents, results.state, results.city);
        
        $("#thanks span").text(results.name.toUpperCase());
        // Sync new email count to Firebase and update DOM
        incrementEmailCount(num=Math.max(Object.keys(results.officials).length, 1), abbreviate=false).then((numEmails) => {
            $("#success-message span").text(numEmails);
            $("#email-counter span").text(abbreviateNumber(numEmails));
        });
        
        // Add listeners
        populateEmailPreview(results, template);
        
        // Fade in feedback and fade out form 
        $("#search-results").fadeOut(FADE_RATE, () => {
            $("#feedback").fadeIn(FADE_RATE);
        });
    }
});

$("#search").click(() => {
    let results = verify();
    if (results !== null && template !== null) {
        populateIncidents(incidents, $("#state").val(), $("#city").val());
        populateOfficials(contacts, $("#state").val(), $("#city").val());

        // Fade in search results and fade out form 
        $("#form").fadeOut(FADE_RATE, () => {
            $("#search-results").fadeIn(FADE_RATE);
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

    $.getJSON("https://raw.githubusercontent.com/mattzh72/Think-Globally-Act-Vocally/master/resources/data/incidents.json", function (rawIncidentsData) {
        $("#data-update").text(rawIncidentsData.updated_at);
        $.getJSON("https://raw.githubusercontent.com/mattzh72/Think-Globally-Act-Vocally/master/resources/data/contacts.json", function (rawContactsData) {
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
    }
});
