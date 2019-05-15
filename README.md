### Electron 5, ReactJS 16, Typescript 3 with Webpack 4

**Getting Started**

##### DEV
1. npm install
2. npm run build:dev (compiles and bundles relevant JS into /DIST)
3. Open New Terminal Then Run -> Next Command
4. npm run start (Runs Electron on the APP)

This process could easily be made easier using an Electron Watcher to Reload the Electron Window when Webpack recompiles the project

##### PROD
1. npm run build:dist
2. npm run package:<macos|win64>
