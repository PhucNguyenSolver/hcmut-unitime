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
        return document.querySelectorAll(`[aria-label="${label}"]`)
    },
    CurrentRegistrationButton: () => {
        const label = "Current Registration"
        return (
            document.querySelector(
                "#UniTimeGWT\\:Body > table > tbody > tr:nth-child(1) > td > div > div.left-panel > button:nth-child(5)"
            ) ?? null
        )
        // return document.querySelectorAll(`[aria-label="${label}"]`)
    },
    BuildScheduleButtons: () => {
        const label = "Build Schedule"
        return document.querySelectorAll(`[aria-label="${label}"]`)
    },
    Buttons: () => [...Query.SubmitScheduleButtons(), ...Query.BuildScheduleButtons()],
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

function bindSuccessfully() {
    const mockBtn = makeOverlayButton()
    const btn = Query.BuildScheduleButtons()[0]
    if (!btn) throw "Button to bind not found"
    btn.hidden = true
    btn.parentNode.appendChild(mockBtn)

    mockBtn.addEventListener("click", function (e) {
        GWT.showMessage(" validating...")
        Validation.validateCourseRequest({})
            .then((result) => {
                GWT.showMessage(result)
                btn.click()
            })
            .catch((err) => {
                GWT.showWarning(err)
            })
    })
}

Utils.sleep(500).then(() => {
    try {
        bindSuccessfully()
        // alert("JS injected hereee")
    } catch {
        alert("Something went wrong")
    }
})
