require('dotenv').config()

const fs = require('fs')
const path = require('path')
const { notarize } = require('@electron/notarize')

module.exports = async (context) => {
  if (process.platform !== 'darwin') return

  console.log('aftersign hook triggered, start to notarize app.')

  /*
  if (!process.env.CI) {
    console.log(`skipping notarizing, not in CI.`)
    return
  }
  */

  if (!('APPLE_ID' in process.env && 'APPLE_ID_PASS' in process.env)) {
    console.warn('skipping notarizing, APPLE_ID and APPLE_ID_PASS env variables must be set.')
    return
  }

  const appPath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`)

  const appId = 'br.com.edumais'

  if (!fs.existsSync(appPath)) {
    console.log(`skip`)
    return
  }

  try {
    await notarize({
      appBundleId: appId,
      appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASS,
      teamId: process.env.APPLE_TEAM_ID
    })
  } catch (error) {
    console.error(error)
  }

  console.log(`done notarizing ${appId}.`)
}
