import 'react-native'
import React from 'react'
import DisclosureRequest from '../settings/DisclosureRequest'
import { render } from 'react-native-testing-library'

const navigation = {
  goBack: jest.fn(),
}

it('renders correctly', () => {
  // @ts-ignore
  const tree = render(<DisclosureRequest navigation={navigation} />).toJSON()
  expect(tree).toMatchSnapshot()
})
