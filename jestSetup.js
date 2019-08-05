import 'cross-fetch/polyfill' // this is needed for apollo client to run on nodejs
import { NativeModules } from 'react-native'
NativeModules.RNAnalytics = {}

const mockAnalytics = jest.genMockFromModule('@segment/analytics-react-native')
jest.mock('@segment/analytics-react-native', () => mockAnalytics)
