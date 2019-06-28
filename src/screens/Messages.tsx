/**
 * Serto Mobile App
 *
 */

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, TextInput } from 'react-native'
import { Query, Mutation, MutationState, QueryResult } from 'react-apollo'
import { Queries, Types } from '../lib/serto-graph'
import {
  Container,
  Button,
  Constants,
  Screen,
  ListItem,
  Text,
  Section,
} from '@kancha/kancha-ui'
import { Colors } from '../theme'

interface Result extends QueryResult {
  data: { messages: Types.Message[] }
}

export default () => {
  const { t } = useTranslation()
  const [jwt, setJwt] = useState('')
  return (
    <Screen
      safeArea={true}
      footerComponent={
        <Container padding>
          <Mutation
            mutation={Queries.newMessage}
            refetchQueries={['FindMessages']}
            // tslint:disable-next-line:no-console
            onError={(e: any) => console.log('Error: ', e)}
          >
            {(mutate: any, state: MutationState) => {
              return (
                <Container paddingBottom>
                  <Button
                    fullWidth
                    disabled={!jwt}
                    type={Constants.BrandOptions.Primary}
                    block={Constants.ButtonBlocks.Filled}
                    buttonText={t('Import Seed')}
                    onPress={() => {
                      mutate({
                        variables: {
                          jwt:
                            'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1NjE2NDU1MDMsInN1YiI6ImRpZDpldGhyOjB4ZDExOTYxZjhhZjJlNWFjNmU1YTllZGQ2OThlMDEwZmI5ZGJkZGMxMiIsImNsYWltIjp7Im5hbWUiOiJCb2IifSwiaXNzIjoiZGlkOmV0aHI6MHg4YTE2NzU0NjE2NzJjNGMyZDcwOGQyYmJlZWI3YjNkNTVlMzk5ZGMwIn0.adOVix1AJ45d5vFk2QfGmlGb7wE9oyXqQxlCTe4frnD38Z4VkSAxTf0C7AOVTgdFC5Hx8_LAYT4v2p_NgJfn3gE',
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
        </Container>
      }
    >
      <Container flex={1}>
        <Query query={Queries.findMessages} onError={console.log}>
          {({ data, loading, refetch, error }: Result) =>
            error ? (
              <Text>{error.message}</Text>
            ) : (
              <FlatList
                style={{ backgroundColor: Colors.LIGHTEST_GREY, flex: 1 }}
                data={data.messages}
                renderItem={({ item, index }) => (
                  <ListItem last={index === data.messages.length - 1}>
                    {item.iss.shortId}
                  </ListItem>
                )}
                keyExtractor={item => item.hash}
                onRefresh={refetch}
                refreshing={loading}
                ListFooterComponent={
                  <Container background={Constants.BrandOptions.Primary}>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        padding: 15,
                        height: 100,
                        borderColor: Colors.LIGHT_GREY,
                      }}
                      placeholder={'Enter message (JWT)'}
                      value={jwt}
                      onChangeText={setJwt}
                    />
                  </Container>
                }
              />
            )
          }
        </Query>
      </Container>
    </Screen>
  )
}
