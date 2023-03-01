import * as path from 'path'
import { PrintfulClient } from './printful'
import { addTextToImage } from './imageGenerator'

const PRINTFUL_API_TOKEN = 'WnxhJVDanWy13FeNTjI1KAO5JYFBCQoQBOwlfACT'
const inputImagePath = path.join(__dirname, 'images/front.png')

const printful = new PrintfulClient(PRINTFUL_API_TOKEN, {
  headers: {
    'X-PF-Store-Id': '10065412'
  }
})

for (let i = 0; i < 1; i++) {
  const outputImagePath = path.join(__dirname, 'output_' + i + '.png')
  addTextToImage(inputImagePath, outputImagePath, i.toString(), 'Arial', 80, '#000000').then(() => {
    printful
      .post('store/products', {
        sync_product: {
          external_id: 'p1',
          name: 'T-shirt Mau',
          thumbnail: 'https://cdn.logo.com/hotlink-ok/logo-social.png',
          is_ignored: true
        },
        sync_variants: [
          {
            external_id: 'v1',
            variant_id: 10288,
            retail_price: '29.99',
            is_ignored: true,
            sku: 'SKU1234',
            product: null,
            files: [
              {
                type: 'front',
                url: 'https://files.cdn.printful.com/files/4c7/4c7c3fb887083c8658966f552696e3ae_thumb.png'
              }
            ],
            options: []
          }
        ]
      })
      .then((data) => console.log(data))
      .catch((item) => console.log(item))
  })
}
