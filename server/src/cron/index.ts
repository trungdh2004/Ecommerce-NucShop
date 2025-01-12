const rootCron = {
    timezone: 'Asia/Ho_Chi_Minh',
    jobSchedules: {
        job1: '59 23 * * *', // Ví dụ: chạy lúc 12 giờ đêm
        job2: '*/5 * * * *', // Ví dụ: chạy mỗi 5 phút
    }
}

export default rootCron