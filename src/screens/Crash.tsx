import * as React from 'react'
import { Screen, Container, Button, Constants } from '@kancha/kancha-ui'

export default () => {
  return (
    <Screen scrollEnabled>
      <Container padding>
        <Button
          fullWidth
          type={Constants.BrandOptions.Warning}
          block={Constants.ButtonBlocks.Outlined}
          buttonText={'Crash it!'}
          onPress={() => {
            throw new Error('Sample error from developer tools')
          }}
        />
      </Container>
    </Screen>
  )
}
