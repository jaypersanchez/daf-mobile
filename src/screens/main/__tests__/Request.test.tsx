import 'react-native'
import React from 'react'
import Request from '../Request'
import { render, fireEvent } from 'react-native-testing-library'
import { Toaster } from '@kancha/kancha-ui'

const navigation = {
  goBack: jest.fn(),
}

describe('Request Component', () => {
  it('renders correctly', () => {
    // @ts-ignore
    const tree = render(<Request navigation={navigation} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should fire the go back event on button taps', () => {
    jest.useFakeTimers()
    Toaster.confirm = jest.fn()
    // @ts-ignore
    const { getByText } = render(<Request navigation={navigation} />)
    fireEvent.press(getByText(/Accept/i))
    expect(navigation.goBack).toBeCalled()
    expect(setTimeout).toHaveBeenCalled()
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500)
    jest.runAllTimers()
    expect(Toaster.confirm).toHaveBeenCalled()
    fireEvent.press(getByText(/Decline/i))
    expect(navigation.goBack).toBeCalled()
  })
})
