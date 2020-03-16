import 'react-native'
import React from 'react'
import { DidViewer } from '../../settings/DidViewer'
import { MockedProvider, wait } from '@apollo/react-testing'
import { render, fireEvent, waitForElement } from 'react-native-testing-library'
import { act } from 'react-test-renderer'
import { SET_VIEWER, DELETE_IDENTITY } from '../../../lib/graphql/queries'

jest.useFakeTimers()
jest.runAllTimers()

const navigation = {
  push: jest.fn(),
  getParam: jest.fn().mockReturnValue('0x1234'),
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

test('test buttons', async () => {
  // @ts-ignore
  let setViewerCalled = false
  let deleteIdentityCalled = false
  const mocks = [
    {
      request: {
        query: SET_VIEWER,
        variables: {
          did: '0x1234',
        },
      },
      result: new Promise(function(resolve, reject) {
        setViewerCalled = true
        resolve(null)
      }),
    },
    {
      request: {
        query: DELETE_IDENTITY,
        variables: {
          type: 'rnEthr',
          did: '0x1234',
        },
      },
      result: new Promise(function(resolve, reject) {
        deleteIdentityCalled = true
        resolve(null)
      }),
    },
  ]

  const screen = <DidViewer navigation={navigation} />
  const tree = render(
    <MockedProvider mocks={mocks} addTypename={false}>
      {screen}
    </MockedProvider>,
  )

  //expect buttons to be rendered
  const makeDefaultbutton = tree.getByProps({ testID: 'MAKE_DEFAULT_BUTTON' })
  const deleteSeedButton = tree.getByProps({ testID: 'DELETE_SEED_BUTTON' })
  expect(makeDefaultbutton).toBeDefined()
  expect(deleteSeedButton).toBeDefined()

  act(() => {
    fireEvent.press(makeDefaultbutton)
    fireEvent.press(deleteSeedButton)
  })

  //expect mutations to be called
  expect(setViewerCalled).toBeTruthy()
  expect(deleteIdentityCalled).toBeTruthy()

  expect(tree.toJSON()).toMatchSnapshot()
  //expect(navigation.goBack).toHaveBeenCalledTimes(1)
})
