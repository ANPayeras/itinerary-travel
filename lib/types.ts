import { UUID } from "crypto";

export type Itinerary = {
  created_at: Date;
  date: string;
  description: string;
  id: number;
  link: string;
};

export type Itineraries = {
  date: string;
  itineraries: Itinerary[];
};

export type ModalProps = {
  open: boolean;
  closeModal: () => void;
  onSubmit: (formData: FormData, id?: number) => void;
  itinerary?: Itinerary;
  modalType?: string;
  modalData?: Partial<ModalEditData>;
};

export type Expense = {
  amount: string;
  created_at: string;
  detail: string;
  id: number;
};

export type Persons = {
  amount: string;
  created_at: string;
  name: string;
  id: number;
  diff?: number;
  text?: string;
  bgColor?: string;
};

export type Ids = {
  uuid: UUID;
  created_at: string;
  name: string;
  id: number;
};

export interface ModalEditData extends Persons, Expense {
  type: string;
}

export type TableControlsProps = {
  onDelete: () => void;
  onEdit: () => void;
};
