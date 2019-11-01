const events =[{ 
        "id": "5da7d08776e3e19307d0dbf4", 
        "start_time": 1228219200, 
        "stop_time": 1230249600, 
        "score": 0.33920597762961086, 
        "tag": null 
    }, {
        "id": "5da7d08776e3e19307d0dbf4", 
        "start_time": 1230760799, 
        "stop_time": 1262296799,
    },
     { 
        "id": "5da7d08776e3e19307d0dbf5", 
        "start_time": 1238241600, 
        "stop_time": 1240682400, 
        "score": 0.149, 
        "tag": "do not investigate" 
    }
];

function groupEvents(){
    let grouppedEvents =[]
     
    events.forEach(event => {
        grouppedEvents.push(groupEventTimestamp(event))
    });
    console.log(grouppedEvents)
}

toTimestamp = function (strDate) {
    let datum = Date.parse(strDate);
    return datum / 1000;
};

let result = {};
let grouppedEvent = {};
function groupEventTimestamp(event) {
    const {start_time, stop_time} = event;
    

    const eventStartYear = new Date(start_time * 1000).getFullYear();
    const eventEndYear = new Date(stop_time * 1000).getFullYear();

    const yearStartDate = toTimestamp(`01/01/${eventStartYear} 00:00:00`);
    const yearStopDate = toTimestamp(`12/31/${eventEndYear} 23:59:59`);

    const eventStartMonth = new Date(start_time * 1000).getMonth() + 1;
    const eventStopMonth = new Date(stop_time * 1000).getMonth() + 1;

    const eventStartDay = new Date(start_time * 1000).getDate()
    const eventStopDay = new Date(stop_time * 1000).getDate();
    
    let currentYear = eventStartYear;
    let currentMonth = eventStartMonth;
    let currentDay = eventStartDay;

    while(currentYear <= eventEndYear) {
        debugger;
        result[currentYear] = {
            events: {
                [event.id]: {
                    start_time: start_time >= yearStartDate ? start_time : yearStartDate,
                    stop_time: stop_time <= yearStopDate ? stop_time : yearStopDate,
                },
            },
            children:[]
        };

        while(currentMonth <= eventStopMonth) {
            const maxDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const monthDateStart = self.toTimestamp(`${eventStartMonth}/01/${currentYear} 00:00:00`);
            const monthDateEnd = self.toTimestamp(`${eventStartMonth}/${maxDaysInMonth}/${currentYear} 23:59:59`);
            let month = {
                [currentMonth] :{
                    start_time: start_time >= monthDateStart ? start_time : monthDateStart,
                    stop_time: stop_time <= monthDateEnd ? stop_time : monthDateEnd
                }
            }

            // year[currentYear].children.push(month)
            currentMonth ++;
        }
        currentYear ++;
    }
    // console.log(result)
    return result;
}

groupEvents()