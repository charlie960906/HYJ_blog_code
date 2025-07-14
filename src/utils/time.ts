export const calculateUptime = () => {
  // 設定為實際網站上線日期
  const startDate = new Date('2025-03-01T00:00:00');
  const now = new Date();
  const diff = now.getTime() - startDate.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return {
    days,
    hours,
    minutes,
    seconds
  };
};