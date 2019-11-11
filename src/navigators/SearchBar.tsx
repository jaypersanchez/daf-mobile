import React, { useRef, useState, useEffect } from 'react'
import { TextInput } from 'react-native'
import { Container } from '@kancha/kancha-ui'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { Colors } from '../theme'
import { Transitioning, Transition } from 'react-native-reanimated'

interface SearchBarProps {
  onFocus: () => void
  cancel: () => void
  searchActive: boolean
}
export default ({ onFocus, cancel, searchActive }: SearchBarProps) => {
  const inputRef = useRef<any>()
  const transitionRef = useRef<any>()

  const [active, toggleActive] = useState(searchActive)

  const transition = (
    <Transition.Change durationMs={150} interpolation={'easeInOut'} />
  )

  const cancelAndBlur = () => {
    if (transitionRef.current) {
      transitionRef.current.animateNextTransition()
    }
    cancel()
    toggleActive(false)
    inputRef.current.blur()
  }

  const focusActivate = () => {
    if (transitionRef.current) {
      transitionRef.current.animateNextTransition()
    }
    toggleActive(true)
    onFocus()
  }

  return (
    <Transitioning.View
      transition={transition}
      ref={transitionRef}
      style={{ flexDirection: 'row', alignItems: 'center' }}
    >
      <Container flex={1} marginLeft marginRight>
        <TextInput
          autoCapitalize={'none'}
          autoCorrect={false}
          autoCompleteType={'off'}
          ref={inputRef}
          onFocus={focusActivate}
          clearButtonMode={'while-editing'}
          placeholder={'Search data'}
          style={{
            backgroundColor: Colors.LIGHTEST_GREY,
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
        />
      </Container>
      <Container viewStyle={{ marginRight: active ? 0 : -80 }}>
        <HeaderButtons>
          <Item title={'Cancel'} onPress={cancelAndBlur} />
        </HeaderButtons>
      </Container>
    </Transitioning.View>
  )
}
