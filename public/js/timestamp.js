const events =[{
    "id": "5da7d08776e3e19307d0dsdddbf4",
    "start_time": 1228219200,
    "stop_time": 1230249600,
    "score": 0.33920597762961086,
    "tag": null
}, {
    "id": "5da7d08776de3e19307d0dsddbf4",
    "start_time": 1230760799,
    "stop_time": 1262296799,
},
{
    "id": "5da7d08776de3e19307d0dsddbf4",
    "start_time": 1230760799,
    "stop_time": 1262296799,
},
 {
    "id": "5da7dd08776e3e19307d0dsddbf4",
    "start_time": 1238241600,
    "stop_time": 1240682400,
    "score": 0.149,
    "tag": "do not investigate"
},
{
    "id": "5dda7d08776e3e19307d0dsddbf4",
    "start_time": 1238241601,
    "stop_time": 1240682402,
    "score": 0.149,
    "tag": "do not investigate"
}
];

function groupEvents(){
let grouppedEvents =[]

const myEvents =  events.map(event => {
    groupEventTimestamp(event)
});
console.log(myEvents)

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
    result[currentYear] =  {
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



function secondGroupEvents(){
const result = {};
events.forEach(event => {
    const start_time = event.start_time;
    const stop_time = event.stop_time;

    const eventStartYear = new Date(start_time * 1000).getFullYear();
    const eventEndYear = new Date(stop_time * 1000).getFullYear();
    const yearStartDate = toTimestamp(`01/01/${eventStartYear} 00:00:00`);
    const yearStopDate = toTimestamp(`12/31/${eventEndYear} 23:59:59`);

    const eventStartMonth = new Date(start_time * 1000).getMonth() + 1;
    const eventStopMonth = new Date(stop_time * 1000).getMonth() + 1;

    let currentYear = eventStartYear;
    let currentMonth = eventStartMonth;

    while(currentYear <= eventStartYear){
        if(result.hasOwnProperty(currentYear)) {
            result[currentYear]["events"][event.id] = {start_time: event.start_time, stop_time: event.stop_time};
        } else {
            result[currentYear] =  {
                events: {
                    [event.id]: {
                        start_time: start_time >= yearStartDate ? start_time : yearStartDate,
                        stop_time: stop_time <= yearStopDate ? stop_time : yearStopDate,
                    }
                },
                children: {}
            }
        }

        while(currentMonth <= eventStopMonth) {
            const maxDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const monthDateStart = self.toTimestamp(`${eventStartMonth}/01/${currentYear} 00:00:00`);
            const monthDateEnd = self.toTimestamp(`${eventStartMonth}/${maxDaysInMonth}/${currentYear} 23:59:59`);

            let month = {
                start_time: start_time >= monthDateStart ? start_time : monthDateStart,
                stop_time: stop_time <= monthDateEnd ? stop_time : monthDateEnd,
                children:{} // yet to be added
            }

            result[currentYear].children[currentMonth] = month;
            currentMonth ++;
        }


        currentYear++;
    }
});
return result;
}

console.log(secondGroupEvents())