// Environmental Impact Calculator
// This simulates the AI-powered analysis that would use OpenAI API in production

const COUNTRY_DISTANCES = {
  'China': 12000,
  'USA': 3000,
  'Germany': 1000,
  'Japan': 15000,
  'India': 8000,
  'Unknown': 5000
}

const CARBON_FACTORS = {
  'Electronics': 0.8,
  'Clothing': 0.4,
  'Food': 0.2,
  'Furniture': 0.6,
  'Books': 0.1,
  'Default': 0.5
}

const MATERIAL_IMPACT = {
  'plastic': 2.5,
  'metal': 1.8,
  'glass': 1.2,
  'wood': 0.8,
  'paper': 0.3,
  'cotton': 1.5,
  'synthetic': 2.0
}

function analyzeProductCategory(name, description) {
  const text = `${name} ${description}`.toLowerCase()
  
  if (text.includes('phone') || text.includes('laptop') || text.includes('tv') || text.includes('electronic')) {
    return 'Electronics'
  } else if (text.includes('shirt') || text.includes('dress') || text.includes('clothing') || text.includes('fashion')) {
    return 'Clothing'
  } else if (text.includes('food') || text.includes('snack') || text.includes('drink')) {
    return 'Food'
  } else if (text.includes('chair') || text.includes('table') || text.includes('furniture')) {
    return 'Furniture'
  } else if (text.includes('book') || text.includes('magazine')) {
    return 'Books'
  }
  
  return 'Default'
}

function calculateShippingImpact(origin, weight = 1) {
  const distance = COUNTRY_DISTANCES[origin] || COUNTRY_DISTANCES['Unknown']
  // Simple calculation: distance * weight * emission factor
  return (distance * weight * 0.0001).toFixed(2)
}

function calculateManufacturingImpact(category, materials = ['plastic']) {
  const baseFactor = CARBON_FACTORS[category] || CARBON_FACTORS['Default']
  const materialFactor = materials.reduce((acc, material) => {
    return acc + (MATERIAL_IMPACT[material.toLowerCase()] || 1.0)
  }, 0) / materials.length
  
  return (baseFactor * materialFactor * 10).toFixed(2)
}

function generateRecommendations(score, category, origin) {
  const recommendations = []
  
  if (score > 7) {
    recommendations.push('🔴 Consider alternatives with lower environmental impact')
    recommendations.push('♻️ Look for recycled or refurbished versions')
  } else if (score > 5) {
    recommendations.push('🟡 Moderate impact - use responsibly')
    recommendations.push('🌱 Consider eco-friendly alternatives when replacing')
  } else {
    recommendations.push('🟢 Good choice! Lower environmental impact')
    recommendations.push('👍 Continue making sustainable choices')
  }
  
  if (origin && origin !== 'Unknown' && COUNTRY_DISTANCES[origin] > 8000) {
    recommendations.push('✈️ Consider local alternatives to reduce shipping impact')
  }
  
  if (category === 'Electronics') {
    recommendations.push('🔋 Properly recycle at end of life')
    recommendations.push('⚡ Use energy-efficient settings')
  }
  
  return recommendations
}

export async function calculateEnvironmentalImpact(productData) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const { name, description = '', origin = 'Unknown', inputMethod } = productData
  
  // Analyze product category
  const category = analyzeProductCategory(name, description)
  
  // Extract potential materials (simplified - would use NLP in real app)
  const materials = ['plastic'] // Default, would be extracted from description
  
  // Calculate different impact components
  const manufacturingImpact = parseFloat(calculateManufacturingImpact(category, materials))
  const shippingImpact = parseFloat(calculateShippingImpact(origin))
  const packagingImpact = Math.random() * 2 + 1 // Simulated
  const endOfLifeImpact = Math.random() * 1.5 + 0.5 // Simulated
  
  // Calculate total score (0-10 scale)
  const totalImpact = manufacturingImpact + shippingImpact + packagingImpact + endOfLifeImpact
  const score = Math.min(totalImpact / 2, 10).toFixed(1)
  
  // Generate recommendations
  const recommendations = generateRecommendations(parseFloat(score), category, origin)
  
  // Create detailed breakdown
  const breakdown = {
    manufacturing: {
      score: manufacturingImpact,
      percentage: ((manufacturingImpact / totalImpact) * 100).toFixed(1)
    },
    shipping: {
      score: shippingImpact,
      percentage: ((shippingImpact / totalImpact) * 100).toFixed(1)
    },
    packaging: {
      score: packagingImpact.toFixed(2),
      percentage: ((packagingImpact / totalImpact) * 100).toFixed(1)
    },
    endOfLife: {
      score: endOfLifeImpact.toFixed(2),
      percentage: ((endOfLifeImpact / totalImpact) * 100).toFixed(1)
    }
  }
  
  return {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    product: {
      name,
      description,
      origin,
      category,
      inputMethod
    },
    environmentalScore: parseFloat(score),
    breakdown,
    recommendations,
    totalImpact: totalImpact.toFixed(2),
    grade: score >= 7 ? 'Poor' : score >= 5 ? 'Fair' : score >= 3 ? 'Good' : 'Excellent'
  }
}
