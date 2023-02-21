export type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type APIArrayReturnTypes = IContact[] &
  IInvoice &
  IHistoryRecord &
  IPurchaseOrder &
  IQuote &
  IContact &
  Contact;

interface IDefaultList {
  Id: string;
  Status: string;
  ProviderName: string;
  DateTimeUTC: string;
}

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

export interface IContactList extends IDefaultList {
  Contacts: IContact[];
}

export interface IInvoiceList extends IDefaultList {
  Invoices: IInvoice[];
}
export interface IQuoteList extends IDefaultList {
  Quotes: IQuote[];
}

export interface IPurchaseOrderList extends IDefaultList {
  PurchaseOrders: IPurchaseOrder[];
}

export interface IHistoryRecordList extends IDefaultList {
  HistoryRecords: IHistoryRecord[];
}

export interface IHistoryRecord {
  Changes: string;
  DateUTCString: string;
  DateUTC: string;
  User: string;
  Details: string;
}

export interface IPurchaseOrder {
  PurchaseOrderID: string;
  Paid: number;
  PurchaseOrderNumber: string;
  DateString: string;
  Date: string;
  DeliveryAddress: string;
  AttentionTo: string;
  Telephone: string;
  DeliveryInstructions: string;
  HasErrors: boolean;
  IsDiscounted: boolean;
  Reference: string;
  Type: string;
  CurrencyRate: number;
  CurrencyCode: string;
  Contact: Contact;
  BrandingThemeID: string;
  Status: string;
  LineAmountTypes: string;
  LineItems: LineItem[];
  SubTotal: number;
  TotalTax: number;
  Total: number;
  UpdatedDateUTC: string;
  HasAttachments: boolean;
}

export interface LineItem {
  ItemCode: string;
  Description: string;
  UnitAmount: number;
  TaxType: string;
  TaxAmount: number;
  LineAmount: number;
  AccountCode: string;
  Quantity: number;
  LineItemID: string;
}

export interface IQuote {
  QuoteID: string;
  QuoteNumber: string;
  Reference: string;
  Terms: string;
  Contact: Contact;
  LineItems: LineItem[];
  Date: string;
  DateString: string;
  ExpiryDate: string;
  ExpiryDateString: string;
  Status: string;
  CurrencyRate: number;
  CurrencyCode: string;
  SubTotal: number;
  TotalTax: number;
  Total: number;
  TotalDiscount: number;
  Title: string;
  Summary: string;
  BrandingThemeID: string;
  UpdatedDateUTC: string;
  LineAmountTypes: string;
}

export interface LineItem {
  LineItemID: string;
  Description: string;
  UnitAmount: number;
  DiscountAmount: number;
  LineAmount: number;
  ItemCode: string;
  Quantity: number;
  TaxAmount: number;
}

export interface IContact {
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

export interface IInvoice {
  Type: string;
  InvoiceID: string;
  InvoiceNumber: string;
  Reference: string;
  AmountDue: number;
  AmountPaid: number;
  AmountCredited: number;
  CurrencyRate: number;
  IsDiscounted: boolean;
  HasAttachments: boolean;
  HasErrors: boolean;
  Contact: Contact;
  DateString: string;
  Date: string;
  DueDateString: string;
  DueDate: string;
  BrandingThemeID: string;
  Status: string;
  LineAmountTypes: string;
  LineItems: LineItem[];
  SubTotal: number;
  TotalTax: number;
  Total: number;
  UpdatedDateUTC: string;
  CurrencyCode: string;
}

export interface LineItem {
  ItemCode: string;
  Description: string;
  UnitAmount: number;
  TaxType: string;
  TaxAmount: number;
  LineAmount: number;
  AccountCode: string;
  Item: Item;
  Quantity: number;
  LineItemID: string;
}
export interface Contact {
  ContactID: string;
  ContactStatus: string;
  Name: string;
  FirstName: string;
  LastName: string;
  UpdatedDateUTC: string;
  DefaultCurrency: string;
  HasValidationErrors: boolean;
}

export interface Item {
  ItemID: string;
  Name: string;
  Code: string;
}
