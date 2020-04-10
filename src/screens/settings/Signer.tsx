/**
 * Serto Mobile App
 *
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, TextInput } from 'react-native'
import { Query, Mutation } from 'react-apollo'
import { NavigationStackScreenProps } from 'react-navigation-stack'

import {
  Container,
  Button,
  Constants,
  Screen,
  ListItem,
  Text,
} from '@kancha/kancha-ui'
import { Colors } from '../../theme'

import {
  GET_MANAGED_IDENTITIES,
  IMPORT_IDENTITY,
  CREATE_IDENTITY,
} from '../../lib/graphql/queries'

interface Identity {
  did: string
  shortId: string
  isSelected: boolean
  profileImage?: string
}

interface SignerProps extends NavigationStackScreenProps {}

const Signer: React.FC<SignerProps> = props => {
  const { t } = useTranslation()
  const [seed, setSeed] = useState('')

  return (
    <Screen
      safeArea={true}
      footerComponent={
        <Container padding>
          {/* <Mutation
            mutation={IMPORT_IDENTITY}
            refetchQueries={[{ query: GET_MANAGED_IDENTITIES }]}
            // tslint:disable-next-line:no-console
            onError={(e: any) => console.log('Error: ', e)}
          >
            {(mutate: any, state: any) => {
              return (
                <Container paddingBottom>
                  <Button
                    fullWidth
                    disabled={!seed}
                    type={Constants.BrandOptions.Primary}
                    block={Constants.ButtonBlocks.Filled}
                    buttonText={t('Import Seed')}
                    onPress={() => {
                      mutate({
                        variables: {
                          type: 'rinkeby-ethr-did',
                          secret: seed,
                        },
                      })
                    }}
                    navButton
                  />
                  {state.error !== undefined && (
                    <Text>{state.error.message}</Text>
                  )}
                </Container>
              )
            }}
          </Mutation> */}
          <Mutation
            mutation={CREATE_IDENTITY}
            refetchQueries={[{ query: GET_MANAGED_IDENTITIES }]}
          >
            {(mutate: any) => (
              <Button
                fullWidth
                type={Constants.BrandOptions.Primary}
                block={Constants.ButtonBlocks.Filled}
                buttonText={t('Create New Identity')}
                onPress={() => {
                  mutate({
                    variables: {
                      type: 'rinkeby-ethr-did',
                    },
                  })
                }}
                navButton
              />
            )}
          </Mutation>
        </Container>
      }
    >
      <Container flex={1}>
        <Query query={GET_MANAGED_IDENTITIES}>
          {({
            data,
            loading,
            refetch,
          }: {
            data: { managedIdentities: Identity[] }
            loading: boolean
            refetch: () => void
          }) => (
            <FlatList
              style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
              data={data && data.managedIdentities}
              renderItem={({ item, index }) => (
                <ListItem
                  last={index === data.managedIdentities.length - 1}
                  selected={item.isSelected}
                  onPress={() => {
                    props.navigation.push('DidViewer', {
                      did: item.did,
                    })
                  }}
                >
                  {item.shortId}
                </ListItem>
              )}
              keyExtractor={item => item.did}
              onRefresh={refetch}
              refreshing={loading}
              ListHeaderComponent={
                <Container background={Constants.BrandOptions.Primary}>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      padding: 15,
                      height: 100,
                      borderColor: Colors.LIGHT_GREY,
                    }}
                    placeholder={'Enter seed phrase'}
                    value={seed}
                    onChangeText={setSeed}
                  />
                </Container>
              }
            />
          )}
        </Query>
      </Container>
    </Screen>
  )
}

export default Signer
