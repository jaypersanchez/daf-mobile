import gql from 'graphql-tag'

export const GET_VIEWER = gql`
  query getViewer {
    viewer {
      did
      shortId
      profileImage
    }
  }
`

export const GET_IDENTITY = gql`
  query getIdentity($did: ID!) {
    identity(did: $did) {
      did
      firstName
      lastName
      shortId
      profileImage
    }
  }
`

export const GET_ALL_IDENTITIES = gql`
  query GetAllIdentities {
    identities {
      did
      shortId
      firstName
      lastName
      profileImage
    }
  }
`

export const GET_VIEWER_CREDENTIALS = gql`
  query getViewer {
    viewer {
      did
      shortId
      profileImage
      interactionCount
      url
      description
      credentialsReceived {
        jwt
        hash
        rowId
        iss {
          did
          shortId
          profileImage
        }
        sub {
          did
          shortId
          profileImage
        }
        fields {
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
    createIdentity(type: $type, secret: $secret) {
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
  mutation newMessage($raw: String!, $sourceType: String!, $sourceId: String) {
    newMessage(raw: $raw, sourceType: $sourceType, sourceId: $sourceId) {
      id
      type
    }
  }
`

export const GET_MANAGED_IDENTITIES = gql`
  query managedIdentities {
    managedIdentities {
      did
      isSelected
      shortId
      profileImage
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
export const VIEWER_MESSAGES = gql`
  query ViewerMessages($selectedDid: String!) {
    viewer {
      did
      messagesAll {
        id
        raw
        data
        threadId
        type
        timestamp
        sender {
          did
          shortId
          profileImage
        }
        receiver {
          did
          shortId
          profileImage
        }
        vc {
          hash
          rowId
          jwt
          iss {
            did
            profileImage
            shortId
          }
          sub {
            did
            profileImage
            shortId
          }
          fields {
            type
            value
            isObj
          }
        }
        metaData {
          rowId
          type
          id
          data
        }
        sdr(sub: $selectedDid) {
          iss {
            did {
              did
              shortId
            }
            url
          }
          claimType
          reason
          essential
          vc {
            hash
            rowId
            iss {
              did
              shortId
              profileImage
            }
            sub {
              did
              shortId
              profileImage
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
  mutation signVp($did: String!, $data: VerifiablePresentationInput!) {
    actionSignVp(did: $did, data: $data)
  }
`

export const SIGN_VC_MUTATION = gql`
  mutation sign($did: String!, $data: VerifiableCredentialInput!) {
    actionSignVc(did: $did, data: $data)
  }
`

export const SIGN_SDR_MUTATION = gql`
  mutation signSDR($did: String!, $data: SDRInput!) {
    actionSignSDR(did: $did, data: $data)
  }
`

export const SEND_JWT_MUTATION = gql`
  mutation send($from: String!, $to: String!, $jwt: String!) {
    actionSendJwt(from: $from, to: $to, jwt: $jwt)
  }
`
