/// <reference types="@capacitor-community/safe-area" />

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.ihorlupyna.parcell',
    appName: 'parcell-key-manager',
    webDir: 'dist/parcell-key-manager/browser',
    loggingBehavior: 'production',
    plugins: {
        SafeArea: {
            enabled: true,
            customColorsForSystemBars: false
        },
    },
};

export default config;
