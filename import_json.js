
import http from "http";

http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World\n');
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');


import fs from 'fs';
import mongoose from 'mongoose';
import countryModel from "./app/models/country.model.js";
import statesModel from "./app/models/states.model.js";
import regionsModel from "./app/models/regions.model.js";
import sectorsModel from "./app/models/sectors.model.js";
import cpvCodesModel from "./app/models/cpv_codes.model.js";
import fundingAgencyModel from "./app/models/funding_agency.model.js";
import cityModel from "./app/models/city.model.js";

const mongoURL = 'mongodb+srv://bidsinfoglobal:3N4ZRDaS6H64GajL@qa.t5cmca1.mongodb.net';
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000
});

//connection for mongoose
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    console.log('Connection Successful!');
});

// Read users.json file
// fs.readFile('country.json', function (err, data) {
//     // Check for errors
//     if (err) throw err;

//     // Converting to JSON
//     const science = JSON.parse(data);
//     // console.log(science[0].interest_rate);
//     var promises = science.map((scores) => {
//         var payload = {};
//         payload.name = scores.name;
//         payload.num_code = scores.num_code;
//         payload.str_code = scores.str_code;
//         payload.is_deleted = false;
//         payload.is_active = true;
//         return payload;
//     });
//     Promise.all(promises).then((files) =>
//         // console.log(files.length)
//         countryModel.insertMany(files)
//             .then((results) => {
//                 return results;
//             })
//             .catch((e) => {
//                 return e;
//             })
//     );
// });

// fs.readFile('states.json', function (err, data) {
//     // Check for errors
//     if (err) throw err;

//     // Converting to JSON
//     const science = JSON.parse(data);
//     // console.log(science[0].interest_rate);
//     var promises = science.map((scores) => {
//         var payload = {};
//         payload.country_name = "India";
//         payload.name = scores.name;
//         payload.code = scores.code;
//         payload.is_deleted = false;
//         payload.is_active = true;
//         return payload;
//     });
//     Promise.all(promises).then((files) =>
//         // console.log(files.length)
//         statesModel.insertMany(files)
//             .then((results) => {
//                 return results;
//             })
//             .catch((e) => {
//                 return e;
//             })
//     );
// });
fs.readFile('cities.json', function (err, data) {
    // Check for errors
    if (err) throw err;

    // Converting to JSON
    const science = JSON.parse(data);
    // console.log(science[0].interest_rate);
    var promises = science.map((scores) => {
        var payload = {};
        payload.state_name = scores.state;
        payload.name = scores.name;
        payload.code = scores.code;
        payload.towns = scores.towns;
        payload.is_deleted = false;
        payload.is_active = true;
        return payload;
    });
    Promise.all(promises).then((files) =>
        // console.log(files.length)
        cityModel.insertMany(files)
            .then((results) => {
                return results;
            })
            .catch((e) => {
                return e;
            })
    );
});


// fs.readFile('regions.json', function (err, data) {
//     // Check for errors
//     if (err) throw err;

//     // Converting to JSON
//     const science = JSON.parse(data);
//     // console.log(science[0].interest_rate);
//     var promises = science.map((scores) => {
//         var payload = {};
//         payload.name = scores.name;
//         payload.code = scores.code;
//         payload.is_deleted = false;
//         payload.is_active = true;
//         return payload;
//     });
//     Promise.all(promises).then((files) =>
//         // console.log(files.length)
//         regionsModel.insertMany(files)
//             .then((results) => {
//                 return results;
//             })
//             .catch((e) => {
//                 return e;
//             })
//     );
// });


// fs.readFile('sector.json', function (err, data) {
//     // Check for errors
//     if (err) throw err;

//     // Converting to JSON
//     const science = JSON.parse(data);
//     // console.log(science[0].interest_rate);
//     var promises = science.map((scores) => {
//         var payload = {};
//         payload.name = scores.name;
//         payload.code = scores.code;
//         payload.is_deleted = false;
//         payload.is_active = true;
//         return payload;
//     });
//     Promise.all(promises).then((files) =>
//         // console.log(files.length)
//         sectorsModel.insertMany(files)
//             .then((results) => {
//                 return results;
//             })
//             .catch((e) => {
//                 return e;
//             })
//     );
// });

fs.readFile('cpvcodes.json', function (err, data) {
    // Check for errors
    if (err) throw err;

    // Converting to JSON
    const science = JSON.parse(data);
    // console.log(science[0].interest_rate);
    var promises = science.map((scores) => {
        var payload = {};
        payload.description = scores.Description;
        payload.code = scores.Code;
        payload.is_deleted = false;
        payload.is_active = true;
        return payload;
    });
    Promise.all(promises).then((files) =>
        // console.log(files.length)
        cpvCodesModel.insertMany(files)
            .then((results) => {
                return results;
            })
            .catch((e) => {
                return e;
            })
    );
});

// fs.readFile('funding_agency.json', function (err, data) {
//     // Check for errors
//     if (err) throw err;

//     // Converting to JSON
//     const science = JSON.parse(data);
//     // console.log(science[0].interest_rate);
//     var promises = science.map((scores) => {
//         var payload = {};
//         payload.title = scores.title;
//         payload.is_deleted = false;
//         payload.is_active = true;
//         return payload;
//     });
//     Promise.all(promises).then((files) =>
//         // console.log(files.length)
//         fundingAgencyModel.insertMany(files)
//             .then((results) => {
//                 return results;
//             })
//             .catch((e) => {
//                 return e;
//             })
//     );
// });
