/**
 * Serto Mobile App
 *
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View, FlatList, TextInput } from 'react-native'
import { Query, Mutation, MutationState } from 'react-apollo'
import {
  Did,
  getDidsQuery,
  createDidMutation,
  importSeedMutation,
  deleteSeedMutation,
} from '../lib/Signer'
import { Container, Button, Constants, Screen } from '@kancha/kancha-ui'

interface Props {}

export default (props: Props) => {
  const { t } = useTranslation()
  const [seed, setSeed] = useState('')
  return (
    <Screen safeArea={true}>
      <Container>
        <Mutation
          mutation={importSeedMutation}
          refetchQueries={['getDids']}
          onError={(e: any) => console.log('Error: ', e)}
        >
          {(mutate: any, state: MutationState) => {
            return (
              <Container>
                <TextInput
                  style={styles.textInput}
                  placeholder={'Enter seed phrase'}
                  value={seed}
                  onChangeText={setSeed}
                />

                <Button
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
          <FlatList
            data={data.dids}
            renderItem={({ item }) => <ListItem item={item} />}
            keyExtractor={(item, index) => item.did}
            onRefresh={refetch}
            refreshing={loading}
          />
        )}
      </Query>
    </Screen>
  )
}

const ListItem = ({ item }: { item: Did }) => {
  return (
    <View style={[styles.item]}>
      <View style={styles.header}>
        <Text style={styles.category}>{item.did}</Text>
      </View>
      <Text style={styles.message}>{item.seed}</Text>
      <Mutation mutation={deleteSeedMutation} refetchQueries={['getDids']}>
        {(mutate: any) => (
          <Button
            type={Constants.BrandOptions.Warning}
            block={Constants.ButtonBlocks.Outlined}
            buttonText={'Delete Seed'}
            onPress={() => {
              mutate({
                variables: {
                  address: item.address,
                },
              })
            }}
            navButton
          />
        )}
      </Mutation>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    marginLeft: 3,
    marginTop: 1,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  category: {
    fontSize: 12,
    color: 'gray',
    fontWeight: 'bold',
  },
  message: {
    fontSize: 15,
  },
  date: {
    fontSize: 12,
    marginBottom: 5,
    color: 'gray',
  },
  textInput: {
    margin: 15,
    borderWidth: 1,
    fontSize: 14,
    borderColor: 'gray',
    padding: 10,
  },
})
