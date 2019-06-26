import { NativeModules } from 'react-native'
NativeModules.RNAnalytics = {}

const mockAnalytics = jest.genMockFromModule('@segment/analytics-react-native')
jest.mock('@segment/analytics-react-native', () => mockAnalytics)
