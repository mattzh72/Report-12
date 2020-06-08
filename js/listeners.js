const emailRegex = /^\w+([-+.'][^\s]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

var incidents = null;
var contacts = null;
var template = null;

var nameFlag = false;
var emailFlag = false;
var stateFlag = false;
var cityFlag = false;

function canLaunch() {
    return nameFlag && emailFlag && stateFlag && cityFlag;
}

$("#return").click(() => {
    $("#feedback").fadeOut(500, () => {
        $("#form-content-wrapper ").fadeIn(500);
    });
});

$("#launch").click(() => {
    let results = verify();
    if (results !== null && template !== null) {
        results.officials = findOfficials(contacts, results.state, results.city);
        results.incidents = findIncidents(incidents, results.state, results.city);


        let emails = draftEmails(results, template);
        for (let [destination, body] of Object.entries(emails)) {
            send(destination, body);
            break;
        }

    }
    //    $("#form-content-wrapper").fadeOut(500, () => {
    //        $("#feedback").fadeIn(500);
    //    });
});


// Read in data and initialize states
$(document).ready(() => {
    cycleBackground();
    
    incidents = indexIncidents(rawIncidentsData);
    contacts = indexContacts(rawContactsData);
    

//    $.getJSON("./data/incidents.json", function (rawIncidentsData) {
//        $.getJSON("./data/contacts.json", function (rawContactsData) {
//            incidents = indexIncidents(rawIncidentsData);
//            contacts = indexContacts(rawContactsData);
            //            console.log(incidents);
            //            console.log(contacts);
//                        console.log(crossValidate(incidents, contacts));
            populateStates(incidents);
//        });
//    });

    $.get('resources/template.txt', function (data) {
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
