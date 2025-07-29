// PWA Installation and Service Worker utilities

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

// Register service worker
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      // Service worker registered successfully
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is available
              // New content is available
            }
          });
        }
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Handle PWA install prompt
export const setupPWAInstall = (): void => {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    // PWA install prompt captured
  });

  window.addEventListener('appinstalled', () => {
    // PWA was installed successfully
    deferredPrompt = null;
  });
};

// Trigger PWA install
export const installPWA = async (): Promise<boolean> => {
  if (!deferredPrompt) {
    // PWA install prompt not available
    return false;
  }

  try {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    // PWA install outcome tracked
    deferredPrompt = null;
    return outcome === 'accepted';
  } catch (error) {
    console.error('PWA install failed:', error);
    return false;
  }
};

// Check if PWA is installable
export const isPWAInstallable = (): boolean => {
  return !!deferredPrompt;
};

// Check if running as PWA
export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    // Browser does not support notifications
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
};

// Show notification
export const showNotification = (title: string, options?: NotificationOptions): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      ...options
    });
  }
};