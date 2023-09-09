// Select Elements
let countSpan = document.querySelector(".count span")
let bulletsElement = document.querySelector(".bullets .spans")
let quizArea = document.querySelector(".quiz-area")
let answerArea = document.querySelector(".answers-area")
let submitButton = document.querySelector(".submit-button")
let bulletsSpans = document.querySelector(".bullets")
let resultsSpans = document.querySelector(".results")
let countDownElement = document.querySelector(".countdown")


// Set Options
let currentIndex = 0
let mRightAnswer = 0
let countDownInterval


function getQuestions() {

    let request = new XMLHttpRequest()

    request.onreadystatechange = function () {

        if (this.readyState === 4 && this.status === 200) {

            let questions = JSON.parse(this.responseText)
            let questionsCount = questions.length
            console.log(questionsCount)

            // Create Bullets + Set Questions Count
            createBullets(questionsCount)

            // Add Question Data
            addQuestionData(questions[currentIndex], questionsCount)

            // Start CountDown
            countDown(5, questionsCount)

            // Click On Submit
            submitButton.onclick = () => {

                // Get Right Answer
                let rightAnswer = questions[currentIndex].right_answer

                // Increase Index
                currentIndex++

                // Check The Answer
                checkAnswers(rightAnswer, questionsCount)

                // Remove Previous Question
                quizArea.innerHTML = ""
                answerArea.innerHTML = ""

                // Add Question Data
                addQuestionData(questions[currentIndex], questionsCount)

                // Handle Bullets Class
                handleBullets()

                // Start CountDown
                clearInterval(countDownInterval)
                countDown(5, questionsCount)

                // Show Results
                showResults(questionsCount)
            }

        }
    }

    request.open("GET", "html_question.json", true)
    request.send()
}

getQuestions()

function createBullets(questionsNumber) {

    countSpan.innerHTML = questionsNumber

    // Create Spans
    for (i = 0; i < questionsNumber; i++) {

        // Create Bullet
        let bullets = document.createElement("span")

        // Check If Its First Span
        if (i === 0) {

            bullets.className = "on"
        }

        // Append Bullets To Main Bullet Element
        bulletsElement.appendChild(bullets)
    }
}

function addQuestionData(obj, count) {

    if (currentIndex < count) {

        // Create H2 Question Title
        let questionsTitle = document.createElement("h2")

        // Create Question Text
        let questionText = document.createTextNode(obj["title"])

        // Append Text To H2
        questionsTitle.appendChild(questionText)

        // Append The H2 To The Quiz Area
        quizArea.appendChild(questionsTitle)

        // Create The Answers
        for (i = 1; i <= 4; i++) {

            // Create Main Answer Div
            let mainDiv = document.createElement("div")

            // Add Class To Main Div
            mainDiv.className = "answer"

            // Create Radio Input
            let radioInput = document.createElement("input")

            // Add Type + Name + Id + Data-Attribute
            radioInput.name = 'question'
            radioInput.type = 'radio'
            radioInput.id = `answer_${i}`
            radioInput.dataset.answer = obj[`answer_${i}`]

            // Make First Option Selected
            if (i === 1) {

                radioInput.checked = true
            }

            // Create Label
            let label = document.createElement("label")

            // Add For Attribute
            label.htmlFor = `answer_${i}`

            // Create Label Text
            let labelText = document.createTextNode(obj[`answer_${i}`])

            // Add The Text To Label
            label.appendChild(labelText)

            // Add Input + Label To Main Div
            mainDiv.appendChild(radioInput)
            mainDiv.appendChild(label)

            // Append All Divs To Answers Area
            answerArea.appendChild(mainDiv)
        }
    }
}

function checkAnswers(mAnswer, mCount) {

    let answers = document.getElementsByName("question")
    let choosenAnswer

    for (let i = 0; i < answers.length; i++) {

        if (answers[i].checked) {
            choosenAnswer = answers[i].dataset.answer
        }
    }

    if (mAnswer === choosenAnswer) {

        mRightAnswer++;
        console.log("Good Answer")
    }
}

function handleBullets() {

    let bulletsSpans = document.querySelectorAll(".bullets .spans span")
    let arraySpans = Array.from(bulletsSpans)

    arraySpans.forEach((span, index) => {

        if (currentIndex === index) {

            span.className = "on"
        }
    })
}

function showResults(mCount) {

    let results

    if (currentIndex === mCount) {

        quizArea.remove()
        answerArea.remove()
        submitButton.remove()
        bulletsSpans.remove()

        if (mRightAnswer > mCount / 2 && mRightAnswer < mCount) {

            results = `<span class="good">Good</span>, ${mRightAnswer} From ${mCount}`

        } else if (mRightAnswer === mCount) {

            results = `<span class="perfect">Perfect</span>, All Answers is Good`

        } else {

            results = `<span class="bad">Bad</span>, ${mRightAnswer} From ${mCount}`
        }

        resultsSpans.innerHTML = results
        resultsSpans.style.padding = "10px"
        resultsSpans.style.backgroundColor = "white"
        resultsSpans.style.marginTop = "10px"

    }
}

function countDown(duration, count) {

    if (currentIndex < count) {

        let minutes, seconds

        countDownInterval = setInterval(() => {

            minutes = parseInt(duration / 60)
            seconds = parseInt(duration % 60)

            minutes = minutes < 10 ? `0${minutes}` : minutes
            seconds = seconds < 10 ? `0${seconds}` : seconds

            countDownElement.innerHTML = `${minutes}:${seconds}`

            if (--duration < 0) {

                clearInterval(countDownInterval)
                submitButton.click()

            }

        }, 1000)

    }

}