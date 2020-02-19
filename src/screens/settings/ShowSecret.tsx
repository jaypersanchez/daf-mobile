/**
 * Serto Mobile App
 *
 */
import React, { useState } from 'react'
import { NavigationStackScreenProps } from 'react-navigation-stack'
import { Container, Text, Screen, Constants, Button } from '@kancha/kancha-ui'
import { Colors } from '../../theme'
import hexToRgba from 'hex-to-rgba'
import { useQuery, useLazyQuery } from 'react-apollo'
import { GET_VIEWER, GET_SECRET_KEY } from '../../lib/graphql/queries'

const ShowSecret: React.FC<NavigationStackScreenProps> = ({ navigation }) => {
  const { data } = useQuery(GET_VIEWER)
  const [getSecretKey, secret] = useLazyQuery(GET_SECRET_KEY)

  return (
    <Screen scrollEnabled={true} background={'primary'}>
      <Container padding>
        <Text type={Constants.TextTypes.H2} bold>
          Seed Phrase
        </Text>
        <Container marginTop>
          <Text type={Constants.TextTypes.Body}>
            Backup your seed phrase in a safe place. You will need it to recover
            this identity. Without this seed phrase you will not be able to
            recover your identity if your device is lost or stolen.
          </Text>
        </Container>
        <Container marginTop>
          <Text type={Constants.TextTypes.Body} bold>
            Current selected identity
          </Text>
        </Container>
        <Container marginTop>
          <Container
            backgroundColor={hexToRgba(Colors.CONFIRM, 0.3)}
            padding
            br={5}
          >
            <Container>
              <Container marginBottom={10}>
                <Text bold textStyle={{ fontFamily: 'menlo' }} selectable>
                  {data && data.viewer && data.viewer.shortId}
                </Text>
              </Container>
              <Text textStyle={{ fontFamily: 'menlo' }} selectable>
                {data && data.viewer && data.viewer.did}
              </Text>
            </Container>
          </Container>
        </Container>
        <Container marginTop>
          <Text bold type={Constants.TextTypes.Body}>
            Seed Phrase
          </Text>
        </Container>
        <Container marginTop>
          {data && data.viewer && (
            <Button
              fullWidth
              buttonText={`Show Seed Phrase`}
              type={'warning'}
              block={'outlined'}
              onPress={() =>
                getSecretKey({
                  variables: {
                    did: data.viewer.did,
                    type: 'rinkeby-ethr-did',
                  },
                })
              }
            />
          )}
        </Container>
        <Container marginTop>
          {secret && secret.data && secret.data.managedIdentitySecret && (
            <Container>
              <Container
                backgroundColor={hexToRgba(Colors.WARN, 0.3)}
                padding
                br={5}
              >
                <Container>
                  <Text textStyle={{ fontFamily: 'menlo' }} selectable>
                    {secret.data.managedIdentitySecret}
                  </Text>
                </Container>
              </Container>
              <Container marginTop alignItems={'center'}>
                <Text
                  type={Constants.TextTypes.SubTitle}
                  warn
                  textAlign={'center'}
                >
                  Do not share this seed phrase with anyone.
                </Text>
              </Container>
            </Container>
          )}
        </Container>
      </Container>
    </Screen>
  )
}

export default ShowSecret
