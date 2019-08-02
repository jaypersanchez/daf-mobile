import { NativeModules } from 'react-native'
import MockAsyncStorage from 'mock-async-storage'

NativeModules.RNAnalytics = {}

const mockAnalytics = jest.genMockFromModule('@segment/analytics-react-native')
jest.mock('@segment/analytics-react-native', () => mockAnalytics)

const mockImpl = new MockAsyncStorage()
jest.mock('@react-native-community/async-storage', () => mockImpl)
