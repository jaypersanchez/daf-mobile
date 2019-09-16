import 'react-native'
import React from 'react'
import { render } from 'react-native-testing-library'
import { MockedProvider } from '@apollo/react-testing'
import Onboarding from '../Onboarding'
import { Did, getDidsQuery } from '../../../lib/Signer'

jest.useFakeTimers()
jest.runAllTimers()

const mockDidItem: Did = {
  did: 'did:ethr:123456',
  address: '123456',
  isSelected: true,
  seed: 'winkle berry boojam',
}

const mocks = [
  {
    request: {
      query: getDidsQuery,
      variables: {},
    },
    result: {
      data: {
        dids: [mockDidItem],
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
