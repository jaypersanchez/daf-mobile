import React from 'react'
import { Container, Banner, ListItem, Indicator } from '@kancha/kancha-ui'

interface RequestProps {
  peerMeta: any
}

const SessionRequest: React.FC<RequestProps> = ({ peerMeta }) => {
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
        text={`${peerMeta && peerMeta.name} are requesting you share`}
      />
      <ListItem last accessoryRight={'sss'}>
        Your did address
      </ListItem>
    </Container>
  )
}

export default SessionRequest
