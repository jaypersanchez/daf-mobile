/**
 * Serto Mobile App
 *
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, TextInput } from 'react-native'
import { Query, Mutation } from 'react-apollo'
import { NavigationStackScreenProps } from 'react-navigation-stack'
// import { useQuery, useApolloClient } from '@apollo/react-hooks'
import {
  Did,
  getDidsQuery,
  createDidMutation,
  importSeedMutation,
} from '../../lib/Signer'
import {
  Container,
  Button,
  Constants,
  Screen,
  ListItem,
  Text,
} from '@kancha/kancha-ui'
import { Colors } from '../../theme'

interface SignerProps extends NavigationStackScreenProps {}

const Signer: React.FC<SignerProps> = props => {
  const { t } = useTranslation()
  const [seed, setSeed] = useState('')
  // const client = useApolloClient()
  // const { data, loading, error } = useQuery(getDidsQuery)
  return (
    <Screen
      safeArea={true}
      footerComponent={
        <Container padding>
          <Mutation
            mutation={importSeedMutation}
            refetchQueries={['getDids']}
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
                          seed,
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
          </Mutation>
          <Mutation mutation={createDidMutation} refetchQueries={['getDids']}>
            {(mutate: any) => (
              <Button
                fullWidth
                type={Constants.BrandOptions.Primary}
                block={Constants.ButtonBlocks.Filled}
                buttonText={t('Create New Identity')}
                onPress={() => {
                  mutate()
                }}
                navButton
              />
            )}
          </Mutation>
        </Container>
      }
    >
      <Container flex={1}>
        <Query query={getDidsQuery}>
          {({
            data,
            loading,
            refetch,
          }: {
            data: { dids: Did[]; selectedDid: string }
            loading: boolean
            refetch: () => void
          }) => (
            <FlatList
              style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
              data={data && data.dids}
              renderItem={({ item, index }) => (
                <ListItem
                  last={index === data.dids.length - 1}
                  selected={item.isSelected}
                  onPress={() => {
                    props.navigation.push('DidViewer', {
                      did: item.did,
                      address: item.address,
                      seed: item.seed,
                    })
                  }}
                >
                  {item.did.substring(0, 20) + '...'}
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
