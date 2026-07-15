export interface Fund {
  id: string;
  name: string;
  amount: number;
  statement_day?: number;
  maturity_day: number;
  created_at: string;
}

export interface AddFundRequest {
  name: string;
  amount: number;
  statement_day?: number;
  maturity_day: number;
  interval_months?: number;
}
