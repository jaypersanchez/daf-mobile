import 'react-native'
import React from 'react'
import { DidViewer } from '../DidViewer'
import { MockedProvider } from 'react-apollo/test-utils'
import { render } from 'react-native-testing-library'

jest.useFakeTimers()

const navigation = {
  push: jest.fn(),
  getParam: jest.fn(),
}

it('renders correctly', () => {
  const tree = render(
    <MockedProvider mocks={[]}>
      {
        // @ts-ignore
        <DidViewer navigation={navigation} />
      }
    </MockedProvider>,
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
