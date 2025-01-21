export interface ISettings {
  client_id?: string;
  client_secret?: string;
};

export interface DPUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  titlePrefix: string;
  isDisabled: boolean;
  isAgent: boolean;
  isConfirmed: boolean;
  emails: string[];
  primaryEmail: string;
  customFields: Record<string, unknown>;
  language: string;
  locale: string;
};

export interface UserData {
  user: DPUser;
};

export interface DPOrganisation {
  id: string;
  name: string;
  summary: string;
  dateCreated: Date;
  customFields: Record<string, unknown>;
};

export interface OrganisationData {
  organisation: DPOrganisation;
};

export type ContextData = UserData|OrganisationData;
