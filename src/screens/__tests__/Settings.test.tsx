import 'react-native'
import React from 'react'
import Settings from '../Settings'
import renderer from 'react-test-renderer'

jest.useFakeTimers()

it('renders correctly', () => {
  const tree = renderer.create(<Settings />).toJSON()
  expect(tree).toMatchSnapshot()
})
