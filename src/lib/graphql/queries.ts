import gql from 'graphql-tag'

export const GET_SECRET_KEY = gql`
  query managedIdentitySecret($did: String, $type: String) {
    managedIdentitySecret(did: $did, type: $type)
  }
`

export const GET_IDENTITY = gql`
  query getIdentity($did: ID!) {
    identity(did: $did) {
      isManaged
      did
      shortId: shortDid
      shortDid
      firstName: latestClaimValue(type: "firstName")
      lastName: latestClaimValue(type: "lastName")
      profileImage: latestClaimValue(type: "profileImage")
    }
  }
`

export const GET_ALL_IDENTITIES = gql`
  query GetAllIdentities {
    identities {
      isManaged
      isSelected
      did
      shortId: shortDid
      shortDid
      firstName: latestClaimValue(type: "firstName")
      lastName: latestClaimValue(type: "lastName")
      profileImage: latestClaimValue(type: "profileImage")
    }
  }
`

export const GET_CREDENTIALS_FOR_IDENTITY = gql`
  fragment ShortProfile on Identity {
    did
    shortId: shortDid
    shortDid
    firstName: latestClaimValue(type: "firstName")
    lastName: latestClaimValue(type: "lastName")
    profileImage: latestClaimValue(type: "profileImage")
  }

  query Credentials($selectedIdentity: ID!) {
    identity(did: $selectedIdentity) {
      isManaged
      isSelected
      ...ShortProfile
      receivedCredentials {
        hash
        issuer {
          ...ShortProfile
        }
        subject {
          ...ShortProfile
        }
        credentialSubject
        claims {
          type
          value
          isObj
        }
      }
    }
  }
`

export const GET_VIEWER = gql`
  query getViewer {
    viewer {
      did
      shortId: shortDid
      shortDid
      profileImage: latestClaimValue(type: "profileImage")
    }
  }
`

export const GET_VIEWER_CREDENTIALS = gql`
  fragment ShortProfile on Identity {
    did
    shortId: shortDid
    shortDid
    firstName: latestClaimValue(type: "firstName")
    lastName: latestClaimValue(type: "lastName")
    profileImage: latestClaimValue(type: "profileImage")
  }
  query getViewer {
    viewer {
      ...ShortProfile
      isManaged
      isSelected
      receivedCredentials {
        hash
        issuer {
          ...ShortProfile
        }
        subject {
          ...ShortProfile
        }
        credentialSubject
        claims {
          type
          value
          isObj
        }
      }
    }
  }
`

export const SET_VIEWER = gql`
  mutation setViewer($did: String!) {
    setViewer(did: $did) {
      did
    }
  }
`

export const IMPORT_IDENTITY = gql`
  mutation importIdentity($type: String!, $secret: String!) {
    importIdentity(type: $type, secret: $secret) {
      did
    }
  }
`

export const CREATE_IDENTITY = gql`
  mutation createIdentity($type: String!) {
    createIdentity(type: $type) {
      did
    }
  }
`

export const DELETE_IDENTITY = gql`
  mutation deleteIdentity($type: String!, $did: String!) {
    deleteIdentity(type: $type, did: $did)
  }
`

export const NEW_MESSAGE = gql`
  mutation handleMessage(
    $raw: String!
    $meta: [MetaDataInput]
    $save: Boolean
  ) {
    handleMessage(raw: $raw, meta: $meta, save: $save) {
      raw
    }
  }
`

export const GET_MANAGED_IDENTITIES = gql`
  query managedIdentities {
    managedIdentities {
      did
      isSelected
      shortId: shortDid
      shortDid
      profileImage: latestClaimValue(type: "profileImage")
    }
  }
`

export const GET_MESSAGE = gql`
  query GetMessage($hash: String!) {
    message(hash: $hash) {
      jwt
    }
  }
`

