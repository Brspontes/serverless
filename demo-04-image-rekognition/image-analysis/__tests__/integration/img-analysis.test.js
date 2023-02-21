const { describe, it, expect } = require('@jest/globals')
const requestMock = require('./../mocks/request.json')
const aws = require('aws-sdk')
aws.config.update({
  region: 'us-east-1',
})
const { main } = require('./../../src')

describe('Image analyser test suite', () => {
  test('It should analyse successfuly the image returning the results', async () => {
    const resultado = [
      '99.7511% de ser do tipo Pastor',
      '99.7511% de ser do tipo cão alemães',
      '99.7511% de ser do tipo caninos',
      '99.7511% de ser do tipo animais de estimação',
      '99.7511% de ser do tipo animais',
      '99.7511% de ser do tipo mamíferos',
    ]

    const expected = {
      statusCode: 200,
      body: `A imagem tem\n`.concat(resultado.join('\n')),
    }
    const result = await main(requestMock)
    expect(result).toStrictEqual(expected)
  })

  test('given an empty queryString it should return status 400', async () => {
    const expected = {
      statusCode: 400,
      body: 'an IMG is required',
    }
    const result = await main({ queryStringParameters: { imageUrl: null } })
    expect(result).toStrictEqual(expected)
  })

  test('given an invalid ImageUrl it should return 500', async () => {
    const expected = {
      statusCode: 500,
      body: 'Internal Server Error',
    }
    const result = await main({ queryStringParameters: { imageUrl: 'test' } })
    expect(result).toStrictEqual(expected)
  })
})
