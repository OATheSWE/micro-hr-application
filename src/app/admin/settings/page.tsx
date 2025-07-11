'use client'

import { useState } from 'react'
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Users, 
  Globe,
  Save
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { motion } from 'framer-motion'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    systemMaintenance: false,
    autoBackup: true,
    twoFactorAuth: true,
    language: 'en',
    timezone: 'UTC'
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    // In a real app, you'd save settings to the backend
    console.log('Saving settings:', settings)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage system configuration</p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Bell className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <button
                  onClick={() => handleSettingChange('emailNotifications', !settings.emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Require 2FA for all users</p>
                </div>
                <button
                  onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.twoFactorAuth ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* System */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Database className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">System</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Auto Backup</p>
                  <p className="text-sm text-gray-500">Automatically backup data daily</p>
                </div>
                <button
                  onClick={() => handleSettingChange('autoBackup', !settings.autoBackup)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoBackup ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">System Maintenance</p>
                  <p className="text-sm text-gray-500">Enable maintenance mode</p>
                </div>
                <button
                  onClick={() => handleSettingChange('systemMaintenance', !settings.systemMaintenance)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.systemMaintenance ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.systemMaintenance ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <Globe className="w-6 h-6 text-indigo-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                  <Select
                    options={[
                      { value: 'en', label: 'English' },
                      { value: 'es', label: 'Spanish' },
                      { value: 'fr', label: 'French' },
                      { value: 'de', label: 'German' }
                    ]}
                  value={settings.language}
                    onChange={(value) => handleSettingChange('language', value)}
                    placeholder="Select Language"
                  />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                  <Select
                    options={[
                      { value: 'UTC', label: 'UTC' },
                      { value: 'EST', label: 'Eastern Time' },
                      { value: 'PST', label: 'Pacific Time' },
                      { value: 'GMT', label: 'GMT' }
                    ]}
                  value={settings.timezone}
                    onChange={(value) => handleSettingChange('timezone', value)}
                    placeholder="Select Timezone"
                  />
                </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>

      {/* Save Button */}
      <motion.div 
        className="flex justify-end"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button onClick={handleSave}>
          <Save className="w-5 h-5 mr-2" />
          Save Settings
        </Button>
      </motion.div>
    </div>
  )
} 