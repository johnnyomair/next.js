/* eslint-env jest */
import {
  killApp,
  findPort,
  nextStart,
  nextBuild,
  launchApp,
} from 'next-test-utils'
import webdriver from 'next-webdriver'
import { join } from 'path'

const appDir = join(__dirname, '../')
let appPort
let app
let browser

function runTests() {
  // #31065
  it('should apply image config for node_modules', async () => {
    browser = await webdriver(appPort, '/image-from-node-modules')
    expect(
      await browser.elementById('image-from-node-modules').getAttribute('src')
    ).toMatch('i.imgur.com')
  })

  // #39330
  it('should apply srcset from image config for node_modules when using priority', async () => {
    browser = await webdriver(appPort, '/image-from-node-modules')

    console.log(
      await browser
        .elementById('image-from-node-modules')
        .getAttribute('srcset')
    )
    expect(
      await browser
        .elementById('image-from-node-modules')
        .getAttribute('srcset')
    ).toMatch('1234')
  })
}

describe('Image Component Tests In Prod Mode', () => {
  beforeAll(async () => {
    await nextBuild(appDir)
    appPort = await findPort()
    app = await nextStart(appDir, appPort)
  })
  afterAll(async () => {
    await killApp(app)
  })

  runTests()
})

describe('Image Component Tests In Dev Mode', () => {
  beforeAll(async () => {
    appPort = await findPort()
    app = await launchApp(appDir, appPort)
  })
  afterAll(async () => {
    await killApp(app)
  })

  runTests()
})
