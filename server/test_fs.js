const fs = require('fs');
const path = require("path");


fs.readFile(path.resolve(__dirname,'./email/inlined.html'), 'utf8', (err, template) => {
    console.log(err);
    console.log(template);
});