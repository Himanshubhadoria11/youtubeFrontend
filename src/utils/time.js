const time = (date) => {
    const diffInSeconds = Math.floor((new Date() - new Date(date)) / 1000); // Calculate the difference in seconds
    const intervals = [
      { unit: 'year', seconds: 365 * 24 * 60 * 60 }, // Seconds in a year
      { unit: 'month', seconds: 30 * 24 * 60 * 60 }, // Seconds in a month
      { unit: 'week', seconds: 7 * 24 * 60 * 60 }, // Seconds in a week
      { unit: 'day', seconds: 24 * 60 * 60 }, // Seconds in a day
      { unit: 'hour', seconds: 60 * 60 }, // Seconds in an hour
      { unit: 'minute', seconds: 60 }, // Seconds in a minute
    ];
  
    for (const { unit, seconds } of intervals) {
      if (diffInSeconds >= seconds) {
        const count = Math.floor(diffInSeconds / seconds); // Calculate the count of the unit
        return `${count} ${unit}${count > 1 ? 's' : ''} ago`; // Return the formatted time difference
      }
    }
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`; // Return seconds if less than a minute
};
  
export default time; // Export the time function as default
