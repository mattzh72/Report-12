const requiredKeys = {
    name: 1,
    email: 1,
    state: 1,
    city: 1,
    resident: 1
};

function verify() {
    // Check name is filled out
    let name = $("#name").val().trim();
    // Check email is filled out
    let email = $("#email").val().trim();
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

    let validEmail = emailRegex.test(email);
    let validName = name.length > 0;
    let validState = state !== null;
    let validCity = city !== null;
    let validAge = Number.isInteger(Number(age));

    let errors = [];
    if (!validName) {
        errors.push("Name");
    }

    if (!validEmail) {
        errors.push("Email Address");
    }

    if (!validState) {
        errors.push("State");
    }

    if (!validCity) {
        errors.push("City");
    }

    if (!validAge) {
        errors.push("Age");
    }

    clearErrorMessage();
    if (errors.length > 0) {
        setErrorMessage(errors);
        return null;
    }

    let result = {
        name: name,
        email: email,
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
            template = template.replace("<<Recipient>>", "Mayor " + contact.name);
            emails[contact.email] = template;
        } else {
            template = template.replace("<<Recipient>>", "All Council Members");
            emails[contact.email] = template;
        }

        
    }

    return emails;
}

function makeTemplate(data, template) {
    template = template.replace("<<Location>>", data.city + ", " + data.state);
    template = template.replace("<<Name>>", data.name);
    template = template.replace("<<Name>>", data.name);
    template = template.replace("<<Age>>", data.age);

    let incidentText = "";
    data.incidents.forEach(incident => {
        incidentText += incident.name + "\n";
        incident.links.forEach((link, index) => {
            incidentText += "Source " + (index + 1) + ": " + link + "\n";
        });
    });

    template = template.replace("<<Incidents>>", incidentText);

    if (data.resident) {
        template = template.replace("<<Residency>>", `and I am one of your constituents`);
    } else {
        template = template.replace("<<Residency>>", "");
    }

    if (data.university && data.university !== "") {
        template = template.replace("<<University>>", data.university);
    } else {
        template = template.replace("<<University>>", "");
    }

    return template;
}

function setErrorMessage(errors) {
    let msg = "Missing: ";
    msg += errors;
    msg = msg.split(",").join(", ") + ".";
    $("#error-messages").text(msg);
}

function clearErrorMessage() {
    $("#error-messages").text("");
}

function send(destination, body) {
    let link = "https://mail.google.com/mail?view=cm&tf=0" +
        (destination ? ("&to=" + destination) : "") +
        ("&su=Demanding Justice in Your Community") +
        ("&body=" + body);

    $('<a>', {
        href: link,
        target: "_blank",
        class: "temporary-email-link"
    }).appendTo('body');
    $(".temporary-email-link")[0].click();
    $(".temporary-email-link").remove();
}
