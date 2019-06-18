import 'react-native'
import React from 'react'
import App from '../App'
import { render } from 'react-native-testing-library'

jest.useFakeTimers()

it('renders correctly', () => {
  const tree = render(<App />).toJSON()
  expect(tree).toMatchSnapshot()
})
