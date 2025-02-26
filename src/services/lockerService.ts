import { Locker, LockerUser } from '../types/types';

const API_URL = 'http://localhost:5006/api';

export const lockerService = {
  async getAllLockers(): Promise<Locker[]> {
    const response = await fetch(`${API_URL}/lockers`);
    if (!response.ok) {
      throw new Error('사물함 데이터를 가져오는데 실패했습니다.');
    }
    return response.json();
  },

  async initializeLockers(rows: number, cols: number): Promise<void> {
    const response = await fetch(`${API_URL}/lockers/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rows, cols }),
    });

    if (!response.ok) {
      throw new Error('사물함 초기화에 실패했습니다.');
    }
  },

  async assignUser(lockerId: string, user: Omit<LockerUser, 'id'>): Promise<void> {
    const response = await fetch(`${API_URL}/lockers/${lockerId}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error('사용자 등록에 실패했습니다.');
    }
  },

  async removeUser(lockerId: string): Promise<void> {
    const response = await fetch(`${API_URL}/lockers/${lockerId}/user`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('사용자 해제에 실패했습니다.');
    }
  }
}; 