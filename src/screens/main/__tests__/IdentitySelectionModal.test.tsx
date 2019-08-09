import 'react-native'
import React from 'react'
import IdentitySelectionModal from '../IdentitySelectionModal'
import { render } from 'react-native-testing-library'
import { MockedProvider } from '@apollo/react-testing'
import { getDidsQuery } from '../../../lib/Signer'

jest.useFakeTimers()

const navigation = {
  goBack: jest.fn(),
}

const mockDid = {
  did: 'did:ethr:123456',
  address: '123456',
  isSelected: true,
}

const mocks = [
  {
    request: {
      query: getDidsQuery,
      variables: {},
    },
    result: {
      data: {
        dids: [mockDid],
        selectedDid: mockDid.did,
      },
    },
  },
]

it('renders correctly', () => {
  const tree = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      {
        // @ts-ignore
        <IdentitySelectionModal navigation={navigation} />
      }
    </MockedProvider>,
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
