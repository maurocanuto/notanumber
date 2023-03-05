import { Color, Gender, Size } from '../types'

// male tshirt: PRODUCT: 428 - VARIANT: 11577
// unisex:
type VariantsPerSize = { id: number; gender: Gender; color: Color }[]
const VARIANTS: Record<Size, VariantsPerSize> = {
  S: [
    {
      id: 473,
      gender: 'MAN',
      color: 'white'
    },
    {
      id: 474,
      gender: 'MAN',
      color: 'black'
    },
    {
      id: 473,
      gender: 'WOMAN',
      color: 'white'
    },
    {
      id: 474,
      gender: 'WOMAN',
      color: 'black'
    }
  ],
  M: [
    {
      id: 505,
      gender: 'MAN',
      color: 'white'
    },
    {
      id: 504,
      gender: 'MAN',
      color: 'black'
    },
    {
      id: 505,
      gender: 'WOMAN',
      color: 'white'
    },
    {
      id: 504,
      gender: 'WOMAN',
      color: 'black'
    }
  ],
  L: [
    {
      id: 535,
      gender: 'MAN',
      color: 'white'
    },
    {
      id: 536,
      gender: 'MAN',
      color: 'black'
    },
    {
      id: 535,
      gender: 'WOMAN',
      color: 'white'
    },
    {
      id: 536,
      gender: 'WOMAN',
      color: 'black'
    }
  ],
  XL: [
    {
      id: 566,
      gender: 'MAN',
      color: 'white'
    },
    {
      id: 567,
      gender: 'MAN',
      color: 'black'
    },
    {
      id: 566,
      gender: 'WOMAN',
      color: 'white'
    },
    {
      id: 567,
      gender: 'WOMAN',
      color: 'black'
    }
  ]
}

export const getVariant = ({
  size,
  color = 'white',
  gender = 'MAN'
}: {
  size: Size
  color: Color
  gender: Gender
}) => {
  const variantList = VARIANTS[size]
  const result = variantList.find((v) => {
    return v.color === color && v.gender === gender
  })

  if (!result) {
    throw new Error(`Variant not found for ${size}-${gender}-${color}`)
  }
  console.log(`Getting variant for ${size}-${color}-${gender}: ${result.id}`)
  return result.id
}
