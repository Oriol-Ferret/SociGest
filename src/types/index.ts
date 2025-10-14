export interface Soci {
  id: string;
  nom: string;
  cognoms: string;
  email: string;
  tel?: string;
  status: 'actiu' | 'baixa' | 'pendent';
}

export interface Mandat {
  id: string;
  soci_id: string;
  iban: string;
  bic?: string;
  mandate_reference: string;
  sign_date: string;
  sequence: 'FRST' | 'RCUR' | 'OOFF' | 'FNAL';
  actiu: boolean;
}

export interface Quote {
  id: string;
  soci_id: string;
  import_cents: number;
  concepte: string;
  periode: string; // "YYYY-MM"
  estat: 'pendent' | 'enviada' | 'cobrada' | 'retornada';
}

export interface RemesaLine {
  id: string;
  remesa_id: string;
  soci_id: string;
  quote_id: string;
  amount_cents: number;
  end_to_end_id: string;
  sequence: 'FRST' | 'RCUR' | 'OOFF' | 'FNAL';
}

export interface Remesa {
  id: string;
  execution_date: string;
  creditor_name: string;
  creditor_iban: string;
  creditor_id: string;
  total_cents: number;
  estat: 'esborrany' | 'generada' | 'enviada';
  xml_url?: string;
}
