import 'react-native'
import React from 'react'
import Scanner from '../Scanner'
import { render } from 'react-native-testing-library'

const navigation = {
  navigate: jest.fn(),
}

it('renders correctly', () => {
  //@ts-ignore
  const tree = render(<Scanner navigation={navigation} />).toJSON()

  expect(tree).toMatchSnapshot()
})
