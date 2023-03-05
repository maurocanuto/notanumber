import 'cross-fetch/polyfill'
import { Color, Gender, Size } from '../types'
import { getVariant } from './variant'

interface PrintfulClientOptions {
  headers?: any
  baseUrl?: string
}

export class PrintfulClient {
  private readonly options: PrintfulClientOptions
  private headers: any

  constructor(token: string, options: PrintfulClientOptions = {}) {
    if (!token) throw new Error('No API key provided')

    const { headers } = options

    this.options = {
      baseUrl: 'https://api.printful.com',
      ...options
    }

    this.headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...headers
    }
  }

  async request<RequestBody, ResponseBody>({
    method,
    endpoint,
    data,
    params = {}
  }: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    endpoint: string
    data?: RequestBody
    params?: { [key: string]: string }
  }): Promise<ResponseBody> {
    const { baseUrl } = this.options
    const headers = this.headers

    const queryString = Object.keys(params).length
      ? `?${Object.keys(params)
          .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
          .join('&')}`
      : ''

    const url = `${baseUrl}/${endpoint}${queryString}`
    const response = await fetch(url, {
      headers,
      ...(method && { method }),
      ...(data && { body: JSON.stringify(data) })
    })

    const json = await response.json()
    if (!response.ok) throw json

    return json as ResponseBody
  }

  get<ResponseBody>(endpoint: string, params?: any): Promise<ResponseBody> {
    return this.request<void, ResponseBody>({ endpoint, params })
  }

  post<RequestBody, ResponseBody>(endpoint: string, data: RequestBody): Promise<ResponseBody> {
    return this.request<RequestBody, ResponseBody>({
      method: 'POST',
      endpoint,
      data
    })
  }

  put<RequestBody, ResponseBody>(endpoint: string, data: RequestBody): Promise<ResponseBody> {
    return this.request<RequestBody, ResponseBody>({
      method: 'PUT',
      endpoint,
      data
    })
  }

  delete<RequestBody, ResponseBody>(endpoint: string): Promise<ResponseBody> {
    return this.request<RequestBody, ResponseBody>({
      method: 'DELETE',
      endpoint
    })
  }

  createNaNProductInStore<RequestBody, ResponseBody>({
    number,
    price,
    size,
    color,
    gender,
    imageFrontUrl,
    imageBackUrl,
    imageLabelInsideUrl
  }: {
    number: number
    price: number
    size: Size
    color: Color
    gender: Gender
    imageFrontUrl: string
    imageBackUrl: string
    imageLabelInsideUrl: string
  }): Promise<ResponseBody> {
    const variantId = getVariant({ size, color, gender })
    const isIgnored = true
    return this.post('store/products', {
      sync_product: {
        external_id: 'nan_' + number + '_' + Date.now(),
        name: 'T-shirt NaN ' + number,
        // thumbnail: 'https://cdn.logo.com/hotlink-ok/logo-social.png',
        is_ignored: isIgnored
      },
      sync_variants: [
        {
          external_id: 'nan_' + number + '_variant_' + Date.now(),
          variant_id: variantId,
          retail_price: price,
          is_ignored: isIgnored,
          files: [
            {
              type: 'front',
              url: imageFrontUrl
            },
            {
              type: 'back',
              url: imageBackUrl
            },
            {
              type: 'label_inside',
              url: imageLabelInsideUrl,
              options: [
                {
                  id: 'template_type',
                  value: 'native'
                }
              ]
            }
          ],
          options: []
        }
      ]
    })
  }
}

export async function request<RequestBody, ResponseBody>(
  endpoint: string,
  { token, ...rest }: { token: string } & PrintfulClientOptions
) {
  const client = new PrintfulClient(token)

  return client.request<RequestBody, ResponseBody>({ endpoint, ...rest })
}
