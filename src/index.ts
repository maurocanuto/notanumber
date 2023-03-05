import * as path from 'path'
import * as fs from 'fs'
import { PrintfulClient } from './printful'
import { addTextToImage } from './imageGenerator'
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3'
import { saveToS3 } from './s3'
import { Color, Gender, Size } from './types'

const PRINTFUL_API_TOKEN = 'UH2F6fpliQBiOcvEgK1KoNnkggQPWPNwYOaHa0Ng'
const PRINTFUL_STORE_ID = '10065412'
const S3_CONFIG: S3ClientConfig = {
  region: 'eu-west-2'
}
const S3_BUCKET = 'notanumber-tshirt'
const S3_KEY_PREFIX = 'images_front/'
const IMAGE_BACK_URL = 'https://cdn.logo.com/hotlink-ok/logo-social.png'
const IMAGE_LABEL_INSIDE_URL = 'https://cdn.logo.com/hotlink-ok/logo-social.png'

const inputImagePath = path.join(__dirname, 'images/front.png')
const SAVE_ON_S3 = true
const CREATE_ON_PRINTFUL = true
const NUM_FROM = 1 // Incuded
const NUM_TO = 2 // Excluded
const T_SHIRT_SIZE: Size = 'M'
const T_SHIRT_GENDER: Gender = 'WOMAN'
const T_SHIRT_COLOR: Color = 'white'

const printful = new PrintfulClient(PRINTFUL_API_TOKEN, {
  headers: {
    'X-PF-Store-Id': PRINTFUL_STORE_ID
  }
})

const s3Client = new S3Client(S3_CONFIG)

for (let number = NUM_FROM; number < NUM_TO; number++) {
  const outputImagePath = path.join(__dirname, 'output_' + number + '.png')
  addTextToImage(inputImagePath, outputImagePath, number.toString(), 'Arial', 80, '#000000').then(
    (image) => {
      console.log(`T-shirt ${number}: image generated successfully. Path: ${image}`)
      const fileName = 'nan_' + number.toString() + '_front.png'
      const s3Key = S3_KEY_PREFIX + fileName

      if (SAVE_ON_S3) {
        saveToS3({ client: s3Client, bucket: S3_BUCKET, key: s3Key, fileLocalPath: image })
          .then((imgUrl) => {
            console.log(`T-shirt ${number}: file stored on S3 successfully. Url: ${imgUrl}`)
            if (CREATE_ON_PRINTFUL) {
              const imageFrontUrl = imgUrl
              printful
                .createNaNProductInStore({
                  number: number,
                  price: 19.0,
                  size: T_SHIRT_SIZE,
                  gender: T_SHIRT_GENDER,
                  color: T_SHIRT_COLOR,
                  imageFrontUrl: imageFrontUrl,
                  imageBackUrl: IMAGE_BACK_URL,
                  imageLabelInsideUrl: IMAGE_LABEL_INSIDE_URL
                })
                .then((data) => {
                  const productId = 'xxxx'
                  console.log(
                    `T-shirt ${number}: product create on Printful successfully. Id: ${productId}`
                  )
                })
                .catch((error) => {
                  console.log(`T-shirt ${number}: Error when creating product on Printful`, error)
                })
            } else {
              console.log(
                `Product T-shirt ${number} not created on Printful. Set CREATE_ON_PRINTFUL to true if you want to do that`
              )
            }
          })
          .catch((error) => {
            console.log(`T-shirt ${number}: Error when uplading to S3`, error)
          })
      } else {
        console.log(
          `Image ${s3Key} not stored on S3 and not created on Printful. Set SAVE_ON_S3 to true if you want to do that`
        )
      }
    }
  )
}
