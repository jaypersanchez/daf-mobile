import 'react-native'
import React from 'react'
import { render } from 'react-native-testing-library'
import { MockedProvider } from '@apollo/react-testing'
import Onboarding from '../Onboarding'
import { Did, getDidsQuery, createDidMutation } from '../../../lib/Signer'

jest.useFakeTimers()

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
        logs: [mockDidItem],
      },
    },
  },
]

it('renders correctly', () => {
  const tree = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      {
        // @ts-ignore
        <Onboarding navigation={jest.fn()} />
      }
    </MockedProvider>,
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
