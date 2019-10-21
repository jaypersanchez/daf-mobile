import 'react-native'
import React from 'react'
import Scanner from '../Scanner'
import { render, fireEvent } from 'react-native-testing-library'

const navigation = {
  goBack: jest.fn(),
}

describe('Scanner', () => {
  it('renders correctly', () => {
    //@ts-ignore
    const tree = render(<Scanner navigation={navigation} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly', () => {
    //@ts-ignore
    const { getByTestId } = render(<Scanner navigation={navigation} />)
    expect(getByTestId('CANCEL_SCAN_BTN')).toBeDefined()

    fireEvent.press(getByTestId('CANCEL_SCAN_BTN'))

    expect(navigation.goBack).toBeCalled()
  })
})
