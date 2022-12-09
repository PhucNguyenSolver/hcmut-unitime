"use strict"

const THROTTLE_INTERVAL = 1000

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
    getStudentInfo: () => {
        try {
            const studentIdDisplayed = document
                .querySelector("#UniTimeGWT\\:Header > div > div.cell.middle > div.text.clickable")
                .innerText.replace("User: ", "")
            const semesterDisplayed = document
                .querySelector("#UniTimeGWT\\:Header > div > div.cell.right > div.text.clickable")
                .innerText.replace("Session: ", "")
            const academicProgramDisplayed = "DT"

            return {
                studentId: valueWrapper(studentIdDisplayed),
                academicProgram: valueWrapper(academicProgramDisplayed),
                semester: valueWrapper(semesterDisplayed),
            }
        } catch {
            return null
        }
    },
    showMessage: GWT.showMessage,
    showWarning: GWT.showWarning,
    btnEnabled: (btn) => (btn.style.display === "none" ? false : true),
    hideInitialButton: (btn) => (btn.hidden = true),
}

const Validation = {
    MSG_SUCCESS: "MSG_SUCCESS",
    validateCourseRequest: async (request) => {
        // const { student, requestedCourse } = request
        // return parseValidationResponse(rawFailResponse)
        return await Validation.randomValidateCourseRequest()
    },
    randomValidateCourseRequest: async () => {
        const failing = (reason) => ({ success: false, errors: [{ message: reason }] })
        const passing = (message) => ({ success: true, message: message })
        await Utils.sleep(1000)
        const choice = Utils.getRandomInt(0, 10)
        if (choice < 6) return failing("Thiếu môn tiên quyết")
        if (choice < 8) return failing("Chưa đóng học phí")
        return passing("Hợp lệ")
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
    const onClick = Utils.throttle(() => validateAndSubmit(btn), THROTTLE_INTERVAL)
    mockBtn.addEventListener("click", onClick, { passive: true })
    btn.parentNode.appendChild(mockBtn)
    Ui.hideInitialButton(btn)
}

function validateAndSubmit(initialButton) {
    const onError = (reason) => alert(reason)
    const successHandler = (res) => {
        const message = res.message.toString()
        Ui.showMessage(message)
        initialButton.click()
    }
    const failHandler = (res) => {
        Array.from(res.errors).forEach((error) => {
            const message = error.message.toString()
            Ui.showWarning(message)
        })
    }
    if (!Ui.btnEnabled(initialButton)) return onError("Button disabled")
    validate(successHandler, failHandler, onError)
}

async function validate(onSuccess, onFail, onError = () => {}, debug = false) {
    if (!onSuccess || !onFail) throw "callback functions are required"
    const request = {
        requestedCourse: Ui.getRequestedCourses(),
        student: Ui.getStudentInfo(),
    }
    debug && console.log(request)
    if (!quickCheckRequest(request)) throw "Error: please try again"
    Ui.showMessage("Validating..")
    Validation.validateCourseRequest(request)
        .then((resultObj) => {
            const success = resultObj.success // expect bool
            if (success === true) onSuccess(resultObj)
            else if (success === false) onFail(resultObj)
            else onError(`Invalid result object ${JSON.stringify(resultObj)}`)
        })
        .catch((err) => {
            onError(err || "Validate Error")
        })
}

function quickCheckRequest(request) {
    const quickCheckCourseList = (courses) => (!courses || courses?.length === 0 ? false : true)
    const quickCheckStudentInfo = (studentInfo) => true
    const { requestedCourse, student } = request
    return quickCheckStudentInfo(student) && quickCheckCourseList(requestedCourse)
}

function testValidate() {
    const onError = (reason) => alert(reason)
    const successHandler = (res) => {
        const message = res.message.toString()
        Ui.showMessage(message)
        alert(message)
    }
    const failHandler = (res) => {
        const message = res.error.message.toString()
        Ui.showWarning(message)
    }
    validate(successHandler, failHandler, onError, (debug = true))
}

Utils.sleep(1500).then(bind).catch(alert)
