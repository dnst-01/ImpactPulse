import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiUser, HiCog, HiLink, HiBell, HiShieldCheck } from 'react-icons/hi';
import DashboardShell from '../components/layout/DashboardShell';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }
  }
};

const tabs = [
  { id: 'profile', label: 'Profile', icon: HiUser },
  { id: 'preferences', label: 'Preferences', icon: HiCog },
  { id: 'connections', label: 'Connections', icon: HiLink },
  { id: 'notifications', label: 'Notifications', icon: HiBell },
  { id: 'security', label: 'Security', icon: HiShieldCheck }
];

function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    organization: user?.organization || ''
  });

  const handleSave = async () => {
    setSaving(true);
    await updateProfile(formData);
    setSaving(false);
  };

  const platforms = [
    { id: 'twitter', name: 'Twitter / X', connected: true, color: '#1DA1F2' },
    { id: 'instagram', name: 'Instagram', connected: true, color: '#E4405F' },
    { id: 'linkedin', name: 'LinkedIn', connected: false, color: '#0A66C2' },
    { id: 'facebook', name: 'Facebook', connected: false, color: '#1877F2' }
  ];

  return (
    <DashboardShell>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Settings</h1>
          <p className="mt-1 text-ink-500">Manage your account and preferences</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="w-64 shrink-0"
          >
            <div className="card p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-accent-50 text-accent-600'
                        : 'text-ink-600 hover:bg-ink-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="flex-1"
          >
            <div className="card p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-ink-900">Profile Information</h2>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-accent-500 to-teal-500 flex items-center justify-center text-white text-2xl font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <button className="text-sm text-accent-600 hover:text-accent-700 font-medium">
                        Change photo
                      </button>
                      <p className="text-xs text-ink-500 mt-1">JPG, PNG, or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-ink-200 bg-ink-50 text-ink-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-ink-700 mb-2">
                        Organization
                      </label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </motion.button>
                  </div>
                </div>
              )}

              {activeTab === 'connections' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-ink-900">Connected Platforms</h2>
                  <p className="text-ink-500">Connect your social media accounts to import analytics data.</p>

                  <div className="space-y-4">
                    {platforms.map((platform) => (
                      <div
                        key={platform.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-ink-200 hover:border-ink-300 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
                            style={{ backgroundColor: platform.color }}
                          >
                            {platform.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-ink-900">{platform.name}</p>
                            <p className="text-sm text-ink-500">
                              {platform.connected ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            platform.connected
                              ? 'border border-red-200 text-red-600 hover:bg-red-50'
                              : 'bg-accent-500 text-white hover:bg-accent-600'
                          }`}
                        >
                          {platform.connected ? 'Disconnect' : 'Connect'}
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-ink-900">Dashboard Preferences</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">
                        Default Platform View
                      </label>
                      <select className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all duration-200">
                        <option value="all">All Platforms</option>
                        <option value="twitter">Twitter</option>
                        <option value="instagram">Instagram</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="facebook">Facebook</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">
                        Default Date Range
                      </label>
                      <select className="w-full px-4 py-3 rounded-xl border border-ink-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 transition-all duration-200">
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last year</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink-700 mb-2">
                        Theme
                      </label>
                      <div className="flex gap-3">
                        {['light', 'dark', 'system'].map((theme) => (
                          <button
                            key={theme}
                            className="flex-1 px-4 py-3 rounded-xl border border-ink-200 hover:border-accent-500 transition-colors capitalize"
                          >
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-ink-900">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'Weekly performance report', desc: 'Receive a summary every Monday' },
                      { label: 'Milestone alerts', desc: 'Get notified when you hit milestones' },
                      { label: 'Viral content alerts', desc: 'Instant alerts for viral posts' },
                      { label: 'Campaign updates', desc: 'Updates on active campaigns' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-ink-200">
                        <div>
                          <p className="font-medium text-ink-900">{item.label}</p>
                          <p className="text-sm text-ink-500">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked={i < 2} />
                          <div className="w-11 h-6 bg-ink-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-500" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-ink-900">Security Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-ink-200">
                      <h3 className="font-medium text-ink-900">Change Password</h3>
                      <p className="text-sm text-ink-500 mt-1">Update your password regularly for security</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-3 px-4 py-2 rounded-xl border border-ink-200 text-ink-700 hover:bg-ink-50 transition-colors text-sm font-medium"
                      >
                        Update Password
                      </motion.button>
                    </div>

                    <div className="p-4 rounded-xl border border-ink-200">
                      <h3 className="font-medium text-ink-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-ink-500 mt-1">Add an extra layer of security</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-3 px-4 py-2 rounded-xl bg-accent-500 text-white hover:bg-accent-600 transition-colors text-sm font-medium"
                      >
                        Enable 2FA
                      </motion.button>
                    </div>

                    <div className="p-4 rounded-xl border border-red-200 bg-red-50/50">
                      <h3 className="font-medium text-red-700">Delete Account</h3>
                      <p className="text-sm text-red-600 mt-1">Permanently delete your account and all data</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-3 px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium"
                      >
                        Delete Account
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default SettingsPage;


