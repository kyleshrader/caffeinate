'use strict'

import { app } from 'electron'
import { createTray } from './tray'
import { caffeinate, decaffeinate } from './caffeine'
import { logger } from './logger'
import os from 'os'

if(!app.requestSingleInstanceLock()) {
    app.exit()
}

app.disableHardwareAcceleration()
app.enableSandbox()

app.on('ready', async() => {
    logger.info('App is running', {
        source: 'init',
        version: app.getVersion(),
        osName: os.type(),
        osRelease: os.release()
    })

    caffeinate()
    createTray()

})

app.on('before-quit', async() => {
    decaffeinate()
})