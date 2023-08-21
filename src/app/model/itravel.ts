export interface Itravel {
  id?: string;
  startDate?: Date;
  startHour?: string;
  endDate?: Date;
  endHour?: string;
  customer?: string;
  city?: string;
  breakfast?: boolean;
  launch?: boolean;
  dinner?: boolean;
  spendItem?: any[];
  docUrls?: string[];
  totalAmount?: number;
  user?: string;
  icon?: string;
  submitted?: boolean;
  paid?: boolean;
}
