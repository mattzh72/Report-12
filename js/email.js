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
    // Check voting age
    let age = $("#age").is(":checked");
    // Check subject
    let subject = $("#subject").val().trim();

    let validName = name.length > 0;
    let validState = state !== null;
    let validCity = city !== null;
    let validSubject = subject.length > 0;

    let errors = [];
    if (!validName) 
    {
        errors.push("name");
    }
    if (!validState) 
    {
        errors.push("state");
    }
    if (!validCity) 
    {
        errors.push("city");
    }
    if (!validSubject) 
    {
        errors.push("subject");
    }

    $("#form-content-wrapper label .error-msg").css("display", "none");
    if (errors.length > 0) 
    {
        errors.forEach(error => {
            $(`label[for="${error}"] .error-msg`).css("display", "block");
        });
        return null;
    }

    return {
        name: name,
        subject: subject,
        state: state,
        city: city,
        resident: resident,
        age: age
    };
}

function populateEmailPreview(data, template) {
    let body = fillTemplate(data, template);

    let destinations = [];
    Object.values(data.officials).forEach(contact => {
        destinations.push(contact.email);
    });

    $("#mock-email-address").text(destinations.toString().split(",").join(", "));
    $("#mock-email-subject").text(`Re: ${data.subject}`);
    $("#mock-email-body").val(body);

    $("#mock-email-address").unbind('click');
    $("#mock-email-address").click(() => {
        $("#mock-email-address").select();
        document.execCommand('copy');
    });

    $("#mock-email-subject").unbind('click');
    $("#mock-email-subject").click(() => {
        $("#mock-email-subject").select();
        document.execCommand('copy');
    });

    $("#mock-email-body").unbind('click');
    $("#mock-email-body").click(() => {
        $("#mock-email-body").select();
        document.execCommand('copy');
    });

    $("#send").unbind('click');
    $("#send").click(() => {
        send(destinations, data.subject, body);
        $("#send").text("Sent ✓");
    });
}

function fillTemplate(data, template) {
    template = template.replace("<<Location>>", data.city + ", " + data.state);
    template = template.replace("<<Location>>", data.city + ", " + data.state);
    template = template.replace("<<Name>>", data.name);
    template = template.replace("<<Name>>", data.name); // One at the end, this is a dumb solution but whatever
    let incidentText = "INCIDENTS:\n";
    data.incidents.forEach(incident => {
        incidentText += `"${incident.name}"\n`;
        incident.links.forEach((link, index) => {
            incidentText += `(${index + 1}) ${link}\n`;
        });
        incidentText += `\n`;
    });
    template = template.replace("<<Incidents>>", incidentText);
    
    let optionalInfo = "";
    if (data.resident && data.age) {
        optionalInfo = ", and I am one of your constituents of voting age."
    } else if (data.resident && !data.age) {
        optionalInfo = ", and I am one of your constituents."
    } else if (!data.resident && data.age) {
        optionalInfo = ", and I am of voting age."
    }
    
    template = template.replace("<<Residency>>", optionalInfo);

    return template;
}

function send(destinations, subject, body) {
    let emailURL = "https://mail.google.com/mail/?view=cm&fs=1" +
        (destinations ? ("&to=" + encodeURIComponent(destinations.toString())) : "") +
        ("&su=" + encodeURI(subject)) + ("&body=" + encodeURIComponent(body));

    if (IS_MOBILE) {
        emailURL = "mailto:" +
            (destinations ? (encodeURIComponent(destinations.toString())) : "") +
            ("?subject=" + encodeURI(subject)) +
            ("&body=" + encodeURIComponent(body));
    }

    let tempLink = $('<a>', {
        href: emailURL,
        target: "_blank",
        class: "temporary-email-link"
    }).appendTo('body');
    tempLink[0].click();
    tempLink.remove();
}
