import React from 'react';
import { Locker as LockerType, LockerGridConfig } from '../types/types';
import Locker from './Locker';

interface LockerGridProps {
  lockers: LockerType[];
  config: LockerGridConfig;
  onLockerClick: (locker: LockerType) => void;
}

const LockerGrid: React.FC<LockerGridProps> = ({ lockers, config, onLockerClick }) => {
  const grid = Array.from({ length: config.rows }, (_, row) =>
    Array.from({ length: config.cols }, (_, col) =>
      lockers.find(locker => locker.position.row === row && locker.position.col === col)
    )
  );

  return (
    <div className="p-4">
      <div className="grid gap-4" style={{
        gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
      }}>
        {grid.flat().map((locker, index) => (
          <div key={index} className="aspect-square">
            {locker ? (
              <Locker locker={locker} onClick={onLockerClick} />
            ) : (
              <div className="h-full bg-gray-100 rounded-lg"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LockerGrid; 