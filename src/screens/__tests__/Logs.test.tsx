import 'react-native'
import React from 'react'
import { render } from 'react-native-testing-library'
import { MockedProvider } from '@apollo/react-testing'
import Logs from '../settings/Logs'
import { LogMessage, LogMessageType, getLogsQuery } from '../../lib/Log'

jest.useFakeTimers()
jest.runAllTimers()

const mockLogItem: LogMessage = {
  message: 'Sample info',
  type: LogMessageType.Info,
  category: 'Example',
  timestamp: 1234567890,
  id: '1234567',
}

const mocks = [
  {
    request: {
      query: getLogsQuery,
      variables: {},
    },
    result: {
      data: {
        logs: [mockLogItem],
      },
    },
  },
]

test('renders correctly', () => {
  const tree = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <Logs />
    </MockedProvider>,
  ).toJSON()

  expect(tree).toMatchSnapshot()
})
