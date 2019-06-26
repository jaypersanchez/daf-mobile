/**
 * Serto Mobile App
 *
 */
import React from 'react'
import { Container, Screen, ListItem, Section } from '@kancha/kancha-ui'
import Config from 'react-native-config'

export default () => {
  const configs = Object.keys(Config.getConstants())

  return (
    <Screen scrollEnabled={true}>
      <Container>
        <Section>
          {configs.map((key: string, i: number) => (
            <ListItem key={key} subTitle={key} last={i === configs.length - 1}>
              {Config[key].substring(0, 25) +
                (Config[key].length > 25 ? '...' : '')}
            </ListItem>
          ))}
        </Section>
      </Container>
    </Screen>
  )
}
