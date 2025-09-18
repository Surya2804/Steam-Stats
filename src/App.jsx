import { useState } from 'react'
import './App.css'
import { getProfile, getGames, getGamesEnhanced, getAchievements, getGenres, getFriends, getRecommendations, getCoopGames } from './services/steam'

function App() {
  const [steamId1, setSteamId1] = useState('')
  const [steamId2, setSteamId2] = useState('')
  const [profiles, setProfiles] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCompare = async (e) => {
    e.preventDefault()
    if (!steamId1 || !steamId2) return
    
    setLoading(true)
    setError('')
    
    try {
      const [profile1, games1, gamesEnhanced1, achievements1, genres1, friends1] = await Promise.all([
        getProfile(steamId1),
        getGames(steamId1),
        getGamesEnhanced(steamId1),
        getAchievements(steamId1),
        getGenres(steamId1),
        getFriends(steamId1)
      ])
      
      const [profile2, games2, gamesEnhanced2, achievements2, genres2, friends2, recommendations, coopGames] = await Promise.all([
        getProfile(steamId2),
        getGames(steamId2),
        getGamesEnhanced(steamId2),
        getAchievements(steamId2),
        getGenres(steamId2),
        getFriends(steamId2),
        getRecommendations(steamId1, steamId2),
        getCoopGames(steamId1, steamId2)
      ])

      setProfiles({
        player1: {
          name: profile1.personaname || 'Player 1',
          avatar: profile1.avatarfull,
          accountCreated: profile1.timecreated ? new Date(profile1.timecreated * 1000).getFullYear() : 'Unknown',
          totalPlaytime: Math.round((games1.games?.reduce((total, game) => total + game.playtime_forever, 0) || 0) / 60),
          gamesOwned: games1.game_count || 0,
          topGames: games1.games?.sort((a, b) => b.playtime_forever - a.playtime_forever).slice(0, 3) || [],
          topGamesWithImages: gamesEnhanced1.enhanced_games || [],
          achievements: achievements1,
          genres: genres1.genres,
          friends: friends1,
          recommendations: recommendations.forPlayer1
        },
        player2: {
          name: profile2.personaname || 'Player 2',
          avatar: profile2.avatarfull,
          accountCreated: profile2.timecreated ? new Date(profile2.timecreated * 1000).getFullYear() : 'Unknown',
          totalPlaytime: Math.round((games2.games?.reduce((total, game) => total + game.playtime_forever, 0) || 0) / 60),
          gamesOwned: games2.game_count || 0,
          topGames: games2.games?.sort((a, b) => b.playtime_forever - a.playtime_forever).slice(0, 3) || [],
          topGamesWithImages: gamesEnhanced2.enhanced_games || [],
          achievements: achievements2,
          genres: genres2.genres,
          friends: friends2,
          recommendations: recommendations.forPlayer2
        },
        sharedData: {
          mutualFriends: [],
          sharedGames: recommendations.sharedGames,
          coopGames: coopGames
        },
        steamIds: {
          player1: steamId1,
          player2: steamId2
        }
      })
    } catch (err) {
      setError('Error fetching profiles. Check Steam IDs and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = (e) => {
    e.target.style.display = 'none'
    e.target.nextSibling.style.display = 'flex'
  }

  const renderGameCard = (game, index) => {
    return (
      <div 
        key={index} 
        className="game-card clickable-game"
        onClick={(e) => {
          e.stopPropagation()
          window.open(`https://store.steampowered.com/app/${game.appid}`, '_blank')
        }}
        title="Click to view on Steam Store"
      >
        <div className="game-image">
          <img 
            src={game.header_image} 
            alt={game.name}
            onError={handleImageError}
          />
          <div className="game-placeholder" style={{ display: 'none' }}>
            <span>🎮</span>
          </div>
        </div>
        <div className="game-info">
          <strong>{game.name}</strong>
          <span className="playtime">{game.hours_played}h played</span>
        </div>
      </div>
    )
  }

  const renderCoopGame = (game, index) => {
    return (
      <div key={index} className="coop-game">
        <div className="coop-game-image">
          <img 
            src={`https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`}
            alt={game.name}
            onError={handleImageError}
          />
          <div className="coop-game-placeholder" style={{ display: 'none' }}>
            🎮
          </div>
        </div>
        <div className="game-info">
          <strong>{game.name}</strong>
          <div className="game-details">
            <span className="coop-type">{game.coopType}</span>
            <span className="players">{game.maxPlayers}</span>
          </div>
        </div>
        {game.isPopular && <span className="popular-badge">🔥 Popular</span>}
      </div>
    )
  }

  if (!profiles) {
    return (
      <div className="app">
        <header>
          <h1>Steam Profile Comparator</h1>
          <p>Compare gaming profiles between two Steam users</p>
        </header>

        <form onSubmit={handleCompare} className="input-form">
          <div className="input-group">
            <label>First Steam ID:</label>
            <input
              type="text"
              value={steamId1}
              onChange={(e) => setSteamId1(e.target.value)}
              placeholder="Enter Steam ID"
              required
            />
          </div>
          
          <div className="input-group">
            <label>Second Steam ID:</label>
            <input
              type="text"
              value={steamId2}
              onChange={(e) => setSteamId2(e.target.value)}
              placeholder="Enter Steam ID"
              required
            />
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Comparing...' : 'Compare Profiles'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}
      </div>
    )
  }

  return (
    <div className="app">
      <header>
        <h1>Steam Profile Comparator</h1>
        <p>Compare Steam profiles between two users</p>
      </header>

      <div className="results">
        <h2>Comparison Results</h2>
        
        <div className="shared-stats">
          <h3>Connection</h3>
          <div className="stats-grid">
            <div className="stat">
              <span className="stat-number">{profiles.sharedData.sharedGames}</span>
              <span className="stat-label">Shared Games</span>
            </div>
            <div className="stat">
              <span className="stat-number">0</span>
              <span className="stat-label">Mutual Friends</span>
            </div>
          </div>
        </div>

        <div className="profiles">
          <div 
            className="profile clickable-profile" 
            onClick={() => window.open(`https://steamcommunity.com/profiles/${profiles.steamIds.player1}`, '_blank')}
            title="Click to view Steam profile"
          >
            <h3>{profiles.player1.name}</h3>
            <img src={profiles.player1.avatar} alt="Avatar" />
            <p>Account Created: {profiles.player1.accountCreated}</p>
            <p>Total Playtime: {profiles.player1.totalPlaytime}h</p>
            <p>Games Owned: {profiles.player1.gamesOwned}</p>
            <p>Achievement Rate: {profiles.player1.achievements.percentage}%</p>
            <p>Friends: {profiles.player1.friends.count}</p>
            
            <div>
              <h4>Top Genres:</h4>
              {Object.entries(profiles.player1.genres || {}).map(([genre, hours], i) => (
                <div key={i}>{genre}: {hours}h</div>
              ))}
            </div>
            
            <div>
              <h4>Top Games:</h4>
              <div className="games-showcase">
                {profiles.player1.topGamesWithImages.slice(0, 3).map(renderGameCard)}
              </div>
            </div>

            <div>
              <h4>Game Recommendations:</h4>
              {profiles.player1.recommendations?.slice(0, 3).map((game, i) => (
                <div key={i}>{game.name}</div>
              ))}
            </div>

            <div className="profile-link-hint">
              <small>🔗 Click anywhere to view Steam profile</small>
            </div>
          </div>

          <div className="vs">VS</div>

          <div 
            className="profile clickable-profile" 
            onClick={() => window.open(`https://steamcommunity.com/profiles/${profiles.steamIds.player2}`, '_blank')}
            title="Click to view Steam profile"
          >
            <h3>{profiles.player2.name}</h3>
            <img src={profiles.player2.avatar} alt="Avatar" />
            <p>Account Created: {profiles.player2.accountCreated}</p>
            <p>Total Playtime: {profiles.player2.totalPlaytime}h</p>
            <p>Games Owned: {profiles.player2.gamesOwned}</p>
            <p>Achievement Rate: {profiles.player2.achievements.percentage}%</p>
            <p>Friends: {profiles.player2.friends.count}</p>
            
            <div>
              <h4>Top Genres:</h4>
              {Object.entries(profiles.player2.genres || {}).map(([genre, hours], i) => (
                <div key={i}>{genre}: {hours}h</div>
              ))}
            </div>
            
            <div>
              <h4>Top Games:</h4>
              <div className="games-showcase">
                {profiles.player2.topGamesWithImages.slice(0, 3).map(renderGameCard)}
              </div>
            </div>

            <div>
              <h4>Game Recommendations:</h4>
              {profiles.player2.recommendations?.slice(0, 3).map((game, i) => (
                <div key={i}>{game.name}</div>
              ))}
            </div>

            <div className="profile-link-hint">
              <small>🔗 Click anywhere to view Steam profile</small>
            </div>
          </div>
        </div>

        <div className="coop-section">
          <h3>🎮 Co-op Gaming Together</h3>
          
          <div className="compatibility-score">
            <div className="score-circle">
              <span className="score-number">{profiles.sharedData.coopGames.compatibilityScore}%</span>
              <span className="score-label">Gaming Compatibility</span>
            </div>
            <div className="coop-stats">
              <div className="stat">
                <span>{profiles.sharedData.coopGames.stats.readyToPlay}</span>
                <small>Ready to Play</small>
              </div>
              <div className="stat">
                <span>{profiles.sharedData.coopGames.stats.suggestions}</span>
                <small>New Suggestions</small>
              </div>
            </div>
          </div>

          {profiles.sharedData.coopGames.availableCoopGames.length > 0 && (
            <div className="coop-games">
              <h4>🚀 Ready to Play Together</h4>
              <div className="games-grid">
                {profiles.sharedData.coopGames.availableCoopGames.map(renderCoopGame)}
              </div>
            </div>
          )}

          {profiles.sharedData.coopGames.suggestedCoopGames.length > 0 && (
            <div className="suggested-coop">
              <h4>💡 Co-op Games to Buy</h4>
              <div className="suggestions-grid">
                {profiles.sharedData.coopGames.suggestedCoopGames.map((game, i) => (
                  <div key={i} className="suggestion">
                    <strong>{game.name}</strong>
                    <div className="suggestion-details">
                      <span>{game.type}</span>
                      <span>{game.players}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={() => {
          setProfiles(null)
          setSteamId1('')
          setSteamId2('')
        }}
        className="new-comparison-btn"
      >
        New Comparison
      </button>
    </div>
  )
}

export default App
