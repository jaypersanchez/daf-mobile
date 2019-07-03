/**
 * Serto Mobile App
 *
 */
import React from 'react'
import { Container, Screen, ListItem, Section } from '@kancha/kancha-ui'
import Config from 'react-native-config'

export default () => {
  const configs = Object.keys(Config.getConstants())

  // tslint:disable-next-line:no-console
  console.log(configs)

  return (
    <Screen scrollEnabled={true}>
      <Container>
        <Section>
          {configs.map((key: string, i: number) => {
            const value = Config[key].toString()
            return (
              <ListItem
                key={key}
                subTitle={key}
                last={i === configs.length - 1}
              >
                {value.substring(0, 25) + (value.length > 25 ? '...' : '')}
              </ListItem>
            )
          })}
        </Section>
      </Container>
    </Screen>
  )
}
