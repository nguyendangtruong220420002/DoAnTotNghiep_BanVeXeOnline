export const generateDateRange = (baseDate, daysAfter = 30) => {
    const dates = [];
    const today = new Date();
    const startDate = new Date(baseDate);

    // Calculate days before based on the difference between selected date and today
    const differenceInTime = startDate.getTime() - today.getTime();
    const daysBefore = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    // Generate past dates only up to today
    for (let i = 0; i < daysBefore; i++) {
        const pastDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
        dates.push({
            date: pastDate.getDate(),
            day: ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][pastDate.getDay()],
            month: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', ' 12'][pastDate.getMonth()],
            fullDate: pastDate,
        });
    }

    // Add the base date (selected date)
    dates.push({
        date: startDate.getDate(),
        day: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ 7'][startDate.getDay()],
        month: ['1', ' 2', ' 3', ' 4', ' 5', ' 6', ' 7', ' 8', ' 9', '10', '11', ' 12'][startDate.getMonth()],
        fullDate: startDate,
    });

    // Generate future dates
    for (let i = 1; i <= daysAfter; i++) {
        const futureDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        dates.push({
            date: futureDate.getDate(),
            day: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ 7'][futureDate.getDay()],
            month: ['1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', '10', '11', 'Tháng 12'][futureDate.getMonth()],
            fullDate: futureDate,
        });
    }

    return dates;
};