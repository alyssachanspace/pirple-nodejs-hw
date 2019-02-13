/*
 * Homework Assignment #1: create a simple "Hello World" API.
 * 1. It should be a RESTful JSON API that listens on a port of your choice.
 * 2. When someone posts anything to the route /hello, you should return a welcome message, in JSON format.
 *    This message can be anything you want.
 * 
 * Note: using ES6 + JavaScript Standard Style
 */

// Dependencies
const http = require('http')
const url = require('url')
const StringDecoder = require('string_decoder').StringDecoder

// Instantiate the server
const server = http.createServer((req, res) => {
  // Get the URL and parse it
  const parsedURL = url.parse(req.url, true)

  // Get the path
  const path = parsedURL.pathname
  const trimmedPath = path.replace(/^\/+|\/+$/g, '')

  // Get the query string as an object
  const queryStringObject = parsedURL.query

  // Get the HTTP method
  const method = req.method.toLowerCase()

  // Get the headers as an object
  const headers = req.headers

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8')
  let buffer = ''

  req.on('data', (data) => {
    buffer += decoder.write(data)
  })

  req.on('end', () => {
    buffer += decoder.end()

    // Choose the handler this request should go to
    // If one is not found, use the notFound handler
    const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound

    // Construct the data object to send to the handler
    const data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer
    }

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode,payload) => {

      // Use the status code called back the handler, or set the default status code to 200
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200

      // Use the payload returned from the handler, or set the default payload to an empty object
      payload = typeof(payload) === 'object' ? payload : {}

      // Convert the payload object to string
      const payloadString = JSON.stringify(payload)

      // Return the response
      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)

      // Log the request path
      console.log('Returning this response: ', statusCode, payloadString)
    })
  })
})

// Define port variable
const PORT = process.env.PORT || 3000

// Start the server
server.listen(PORT, function(){
  console.log(`The server is running on port ${PORT}`)
})

// Define the handlers
let handlers = {}

// hello handler
handlers.hello = function(data,callback){
  callback(200, {'greeting': 'Welcome friends'})
}

// Not found handler
handlers.notFound = function(data,callback){
  callback(404)
}

// Define a request router
const router = {
  'hello': handlers.hello
}
