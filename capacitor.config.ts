import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.ihorlupyna.parcell',
    appName: 'parcell-key-manager',
    webDir: 'dist/parcell-key-manager/browser',
    loggingBehavior: 'production',
    plugins: {
        SafeArea: {
            enabled: true,
            customColorsForSystemBars: false,
        },
        CapacitorSQLite: {
            androidIsEncryption: true,
            electronIsEncryption: true,
            electronWindowsLocation: 'C:\\ProgramData\\CapacitorDatabases',
        },
    },
};

export default config;
