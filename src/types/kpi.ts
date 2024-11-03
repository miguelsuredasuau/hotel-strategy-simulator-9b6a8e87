export type KPICategory = 'operational' | 'financial';
export type KPIAxis = 'X' | 'Y';
export type KPIImpactType = 'value';
export type FinancialKPIType = 
  | 'rooms'
  | 'occupied_rooms'
  | 'adr'
  | 'extras_revenue'
  | 'variable_costs_percent'
  | 'fixed_costs'
  | 'investments';

export interface KPI {
  uuid: string;
  name: string;
  game_uuid?: string;
  impact_type: KPIImpactType;
  weight: number;
  default_value: number;
  axis: KPIAxis;
  category: KPICategory;
  is_customizable: boolean;
  created_at?: string;
  financial_type?: FinancialKPIType;
}

export interface KPIValue {
  uuid: string;
  kpi_uuid: string;
  game_uuid: string;
  turn_uuid?: string;
  value: number;
  created_at?: string;
}