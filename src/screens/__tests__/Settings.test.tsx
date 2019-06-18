import 'react-native'
import React from 'react'
import Settings from '../Settings'
import { render } from 'react-native-testing-library'

jest.useFakeTimers()

it('renders correctly', () => {
  const tree = render(<Settings />).toJSON()
  expect(tree).toMatchSnapshot()
})
