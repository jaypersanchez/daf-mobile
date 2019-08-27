import 'react-native'
import React from 'react'
import Request from '../Request'
import { render, fireEvent, act } from 'react-native-testing-library'
import { Toaster } from '@kancha/kancha-ui'
import console = require('console')

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

  // Hardcoded names = Jane, Jenny, Jill
  it('should toggle request items', () => {
    const { getByText, getAllByText } = render(
      // @ts-ignore
      <Request navigation={navigation} />,
    )
    expect(getAllByText(/Jane/i)).toHaveLength(1)

    act(() => {
      fireEvent.press(getByText(/Jane/i))
    })

    expect(getAllByText(/Jane/i)).toHaveLength(2)
    expect(getByText(/Jenny/i)).toBeDefined()
    expect(getByText(/Jill/i)).toBeDefined()
  })
})
