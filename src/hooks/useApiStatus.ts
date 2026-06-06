import { useState, useEffect } from 'react';
import { TourismApiService } from '@/lib/api';
import { HealthStatus, SystemStats } from '@/types/tourism';

export const useApiStatus = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [healthData, statsData] = await Promise.allSettled([
        TourismApiService.getHealthStatus(),
        TourismApiService.getSystemStats(),
      ]);

      if (healthData.status === 'fulfilled') {
        setHealth(healthData.value);
      }

      if (statsData.status === 'fulfilled') {
        setStats(statsData.value);
      }

      if (healthData.status === 'rejected' && statsData.status === 'rejected') {
        setError('Failed to connect to API');
      }
    } catch (err) {
      setError('Failed to fetch API status');
      console.error('API status error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return {
    health,
    stats,
    isLoading,
    error,
    refetch: checkStatus,
  };
};
