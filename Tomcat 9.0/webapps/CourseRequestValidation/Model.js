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
    } catch {
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
        status: "Fail",
        studentStatus: "NORMAL",
        subjectChecks: [
            {
                subjectId: "CO2",
                subjectName: "BBB",
                checkResult: "Fail",
                failReasons: [
                    {
                        subjectDesId: "CO1",
                        conditionType: "3",
                    },
                ],
            },
        ],
        checkMinCreditResult: "Pass",
    },
}

const rawSuccessResponse = {
    data: {
        status: "Pass", // !?
        studentStatus: "NORMAL",
        subjectChecks: [
            {
                subjectId: "CO2",
                subjectName: "BBB",
                checkResult: "Pass",
            },
        ],
        checkMinCreditResult: "Pass",
    },
}

const failing = (reason) => ({ success: false, error: { message: reason } })
const passing = (message) => ({ success: true, message: message })

const parseValidationResponse = (response) => {
    try {
        const status = response?.data?.status
        if (status === "Pass")
            return {
                errors: [],
                success: true,
                message: "..Hợp lệ..",
            }
        if (status === "Fail") return _parseValidationFailResult(response)
        throw `Invalid status ${response?.data?.status}`
    } catch (e) {
        console.warn(e)
        return null
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

const _parseValidationFailResult = (response = rawFailResponse) => {
    const errorMessages = ["Fail this", "fail that"]

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
