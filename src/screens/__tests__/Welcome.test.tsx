import 'react-native'
import React from 'react'
import Welcome from '../Welcome'
import { render } from 'react-native-testing-library'

jest.useFakeTimers()

it('renders correctly', () => {
  const tree = render(<Welcome />).toJSON()

  expect(tree).toMatchSnapshot()
})
