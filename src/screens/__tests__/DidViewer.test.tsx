import 'react-native'
import React from 'react'
import { DidViewer } from '../settings/DidViewer'
import { MockedProvider, wait, MockedResponse } from '@apollo/react-testing'
import { render, fireEvent, waitForElement } from 'react-native-testing-library'
import { act, create } from 'react-test-renderer'
import { SET_VIEWER } from '../../lib/graphql/queries'

jest.useFakeTimers()
jest.runAllTimers()

const navigation = {
  push: jest.fn(),
  getParam: jest.fn(),
  goBack: jest.fn(),
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

test('button test', async () => {
  // @ts-ignore
  let setViewerCalled = false
  const mocks = [
    {
      request: {
        query: SET_VIEWER,
        variables: {
          did: '0x1234',
        },
      },
      result: () => {
        setViewerCalled = true
        return {
          data: {
            setViewer: {
              did: '0x1234',
            },
          },
        }
      },
    },
  ]

  const screen = <DidViewer navigation={navigation} />
  const tree = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      {screen}
    </MockedProvider>,
  )
  const button = tree.getByProps({ testID: 'MAKE_DEFAULT_BUTTON' })
  expect(button).toBeDefined()
  await act(async () => {
    fireEvent.press(button)
  })
  console.log(setViewerCalled)
  expect(navigation.goBack).toBeCalled()
})
