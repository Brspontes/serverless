const { dynamoDB } = require('./src/factory')
const Handler = require('./src/handler')
const { decoratorValidator } = require('./src/util')
const handler = new Handler({ dynamoDBSvc: dynamoDB })
const heroesTrigger = async (event) => {
  console.log('****event', event)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v3.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  }
}

const heroesInsert = decoratorValidator(
  handler.main.bind(handler),
  Handler.validator(),
  'body'
)

module.exports = {
  heroesTrigger,
  heroesInsert,
}
