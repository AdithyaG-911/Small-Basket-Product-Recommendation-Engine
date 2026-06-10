// Shared utilities for product unit display, text formatting, and category-specific placeholders

/**
 * Converts text to sentence case (first letter uppercase, rest lowercase)
 */
export function toSentenceCase(str) {
  if (!str) return ''
  const s = String(str).trim()
  if (s.length === 0) return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

/**
 * Converts text to title case (capitalize each word)
 */
export function toTitleCase(str) {
  if (!str) return ''
  return String(str)
    .split(/\s+/)
    .map((w) => {
      if (w.length === 0) return w
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    })
    .join(' ')
    .replace(/\s+&\s+/g, ' & ')
}

/**
 * Determines sensible unit display based on product metadata and category detection
 * Examples: "1 L", "500 g", "1 kg", "1 pc"
 */
export function getProductUnitText(product) {
  if (!product) return ''
  const name = (product.name || '').toLowerCase()
  const category = (product.category || '').toLowerCase()

  // Use explicit unit if provided by backend
  if (product.size) {
    const sizeText = String(product.size).trim()
    if (sizeText.match(/\d+\s*(kg|g|l|ml|pc|pcs|piece|pieces)/i)) {
      return sizeText.replace(/\s+/g, ' ')
    }
    return sizeText
  }

  if (product.unit) {
    const unitText = String(product.unit).trim().toLowerCase()
    if (unitText === 'pc' || unitText === 'pcs' || unitText === 'piece' || unitText === 'pieces') return '1 pc'
    if (unitText.match(/\d+\s*(kg|g|l|ml|pc|pcs|piece|pieces)/i)) return unitText.replace(/\s+/g, ' ')
    return product.unit
  }

  // Detect explicit unit embedded in the product name
  const explicitNameUnit = name.match(/(\d+(?:\.\d+)?\s*(?:kg|g|l|ml|pc|pcs|piece|pieces))/i)
  if (explicitNameUnit) return explicitNameUnit[0].replace(/\s+/g, ' ')

  // Detect liquid products
  const isLiquid = ['milk', 'juice', 'water', 'oil', 'soda', 'cola', 'drink', 'beverage', 'beverages', 'wine', 'spirits', 'beer', 'sauce'].some(t => name.includes(t) || category.includes(t))

  // Detect grocery/weight-based products
  const isGrocery = [
    'groceries', 'foodgrains', 'foodgrains, oil & masala', 'bakery', 'bakery, cakes & dairy',
    'fruits & vegetables', 'fresh produce', 'snacks', 'snacks & branded foods', 'dairy', 'beverages'
  ].some(t => category.includes(t))

  // Detect products sold by weight
  const heavyWeight = ['rice', 'dal', 'wheat', 'flour', 'sugar', 'salt', 'pasta', 'oats', 'cereal', 'butter', 'ghee', 'oil'].some(t => name.includes(t) || category.includes(t))
  const isWeightProduct = ['kg', 'gram', 'grams', 'grocery', 'foodgrain', 'flour', 'grain', 'pulse', 'lentil'].some(t => name.includes(t) || category.includes(t))
  const smallPack = ['spice', 'masala', 'tea', 'coffee', 'bread', 'biscuits', 'snacks', 'nut', 'nuts', 'jam', 'sauce'].some(t => name.includes(t) || category.includes(t))
  const drinkPack = ['juice', 'soda', 'cola', 'beer', 'wine', 'tea', 'coffee', 'milk', 'water'].some(t => name.includes(t) || category.includes(t))
  const pieceProduct = ['egg', 'banana', 'apple', 'orange', 'tomato', 'onion', 'garlic', 'mango', 'pear', 'potato', 'cucumber', 'chocolate bar'].some(t => name.includes(t) || category.includes(t))

  if (pieceProduct && !isLiquid) return '1 pc'
  if (isLiquid) return drinkPack ? '500 ml' : '1 L'
  if (heavyWeight) return '1 kg'
  if (smallPack) return '250 g'
  if (isGrocery || isWeightProduct) return '500 g'

  return ''
}

/**
 * Returns category-specific placeholder background colors
 */
export function getPlaceholderColor(category) {
  const categoryLower = (category || '').toLowerCase()
  const colorMap = {
    'beauty & hygiene': '#f3e5ab',
    'bath & hand wash': '#e8f5e9',
    'cosmetics': '#fce4ec',
    'skincare': '#e1f5fe',
    'haircare': '#fff3e0',
    'nutrition': '#f3e5f5',
    'groceries': '#e8f5e9',
    'fresh produce': '#c8e6c9',
    'fruits': '#ffccbc',
    'vegetables': '#c8e6c9',
    'electronics': '#b3e5fc',
    'fashion': '#f8bbd0',
    'home': '#ffe0b2',
    'sports': '#b2dfdb',
    'books': '#d1c4e9',
    'toys': '#ffccbc',
    'food': '#fff9c4',
    'beverages': '#ffe0b2',
    'bakery': '#fff3e0',
    'dairy': '#e8f5e9',
    'snacks': '#fff9c4',
    'cooking': '#fff3e0',
    'oil & masala': '#fff3e0',
  }
  return colorMap[categoryLower] || '#f5f5f5'
}

/**
 * Returns a category-specific SVG icon for placeholder display
 */
export function getCategoryPlaceholderSVG(category) {
  const categoryLower = (category || '').toLowerCase()
  
  const getSVG = (path, viewBox = '0 0 24 24') => (
    <svg width="48" height="48" viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.9 }}>
      {path}
    </svg>
  )

  // Grocery/Food SVG
  if (['groceries', 'fresh produce', 'fruits', 'vegetables', 'bakery', 'snacks', 'beverages', 'dairy', 'oil & masala'].some(t => categoryLower.includes(t))) {
    return getSVG(<path d="M3 7h18v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" stroke="#777" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>)
  }

  // Beauty & Hygiene SVG
  if (['beauty', 'hygiene', 'cosmetics', 'skincare', 'haircare'].some(t => categoryLower.includes(t))) {
    return getSVG(<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" stroke="#777" strokeWidth="1.2"/>)
  }

  // Electronics SVG
  if (categoryLower.includes('electronics')) {
    return getSVG(<path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-2 12H4V4h14v10z" stroke="#777" strokeWidth="1.2"/>)
  }

  // Fashion/Clothing SVG
  if (['fashion', 'clothing', 'apparel'].some(t => categoryLower.includes(t))) {
    return getSVG(<path d="M16 2H8c-1.1 0-2 .9-2 2v3h2V4h8v3h2V4c0-1.1-.9-2-2-2zm3 8h-1v9c0 .55-.45 1-1 1h-8c-.55 0-1-.45-1-1v-9H5v9c0 1.65 1.35 3 3 3h8c1.65 0 3-1.35 3-3v-9zm-4-3H9v2h6V7z" stroke="#777" strokeWidth="1.2"/>)
  }

  // Home/Household SVG
  if (['home', 'household', 'kitchen', 'garden', 'pets'].some(t => categoryLower.includes(t))) {
    return getSVG(<path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" stroke="#777" strokeWidth="1.2"/>)
  }

  // Default product SVG
  return getSVG(<path d="M3 7h18v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" stroke="#777" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>)
}
