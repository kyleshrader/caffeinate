const child_process = require('child_process')
const electron = require('electron')
const esbuild = require('esbuild')

const isDev = !process.argv.includes('--prod')

const electronRunner = (() => {
    let handle = null
    return {
        restart() {
            console.info('Restarting Electron process.')
            if(handle) handle.kill()
            handle = child_process.spawn(electron, ['.'], {
                stdio: 'inherit'
            })
        }
    }
})()

const mainBuild = esbuild.build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    minify: !isDev,
    platform: 'node',
    external: ['electron'],
    outfile: 'dist/main.js',
    define: {
        'process.env.STATIC': (isDev) ? '"../build/icons"' : '"."',
    },
    watch: (isDev)
      ? { onRebuild(error) { if(!error) electronRunner.restart() } }
      : false
})

Promise.all([
    mainBuild
])
.then(() => { if(isDev) electronRunner.restart() })
.catch(() => process.exit(1))