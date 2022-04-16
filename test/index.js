"use strict";
const loadtest = require("loadtest");

const options = {
  url: "https://dev-api.imi.ai/v2/requests",
  maxRequests: 1,
  method: "POST",
  body: "",
  requestGenerator: (params, options, client, callback) => {
    const message = '{"test": "stress test mode"}';
    options.headers["Content-Length"] = message.length;
    options.headers["Content-Type"] = "application/json";
    options.headers["Authorization"] =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InByZW1pdW1fcGF0aWVudEBpbWkuYWkiLCJfaWQiOiI1ZmJmZmQ0N2JjNDQ0ODAwMTIyZTk0MGMiLCJyb2xlIjoicGF0aWVudCIsImlhdCI6MTYxOTY5OTY2NywiZXhwIjoxNjIwMTMxNjY3fQ.8mNZA7vHIGmkwyZvci5UNrqXFfE36Ky2X8eJR9y2p6A";
    options.body = {
      biopsy: [],
      radiology: [],
      type: 6,
      isAutomatic: true,
      registrationToken:
        "d_Ump3RMEolt2Q7eEDuIUu:APA91bEqWwEArZmj1imo5vdrpmfT3BbTXfT34y2Mb5L9P2n_7H_5F9N7mRpuMYHRgOOibgSsbFyokTP4gr1p6P8pr_GHIfniGZdyibC1HRZ2oHCm_vCNLZ2O8HiHm9bfJxebaw1sL4Uf",
      questions: [
        {
          content: "N/A",
        },
      ],
      bloodTest: [
        {
          fileName: "new_blood_test.jpeg",
          publicFileUrl:
            "https://storage.googleapis.com/testing-go-bucket/5fbffd47bc444800122e940c%2Fd7790510-a8bd-11eb-8095-e189d8abca17-new_blood_test.jpeg?GoogleAccessId=ocr-92%40imi-server.iam.gserviceaccount.com&Expires=1619682106&Signature=15%2F7PlclDllIjh96s6rswEjHWFdxE8xW8TEF1bZvUkopboBsBkMX02BfNfWzLOoSHa8OqUM%2BH9z1Ii7p2qX8hJQIxjgu%2BnYTINa9pORiGoNMG4zzb8vEwQMFtT9ny09IjDTFM9q3I%2BqnGLQM%2F5vlIC7w%2Fdx0T401%2FQCn%2FdxSBbHrkBgrhDB5uE1OW2B2XD5kB9F8AE2sy51Rx57tfTVwwBJbFTrQst2PuxkGuTI41hSVnhCkepTKbF5Rr5zm7%2B7AKWX%2BIHUmPJ3zma02TXBPh38pR3SyJcUUWXITadHkSw5hYuxPb9v5v2WHpL2ndlujcA9AcQ%2FGXGxTtJriP63gGQ%3D%3D",
          fileType: "image/jpeg",
          fileUrl:
            "https://storage.cloud.google.com/testing-go-bucket/5fbffd47bc444800122e940c/d7790510-a8bd-11eb-8095-e189d8abca17-new_blood_test.jpeg",
        },
      ],
    };
    // options.path = 'YourURLPath';
    const request = client(options, callback);
    request.write(message);
    return request;
  },
};

loadtest.loadTest(options, (error, results) => {
  if (error) {
    return console.error("Got an error: %s", error);
  }
  console.log(results);
  console.log("Tests run successfully");
});
