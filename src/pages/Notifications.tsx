import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, Clock, AlertCircle } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'info',
    title: 'Property Analysis Complete',
    message: 'Your property analysis for 123 Main St has been completed.',
    time: '2 minutes ago',
    unread: true
  },
  {
    id: 2,
    type: 'success',
    title: 'Valuation Updated',
    message: 'Property valuation has been updated based on recent market data.',
    time: '1 hour ago',
    unread: true
  },
  {
    id: 3,
    type: 'warning',
    title: 'Market Alert',
    message: 'Significant price changes detected in your area.',
    time: '3 hours ago',
    unread: false
  }
];

const Notifications = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <Check className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default: return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

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
        <h1 className="text-3xl font-bold mb-6">Notifications</h1>
        
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.3 }}
              className={`p-4 rounded-lg border bg-card ${notification.unread ? 'border-primary/20' : 'border-border'}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${notification.unread ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{notification.time}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-1">{notification.message}</p>
                  {notification.unread && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Notifications;