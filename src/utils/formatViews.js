const formatViews = (count) => {
    if (count < 1000) return count.toString(); // Return count as string if less than 1000
    const units = ['k', 'M', 'B']; // Units for thousand, million, billion
    const index = Math.floor(Math.log10(count) / 3) - 1; // Determine the unit index
    const divisor = Math.pow(1000, index + 1); // Calculate the divisor
    return (count / divisor).toFixed(1).replace(/\.0$/, '') + units[index]; // Format the count and append the unit
};

export default formatViews; // Export the formatViews function as default
