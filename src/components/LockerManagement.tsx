import React, { useState, useEffect } from 'react';
import { Locker as LockerType, LockerGridConfig, LockerUser } from '../types/types';

interface LockerManagementProps {
  lockers: LockerType[];
  config: LockerGridConfig;
  onConfigChange: (config: LockerGridConfig) => void;
  onAssignUser: (lockerId: string, user: Omit<LockerUser, 'id'>) => void;
  onRemoveUser: (lockerId: string) => void;
  selectedLocker: LockerType | null;
  onClose: () => void;
}

const LockerManagement: React.FC<LockerManagementProps> = ({
  lockers,
  config,
  onConfigChange,
  onAssignUser,
  onRemoveUser,
  selectedLocker,
  onClose,
}) => {
  const [newUser, setNewUser] = useState<Partial<LockerUser>>({
    name: '',
    studentId: '',
  });

  useEffect(() => {
    if (selectedLocker?.user) {
      setNewUser({
        name: selectedLocker.user.name,
        studentId: selectedLocker.user.studentId || '',
      });
    } else {
      setNewUser({ name: '', studentId: '' });
    }
  }, [selectedLocker]);

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    onConfigChange({
      ...config,
      [name]: numValue
    });
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLocker) return;

    const user = {
      name: newUser.name || '',
      studentId: newUser.studentId,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
    };

    onAssignUser(selectedLocker.id, user);
    setNewUser({ name: '', studentId: '' });
    onClose();
  };

  if (!selectedLocker) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">사물함 배치 설정</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">행</label>
              <input
                type="number"
                name="rows"
                value={config.rows}
                onChange={handleConfigChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">열</label>
              <input
                type="number"
                name="cols"
                value={config.cols}
                onChange={handleConfigChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="1"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">사용 중인 사물함</h3>
          <div className="space-y-2">
            {lockers.filter(locker => locker.status === 'occupied').map(locker => (
              <div
                key={locker.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <span className="font-medium">#{locker.number}</span>
                  <span className="mx-2">-</span>
                  <span>{locker.user?.name}</span>
                  {locker.user?.studentId && (
                    <span className="text-gray-500 ml-2">({locker.user.studentId})</span>
                  )}
                </div>
                <button
                  onClick={() => onRemoveUser(locker.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  해제
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            사물함 #{selectedLocker.number} {selectedLocker.status === 'occupied' ? '수정' : '등록'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {selectedLocker.status === 'occupied' && (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <div className="text-sm">
              <div>현재 사용자: {selectedLocker.user?.name}</div>
              {selectedLocker.user?.studentId && (
                <div>학번: {selectedLocker.user.studentId}</div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {new Date(selectedLocker.user?.startDate || '').toLocaleDateString()} ~{' '}
                {new Date(selectedLocker.user?.endDate || '').toLocaleDateString()}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleUserSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                이름
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                학번
              </label>
              <input
                type="text"
                value={newUser.studentId}
                onChange={(e) => setNewUser(prev => ({ ...prev, studentId: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                disabled={!newUser.name}
              >
                {selectedLocker.status === 'occupied' ? '수정' : '등록'}
              </button>
              {selectedLocker.status === 'occupied' && (
                <button
                  type="button"
                  onClick={() => {
                    onRemoveUser(selectedLocker.id);
                    onClose();
                  }}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
                >
                  해제
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LockerManagement; 