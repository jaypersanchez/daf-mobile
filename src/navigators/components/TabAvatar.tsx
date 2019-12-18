import * as React from 'react'
import { Avatar } from '@kancha/kancha-ui'
import { useQuery } from 'react-apollo'
import { GET_VIEWER } from '../../lib/graphql/queries'
import { ActivityIndicator } from 'react-native'

interface TabAvatarProps {
  tintColor?: string
}

export default ({ tintColor }: TabAvatarProps) => {
  const { data, loading } = useQuery(GET_VIEWER)
  const source =
    data && data.viewer && data.viewer.profileImage
      ? { source: { uri: data.viewer.profileImage } }
      : {}

  return loading ? (
    <ActivityIndicator />
  ) : (
    !loading && data && data.viewer && (
      <Avatar
        {...source}
        backgroundColor={tintColor}
        border
        address={data && data.viewer && data.viewer.did}
        gravatarType={'retro'}
      />
    )
  )
}
