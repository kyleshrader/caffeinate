import path from 'path'
import { app } from 'electron'
import winston from 'winston'

const log = (info: winston.Logform.TransformableInfo) => {
    const { source, level, message, ...meta } = info
    return `${level} [${source}]: ${message} ${Object.keys(meta).length === 0 ? '' : JSON.stringify(meta)}`
}

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { source: 'etc' },
    transports: [
        new winston.transports.File({
            filename: path.join(app.getPath('userData'), 'apt-data', 'logs.txt'),
            options: { flags: 'w' },
            format: winston.format.printf(log)
        })
    ]
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format((info) => ({ ...info }))(),
            winston.format.colorize({ level: true }),
            winston.format.printf(log)
        )
    }))
}