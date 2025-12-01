import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Container from '../components/ui/Container'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { User, Bell, Shield, Trash2, Save } from 'lucide-react'

const Settings = () => {
  const { user, updatePreferences } = useAuth()
  const [notifications, setNotifications] = useState(user?.preferences?.notifications ?? true)
  const [defaultOrigin, setDefaultOrigin] = useState(user?.preferences?.defaultOrigin || '')
  const [saving, setSaving] = useState(false)

  const handleSavePreferences = async () => {
    setSaving(true)
    await updatePreferences({
      notifications,
      defaultOrigin,
    })
    setSaving(false)
  }

  return (
    <Container className="py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-3 tracking-tight">Settings</h1>
          <p className="text-lg text-zinc-600">Manage your account preferences</p>
        </div>

        {/* Profile */}
        <Card className="mb-6 animate-slide-up">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Profile</h2>
              <p className="text-sm text-zinc-600">Update your account information</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Name"
              defaultValue={user?.name}
              placeholder="Your name"
            />
            <Input
              label="Email"
              defaultValue={user?.email}
              placeholder="your@email.com"
              disabled
            />
            <Button variant="primary" className="w-full sm:w-auto">
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </Card>

        {/* Preferences */}
        <Card className="mb-6 animate-slide-up">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
              <Bell size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Preferences</h2>
              <p className="text-sm text-zinc-600">Customize your experience</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-xl border border-zinc-200">
              <div>
                <h3 className="font-medium text-zinc-900 mb-1">Email Notifications</h3>
                <p className="text-sm text-zinc-600">Receive updates about your analyses</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-zinc-900 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900"></div>
              </label>
            </div>

            <Input
              label="Default Origin Country"
              value={defaultOrigin}
              onChange={(e) => setDefaultOrigin(e.target.value)}
              placeholder="e.g., USA, China, Germany"
              helperText="This will be used as the default origin for new analyses"
            />

            <Button 
              variant="primary" 
              onClick={handleSavePreferences}
              disabled={saving}
              className="w-full sm:w-auto"
            >
              <Save size={16} className="mr-2" />
              {saving ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </Card>

        {/* Security */}
        <Card className="mb-6 animate-slide-up">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Security</h2>
              <p className="text-sm text-zinc-600">Manage your account security</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button variant="secondary" className="w-full sm:w-auto">
              Change Password
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50/50 animate-slide-up">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
              <Trash2 size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-900">Danger Zone</h2>
              <p className="text-sm text-zinc-600">Irreversible actions</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-zinc-700">
              Deleting your account will permanently remove all your data and analyses.
            </p>
            <Button variant="danger" className="w-full sm:w-auto">
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </Container>
  )
}

export default Settings