export const GET_MESSAGE_SDR = gql`
  fragment ShortProfile on Identity {
    did
    shortId: shortDid
    shortDid
    firstName: latestClaimValue(type: "firstName")
    lastName: latestClaimValue(type: "lastName")
    profileImage: latestClaimValue(type: "profileImage")
  }
  query GetMessageSDR($id: ID!, $selectedIdentity: ID!) {
    message(id: $id) {
      threadId
      id
      replyTo
      replyUrl
      from {
        did
        shortId: shortDid
      }
      sdr(id: $selectedIdentity) {
        claimType
        claimValue
        credentialType
        essential
        issuers {
          did {
            did
          }
        }
        credentials {
          hash
          raw
          issuanceDate
          expirationDate
          credentialSubject
          iss: issuer {
            ...ShortProfile
          }
          sub: subject {
            ...ShortProfile
          }
          fields: claims {
            type
            value
            isObj
          }
        }
      }
    }
  }
`
export const ALL_MESSAGES = gql`
  fragment ShortProfile on Identity {
    did
    shortId: shortDid
    name: latestClaimValue(type: "name")
    firstName: latestClaimValue(type: "firstName")
    lastName: latestClaimValue(type: "lastName")
    profileImage: latestClaimValue(type: "profileImage")
  }
  query AllMessages {
    messages {
      id
      saveDate
      updateDate
      createdAt
      expiresAt
      threadId
      type
      raw
      data
      replyTo
      replyUrl
      viewer {
        ...ShortProfile
      }
      presentations {
        hash
        raw
      }
      credentials {
        hash
        raw
        issuer {
          ...ShortProfile
        }
        subject {
          ...ShortProfile
        }
        issuanceDate
        expirationDate
        credentialSubject
        claims {
          type
          value
          isObj
        }
      }
      from {
        ...ShortProfile
      }
      to {
        ...ShortProfile
      }
      metaData
    }
  }
`

export const VIEWER_MESSAGES = gql`
  query ViewerMessages($selectedIdentity: ID!) {
    viewer {
      did
      receivedMessages {
        id
        raw
        data
        threadId
        type
        createdAt
        to {
          did
          shortId: shortDid
          shortDid
          profileImage: latestClaimValue(type: "profileImage")
        }
        from {
          did
          shortId: shortDid
          shortDid
          profileImage: latestClaimValue(type: "profileImage")
        }
        credentials {
          hash
          jwt
          iss {
            did
            shortId: shortDid
            profileImage: latestClaimValue(type: "profileImage")
            shortDid
          }
          sub {
            did
            profileImage: latestClaimValue(type: "profileImage")
            shortDid
          }
          fields {
            type
            value
            isObj
          }
        }
        metaData {
          type
          value
        }
        sdr(did: $selectedIdentity) {
          iss {
            did {
              did
              shortId: shortDid
              shortDid
            }
            url
          }
          claimType
          reason
          essential
          vc {
            hash
            iss {
              did
              shortDid
              shortId: shortDid
              profileImage: latestClaimValue(type: "profileImage")
            }
            sub {
              did
              shortId: shortDid
              shortDid
              profileImage: latestClaimValue(type: "profileImage")
            }
            jwt
            fields {
              type
              value
              isObj
            }
          }
        }
      }
    }
  }
`

export const SIGN_VP = gql`
  mutation signPresentationJwt($data: SignPresentationInput!, $save: Boolean) {
    signPresentationJwt(data: $data, save: $save) {
      raw
    }
  }
`

export const SIGN_VC_MUTATION = gql`
  mutation sign($data: SignCredentialInput!, $save: Boolean) {
    signCredentialJwt(data: $data, save: $save) {
      raw
    }
  }
`

export const SIGN_SDR_MUTATION = gql`
  mutation signSdrJwt($data: SDRInput!) {
    signSdrJwt(data: $data)
  }
`

export const SEND_JWT_MUTATION = gql`
  mutation send($from: String!, $to: String!, $jwt: String!) {
    actionSendJwt(from: $from, to: $to, jwt: $jwt) {
      id
    }
  }
`
