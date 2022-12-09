"use strict"

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

const GWT = {
    showLoading: () => this?.showGwtLoading && showGwtLoading(),
    hideLoading: () => this?.hideGwtLoading && hideGwtLoading(),
    showMessage: (message) => this?.gwtShowMessage && gwtShowMessage(message?.toString() ?? ""),
    showWarning: (message) => this?.gwtShowWarning && gwtShowWarning(message?.toString() ?? ""),
    showDialog: (message, path = "gwt.jsp?page=sectioning") =>
        this?.showGwtDialog && showGwtDialog(message, path, "40%", "40%"),
}

const Ui = {
    getSchedulingAssistantTable: () => {
        return document.querySelector("#UniTimeGWT\\:Body > table") ?? null
    },
    getCourseRequestTab: () => {
        return document.querySelector("#UniTimeGWT\\:Body > table > tbody > tr:nth-child(2) > td > div") ?? null
    },
    getCurrentRegistrationButtons: () => {
        const label = "Current Registration"
        return document.querySelectorAll(`[aria-label="${label}"]`) ?? []
    },
    getSubmitScheduleButtons: () => {
        const label = "Submit Schedule"
        return document.querySelectorAll(`[aria-label="${label}"]`) ?? []
    },
    getBuildScheduleButtons: () => {
        const label = "Build Schedule"
        return document.querySelectorAll(`[aria-label="${label}"]`) ?? []
    },
    getSubmitRequestsButtons: () => {
        const label = "Submit Requests"
        return document.querySelectorAll(`[aria-label="${label}"]`) ?? []
    },
    _getButtons: () => [
        ...Ui.getSubmitRequestsButtons(),
        ...Ui.getBuildScheduleButtons(),
        ...Ui.getSubmitScheduleButtons(),
    ],
    makeOverlayButton: (title) => {
        let ele = document.createElement("div")
        ele.innerHTML = `<button type="button" style="min-width: 75px;">${title}</button>`
        return ele
    },
    getRequestedCourses: () => {
        let courseRequestLines = document.querySelectorAll("[class='unitime-CourseRequestLine']")
        const raw = Array.from(courseRequestLines).map((rl) => {
            const course = rl.querySelector(".line")?.querySelector("input[class='filter']")?.value
            const altCourse = rl.querySelector(".alt-line")?.querySelector("input[class='filter']")?.value
            return { course, altCourse }
        })
        const checkValidLine = (item) => item?.course !== undefined && item?.course !== ""
        const result = raw.filter(checkValidLine)
        return result
    },
    showMessage: GWT.showMessage,
    showWarning: GWT.showWarning,
    checkInitialButtonActiveOnPage: (btn) => !(btn.style.display === "none"),
    hideInitialButton: (btn) => (btn.hidden = true),
}

const Validation = {
    MSG_SUCCESS: "MSG_SUCCESS",
    validateCourseRequest: async (request) => {
        const { student, requestedCourse } = request
        return await Validation.randomValidateCourseRequest(request)
    },
    randomValidateCourseRequest: async () => {
        await Utils.sleep(1000)
        const choice = Utils.getRandomInt(0, 10)
        if (choice < 6) throw "Thiếu môn tiên quyết"
        if (choice < 8) throw "Chưa đóng học phí"
        return MSG_SUCCESS
    },
}

function bind() {
    if (Ui._getButtons().length === 0) throw "No buttons found"
    Array.from(Ui.getSubmitRequestsButtons()).forEach((b) => _bindValidatorButton(b, ".Submit Request"))
    Array.from(Ui.getBuildScheduleButtons()).forEach((b) => _bindValidatorButton(b, ".Build Schedule"))
    Array.from(Ui.getSubmitScheduleButtons()).forEach((b) => _bindValidatorButton(b, ".Submit Schedule"))
}

function _bindValidatorButton(btn, title) {
    const mockBtn = Ui.makeOverlayButton(title)
    const onClick = Utils.throttle(() => validateAndSubmit(btn), 3000)
    mockBtn.addEventListener("click", onClick, { passive: true })
    btn.parentNode.appendChild(mockBtn)
    Ui.hideInitialButton(btn)
}

function validateAndSubmit(initialButton) {
    if (!Ui.checkInitialButtonActiveOnPage(initialButton)) return alert("Button disabled")
    let request = {
        requestedCourse: Ui.getRequestedCourses(),
        student: null,
    }
    if (!quickCheckRequest(request)) return alert("Quick check failed")
    console.log({ request })
    Ui.showMessage(" validating...")
    Validation.validateCourseRequest(request)
        .then((result) => {
            Ui.showMessage(result)
            initialButton.click()
        })
        .catch((err) => {
            Ui.showWarning(err)
        })
}

function quickCheckRequest({ requestedCourse: courses }) {
    if (!courses || courses?.length === 0) return false
    return true
}

Utils.sleep(1500).then(bind).catch(alert)
