import React, { useState, useEffect } from 'react';
import './App.css';
import { Locker as LockerType, LockerGridConfig } from './types/types';
import LockerGrid from './components/LockerGrid';
import LockerManagement from './components/LockerManagement';
import { lockerService } from './services/lockerService';

function App() {
  const [config, setConfig] = useState<LockerGridConfig>({
    rows: 5,
    cols: 6
  });

  const [lockers, setLockers] = useState<LockerType[]>([]);
  const [selectedLocker, setSelectedLocker] = useState<LockerType | null>(null);

  useEffect(() => {
    loadLockers();
  }, []);

  const loadLockers = async () => {
    try {
      const loadedLockers = await lockerService.getAllLockers();
      setLockers(loadedLockers);
    } catch (error) {
      console.error('사물함 데이터 로딩 실패:', error);
      // 초기 데이터가 없는 경우 새로 생성
      await lockerService.initializeLockers(config.rows, config.cols);
      const newLockers = await lockerService.getAllLockers();
      setLockers(newLockers);
    }
  };

  const handleConfigChange = async (newConfig: LockerGridConfig) => {
    setConfig(newConfig);
    await lockerService.initializeLockers(newConfig.rows, newConfig.cols);
    await loadLockers();
  };

  const handleLockerClick = (locker: LockerType) => {
    setSelectedLocker(locker);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">사물함 관리 시스템</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">사물함 배치도</h2>
            <LockerGrid 
              lockers={lockers} 
              config={config} 
              onLockerClick={handleLockerClick} 
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">관리 패널</h2>
            <LockerManagement 
              lockers={lockers}
              config={config}
              onConfigChange={handleConfigChange}
              onAssignUser={async (lockerId, user) => {
                await lockerService.assignUser(lockerId, user);
                await loadLockers();
              }}
              onRemoveUser={async (lockerId) => {
                await lockerService.removeUser(lockerId);
                await loadLockers();
              }}
              selectedLocker={selectedLocker}
              onClose={() => setSelectedLocker(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
