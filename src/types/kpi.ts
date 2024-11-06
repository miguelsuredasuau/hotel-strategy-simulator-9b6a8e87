export type KPIType = 'financial' | 'operational';

export interface KPI {
  uuid: string;
  created_at?: string;
  game_uuid?: string;
  name: string;
  type: KPIType;
  default_value?: string | number;
  description?: string;
  unit?: string;
  is_percentage?: boolean;
  formula?: string;
  depends_on?: string[];
  is_custom_variable?: boolean;
}