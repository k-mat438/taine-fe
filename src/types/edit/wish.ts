export type Wish = {
  id: string;
  organization_id: string;
  title: string;
  note: string;
  order_no: number;
  created_at: string;
  updated_at: string;
}

export type WishesResponse = {
  wishes: Wish[];
}

export type ChecklistItem = {
  id: string;
  text: string;
  note?: string;
  checked: boolean;
  avatars: string[];
  subItems?: ChecklistItem[];
}