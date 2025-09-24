import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Palette } from 'lucide-react';

const settingsCategories = [
  {
    icon: User,
    title: 'Account',
    description: 'Manage your account settings and preferences',
    items: ['Profile Information', 'Password & Security', 'Connected Accounts']
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Control how and when you receive notifications',
    items: ['Email Notifications', 'Push Notifications', 'Alert Preferences']
  },
  {
    icon: Palette,
    title: 'Appearance',
    description: 'Customize the look and feel of your dashboard',
    items: ['Theme Settings', 'Layout Preferences', 'Color Scheme']
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'Manage your privacy and security settings',
    items: ['Data Privacy', 'Security Settings', 'Permission Controls']
  }
];

const Settings = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                className="p-6 rounded-lg border bg-card hover:bg-card/80 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      • {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Settings;