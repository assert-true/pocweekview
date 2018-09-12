//data to display
const currentWeek = 38;
const courses = [
    {
        title: 'GTI',
        dates: [
            {
                weekday: 'Monday',
                from: '10:00',
                to: '12:00',
                date: '17.09.2018',
                kw: 38
            },
            {
                weekday: 'Thursday',
                from: '13:00',
                to: '16:00',
                date: '20.09.2018',
                kw: 38
            }]
    },
    {
        title: 'ESE',
        dates: [
            {
                weekday: 'Tuesday',
                from: '08:00',
                to: '10:00',
                date: '18.06.2018',
                kw: 38
            },
            {
                weekday: 'Friday',
                from: '10:00',
                to: '12:00',
                date: '21.09.2018',
                kw: 38
            }]
    },
    {
        title: 'Wirtschaftsinformatik',
        dates: [
            {
                weekday: 'Monday',
                from: '13:00',
                to: '15:00',
                date: '17.09.2018',
                kw: 38
            },
            {
                weekday: 'Thursday',
                from: '09:00',
                to: '11:00',
                date: '20.09.2018',
                kw: 38
            }]
    }
];

//Measures
const headerFontSize = 40;
const weekWidth = 800;
const weekHeight = 600;
const cellWidth = weekWidth / 6;
const cellHeight = 50;
const textAlignY = 30;
const timeSlotsNumber = 11;

//Colors
const emptySlotColor = "#ffefd5";
const assignedSlotColor = "#add8e6";
const lineColor = "#555555";

//global font
const fontFamily = 'Verdana';

//Main SVG
const svg = d3.select('#weekview').append('svg')
    .attr('width', weekWidth)
    .attr('height', weekHeight);


//render everything

drawWeek(svg);


//Level 0 ; Top hierarchy function
function drawWeek(svg) {
    drawTimeLabels(svg);
    drawHeader(svg);
    drawSlots(svg);
    drawAssignedSlots(svg);
}

//Level 1; Draw TimeLabels
function drawTimeLabels() {
    var i;
    var startTime = 8;
    for (i = 0; i < timeSlotsNumber; i++) {
        var group = svg.append('g');
        group.append('rect')
            .attr('x', 0)
            .attr('y', (i + 1) * cellHeight)
            .attr('width', cellWidth)
            .attr('height', cellHeight)
            .attr('fill', emptySlotColor)
            .attr('stroke', lineColor);
        group.append('text')
            .text(startTime + i + ' - ' + (startTime + i + 1))
            .attr('x', 50)
            .attr('y', (i + 1) * cellHeight + textAlignY)
            .attr('fill', lineColor)
            .attr('size', 33);
    }

}


//Level 1; Draw the first row with day names
function drawHeader(svg) {
    svg.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', emptySlotColor)
        .attr('stroke', lineColor);
    let i;
    const days = ['Mo', 'Tu', 'We', 'Th', 'Fr'];
    for (i = 0; i < 5; i++) {
        let group = svg.append('g');
        group.append('rect')
            .attr('x', (i + 1) * cellWidth)
            .attr('y', 0)
            .attr('width', cellWidth)
            .attr('height', cellHeight)
            .attr('fill', emptySlotColor)
            .attr('stroke', lineColor);
        group.append('text')
            .text(days[i])
            .attr('x', (i + 1.5) * cellWidth - 10)
            .attr('y', textAlignY)
            .attr('fill', lineColor)
            .attr('size', 33);
    }
}

//Level 1; Append all time slots including lectures
function drawSlots(svg) {
    let slots;
    let day;
    for (day = 1; day <= 5; day++) {
        for (slots = 0; slots < timeSlotsNumber; slots++) {
            svg.append('rect')
                .attr('x', day * cellWidth)
                .attr('y', (slots + 1) * cellHeight)
                .attr('width', cellWidth)
                .attr('height', cellHeight)
                .attr('fill', emptySlotColor)
                .attr('stroke', lineColor)
                .attr('stroke-dasharray', 2);
        }
    }


}

//Level 1; Overlay with assigned timeslots to courses
function drawAssignedSlots(svg) {

    const dates = courses
        .map((e) => e.dates.map((d) => ({...d, title: e.title})))
        .reduce((s, n) => ([...s, ...n]), [])
        .filter((e) => e.kw === currentWeek);

    let i;
    for(i = 0; i<dates.length; i++) {
        let group = svg.append('g');
        group.append('rect')
            .attr('x', evalX(dates[i].weekday))
            .attr('y', evalY(dates[i].from))
            .attr('width', cellWidth)
            .attr('height', evalHeight(dates[i].from, dates[i].to))
            .attr('fill', assignedSlotColor)
            .attr('stroke', lineColor);
        group.append('text')
            .text(dates[i].title)
            .attr('x', evalX(dates[i].weekday))
            .attr('y', evalY(dates[i].from)+textAlignY)
            .attr('fill', lineColor)
            .attr('size', 33);
    }
}

//Level 2; Compute x-coordinate of specific course
function evalX(weekday) {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    return (weekdays.indexOf(weekday) + 1) * cellWidth;
}

//Level 2; Compute y-coordinate of specific course
function evalY(startTime) {
    const y = parseInt(startTime.substring(0, 2)) - 8;
    return (y+1) * cellHeight;
}

//Level 2; Compute display height of specific course
function evalHeight(startTime, endTime) {
    const time = parseInt(endTime.substring(0, 2)) - parseInt(startTime.substring(0, 2));
    return time * cellHeight;
}
