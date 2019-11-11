import 'react-native'
import React from 'react'
import DrawerLeft from '../DrawerLeft'
import DrawerRight from '../DrawerRight'
import { render } from 'react-native-testing-library'
import { MockedProvider } from '@apollo/react-testing'
import { GET_VIEWER } from '../../lib/rn-packages/rn-graphql/queries'

jest.useFakeTimers()
jest.runAllTimers()

const mocks = [
  {
    request: {
      query: GET_VIEWER,
      variables: {},
    },
    result: {
      data: {
        viewer: {
          did: 'did:ethr:123456789',
          shortId: 'did:ethr:123...789',
        },
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
