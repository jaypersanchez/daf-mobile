/**
 * Serto Mobile App
 */
import React, { useState, useEffect } from 'react'
import {
  Container,
  Button,
  Constants,
  Screen,
  Text,
  Icon,
  RadioBtn,
} from '@kancha/kancha-ui'
import { TextInput } from 'react-native'
import { useNavigation } from 'react-navigation-hooks'
import { useQuery } from 'react-apollo'
import { GET_VIEWER, GET_ALL_IDENTITIES } from '../../lib/graphql/queries'

import { Colors } from '../../theme'
import { TouchableHighlight } from 'react-native-gesture-handler'

interface Claim {
  claimType: string
  reason: string
  essential: boolean
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
  const [identityBrowseOpen, toggleIdentityBrowse] = useState(false)

  const [claims, updateClaims] = useState<any>([])
  const [claimType, updateClaimType] = useState()
  const [claimTypeRequired, updateClaimTypeRequired] = useState(false)
  const [claimReason, updateClaimReason] = useState()
  const [claimTypeIssuers, updateClaimTypeIssuers] = useState([])

  const addClaimField = (type: string, reason: string, essential: boolean) => {
    const field = {
      claimType: type,
      reason,
      essential,
    }
    const updatedClaims = claims.concat([field])
    updateClaims(updatedClaims)
    updateClaimType('')
    updateClaimReason('')
    updateClaimTypeRequired(false)
  }

  const removeClaimField = (index: number) => {
    const updatedClaims = claims.filter((item: any, i: number) => i !== index)
    updateClaims(updatedClaims)
  }

  const signClaim = () => {
    navigation.navigate('SendRequest', {
      request: {
        claims,
        tag: 'tag-' + Date.now().toString(),
        issuer: data.viewer.did,
        subject: subject && subject.did,
      },
    })
  }

  useEffect(() => {
    if (getAllIdentitiesResp.data && getAllIdentitiesResp.data.identities) {
      setIdentities(getAllIdentitiesResp.data.identities)
    }
  }, [data])

  return (
    <Screen scrollEnabled={true} background={'primary'}>
      <Container padding>
        <Container marginBottom>
          <Text type={Constants.TextTypes.H3} bold>
            Create Request
          </Text>
          <Container marginTop>
            <Container>
              <Text type={Constants.TextTypes.SubTitle}>
                Request information from: (Optional)
              </Text>
            </Container>

            <Container background={'secondary'} padding marginTop br={5}>
              <TextInput
                placeholder={'Enter did'}
                autoCorrect={false}
                autoCapitalize={'none'}
                autoCompleteType={'off'}
                placeholderTextColor={Colors.DARK_GREY}
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
                  {identities.map((id: any) => {
                    return (
                      <TouchableHighlight
                        underlayColor={Colors.LIGHTEST_GREY}
                        key={id.did}
                        onPress={() => {
                          updateSubject(id)
                          toggleIdentityBrowse(false)
                        }}
                      >
                        <Container dividerTop paddingTop paddingBottom>
                          <Text bold>{id.shortId}</Text>
                          <Text textStyle={{ fontSize: 12 }}>{id.did}</Text>
                        </Container>
                      </TouchableHighlight>
                    )
                  })}
                </Container>
              )}
            </Container>
          </Container>
          <Container marginTop>
            <Text type={Constants.TextTypes.SectionHeader}>
              <Text type={Constants.TextTypes.SubTitle}>
                This request will be sent from:{' '}
                <Text bold>{data && data.viewer && data.viewer.shortId}</Text>
              </Text>
            </Text>
          </Container>
        </Container>
        <Container>
          {claims.map((c: Claim, i: number) => {
            return (
              <Container
                key={i}
                backgroundColor={Colors.CHARCOAL}
                br={8}
                padding
                marginBottom
              >
                <Text textColor={Colors.WHITE} textStyle={{ fontSize: 12 }}>
                  {c.claimType}
                </Text>
                <Text textColor={Colors.WHITE} textStyle={{ fontSize: 12 }}>
                  {c.reason}
                </Text>
                <Text textColor={Colors.WHITE} warn={c.essential}>
                  {c.essential ? 'Required' : 'Not Required'}
                </Text>
                <Container
                  viewStyle={{ position: 'absolute', top: 20, right: 10 }}
                >
                  <Button
                    icon={
                      <Icon
                        size={25}
                        icon={{ name: 'ios-close', iconFamily: 'Ionicons' }}
                      />
                    }
                    iconButton
                    onPress={() => removeClaimField(i)}
                  ></Button>
                </Container>
              </Container>
            )
          })}
        </Container>
        <Container backgroundColor={Colors.LIGHTEST_GREY} br={8} padding>
          <Container backgroundColor={Colors.WHITE} padding br={8}>
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
            backgroundColor={Colors.WHITE}
            padding
            br={8}
            marginTop={10}
          >
            <TextInput
              autoCorrect={false}
              autoCapitalize={'none'}
              autoCompleteType={'off'}
              placeholderTextColor={Colors.LIGHT_GREY}
              placeholder={'Enter reason for requesting'}
              value={claimReason}
              style={{ fontSize: 12 }}
              onChangeText={updateClaimReason}
            ></TextInput>
          </Container>
          <Container
            paddingTop
            flexDirection={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Container flex={1}>
              <RadioBtn
                onPress={() => updateClaimTypeRequired(!claimTypeRequired)}
                selected={claimTypeRequired}
              >
                Required
              </RadioBtn>
            </Container>
            <Container justifyContent={'center'}>
              <Button
                disabled={!claimType}
                block={Constants.ButtonBlocks.Filled}
                type={Constants.BrandOptions.Primary}
                buttonText={'+ Add'}
                small
                onPress={() =>
                  addClaimField(claimType, claimReason, claimTypeRequired)
                }
              ></Button>
            </Container>
          </Container>
        </Container>

        <Container marginTop>
          <Container>
            <Button
              buttonText={subject.did ? 'Send Request' : 'Generate QRCode'}
              fullWidth
              type={'confirm'}
              block={'filled'}
              onPress={() => signClaim()}
              disabled={claims.length === 0}
              shadowOpacity={0.2}
            ></Button>
          </Container>
        </Container>
      </Container>
    </Screen>
  )
}
