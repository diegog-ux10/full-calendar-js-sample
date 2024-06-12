document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    const getCalendarData = async () => {
        const res = await fetch("./events.json")
        const data = await res.json()
        return data
    }

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: async (info, successCallback, failureCallback) => {
            try {
                const data = await getCalendarData()
                let events = data.events.map(({ eventTitle, eventStartDate, eventEndDate, eventUrl, eventLocation, eventStartTime, eventEndTime }) => {
                    return {
                        title: eventTitle,
                        start: new Date(eventStartDate),
                        end: new Date(eventEndDate),
                        url: eventUrl,
                        location: eventLocation,
                        timeStart: eventStartTime,
                        timeEnd: eventEndTime
                    }
                })

                successCallback(events)
            } catch (error) {
                failureCallback(error)
            }
        },

        eventContent: (info) => {
            return {
                html: `
                    <div class="eventContainer">
                        <div><strong>${info.event.title}</strong></div>
                        <div>Location: ${info.event.extendedProps.location}</div>
                        <div>Date: ${info.event.start.toLocaleDateString("es-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                })}</div>
                        <div>Time: ${info.event.extendedProps.timeStart} - ${info.event.extendedProps.timeEnd}</div>
                    </div>
                `
            }
        },

        eventMouseEnter: (mouseEnterInfo) => {
            const el = mouseEnterInfo.el
            el.classList.add('relative')

            const newEl = document.createElement('div')
            const newElTitle = mouseEnterInfo.event.title
            const newElLocation = mouseEnterInfo.event.extendedProps.location

            newEl.innerHTML = `
            <div class="hoverable-event">
                <div><strong>${newElTitle}</strong></div>
                <div>Location: ${newElLocation}</div>
                <div>Date: ${mouseEnterInfo.event.start.toLocaleDateString("es-US", {
                month: "long",
                day: "numeric",
                year: "numeric"
            })}</div>
                <div>Time: ${mouseEnterInfo.event.extendedProps.timeStart} - ${mouseEnterInfo.event.extendedProps.timeEnd}</div>
            </div>            
            `

            el.after(newEl)
        },

        eventMouseLeave: (mouseLeaveInfo) => {
            const el = document.querySelector('.hoverable-event')
           el.remove()
        }
    });

    calendar.render();

});  