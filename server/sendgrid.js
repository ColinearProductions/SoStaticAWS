const sendgridClient = require('@sendgrid/mail');
const Mustache = require('mustache');
const path = require("path");
require('dotenv').config()


sendgridClient.setApiKey(process.env.SENDGRID_API_KEY);
const fs = require('fs');
let htmlTemplate;

fs.readFile(path.resolve(__dirname, './email/inlined.html'), 'utf8', (err, template) => {
    if (err) {
        console.error("Failed reading template html", err);
        process.exit(1)
    } else {
        htmlTemplate = template;
    }
});


console.log(process.env.SENDGRID_API_KEY);

email("becheru.razvan@gmail.com");


const sendMessage = function (payload, websiteConfig, formConfig) {
    let entries = [];

    for (let key in payload)
        if (Object.prototype.hasOwnProperty.call(payload, key))
            entries.push({key: key, value: payload[key]});

    let emailData = {
        'alias': websiteConfig.alias,
        'formAlias': formConfig.alias,
        'entries': entries,
        'websiteurl': websiteConfig.url,
        'unsubscribeUrl': ""

    };
    let rendered = Mustache.render(htmlTemplate, emailData);


    let to = objToArray(websiteConfig.contacts)[0].email;

    const msg = {
        to: to,
        from: {
            email: 'noreply@sostatic.xyz',
            name: 'SoStatic'
        },
        subject: 'New message on ' + websiteConfig.alias,
        html: rendered,
    };
    sendgridClient
        .send(msg)
        .then(() => console.log("ON Send email succesfull"))
        .catch(error => console.error(error));


};

function email(to) {
    const msg = {
        to: to,
        from: {
            email: 'noreply@sostatic.xyz',
            name: 'SoStatic'
        },
        subject: 'This is a test email',
        html: '<h1>This is a test email!!!</h1>',
    };
    sendgridClient.send(msg)
        .then(() => console.log("ON Send email succesfull"))
        .catch(error => console.error(error));

}

function objToArray(obj) {
    return Object.keys(obj).map(function (key) {
        obj[key]['key'] = key;
        return obj[key];
    });
}


module.exports = {
    sendMessage, email
};