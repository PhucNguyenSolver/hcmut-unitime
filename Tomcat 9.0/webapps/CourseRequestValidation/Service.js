// parsedRequest -> BE -> rawSuccessResponse/rawFailResponse

const BASE_URL = "http://localhost:8000"
const courseCheckUrl = `${BASE_URL}/register_course/check`

const input = {
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

const outputFail = {
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
                        conditionType: 3,
                    },
                ],
            },
            {
                subjectId: "CO3",
                subjectName: "CCC",
                checkResult: "FAIL",
                failReasons: [
                    {
                        subjectDesId: "CO1",
                        conditionType: 1,
                    },
                ],
            },
        ],
        checkMinCreditResult: "PASS",
    },
}

function postValidation(jsonBody) {}

const Api = {
    postJSON: async (url, json) => {
        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
                "Content-Type": "text/plain",
                // "Access-Control-Allow-Origin": "*",
                // mode: "cors",
            },
            method: "POST",
            body: JSON.stringify(json),
        })
        return response.json()
    },
    get: async (url) => {
        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
            },
            method: "GET",
        })
        return response.json()
    },
    testGetApi: () => {
        const sampleGetUrl = "https://jsonplaceholder.typicode.com/todos/1"
        Api.get(sampleGetUrl)
            .then((json) => console.log(json))
            .catch(console.error)
    },
    testPostApi: (payload = input) => {
        Api.postJSON(courseCheckUrl, payload)
            .then((json) => console.log(json))
            .catch(console.error)
    },
}

function callCourseCheck(payload) {
    console.log("here you are", payload)
    return Api.postJSON(courseCheckUrl, payload)
}