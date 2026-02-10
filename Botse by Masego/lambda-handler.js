/**
 * Lambda Handler for Botse Express Server
 * 
 * This allows the Express app to run on AWS Lambda + API Gateway
 * Compatible with AWS Lambda Web Adapter
 * 
 * Usage in AWS Lambda:
 * - Handler: lambda-handler.handler
 * - Runtime: Node.js 18.x
 * - Environment: See .env.example
 */

const app = require('./server');

// For AWS Lambda Web Adapter
exports.handler = async (event, context) => {
  // AWS Lambda Web Adapter will wrap the Express app
  return app(event, context);
};

// Alternative: If using ALB or Lambda proxy integration directly
// exports.handler = async (event, context) => {
//   return {
//     statusCode: 200,
//     body: 'Botse API is running on Lambda!',
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   };
// };
