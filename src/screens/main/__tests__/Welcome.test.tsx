import 'react-native'
import React from 'react'
import Welcome from '../Welcome'
import { render, fireEvent } from 'react-native-testing-library'

jest.useFakeTimers()
jest.runAllTimers()

const navigation = {
  navigate: jest.fn(),
}

describe('Welcome', () => {
  it('renders correctly', () => {
    //@ts-ignore
    const tree = render(<Welcome navigation={navigation} />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('shows the credentials and you can tap them', () => {
    //@ts-ignore
    const { getByText } = render(<Welcome navigation={navigation} />)

    expect(getByText(/Credit Worthy/i)).toBeDefined()
    fireEvent.press(getByText(/Credit Worthy/i))
    expect(navigation.navigate).toBeCalled()

    expect(getByText(/Serto Identity Platform/i)).toBeDefined()
    fireEvent.press(getByText(/Serto Identity Platform/i))
    expect(navigation.navigate).toBeCalled()
  })
})
