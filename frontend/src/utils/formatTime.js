export const formatTime = (timeString, options = {}) => {
  if (!timeString) return '';
  
  // Try parsing as ISO string first
  let date = new Date(timeString);
  
  // If not ISO, try prepending a dummy date for parsing time strings like "14:30"
  if (isNaN(date.getTime())) {
    date = new Date(`1970-01-01T${timeString}`);
  }
  
  if (isNaN(date.getTime())) return timeString;

  const defaultOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    ...options
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
};

export default formatTime;
