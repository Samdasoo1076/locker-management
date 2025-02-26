import React from 'react';
import { Locker as LockerType } from '../types/types';

interface LockerProps {
  locker: LockerType;
  onClick: (locker: LockerType) => void;
}

const Locker: React.FC<LockerProps> = ({ locker, onClick }) => {
  const statusColor = locker.status === 'available' ? 'bg-green-200' : 'bg-red-200';

  return (
    <div
      className={`p-4 border rounded-lg ${statusColor} cursor-pointer hover:opacity-80 transition-opacity`}
      onClick={() => onClick(locker)}
    >
      <div className="text-center">
        <div className="font-bold">#{locker.number}</div>
        {locker.status === 'occupied' && locker.user && (
          <div className="text-sm">
            <div className="font-medium">{locker.user.name}</div>
            {locker.user.studentId && (
              <div className="text-gray-600">{locker.user.studentId}</div>
            )}
            <div className="text-xs text-gray-500 mt-1">
              {new Date(locker.user.startDate).toLocaleDateString()} ~
              <br />
              {new Date(locker.user.endDate).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Locker; 