import Log, {
  LogMessage,
  LogMessageType,
  getLogsQuery,
  resolvers,
  configure,
} from '../Log'

const client = {
  mutate: jest.fn(),
  addResolvers: jest.fn(),
}

configure(client)

const cache = {
  readQuery: jest.fn().mockReturnValue({ logs: [] }),
  writeQuery: jest.fn(),
}

const mockLogItem: LogMessage = {
  message: 'Sample info',
  type: LogMessageType.Info,
  category: 'Example',
  timestamp: 1234567890,
  id: '1234567890',
}

it('log mutation', () => {
  const result = resolvers.Mutation.log(null, mockLogItem, { cache })
  expect(cache.readQuery).toBeCalledWith({ query: getLogsQuery })
  expect(cache.writeQuery).toBeCalledWith(
    expect.objectContaining({
      query: getLogsQuery,
      data: {
        logs: expect.arrayContaining([expect.objectContaining(result)]),
      },
    }),
  )
})

it('info calls client mutation', () => {
  Log.info('Sample info', 'Jest')
  expect(client.mutate).toBeCalledWith(
    expect.objectContaining({
      variables: {
        message: 'Sample info',
        category: 'Jest',
        type: LogMessageType.Info,
      },
      refetchQueries: ['getLogs'],
    }),
  )
})

it('warning calls client mutation', () => {
  Log.warning('Sample warning', 'Jest')
  expect(client.mutate).toBeCalledWith(
    expect.objectContaining({
      variables: {
        message: 'Sample warning',
        category: 'Jest',
        type: LogMessageType.Warning,
      },
      refetchQueries: ['getLogs'],
    }),
  )
})

it('warning calls client mutation', () => {
  Log.error('Sample error', 'Jest')
  expect(client.mutate).toBeCalledWith(
    expect.objectContaining({
      variables: {
        message: 'Sample error',
        category: 'Jest',
        type: LogMessageType.Error,
      },
      refetchQueries: ['getLogs'],
    }),
  )
})
