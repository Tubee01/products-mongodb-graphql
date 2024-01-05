export enum PrismaErrorCode {
  UniqueConstraintViolation = 'P2002',
  ForeignKeyConstraintViolation = 'P2003',
  CheckConstraintViolation = 'P2004',
  ExclusionConstraintViolation = 'P2005',
  InvalidConnectionArgument = 'P2006',
  InvalidConnectionOption = 'P2007',
  TransactionConflict = 'P2008',
  UnsupportedProtocol = 'P2009',
  QueryCancelled = 'P2010',
  AdminShutdown = 'P2011',
  CrashShutdown = 'P2012',
  CannotConnectToReplica = 'P2013',
  ReadOnlyTransactionTerminated = 'P2014',
  MalformedPacket = 'P2016',
  TooManyRedirects = 'P2017',
  ProtocolViolation = 'P2018',
  ResponseTooLarge = 'P2019',
  ClientIdleTimeout = 'P2020',
  UnknownSessionError = 'P3000',
  RecordDoesNotExist = 'P2025',
}