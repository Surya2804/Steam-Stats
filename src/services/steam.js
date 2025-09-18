const API_BASE = 'http://localhost:4000/api'

export const resolveUsername = async (username) => {
  const response = await fetch(`${API_BASE}/resolve/${username}`)
  return response.json()
}

export const getProfile = async (steamId) => {
  const response = await fetch(`${API_BASE}/summary/${steamId}`)
  return response.json()
}

export const getGames = async (steamId) => {
  const response = await fetch(`${API_BASE}/games/${steamId}`)
  return response.json()
}

export const getGamesEnhanced = async (steamId) => {
  const response = await fetch(`${API_BASE}/games-enhanced/${steamId}`)
  return response.json()
}

export const getAchievements = async (steamId) => {
  const response = await fetch(`${API_BASE}/achievements/${steamId}`)
  return response.json()
}

export const getGenres = async (steamId) => {
  const response = await fetch(`${API_BASE}/genres/${steamId}`)
  return response.json()
}

export const getFriends = async (steamId) => {
  const response = await fetch(`${API_BASE}/friends/${steamId}`)
  return response.json()
}

export const getRecommendations = async (steamId1, steamId2) => {
  const response = await fetch(`${API_BASE}/recommendations/${steamId1}/${steamId2}`)
  return response.json()
}

export const getCoopGames = async (steamId1, steamId2) => {
  const response = await fetch(`${API_BASE}/coop/${steamId1}/${steamId2}`)
  return response.json()
}
