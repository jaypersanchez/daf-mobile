import 'react-native'
import React from 'react'
import IdentitySelectionModal from '../IdentitySelectionModal'
import { render } from 'react-native-testing-library'
import { MockedProvider } from '@apollo/react-testing'
import { GET_MANAGED_IDENTITIES } from '../../../lib/graphql/queries'

jest.useFakeTimers()
jest.runAllTimers()

const navigation = {
  goBack: jest.fn(),
}

const mockDid = {
  did: 'did:ethr:123456',
  shortId: 'did:ethr:123.56',
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
        managedIdentities: [mockDid],
      },
    },
  },
]

it('renders correctly', () => {
  // @ts-ignore
  const screen = <IdentitySelectionModal navigation={navigation} />
  const tree = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      {screen}
    </MockedProvider>,
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
