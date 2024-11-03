export type KPICategory = 'operational' | 'financial';
export type KPIAxis = 'X' | 'Y';
export type KPIImpactType = 'value';

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
}