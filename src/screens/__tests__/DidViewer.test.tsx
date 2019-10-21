import 'react-native'
import React from 'react'
import { DidViewer } from '../settings/DidViewer'
import { MockedProvider } from '@apollo/react-testing'
import { render } from 'react-native-testing-library'

jest.useFakeTimers()
jest.runAllTimers()

const navigation = {
  push: jest.fn(),
  getParam: jest.fn(),
}

test('renders correctly', () => {
  // jest.useFakeTimers()
  // @ts-ignore
  const screen = <DidViewer navigation={navigation} />
  const tree = render(
    <MockedProvider mocks={[]}>{screen}</MockedProvider>,
  ).toJSON()

  // jest.runAllTimers()
  expect(tree).toMatchSnapshot()
})
