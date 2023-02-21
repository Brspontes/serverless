const { get } = require('axios')

module.exports = class Handler {
  constructor({ rekoSvc, translatorSvc }) {
    this.rekoSvc = rekoSvc
    this.translatorSvc = translatorSvc
  }

  async getImageBuffer(imageUrl) {
    const response = await get(imageUrl, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data, 'base64')
    return buffer
  }

  async detectedImageLabels(buffer) {
    const result = await this.rekoSvc
      .detectLabels({
        Image: {
          Bytes: buffer,
        },
      })
      .promise()
    const workingItems = result.Labels.filter(
      ({ Confidence }) => Confidence > 80
    )
    const names = workingItems.map(({ Name }) => Name).join(' and ')
    return {
      names,
      workingItems,
    }
  }

  formatTextResults(texts, workingItems) {
    const finalText = []
    for (const indexText in texts) {
      const nameInPortuguese = texts[indexText]
      const confidence = workingItems[indexText].Confidence

      finalText.push(
        `${confidence.toFixed(4)}% de ser do tipo ${nameInPortuguese}`
      )
    }

    return finalText.join('\n')
  }

  async translateText(text) {
    const params = {
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'pt',
      Text: text,
    }

    const { TranslatedText } = await this.translatorSvc
      .translateText(params)
      .promise()

    return TranslatedText.split(' e ')
  }

  async main(event) {
    try {
      console.log('Event', event)
      const { imageUrl } = event.queryStringParameters

      if (!imageUrl)
        return {
          statusCode: 400,
          body: 'an IMG is required',
        }

      console.log('downloading image...')
      const buffer = await this.getImageBuffer(imageUrl)

      console.log('detecting image labels...')
      const { names, workingItems } = await this.detectedImageLabels(buffer)

      console.log('translate to portuguese...')
      const texts = await this.translateText(names)
      const finalText = this.formatTextResults(texts, workingItems)

      console.log('finishing...')

      return {
        statusCode: 200,
        body: `A imagem tem\n`.concat(finalText),
      }
    } catch (error) {
      console.error(error.stack)
      return {
        statusCode: 500,
        body: 'Internal Server Error',
      }
    }
  }
}
