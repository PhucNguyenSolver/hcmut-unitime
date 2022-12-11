// rawRequest -> parsedRequest -> BE -> rawSuccessResponse/rawFailResponse -> sampleFailResponse
// (makeRequestBody) | (parseValidationResponse)

const rawRequest = {
    requestedCourse: [
        { course: "ALG 101" },
        { course: "COM 101" },
        { course: "PSY 101" },
        { course: "ECON 101" },
        { course: "GER 101" },
        { course: "ENGL 101", altCourse: "SPAN 101" },
    ],
    student: {
        studentId: 1915982,
        academicProgram: "DT",
        semester: 191,
    },
}

function makeRequestBody({ requestedCourse, student }) {
    try {
        return {
            studentId: student.studentId,
            academicProgram: student.academicProgram,
            semester: student.semester,
            registerSubjects: requestedCourse.map((i) => ({ subjectId: i.course })),
        }
    } catch(e) {
        console.error(e)
        return null
    }
}

const parsedRequest = {
    studentId: 1915982,
    academicProgram: "DT",
    semester: 191,
    registerSubjects: [
        {
            subjectId: "CO2",
        },

        {
            subjectId: "CO3",
        },
    ],
}

const rawFailResponse = {
    data: {
        status: "FAIL",
        studentStatus: "NORMAL",
        subjectChecks: [
            {
                subjectId: "CO2",
                subjectName: "BBB",
                checkResult: "FAIL",
                failReasons: [
                    {
                        subjectDesId: "CO1",
                        conditionType: "3",
                    },
                ],
            },
        ],
        checkMinCreditResult: "PASS",
    },
}

const rawSuccessResponse = {
    data: {
        status: "PASS", // !?
        studentStatus: "NORMAL",
        subjectChecks: [
            {
                subjectId: "CO2",
                subjectName: "BBB",
                checkResult: "PASS",
            },
        ],
        checkMinCreditResult: "PASS",
    },
}

const failing = (reason) => ({ success: false, error: { message: reason } })
const passing = (message) => ({ success: true, message: message })

const parseValidationResponse = (response) => {
    const apiError = response?.error
    if (apiError) return _parseApiError(apiError)

    try {
        const status = response?.data?.status
        if (status === "PASS")
            return {
                errors: [],
                success: true,
                message: "..Hợp lệ..",
            }
        if (status === "FAIL") return _parseValidationFailResult(response)
        throw `Invalid status ${response?.data?.status}`
    } catch (e) {
        console.error(e)
        return null
    }
}

function _parseApiError(error) {
    let msg = `Đã có lỗi xảy ra. Vui lòng kiểm tra lại.` // fallback error
    const { code, reason, domain } = error
    if (reason === "NOT_FOUND_SUBJECT_ID") msg = `Không tìm thấy thông tin môn học. Vui lòng kiểm tra lại.`
    if (reason === "NOT_FOUND_STUDENT_STATUS") msg = `Không tìm thấy thông tin sinh viên. Vui lòng kiểm tra lại.`
    if (reason === "NOT_FOUND_MIN_CREDIT_CONFIG") msg = `Không tìm thấy số tín chỉ tối thiểu. Vui lòng kiểm tra lại.`

    return {
        success: false,
        errors: [
            {
                message: msg,
            },
        ],
    }
}

const sampleFailResponse = {
    error: {
        detail: {
            title: "Lỗi",
            message: "Thiếu môn tiên quyết",
        },
        code: 999,
    },
    success: false,
}

const sampleSuccessResponse = {
    error: null,
    success: true,
}

const _parseConditionType = (type) => {
    const dict = {}
    dict[1] = "tiên quyết" // ?!
    dict[2] = "học trước" // ?!
    dict[3] = "song hành" // ?!
    if (dict[type] === undefined) throw `Unknow condition type ${type}`
    return dict[type]
}
const _parseFailReasonsAsLines = (failReasons) => {
    let lines = ""
    Array.from(failReasons).forEach((aReason) => {
        const { subjectDesId, conditionType } = aReason
        const subjectName = valueWrapper(`name_of_${subjectDesId}`)
        // lines += `- thiếu môn ${_parseConditionType(conditionType)}: ${subjectDesId} \n`
        lines += `- thiếu môn ${_parseConditionType(conditionType)}: ${subjectName} \n`
    })
    console.log("fail reasons", lines)
    return lines
}

const _parseValidationFailResult = (response) => {
    const errorMessages = []

    console.log(response)
    const { studentStatus, checkMinCreditResult: minCreditStatus, subjectChecks = [] } = response?.data || {}

    if (studentStatus !== "NORMAL") errorMessages.push(`Thông tin sinh viên không hợp lệ: ${studentStatus}`)
    if (minCreditStatus !== "PASS") errorMessages.push(`Không đạt số tín chỉ tối thiểu`)

    const failedCourses = (subjectChecks || []).filter((item) => item.checkResult === "FAIL")
    Array.from(failedCourses).forEach((course) => {
        const { subjectId, subjectName, failReasons } = course
        const reason = `Không hợp lệ: ${subjectName}\n` + _parseFailReasonsAsLines(failReasons)
        console.log(reason)
        errorMessages.push(reason)
    })

    return {
        success: false,
        errors: errorMessages.map((text) => ({
            message: text,
        })),
    }
}

const Model = {
    makeRequestBody,
    parseValidationResponse,
    rawRequest,
    sampleFailResponse,
}

// export default Model
