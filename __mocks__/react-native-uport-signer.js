const RNUportHDSigner = {
  listSeedAddresses: jest.fn().mockReturnValue(['0x12345']),
  createSeed: jest.fn().mockReturnValue({ address: '0x12345' }),
  importSeed: jest.fn().mockReturnValue({ address: '0x12345' }),
  deleteSeed: jest.fn().mockReturnValue(true),
  showSeed: jest.fn().mockReturnValue('test'),
}

export { RNUportHDSigner }
