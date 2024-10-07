import axios from 'axios'

const PARIS_COORDINATES = [48.8566, 2.3522]

function haversineDistance([lat1, lon1], [lat2, lon2]) {
  const R = 6371 
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function validateAddress(address) {
  try {
    const response = await axios.get(
      `https://api-adresse.data.gouv.fr/search/?q=${address}&limit=1`
    )
    const location = response.data.features[0]?.geometry.coordinates

    if (location) {
      const [lon, lat] = location
      const distanceFromParis = haversineDistance(PARIS_COORDINATES, [lat, lon])

      return distanceFromParis <= 50
    } else {
      return false
    }
  } catch (error) {
    console.error('Error validating address:', error)
    return false
  }
}
