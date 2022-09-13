import { powerSaveBlocker } from 'electron'
import { logger } from './logger'

let id: number = -1

export function caffeinate() {
    id = powerSaveBlocker.start('prevent-display-sleep')
    logger.info("Caffeinated!", { source: 'cafe' })
}

export function decaffeinate() {
    if(powerSaveBlocker.isStarted(id)) {
        powerSaveBlocker.stop(id)
        logger.info("Decaffeinated.", { source: 'cafe' })
    }
}

export function isCaffeinated() {
    return powerSaveBlocker.isStarted(id)
}