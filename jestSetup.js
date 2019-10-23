import 'cross-fetch/polyfill' // this is needed for apollo client to run on nodejs
import * as ReactNative from 'react-native'
import MockAsyncStorage from 'mock-async-storage'

jest.doMock('react-native', () => {
  ReactNative.NativeModules.RNAnalytics = {}
  return ReactNative
})

const mockAnalytics = jest.genMockFromModule('@segment/analytics-react-native')
jest.mock('@segment/analytics-react-native', () => mockAnalytics)

const mockImpl = new MockAsyncStorage()
jest.mock('@react-native-community/async-storage', () => mockImpl)

jest.mock('react-native-reanimated', () => {
  return {
    set: jest.fn(),
  }
})
