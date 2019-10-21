/**
 * Serto Mobile App
 *
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Query, Mutation } from 'react-apollo'
import { NavigationScreenProps } from 'react-navigation'
import { Did, getDidsQuery, signJwtMutation } from '../../lib/Signer'
import {
  Container,
  Button,
  Constants,
  Screen,
  ListItem,
  Text,
} from '@kancha/kancha-ui'
import { Colors } from '../../theme'

interface SignJwtProps extends NavigationScreenProps {}

const SignJwt: React.FC<SignJwtProps> = props => {
  const { t } = useTranslation()

  return (
    <Screen safeArea={true}>
      <Container padding>
        <Query query={getDidsQuery}>
          {({
            data,
            loading,
            refetch,
          }: {
            data: { dids: Did[] }
            loading: boolean
            refetch: () => void
          }) => (
            <Mutation mutation={signJwtMutation} refetchQueries={['getDids']}>
              {(mutate: any, state: any) => (
                <Container paddingBottom>
                  <Button
                    fullWidth
                    type={Constants.BrandOptions.Primary}
                    block={Constants.ButtonBlocks.Filled}
                    buttonText={t('Sign Jwt')}
                    onPress={() => {
                      mutate({
                        variables: {
                          address: data.dids[0].address,
                        },
                      })
                    }}
                    navButton
                  />
                  {state.error !== undefined && (
                    <Text>{state.error.message}</Text>
                  )}
                  {state.data && state.data.signJwt && (
                    <Text>{state.data.signJwt}</Text>
                  )}
                </Container>
              )}
            </Mutation>
          )}
        </Query>
      </Container>
    </Screen>
  )
}

export default SignJwt
