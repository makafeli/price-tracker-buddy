export interface TLD {
  tld: string;
  type: string;
  description?: string;
  category?: string;
}

export type TLDType = 'gTLD' | 'ccTLD' | 'grTLD' | 'sTLD' | 'infrastructure' | 'test';