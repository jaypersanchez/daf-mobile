import 'react-native'
import React from 'react'
import ModalDemo from '../settings/ModalDemo'
import { render } from 'react-native-testing-library'

const navigation = {
  goBack: jest.fn(),
}

it('renders correctly', () => {
  // @ts-ignore
  const tree = render(<ModalDemo navigation={navigation} />).toJSON()
  expect(tree).toMatchSnapshot()
})
