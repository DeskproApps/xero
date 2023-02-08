export type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export interface ITenant {
  id: string;
  authEventId: string;
  tenantId: string;
  tenantType: string;
  tenantName: string;
  createdDateUtc: string;
  updatedDateUtc: string;
}

export interface IConnectToken {
  id_token: string;
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  scope: string;
  error?: string;
}

export interface IContactList {
  Id: string;
  Status: string;
  ProviderName: string;
  DateTimeUTC: string;
  Contacts: Contact[];
}

export interface Contact {
  ContactID: string;
  ContactStatus: string;
  Name: string;
  FirstName?: string;
  LastName?: string;
  EmailAddress: string;
  BankAccountDetails: string;
  Addresses: Address[];
  Phones: Phone[];
  UpdatedDateUTC: string;
  IsSupplier: boolean;
  IsCustomer: boolean;
  HasAttachments: boolean;
  HasValidationErrors: boolean;
}

export interface Address {
  AddressType: AddressType;
  City: string;
  Region: string;
  PostalCode: string;
  Country: string;
}

export enum AddressType {
  Pobox = "POBOX",
  Street = "STREET",
}

export interface Phone {
  PhoneType: PhoneType;
  PhoneNumber: string;
  PhoneAreaCode: string;
  PhoneCountryCode: string;
}

export enum PhoneType {
  DDI = "DDI",
  Default = "DEFAULT",
  Fax = "FAX",
  Mobile = "MOBILE",
}
