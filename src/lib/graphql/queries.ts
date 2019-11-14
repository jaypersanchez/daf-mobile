import gql from 'graphql-tag'

export const GET_VIEWER = gql`
  query getViewer {
    viewer {
      did
      shortId
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
    newMessage(raw: $raw, sourceType: $sourceType, sourceId: $sourceId)
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
