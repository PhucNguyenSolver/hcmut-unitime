"use strict"

const GWT = {
    showLoading: () => this?.showGwtLoading && showGwtLoading(),
    hideLoading: () => this?.hideGwtLoading && hideGwtLoading(),
    showMessage: (message) => this?.gwtShowMessage && gwtShowMessage(message?.toString() ?? ""),
    showWarning: (message) => this?.gwtShowWarning && gwtShowWarning(message?.toString() ?? ""),
    showDialog: (message, path = "gwt.jsp?page=sectioning") =>
        this?.showGwtDialog && showGwtDialog(message, path, "40%", "40%"),
}

const Utils = {
    getRandomInt: (min, max) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    },
    debounce: (fn, d) => {
        let timer
        return function () {
            clearTimeout(timer)
            timer = setTimeout(() => {
                fn.apply()
            }, d)
        }
    },
    throttle: (func, interval) => {
        let shouldFire = true
        return function () {
            if (shouldFire) {
                func()
                shouldFire = false
                setTimeout(() => {
                    shouldFire = true
                }, interval)
            }
        }
    },
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
}

const Query = {
    SchedulingAssistant: () => {
        return document.querySelector("#UniTimeGWT\\:Body > table") ?? null
    },
    CourseRequestTab: () => {
        return document.querySelector("#UniTimeGWT\\:Body > table > tbody > tr:nth-child(2) > td > div") ?? null
    },
    SubmitScheduleButtons: () => {
        const label = "Submit Schedule"
        return document.querySelectorAll(`[aria-label="${label}"]`) ?? []
    },
    CurrentRegistrationButton: () => {
        const label = "Current Registration"
        return document.querySelectorAll(`[aria-label="${label}"]`) ?? []
    },
    BuildScheduleButtons: () => {
        const label = "Build Schedule"
        return document.querySelectorAll(`[aria-label="${label}"]`) ?? []
    },
    SubmitRequestsButtons: () => {
        const label = "Submit Requests"
        return document.querySelectorAll(`[aria-label="${label}"]`) ?? []
    },
    Buttons: () => [
        ...Query.SubmitRequestsButtons(),
        ...Query.BuildScheduleButtons(),
        ...Query.SubmitScheduleButtons(),
    ],
}

function makeOverlayButton() {
    let ele = document.createElement("div")
    ele.innerHTML = `<button type="button" style="min-width: 75px;">Mock Submit</button>`
    return ele
}

const Validation = {
    validateCourseRequest: async ({ student, requestedCourse }) => {
        await Utils.sleep(3000)
        const choice = Utils.getRandomInt(0, 10)
        if (choice < 6) throw "Thiếu môn tiên quyết"
        if (choice < 8) throw "Chưa đóng học phí"
        return "OK"
    },
}

const notifySuccess = console.info
const notifyFailure = console.warn

const mock = () => {
    Validation.validateCourseRequest({})
        .then((result) => {
            notifySuccess(result)
        })
        .catch((err) => notifyFailure(err))
}

let btn

function bindSuccessfully() {
    let buttons = Query.Buttons()
    if (!buttons || buttons.length === 0) throw "Button to bind not found"
    // for (let btn of buttons) {
    btn = buttons[0]
    const mockBtn = makeOverlayButton()
    btn.parentNode.appendChild(mockBtn)
    btn.hidden = true
    // }

    const options = { passive: true }
    mockBtn.addEventListener("click", Utils.throttle(validateAndSubmit.bind(this), 3000), options)
}

function validateAndSubmit(e) {
    let request = getRequestedCourses()
    if (!quickCheckRequest(request)) return
    console.log({ request })
    GWT.showMessage(" validating...")
    Validation.validateCourseRequest({})
        .then((result) => {
            GWT.showMessage(result)
            btn.click()
        })
        .catch((err) => {
            GWT.showWarning(err)
        })
}

function quickCheckRequest(request) {
    if (!request || request?.length === 0) return false
    return true
}

Utils.sleep(2000).then(() => {
    try {
        bindSuccessfully()
        alert("JS injected")
    } catch (e) {
        alert("Something went wrong")
        console.error(e)
    }
})

function getRequestedCourses() {
    let courseRequestLines = document.querySelectorAll("[class='unitime-CourseRequestLine']")
    const raw = Array.from(courseRequestLines).map((rl) => {
        const course = rl.querySelector(".line")?.querySelector("input[class='filter']")?.value
        const altCourse = rl.querySelector(".alt-line")?.querySelector("input[class='filter']")?.value
        return { course, altCourse }
    })
    const checkValidLine = (item) => item?.course !== undefined && item?.course !== ""
    const result = raw.filter(checkValidLine)
    return result
}
