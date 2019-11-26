/**
 * Serto Mobile App
 *
 */

import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Container,
  Button,
  Constants,
  Screen,
  ListItem,
  Section,
  Text,
  Icon,
  Card,
} from '@kancha/kancha-ui'
import { TextInput, ScrollView } from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import { useQuery } from 'react-apollo'
import { GET_VIEWER, GET_ALL_IDENTITIES } from '../../lib/graphql/queries'

import { Colors } from '../../theme'
import { TouchableHighlight } from 'react-native-gesture-handler'

interface Field {
  type: string
  value: any
}

/**
 * Temporary implementation until all requirements have been ironed out.
 * Final component will be built in @kancha
 */
export default () => {
  const navigation = useNavigation()

  const { data } = useQuery(GET_VIEWER)
  const getAllIdentitiesResp = useQuery(GET_ALL_IDENTITIES)

  const [identities, setIdentities] = useState<any[]>([])
  const [subject, updateSubject] = useState<any>({})
  const [claimValue, updateClaimValue] = useState('')
  const [claimType, updateClaimType] = useState('')
  const [fields, updateFields] = useState<Field[]>([])
  const [identityBrowseOpen, toggleIdentityBrowse] = useState(false)

  const signClaim = () => {
    navigation.navigate('ShareCredential', {
      claim: {
        fields,
        issuer: data.viewer.did,
        subject: subject && subject.did,
      },
    })
  }

  const updateClaimFields = (field: Field) => {
    const newfields = fields.concat([field])
    updateFields(newfields)
    updateClaimValue('')
    updateClaimType('')
  }

  useEffect(() => {
    if (data && data.viewer) {
      updateSubject(data.viewer)
    }

    if (getAllIdentitiesResp.data && getAllIdentitiesResp.data.identities) {
      setIdentities(getAllIdentitiesResp.data.identities)
    }
  }, [data])

  return (
    <Screen scrollEnabled={true} background={'primary'}>
      <Container padding>
        <Container marginBottom>
          <Text type={Constants.TextTypes.H3} bold>
            Create Credential
          </Text>
          <Container marginTop>
            <Text type={Constants.TextTypes.SubTitle}>
              to: {subject.shortId}
            </Text>
            <TextInput
              autoCorrect={false}
              autoCapitalize={'none'}
              autoCompleteType={'off'}
              placeholderTextColor={Colors.LIGHT_GREY}
              style={{ color: Colors.BRAND }}
              onFocus={() => toggleIdentityBrowse(true)}
              onBlur={() => toggleIdentityBrowse(false)}
              onChangeText={value =>
                updateSubject({ did: value, shortId: 'Unknown' })
              }
              value={subject.did}
            ></TextInput>
            {identityBrowseOpen && (
              <Container marginTop dividerBottom>
                {getAllIdentitiesResp &&
                  getAllIdentitiesResp.data &&
                  getAllIdentitiesResp.data.identities.map((id: any) => {
                    return (
                      <TouchableHighlight
                        underlayColor={Colors.LIGHTEST_GREY}
                        key={id.did}
                        onPress={() => {
                          updateSubject(id)
                          toggleIdentityBrowse(false)
                        }}
                      >
                        <Container dividerTop padding>
                          <Text>{id.shortId}</Text>
                          <Text
                            type={Constants.TextTypes.SubTitle}
                            textStyle={{ fontSize: 12 }}
                          >
                            {id.did}
                          </Text>
                        </Container>
                      </TouchableHighlight>
                    )
                  })}
              </Container>
            )}
          </Container>
          <Container marginTop>
            <Text type={Constants.TextTypes.SectionHeader}>
              <Text type={Constants.TextTypes.SubTitle}>from: </Text>
              {data && data.viewer && data.viewer.shortId}
            </Text>
            <Text type={Constants.TextTypes.SubTitle}>
              {data && data.viewer && data.viewer.did}
            </Text>
          </Container>
        </Container>
        <Container marginTop>
          {fields.map((field, i) => {
            return (
              <Container
                key={i}
                backgroundColor={Colors.CHARCOAL}
                br={8}
                padding
                marginBottom
              >
                <Text textColor={Colors.WHITE} textStyle={{ fontSize: 12 }}>
                  {field.type}
                </Text>
                <Text textColor={Colors.WHITE}>{field.value}</Text>
              </Container>
            )
          })}
        </Container>
        <Container flexDirection={'row'}>
          <Container
            flex={3}
            backgroundColor={Colors.LIGHTEST_GREY}
            br={8}
            padding
            marginRight
          >
            <TextInput
              autoCorrect={false}
              autoCapitalize={'none'}
              autoCompleteType={'off'}
              placeholderTextColor={Colors.LIGHT_GREY}
              placeholder={'Enter claim type'}
              value={claimType}
              style={{ fontSize: 12 }}
              onChangeText={updateClaimType}
            ></TextInput>
          </Container>
          <Container
            flex={3}
            backgroundColor={Colors.LIGHTEST_GREY}
            br={8}
            padding
            marginRight
          >
            <TextInput
              autoCorrect={false}
              autoCapitalize={'none'}
              autoCompleteType={'off'}
              placeholderTextColor={Colors.LIGHT_GREY}
              placeholder={'Enter claim value'}
              value={claimValue}
              style={{ fontSize: 12 }}
              onChangeText={updateClaimValue}
            ></TextInput>
          </Container>
          <Container flex={1} justifyContent={'center'}>
            <Button
              icon={
                <Icon
                  color={Colors.BRAND}
                  size={40}
                  icon={{ name: 'ios-add', iconFamily: 'Ionicons' }}
                />
              }
              iconButton
              disabled={claimValue === '' || claimType === ''}
              onPress={() =>
                updateClaimFields({ type: claimType, value: claimValue })
              }
            ></Button>
          </Container>
        </Container>

        <Container marginTop={32}>
          <Container>
            <Button
              buttonText={'Sign Claim'}
              fullWidth
              type={'confirm'}
              block={'filled'}
              onPress={() => signClaim()}
              disabled={fields.length === 0}
              shadowOpacity={0.2}
            ></Button>
          </Container>
        </Container>
      </Container>
    </Screen>
  )
}
