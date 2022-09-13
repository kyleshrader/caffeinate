import { autoUpdater } from 'electron-updater'
import { logger } from './logger'
import { rebuildTrayMenu } from './tray'

export const UpdateState = {
    canCheck: true,
    status: ''
}

autoUpdater.on('update-available', async (info: { version: string }) => {
    UpdateState.canCheck = false
    if(autoUpdater.autoDownload) {
        UpdateState.status = `Downloading v${info.version}...`
    } else {
        UpdateState.status = `Update v${info.version} avaialble on GitHub.`
    }
    rebuildTrayMenu()
})

autoUpdater.on('update-not-available', () => {
    UpdateState.canCheck = true
    UpdateState.status = 'No updates available.'
    rebuildTrayMenu()
})

autoUpdater.on('error', () => {
    UpdateState.canCheck = true
    UpdateState.status = 'Something went wrong, check logs.'
    rebuildTrayMenu()
})

autoUpdater.on('update-downloaded', async (info: { version: string }) => {
    UpdateState.canCheck = false
    UpdateState.status = `v${info.version} will be installed on exit.`
    rebuildTrayMenu()
})

export async function checkForUpdates() {
    autoUpdater.logger = logger
    autoUpdater.autoDownload = !process.env.PORTABLE_EXECUTABLE_DIR //&& !config.get('disableUpdateDownload')

    UpdateState.canCheck = false
    UpdateState.status = 'Checking for updates...'
    rebuildTrayMenu()

    try {
        await autoUpdater.checkForUpdates()
    } catch {
        // handled by event
    }
}