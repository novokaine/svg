const events = [{"id":"5da7e44876e3e19307d0dd39","start_time":1239451200,"stop_time":1242842400,"score":0.205,"tag":"do not investigate"},{"id":"5da7e44876e3e19307d0dd3a","start_time":1244505600,"stop_time":1252908000,"score":0.29587544254462034,"tag":null},{"id":"5da7e44876e3e19307d0dd3b","start_time":1253059200,"stop_time":1254571200,"score":0.11861788209990423,"tag":null},{"id":"5da7e44876e3e19307d0dd3c","start_time":1257379200,"stop_time":1260014400,"score":0.1883936145959299,"tag":null},{"id":"5da7e44876e3e19307d0dd3d","start_time":1261699200,"stop_time":1264377600,"score":0.1379366892148645,"tag":null},{"id":"5da7e44876e3e19307d0dd3e","start_time":1313539200,"stop_time":1351080000,"score":0.231,"tag":"normal"},{"id":"5da7e44876e3e19307d0dd3f","start_time":1351900800,"stop_time":1361037600,"score":0.118,"tag":"normal"},{"id":"5da7e44876e3e19307d0dd40","start_time":1415707200,"stop_time":1417197600,"score":0.396,"tag":"problem"},{"id":"5da7e44876e3e19307d0dd41","start_time":1418623200,"stop_time":1420135200,"score":0.309,"tag":"previously seen"}]

toTimestamp = function (strDate) {
    let datum = Date.parse(strDate);
    return datum / 1000;
};

function groupEvents() {
    const result = {};
    events.forEach(event => {
        const {start_time, stop_time} = event;
        const eventStartYear = new Date(start_time * 1000).getFullYear();
        const eventStopYear = new Date(stop_time * 1000).getFullYear();
        let currentYear = eventStartYear;

        while (currentYear <= eventStopYear) {
            const yearStartDate = toTimestamp(`01/01/${currentYear} 00:00:00`);
            const yearStopDate = toTimestamp(`12/31/${currentYear} 23:59:59`);
            const eventProps = {
                start_time: start_time >= yearStartDate ? start_time : yearStartDate,
                stop_time: stop_time <= yearStopDate ? stop_time : yearStopDate,
                tag: event.tag, 
                score: event.score
            }

            if (result[currentYear]) {
                result[currentYear]["events"][event.id] = eventProps;
            } else {
                result[currentYear] = {
                    events: {[event.id]: eventProps},
                    months: {}
                }
            }

            const eventStartMonth = new Date(result[currentYear].events[event.id].start_time * 1000).getMonth() + 1;
            const eventStopMonth = new Date(result[currentYear].events[event.id].stop_time * 1000).getMonth() + 1;
            let currentMonth = eventStartMonth;
            
            while (currentMonth <= eventStopMonth) {
                const maxDaysInMonth = new Date(currentYear, currentMonth, 0).getDate();
                const monthDateStart = self.toTimestamp(`${currentMonth}/01/${currentYear} 00:00:00`);
                const monthDateStop = self.toTimestamp(`${currentMonth }/${maxDaysInMonth}/${currentYear} 23:59:59`);
                
                let month = {
                    start_time: start_time >= monthDateStart ? start_time : monthDateStart,
                    stop_time: stop_time <= monthDateStop ? stop_time : monthDateStop,
                    days: {}
                };

                const eventStartDay = new Date(month.start_time * 1000).getDate();
                const eventStopDay = new Date(month.stop_time * 1000).getDate();
                let currentDay = eventStartDay;

                result[currentYear].months[currentMonth] = month;
                
                while (currentDay <= eventStopDay) {
                    const dayDateStart = self.toTimestamp(`${currentMonth}/${currentDay}/${currentYear} 00:00:00`);
                    const dayDateStop = self.toTimestamp(`${currentMonth}/${currentDay}/${currentYear} 23:59:59`);

                    let day = {
                        start_time: start_time >= dayDateStart ? start_time : dayDateStart,
                        stop_time: stop_time <= dayDateStop ? stop_time : dayDateStop
                    }

                    result[currentYear].months[currentMonth].days[currentDay] = day;
                    currentDay++;
                }
                currentMonth++;
            }
            currentYear++;
        }
    });
    return result;
}

const element = document.getElementById('events');
    var svgContainer = d3
        .select(element)
        .append("svg")
        .attr("width", 200)
        .attr("height", 200)

function drawEvent(distance) {
    var circle = svgContainer.append("circle")
        .attr("cx", 30 + distance)
        .attr("cy", 30 + distance)
        .attr("r", 20);

    // svg
    //     .append('path')
    //     .attr('class', 'feature-area radial-cursor')

}

const grouppedEvents = groupEvents();

/**
 * level: year, period: 2009,
 * level: month, period: {year, month};
 * level: day, period: {day, month, year}
 */

function getEventList(level, period) {
    const events = grouppedEvents;
    let filteredEvents = {};
    if(level === 'year') {
        filteredEvents = events[period]
    }
    if(level === 'month') {
        filteredEvents = events[period.year].months[04];
    }
    if(level === 'day') {
        debugger;
        filteredEvents = events[period.year].months[04].days[period.day]
    }

    return filteredEvents;
}

console.log(getEventList('year', '2009'));
console.log(getEventList('month', {year: '2009', month: 'Apr'}));
console.log(getEventList('day', {day: '01', month: 'Apr', year: '2009'}))


// for(var key in grouppedEvents) {
//     const events = grouppedEvents[key];
//     for (var eventKey in events) {

//         // if(eventKey === 'months') {
//         //     console.log('month level here')
//         // }
//         // if(eventKey === 'days') {
//         //     console.log('day level here')
//         // }
//     }
// }


