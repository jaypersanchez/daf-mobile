/**
 * Serto Mobile App
 *
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, TextInput } from 'react-native'
import { Query, Mutation, MutationState } from 'react-apollo'
import { NavigationScreenProps } from 'react-navigation'
import { Did, getDidsQuery, createVerificationMutation } from '../lib/Signer'
import {
  Container,
  Button,
  Constants,
  Screen,
  ListItem,
  Text,
} from '@kancha/kancha-ui'
import { Colors } from '../theme'

interface CreateVerificationProps extends NavigationScreenProps {}

const CreateVerification: React.FC<CreateVerificationProps> = props => {
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
            <Mutation
              mutation={createVerificationMutation}
              refetchQueries={['getDids']}
            >
              {(mutate: any) => (
                <Button
                  fullWidth
                  type={Constants.BrandOptions.Primary}
                  block={Constants.ButtonBlocks.Filled}
                  buttonText={t('create credential')}
                  onPress={() => {
                    mutate({
                      variables: {
                        address: data.dids[0],
                      },
                    })
                  }}
                  navButton
                />
              )}
            </Mutation>
          )}
        </Query>
      </Container>
    </Screen>
  )
}

export default CreateVerification
