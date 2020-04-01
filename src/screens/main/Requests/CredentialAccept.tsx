import React, { useState, useEffect } from 'react'
import {
  Container,
  Banner,
  ListItem,
  Indicator,
  Credential,
} from '@kancha/kancha-ui'
import { core, dataStore } from '../../../lib/setup'

interface RequestProps {
  peerMeta: any
  messageId: string
}

const SessionRequest: React.FC<RequestProps> = ({ peerMeta, messageId }) => {
  const [vcs, updateVcs] = useState()

  const getCredentialsFromMessage = async () => {
    const vcs = await dataStore.credentialsForMessageId(messageId)
    const vcsWithFields = await Promise.all(
      vcs.map(async vc => ({
        ...vc,
        iss: {
          did: vc.iss.did,
          shortId: await dataStore.shortId(vc.iss.did),
        },
        sub: {
          did: vc.sub.did,
          shortId: await dataStore.shortId(vc.iss.did),
        },
        fields: await dataStore.credentialsFieldsForClaimHash(vc.hash),
      })),
    )

    updateVcs(vcsWithFields)
  }

  useEffect(() => {
    setTimeout(() => {
      getCredentialsFromMessage()
    }, 300)
  }, [])

  return (
    <Container>
      <Banner
        title={peerMeta.name}
        subTitle={peerMeta.url}
        issuer={{
          did: '',
          shortId: '',
          profileImage: peerMeta && peerMeta.icons[0],
        }}
      />
      <Indicator
        text={`${peerMeta && peerMeta.name} has issue you a credential`}
      />
      {vcs &&
        vcs.map((vc: any) => {
          return (
            <Credential
              background={'primary'}
              key={vc.hash}
              exp={vc.exp}
              issuer={vc.iss}
              subject={vc.sub}
              fields={vc.fields}
              jwt={vc.jwt}
            />
          )
        })}
    </Container>
  )
}

export default SessionRequest
