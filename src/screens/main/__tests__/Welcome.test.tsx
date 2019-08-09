import 'react-native'
import React from 'react'
import Welcome from '../Welcome'
import { render } from 'react-native-testing-library'

jest.useFakeTimers()

const navigation = {
  navigate: jest.fn(),
}

it('renders correctly', () => {
  //@ts-ignore
  const tree = render(<Welcome navigation={navigation} />).toJSON()

  expect(tree).toMatchSnapshot()
})
