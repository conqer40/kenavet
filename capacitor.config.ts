import type { CapacitorConfig } from '@capacitor/cli';

const serverUrl = process.env.CAPACITOR_SERVER_URL || 'http://192.168.1.6:3000';

const config: CapacitorConfig = {
  appId: 'com.kenavet.fieldforce',
  appName: 'KENAVET',
  webDir: 'mobile-shell',
  server: {
    url: serverUrl,
    cleartext: true,
    allowNavigation: ['*']
  },
  android: {
    allowMixedContent: true,
    captureInput: true
  }
};

export default config;
