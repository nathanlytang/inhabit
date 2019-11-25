var calendar = new HelloWeek({
    daysSelected: ['2019-04-25', '2019-05-01', '2019-05-02', '2019-05-03'],
    multiplePick: true,
    onSelect: () => {
        console.log(calendar.getDays());
    }
});