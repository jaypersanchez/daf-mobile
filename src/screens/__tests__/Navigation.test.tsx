import 'react-native'
import React from 'react'
import Navigation from '../Navigation'
import { render } from 'react-native-testing-library'
jest.useFakeTimers()

it('renders correctly', () => {
  const tree = render(<Navigation />).toJSON()
  expect(tree).toMatchSnapshot()
})
