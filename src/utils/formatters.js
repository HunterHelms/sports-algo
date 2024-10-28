export const formatYardage = (yards) => {
    if (!yards && yards !== 0) return 'N/A';
    return yards.toFixed(1);
};

export const formatRecord = (record) => {
    return record || 'N/A';
};
