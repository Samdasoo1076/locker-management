export interface LockerUser {
  id: string;
  name: string;
  studentId?: string;
  startDate: Date;
  endDate: Date;
}

export interface Locker {
  id: string;
  number: number;
  position: {
    row: number;
    col: number;
  };
  status: 'available' | 'occupied';
  user?: LockerUser;
}

export interface LockerGridConfig {
  rows: number;
  cols: number;
} 