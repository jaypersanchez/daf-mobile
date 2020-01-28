import TEST_ID from './testIDs'

describe('App Launch', () => {
  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('should have welcome screen', async () => {
    await expect(element(by.id('ONBOARDING_WELCOME_TOP'))).toBeVisible()
  })

  // it('should have all list items', async () => {
  //   await expect(element(by.text('Screen'))).toBeVisible()
  //   await expect(element(by.text('Bottom Sheet'))).toBeVisible()
  //   await expect(element(by.text('Text'))).toBeVisible()
  //   await expect(element(by.text('Button'))).toBeVisible()
  //   await expect(element(by.text('Icon'))).toBeVisible()
  //   await expect(element(by.text('List Item'))).toBeVisible()
  //   await expect(element(by.text('Log Item'))).toBeVisible()
  // })

  // it('should tap Screen list item and view screen', async () => {
  //   await element(by.text('Screen')).tap()

  //   await expect(element(by.text('Welcome to Screen'))).toBeVisible()
  //   await expect(element(by.text('Accept'))).toBeVisible()
  //   await expect(element(by.text('Decline'))).toBeVisible()
  //   await expect(element(by.id('header-back'))).toBeVisible()
  // })

  // it('should have a back button', async () => {})

  // it('should have a button on the welcome screen', async () => {
  //   await expect(element(by.id(TEST_ID.WELCOME_BUTTON))).toBeVisible()
  // })

  // it('should have hidden text', async () => {
  //   await expect(element(by.id(TEST_ID.VISIBLE_TEXT))).not.toBeDefined()
  // })

  // it('should show text after tapping on button', async () => {
  //   await element(by.id(TEST_ID.WELCOME_BUTTON)).tap()
  //   await expect(element(by.id(TEST_ID.VISIBLE_TEXT))).toBeVisible()
  // })

  // it('should hide the text after tapping again', async () => {
  //   await element(by.id(TEST_ID.WELCOME_BUTTON)).tap()
  //   await expect(element(by.id(TEST_ID.VISIBLE_TEXT))).not.toBeVisible()
  // })
})
