const errors = {
    "Unknown Location": 1
};

function indexIncidents(data) {
    var locations = {};

    $("#data-update").text(data.updated_at);
    data.data.forEach(incident => {
        if (!(incident.state in errors)) {
            if (!(incident.state in locations)) {
                locations[incident.state] = [];
            }

            locations[incident.state].push(incident);
        }
    });

    return locations;
}

function indexContacts(data) {
    var contacts = {};

    data.forEach(contact => {
        let loc = contact.Location.split(", ");
        if (!(loc[1] in contacts)) {
            contacts[loc[1]] = [];
        }

        contacts[loc[1]].push({
            city: loc[0],
            state: loc[1],
            officials: bundleContact(contact)
        });
    });

    return contacts;
}

function findOfficials(contacts, state, city) {
    let result = null;
    
    if (state in contacts) {
        contacts[state].forEach(contact => {
            if (contact.city === city) {
                result = contact.officials;
            }
        });
    }
    
    return result;
}

function findIncidents(incidents, state, city) {
    let result = [];
    
    if (state in incidents) {
        incidents[state].forEach(incident => {
            if (incident.city === city) {
                result.push(incident);
            }
        });
    }
    
    return result.length === 0 ? null : result;
}

function bundleContact(contact, limit = 4) {
    let bundled = {};

    if (contact.Mayor !== "") {
        bundled["Mayor"] = {
            name: contact["Mayor"],
            email: contact["Mayor's Email"]
        };
    }

    for (let i = 1; i <= limit; i++) {
        if ("CCR Email " + i in contact && contact["CCR Email " + i]) {
            bundled["City Council Rep " + i] = {
                name: contact["City Council Rep " + i],
                email: contact["CCR Email " + i]
            };
        }
    }

    return bundled;
}

function crossValidate(incidentData, contactData) {
    let locPairs = {};
    for (let [state, contacts] of Object.entries(contactData)) {
        locPairs[state] = {};

        contacts.forEach(contact => {
            locPairs[state][contact.city] = 1;
        });
    }

    let missing = {};
    for (let [state, incidents] of Object.entries(incidentData)) {
        incidents.forEach(incident => {
            if (!(state in locPairs) || !(incident.city in locPairs[state])) {
                missing[incident.city + ", " + state] = 1;
            }
        });
    }

    return Object.keys(missing);
}


function populateStates(locations) {
    Object.keys(locations).forEach(state => {
        $('#state').append(new Option(state, state));
    });
}

function populateCities(locations, state) {
    let cities = {};
    locations[state].forEach(incident => {
        cities[incident.city] = 1;
    });

    $("#city option").remove();

    Object.keys(cities).forEach(city => {
        $('#city').append(new Option(city, city));
    });
}

function populateIncidents(incidents, state, city) {
    $("#incidents span").remove();
    $("#incidents a").remove();
    $("#incidents br").remove();

    incidents[state].forEach(incident => {
        if (incident.city === city) {
            $('<span>', {
                text: incident.name
            }).appendTo('#incidents');
            incident.links.forEach((link, idx) => {
                $('<a>', {
                    text: ' Source ' + (idx + 1),
                    href: link,
                    target: "_blank",
                    rel: "noopener noreferrer"
                }).appendTo('#incidents');
            });
            $('<br>').appendTo('#incidents');
            $('<br>').appendTo('#incidents');
        }
    });
}

function populateOfficials(contacts, state, city) {
    $("#officials .officials-card").remove();
    $("#officials span").remove();

    let found = false;

    if (state in contacts) {
        contacts[state].forEach((contact, i) => {
            if (contact.city === city) {
                let id = 0;
                for (let [position, information] of Object.entries(contact.officials)) {
                    createOfficialsCard(information.name, position, information.email, id);
                    id++;
                }

                found = true;
            }
        });
    }

    if (!found) {
        $('<span>', {
            text: `We're missing contacts for ${city}, ${state}, but you can still use this template. Contact us using the form on the bottom right if you have this data and would like to contribute.`
        }).css('color', 'red').appendTo('#officials');
    }
}

function createOfficialsCard(name, position, email, id) {
    $('<div>', {
        class: "officials-card",
        id: id
    }).appendTo('#officials');

    $('<div>', {
        class: "officials-name",
        text: name
    }).appendTo('#' + id);

    $('<div>', {
        class: "officials-position",
        text: position
    }).appendTo('#' + id);

    $('<div>', {
        class: "officials-email",
        text: email
    }).appendTo('#' + id);
}
