export enum Kinds {
  salesman = 'salesman',
  buyer = 'buyer',
}

export interface ITokenPayload {
  id: number;
  name: string;
  kind: Kinds;
}

export interface IAccessToken {
  access_token: string;
}
