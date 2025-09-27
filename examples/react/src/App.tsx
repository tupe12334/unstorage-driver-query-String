import React, { useState, useEffect } from 'react'
import { createStorage } from 'unstorage'
import { createQueryStringDriver } from 'unstorage-driver-query-string'

interface UserProfile {
  name: string
  email: string
  preferences: {
    theme: string
    notifications: boolean
  }
}

const App: React.FC = () => {
  const [storage] = useState(() => createStorage({
    driver: createQueryStringDriver({
      base: 'demo',
      updateHistory: true,
      historyMethod: 'replaceState'
    })
  }))

  const [filter, setFilter] = useState('')
  const [count, setCount] = useState(0)
  const [enabled, setEnabled] = useState(false)
  const [theme, setTheme] = useState('light')
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    preferences: {
      theme: 'light',
      notifications: false
    }
  })
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    const loadInitialValues = async () => {
      const initialFilter = await storage.getItem('filter') as string || ''
      const initialCount = await storage.getItem('count') as number || 0
      const initialEnabled = await storage.getItem('enabled') as boolean || false
      const initialTheme = await storage.getItem('theme') as string || 'light'
      const initialProfile = await storage.getItem('user.profile') as UserProfile || {
        name: '',
        email: '',
        preferences: {
          theme: 'light',
          notifications: false
        }
      }

      setFilter(initialFilter)
      setCount(initialCount)
      setEnabled(initialEnabled)
      setTheme(initialTheme)
      setUserProfile(initialProfile)
    }

    loadInitialValues()
    updateCurrentUrl()
  }, [storage])

  const updateCurrentUrl = () => {
    setCurrentUrl(window.location.href)
  }

  const handleFilterChange = async (value: string) => {
    setFilter(value)
    await storage.setItem('filter', value)
    updateCurrentUrl()
  }

  const handleCountChange = async (value: number) => {
    setCount(value)
    await storage.setItem('count', value)
    updateCurrentUrl()
  }

  const handleEnabledChange = async (value: boolean) => {
    setEnabled(value)
    await storage.setItem('enabled', value)
    updateCurrentUrl()
  }

  const handleThemeChange = async (value: string) => {
    setTheme(value)
    await storage.setItem('theme', value)
    updateCurrentUrl()
  }

  const handleProfileChange = async (profile: UserProfile) => {
    setUserProfile(profile)
    await storage.setItem('user.profile', profile)
    updateCurrentUrl()
  }

  const clearAllData = async () => {
    await storage.clear()
    setFilter('')
    setCount(0)
    setEnabled(false)
    setTheme('light')
    setUserProfile({
      name: '',
      email: '',
      preferences: {
        theme: 'light',
        notifications: false
      }
    })
    updateCurrentUrl()
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>unstorage-driver-query-string React Example</h1>

      <p>
        This example demonstrates how to use unstorage with the query string driver
        to persist application state in the URL. Try changing the values below and
        notice how the URL updates automatically.
      </p>

      <div className="url-display">
        <strong>Current URL:</strong><br />
        {currentUrl}
      </div>

      <div className="demo-section">
        <h3>Simple Values</h3>
        <div className="controls">
          <div>
            <label>Filter: </label>
            <input
              type="text"
              value={filter}
              onChange={(e) => handleFilterChange(e.target.value)}
              placeholder="Enter filter text"
            />
          </div>

          <div>
            <label>Count: </label>
            <input
              type="number"
              value={count}
              onChange={(e) => handleCountChange(Number(e.target.value))}
            />
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => handleEnabledChange(e.target.checked)}
              />
              Enabled
            </label>
          </div>

          <div>
            <label>Theme: </label>
            <select value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </div>

      <div className="demo-section">
        <h3>Nested Objects</h3>
        <p>This demonstrates storing complex nested data structures:</p>

        <div className="controls">
          <div>
            <label>Name: </label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => handleProfileChange({
                ...userProfile,
                name: e.target.value
              })}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label>Email: </label>
            <input
              type="email"
              value={userProfile.email}
              onChange={(e) => handleProfileChange({
                ...userProfile,
                email: e.target.value
              })}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label>Preferred Theme: </label>
            <select
              value={userProfile.preferences.theme}
              onChange={(e) => handleProfileChange({
                ...userProfile,
                preferences: {
                  ...userProfile.preferences,
                  theme: e.target.value
                }
              })}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="blue">Blue</option>
            </select>
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={userProfile.preferences.notifications}
                onChange={(e) => handleProfileChange({
                  ...userProfile,
                  preferences: {
                    ...userProfile.preferences,
                    notifications: e.target.checked
                  }
                })}
              />
              Email Notifications
            </label>
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <strong>User Profile Data:</strong>
          <pre style={{
            backgroundColor: '#333',
            color: '#fff',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(userProfile, null, 2)}
          </pre>
        </div>
      </div>

      <div className="demo-section">
        <h3>Actions</h3>
        <button onClick={clearAllData}>
          Clear All Data
        </button>
        <button onClick={() => window.location.reload()}>
          Reload Page (test persistence)
        </button>
      </div>

      <div className="demo-section">
        <h3>Features Demonstrated</h3>
        <ul>
          <li>✅ String, number, and boolean values</li>
          <li>✅ Nested object structures</li>
          <li>✅ URL updates in real-time</li>
          <li>✅ State persistence across page reloads</li>
          <li>✅ Configurable base prefix (`demo[key]`)</li>
          <li>✅ Browser history integration</li>
        </ul>
      </div>

      <div className="demo-section">
        <h3>Try This</h3>
        <ol>
          <li>Fill in some values above</li>
          <li>Copy the URL and open it in a new tab</li>
          <li>Notice how the state is restored from the URL</li>
          <li>Use browser back/forward buttons to see history integration</li>
        </ol>
      </div>
    </div>
  )
}

export default App