import 'react-native'
import React from 'react'
import Settings from '../settings/Settings'
import { render } from 'react-native-testing-library'

const navigation = {
  navigate: jest.fn(),
}

it('renders correctly', () => {
  // @ts-ignore
  const tree = render(<Settings navigation={navigation} />).toJSON()
  expect(tree).toMatchSnapshot()
})
