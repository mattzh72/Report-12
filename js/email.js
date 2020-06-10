const requiredKeys = {
    name: 1,
    state: 1,
    city: 1,
    resident: 1
};

function verify() {
    // Check name is filled out
    let name = $("#name").val().trim();
    // Check state is selected
    let state = $("#state").val();
    // Check city is selected
    let city = $("#city").val();
    // Check residency
    let resident = $("#resident").is(":checked");
    // Check age
    let age = $("#age").val().trim();

    // OPTIONAL REGIONS
    //Check university
    let university = $("#university").val().trim();

    let validName = name.length > 0;
    let validState = state !== null;
    let validCity = city !== null;
    let validAge = Number.isInteger(Number(age));

    let errors = [];
    if (!validName) {
        errors.push("name");
    }

    if (!validState) {
        errors.push("state");
    }

    if (!validCity) {
        errors.push("city");
    }

    if (!validAge) {
        errors.push("age");
    }

    $("#form-content-wrapper label .error-msg").css("display", "none");
    if (errors.length > 0) {
        errors.forEach(error => {
            $(`label[for="${error}"] .error-msg`).css("display", "block");
        });
        return null;
    }

    let result = {
        name: name,
        state: state,
        city: city,
        resident: resident
    };
    if (age !== "") {
        result.age = age;
    }

    if (university !== "") {
        console.log(university);
        result.university = university;
    }

    return result;
}

function draftEmails(data, template) {
    let master = makeTemplate(data, template);
    let emails = {}; // indexed by email
    for (let [position, contact] of Object.entries(data.officials)) {
        let template = master;
        if (position == "Mayor") {
            position = "Mayor ";
            template = template.replace("<<Recipient>>", "Mayor " + contact.name);
            emails[contact.email] = template;
        } else if (position == "DEFAULT") {
            position = ""; // clear out for display purposes
            contact.name = ""; // clear out for display purposes
            template = template.replace("<<Recipient>>", "[OFFICIAL ROLE] " + contact.name);
        } else {
            position = "Council Rep ";
            template = template.replace("<<Recipient>>", "Council Rep " + contact.name);
        }
        
        emails[contact.email] = {body: template, name: contact.name, position: position};
    }
    return emails;
}

function createEmailLinks(destination, body, id, position="", name="", target = "#primary-option") {
    let link = "mailto:" +
        (destination ? (encodeURIComponent(destination)) : "") +
        ("?subject=Demanding Justice in Our Communities") +
        ("&body=" + encodeURIComponent(body));

    let wrapper = $('<div>', {
        text: `Email ${id}: ${position}${name}`,
        class: "email-results-item"
    });
    let emailLink = $('<a>', {
        href: link,
        target: "_blank",
        rel: "noopener noreferrer",
        text: "Send Email",
        id: "primary-" + id,
        class:"right-align-anchor"
    })
    $("#primary-" + id).click(() => {
        $("#primary-" + id).text("Sent! ✓");
    });
    emailLink.appendTo(wrapper);
    wrapper.appendTo($(target));
}

function createCopyLinks(destination, body, id, target = "#backup-option") {
    let wrapper = $('<div>', {
        text: `Email ${id}: ${destination}`,
        class: "email-results-item"
    }).appendTo($(target));
    
//    let emailLink = $('<a>', {
//        href: "#",
//        text: destination,
//        id: "backup-email-" + id,
//    }).appendTo(wrapper);

    let copyLink = $('<a>', {
        href: "#",
        text: "Copy Text",
        id: "backup-" + id,
        class:"right-align-anchor"
    }).appendTo(wrapper);

    $("#backup-" + id).click(($e) => {
        $e.preventDefault();
        const el = document.createElement('textarea');
        el.value = body;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        $("#backup-" + id).text("Copied ✓");
    });
    
//    $("backup-email-" + id).click(($e) => {
//        $e.preventDefault();
//        const el = document.createElement('textarea');
//        el.value = destination;
//        el.setAttribute('readonly', '');
//        el.style.position = 'absolute';
//        el.style.left = '-9999px';
//        document.body.appendChild(el);
//        el.select();
//        document.execCommand('copy');
//        document.body.removeChild(el);
//    });
}

function makeTemplate(data, template) {
    template = template.replace("<<Location>>", data.city + ", " + data.state);
    template = template.replace("<<Name>>", data.name);
    template = template.replace("<<Name>>", data.name); // One at the end, this is a dumb solution but whatever
    template = template.replace("<<Age>>", data.age);
    let incidentText = "INCIDENTS:\n";
    data.incidents.forEach(incident => {
        incidentText += `"${incident.name}"\n`;
        incident.links.forEach((link, index) => {
            incidentText += `(${index + 1}) ${link}\n`;
        });
        incidentText += `\n`;
    });
    template = template.replace("<<Incidents>>", incidentText);
    template = template.replace("<<Residency>>", 
                                data.resident ? 'I am also one of your constituents. ': "");
    template = template.replace("<<University>>", 
                                data.university && data.university !== "" ? data.university : "");

    return template;
}

function send(destination, body) {
    let link = "mailto:" +
        (destination ? (encodeURIComponent(destination)) : "") +
        ("?subject=Demanding Justice in Our Communities") +
        ("&body=" + encodeURIComponent(body));

    let tempLink = $('<a>', {
        href: link,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "temporary-email-link"
    }).appendTo('body');
    tempLink[0].click();
    tempLink.remove();
}
