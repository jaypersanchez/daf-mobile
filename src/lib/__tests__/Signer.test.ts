import {
  resolvers,
  getDidsQuery,
  importSeedMutation,
  deleteSeedMutation,
  createDidMutation,
  DEFAULT_LEVEL,
  SHOW_SEED_PROMPT,
} from '../Signer'

import { RNUportHDSigner } from 'react-native-uport-signer'
jest.mock('../GraphQL')
jest.mock('../Log')

it('dids query returns valid result', async () => {
  const result = await resolvers.Query.dids(null, null, null)
  expect(RNUportHDSigner.listSeedAddresses).toBeCalled()
  expect(result).toEqual([
    { did: 'did:ethr:0x12345', address: '0x12345', __typename: 'Did' },
  ])
})

it('createSeed mutation returns new did', async () => {
  const result = await resolvers.Mutation.createDid(null, null, null)
  expect(RNUportHDSigner.createSeed).toBeCalledWith(DEFAULT_LEVEL)
  expect(result).toEqual({
    did: 'did:ethr:0x12345',
    address: '0x12345',
    __typename: 'Did',
  })
})

it('importSeed mutation returns new did', async () => {
  const args = { seed: 'test' }
  const result = await resolvers.Mutation.importSeed(null, args, null)
  expect(RNUportHDSigner.importSeed).toBeCalledWith(args.seed, DEFAULT_LEVEL)
  expect(result).toEqual({
    did: 'did:ethr:0x12345',
    address: '0x12345',
    __typename: 'Did',
  })
})

it('deleteSeed mutation returns bool', async () => {
  const args = { address: '0x12345' }
  const result = await resolvers.Mutation.deleteSeed(null, args, null)
  expect(RNUportHDSigner.deleteSeed).toBeCalledWith(args.address)
  expect(result).toEqual(true)
})

it('Did.seed query', async () => {
  const args = { address: '0x12345' }
  const result = await resolvers.Did.seed(args, null, null)
  expect(RNUportHDSigner.showSeed).toBeCalledWith(
    args.address,
    SHOW_SEED_PROMPT,
  )
  expect(result).toEqual('test')
})

it('query snapshots', async () => {
  expect(getDidsQuery).toMatchSnapshot()
  expect(importSeedMutation).toMatchSnapshot()
  expect(deleteSeedMutation).toMatchSnapshot()
  expect(createDidMutation).toMatchSnapshot()
})
