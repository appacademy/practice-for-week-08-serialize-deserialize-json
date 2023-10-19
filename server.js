const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  let reqBody = "";

  req.on("data", (data) => {
    reqBody += data;
  });

  req.on("end", () => {
    if (reqBody) {
      if (req.headers['content-type'] === 'application/json') {
        // Parse the request body as JSON
        try {
          req.body = JSON.parse(reqBody);
        } catch (error) {
          // Handle JSON parsing errors
          console.error('Error parsing JSON:', error);
          res.statusCode = 400; // Bad Request
          res.end('Invalid JSON');
          return;
        }
      } else {
        // Parse the body of the request as x-www-form-urlencoded
        req.body = reqBody
          .split("&")
          .map((keyValuePair) => keyValuePair.split("="))
          .map(([key, value]) => [key, value.replace(/\+/g, " ")])
          .map(([key, value]) => [key, decodeURIComponent(value)])
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {});
      }

      // Log the body of the request to the terminal
      console.log(req.body);
    }

    const resBody = {
      "Hello": "World!"
    };

    // Serialize the resBody object into JSON
    const responseBody = JSON.stringify(resBody);

    // Set the necessary response components, including the Content-Type
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200; // OK

    // Return the JSON response in the body of the response
    res.end(responseBody);
  });
});

const port = 5000;

server.listen(port, () => console.log('Server is listening on port', port));
