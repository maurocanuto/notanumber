import { Color, Gender, Size } from '../types'
import { getVariant } from './variant'

describe('getVariant', () => {
  it('should return variant id when a matching variant is found', () => {
    const variant = getVariant({
      size: 'M',
      color: 'black',
      gender: 'MAN'
    })

    expect(variant).toBe(504)
  })

  it('should return variant id for all possible combinations', () => {
    const sizes: Size[] = ['S', 'M', 'L', 'XL']
    const genders: Gender[] = ['MAN', 'WOMAN']
    const colors: Color[] = ['white', 'black']

    sizes.forEach((size) => {
      genders.forEach((gender) => {
        colors.forEach((color) => {
          expect(() => {
            getVariant({
              size,
              gender,
              color
            })
          }).not.toThrow()
        })
      })
    })
  })
})
