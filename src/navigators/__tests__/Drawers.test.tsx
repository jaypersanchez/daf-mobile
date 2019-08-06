import 'react-native'
import React from 'react'
import DrawerLeft from '../DrawerLeft'
import DrawerRight from '../DrawerRight'
import { render } from 'react-native-testing-library'
import { MockedProvider } from 'react-apollo/test-utils'
import { getSelectedDidQuery } from '../../lib/Signer'

jest.useFakeTimers()

const mocks = [
  {
    request: {
      query: getSelectedDidQuery,
      variables: {},
    },
    result: {
      data: {
        selectedDid: 'did:ethr:123456789',
      },
    },
  },
]

describe('Navigation', () => {
  it('renders left drawer correctly', () => {
    const onPress = jest.fn()

    const tree = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DrawerLeft
          onItemPress={onPress}
          activeItemkey={'TEST_KEY'}
          // @ts-ignore
          navigation={jest.fn()}
        />
      </MockedProvider>,
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('renders right drawer correctly', () => {
    const onPress = jest.fn()

    const tree = render(
      <DrawerRight onItemPress={onPress} activeItemkey={'TEST_KEY'} />,
    ).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
