import 'react-native'
import React from 'react'
import { render } from 'react-native-testing-library'
import { MockedProvider } from '@apollo/react-testing'
import Onboarding from '../Onboarding'
import { GET_MANAGED_IDENTITIES } from '../../../lib/graphql/queries'

jest.useFakeTimers()
jest.runAllTimers()

const mockDidItem = {
  did: 'did:ethr:123456',
  shortId: 'did:ethr:12..3',
  isSelected: true,
}

const mocks = [
  {
    request: {
      query: GET_MANAGED_IDENTITIES,
      variables: {},
    },
    result: {
      data: {
        managedIdentities: [mockDidItem],
      },
    },
  },
]

describe('Onboarding', () => {
  test('renders the intermediate screen if dids are present', async () => {
    // jest.useFakeTimers()
    // @ts-ignore
    const onboarding = <Onboarding navigation={jest.fn()} />
    const tree = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        {onboarding}
      </MockedProvider>,
    ).toJSON()

    // jest.runAllTimers()

    expect(tree).toMatchSnapshot()
  })
})
