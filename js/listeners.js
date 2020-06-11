const emailRegex = /^\w+([-+.'][^\s]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

var incidents = null;
var contacts = null;
var template = null;

$("#return").click(() => {
    $("#feedback").fadeOut(500, () => {
        $("#form-content-wrapper ").fadeIn(500);
    });
});

//function populateEmailPreview(city, state, destinations, body) {
//    $("#mock-email-address span").text(destinations.toString().split(",").join(", "));
//    $("#mock-email-subject span").text(`Demanding Justice in ${city}, ${state}`);
//    $("#mock-email-body").val(body);
//
//    $("#send").click(() => {
//        send(destinations, body);
//    });
//}
//
//function fillTemplate(data, template) {
//    template = template.replace("<<Location>>", data.city + ", " + data.state);
//    template = template.replace("<<Location>>", data.city + ", " + data.state);
//    template = template.replace("<<Name>>", data.name);
//    template = template.replace("<<Name>>", data.name); // One at the end, this is a dumb solution but whatever
//    template = template.replace("<<Age>>", data.age);
//    let incidentText = "INCIDENTS:\n";
//    data.incidents.forEach(incident => {
//        incidentText += `"${incident.name}"\n`;
//        incident.links.forEach((link, index) => {
//            incidentText += `(${index + 1}) ${link}\n`;
//        });
//        incidentText += `\n`;
//    });
//    template = template.replace("<<Incidents>>", incidentText);
//    template = template.replace("<<Residency>>", 
//                                data.resident ? 'I am also one of your constituents. ': "");
//    template = template.replace("<<University>>", 
//                                data.university && data.university !== "" ? data.university : "");
//
//    return template;
//}

$("#launch").click(() => {
    let results = verify();
    if (results !== null && template !== null) {
        // Template emails
        results.officials = findOfficials(contacts, results.state, results.city);
        results.incidents = findIncidents(incidents, results.state, results.city);
        let body = fillTemplate(results, template);
        
        // Sync new email count to Firebase and update DOM
        incrementEmailCount().then((numEmails) => {
            console.log(numEmails);
            $("#email-counter span").text(numEmails)
        });
        
        // Add listeners
        populateEmailPreview(results, template);
        
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
        populateIncidents(incidents, $("#state").val(), $("#city").val());
        populateOfficials(contacts, $("#state").val(), $("#city").val());

        $("#city").change(() => {
            populateIncidents(incidents, $("#state").val(), $("#city").val());
            populateOfficials(contacts, $("#state").val(), $("#city").val());
        });
    }
});
