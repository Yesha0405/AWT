import { useEffect, useState } from 'react'

const defaultSettings = {
  theme: 'light',
  density: 'comfortable',
  academicYear: '2026-27',
}

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings)

  useEffect(() => {
    const saved = localStorage.getItem('campusflow-settings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('campusflow-settings', JSON.stringify(settings))
    document.body.dataset.theme = settings.theme
  }, [settings])

  const updateSetting = (key, value) => setSettings((current) => ({ ...current, [key]: value }))

  return (
    <section className="page-panel">
      <div className="page-header">
        <div>
          <p className="eyebrow">Preferences</p>
          <h1>Settings</h1>
        </div>
      </div>

      <div className="settings-grid">
        <div className="table-card">
          <div className="TableHeader">
            <h3>Appearance</h3>
          </div>
          <div className="settings-list">
            <label className="settings-option">
              <span>Light / Dark mode</span>
              <select value={settings.theme} onChange={(event) => updateSetting('theme', event.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label className="settings-option">
              <span>Table density</span>
              <select value={settings.density} onChange={(event) => updateSetting('density', event.target.value)}>
                <option value="comfortable">Comfortable</option>
                <option value="compact">Compact</option>
              </select>
            </label>
            <label className="settings-option">
              <span>Academic year</span>
              <select value={settings.academicYear} onChange={(event) => updateSetting('academicYear', event.target.value)}>
                <option value="2026-27">2026-27</option>
                <option value="2025-26">2025-26</option>
                <option value="2024-25">2024-25</option>
              </select>
            </label>
          </div>
        </div>

        <div className="table-card">
          <div className="TableHeader">
            <h3>Campus preferences</h3>
          </div>
          <div className="settings-list">
            <div className="settings-item">
              <span>Default student view</span>
              <strong>Table</strong>
            </div>
            <div className="settings-item">
              <span>Attendance policy</span>
              <strong>Eligible ≥ 75%</strong>
            </div>
            <div className="settings-item">
              <span>Report export format</span>
              <strong>CSV</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
