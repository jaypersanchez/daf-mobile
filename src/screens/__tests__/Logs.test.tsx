import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import { MockedProvider } from 'react-apollo/test-utils'
import Logs from '../Logs'
import { LogMessage, LogMessageType, getLogsQuery } from '../../lib/Log'

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

it('renders correctly', () => {
  const tree = renderer
    .create(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Logs />
      </MockedProvider>,
    )
    .toJSON()
  expect(tree).toMatchSnapshot()
})
