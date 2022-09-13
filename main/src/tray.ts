import { Tray, nativeImage, Menu, app } from 'electron'
import { caffeinate, decaffeinate, isCaffeinated } from './caffeine'
import { logger } from './logger'
import { checkForUpdates, UpdateState } from './updates'
import path from 'path'

let tray: Tray

export function createTray() {
    tray = new Tray(
        nativeImage.createFromPath(path.join(__dirname, process.env.STATIC!, process.platform === 'win32' ? 'icon.ico' : 'icon.png'))
    )

    tray.setToolTip('Caffeinate')
    tray.on('double-click', async () => {
        logger.info('todo: open menu', { source: 'tray' })
    })
    rebuildTrayMenu()
}

export function rebuildTrayMenu() {
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Caffeinated',
            type: 'checkbox',
            checked: isCaffeinated(),
            click: isCaffeinated() ? decaffeinate : caffeinate
        },
        {
            type: 'separator'
        },
        {
            sublabel: `v${app.getVersion()}`,
            label: UpdateState.canCheck ? 'Check for updates.' : UpdateState.status,
            enabled: UpdateState.canCheck,
            click: checkForUpdates
        },
        {
            type: 'separator'
        },
        {
            label: 'Quit',
            click: () => {
                app.quit()
            }
        }
    ])
    tray.setContextMenu(contextMenu)
    
}