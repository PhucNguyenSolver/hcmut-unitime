// rawRequest -> sampleRequest -> BE -> rawSuccessResponse/rawFailResponse -> sampleFailResponse
// (makeRequestBody) | (parseValidationResult)

const mockStudent = {
    studentId: 1915982,
    academicProgram: "DT",
    semester: 191,
}

const rawRequest = {
    requestedCourse: [
        { course: "ALG 101" },
        { course: "COM 101" },
        { course: "PSY 101" },
        { course: "ECON 101" },
        { course: "GER 101" },
        { course: "ENGL 101", altCourse: "SPAN 101" },
    ],
    student: mockStudent,
}

function makeRequestBody({ requestedCourse, student = mockStudent }) {
    if (!requestedCourse) return null
    return {
        studentId: mockStudent.studentId,
        academicProgram: mockStudent.academicProgram,
        semester: mockStudent.semester,
        registerSubjects: requestedCourse.map((i) => ({ subjectId: i.course })),
    }
}

const sampleRequest = {
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
        checkMinCreditResult: "Pass",
    },
}

const parseValidationResult = (response) => {
    const status = response?.data?.status
    if (status === "Fail") return _parseValidationFailResult(response)
    else if (status === "Pass")
        return {
            error: null,
            success: true,
        }
    throw `Invalid status ${response?.data?.status}`
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

const _parseValidationFailResult = (response) => {
    return {
        error: {
            detail: {
                title: "Lỗi",
                message: "VD: Thiếu môn tiên quyết",
            },
            code: 999,
        },
        success: false,
    }
}

const Model = {
    makeRequestBody,
    parseValidationResult,
    rawRequest,
    sampleFailResponse,
}

// export default Model
