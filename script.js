let questionNumber = document.querySelector(".quiz-box .count span");
let bulletsBox = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answeesArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bulletsHolder = document.querySelector(".bullets");
let resaults = document.querySelector(".resaults");
let countDownHolder = document.querySelector(".count_down");


let page = 0;
let rgihtAnswer = 0;
let countTimeInterval;

function getQuestions(){
    let myReq = new XMLHttpRequest();

    myReq.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            let myQuestions = JSON.parse(this.responseText); 

            creatBullets(myQuestions.length);

            getData(myQuestions[page], myQuestions.length);

            countDown(60, myQuestions.length);

            submitButton.onclick= ()=>{
                let rightAnswer = myQuestions[page].right_answer;
                page++;
                checkAnswer(rightAnswer, myQuestions.length);

                quizArea.innerHTML='';
                answeesArea.innerHTML='';
                getData(myQuestions[page], myQuestions.length);

                changeBullets()

                clearInterval(countTimeInterval)
                countDown(60, myQuestions.length);

                showResults(myQuestions.length);
            }
        }
    }

    myReq.open("GET", "main.json" , true);
    myReq.send();

}

getQuestions();

function creatBullets(num){
    questionNumber.innerHTML= num;

    for(let i=0; i<num ; i++){

        let bullets = document.createElement('span');

        if(i === 0){
            bullets.className='on';
        }

        bulletsBox.appendChild(bullets);
    }
}

function getData(obj, count){
    if(page < count){
        let qTitle = document.createElement("h2");
        qTitle.appendChild(document.createTextNode(obj.title));

        quizArea.appendChild(qTitle);

        for (let i = 1; i <= 4; i++) {
        let answersDiv = document.createElement("div");
        answersDiv.className = "answer";

        // creat input radio
        let radioInput = document.createElement("input");
        radioInput.type = "radio";
        radioInput.name = "answer";
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];

        if (i === 1) {
            radioInput.checked = true;
        }

        // creat label
        let aLabel = document.createElement("label");
        aLabel.htmlFor = `answer_${i}`;
        aLabel.appendChild(document.createTextNode(obj[`answer_${i}`]));

        answersDiv.appendChild(radioInput);
        answersDiv.appendChild(aLabel);

        answeesArea.appendChild(answersDiv);
        }
    }
}

function checkAnswer(rAnswer ,  count){
    let answers = document.getElementsByName("answer");
    let chossenAnswer;
    for (let i = 0; i < answers.length; i++){
        if(answers[i].checked){
            chossenAnswer = answers[i].dataset.answer;
        }
    }
    if(rAnswer === chossenAnswer){
        rgihtAnswer++;
    }
}

function changeBullets(){
    let bulletSpans = document.querySelectorAll(".bullets .spans span");
    let arraySpans = Array.from(bulletSpans);
    arraySpans.forEach((span , index) =>{
        if (page === index) {
            span.className = "on";
        }
    })
}

function showResults(count){
    let theResault;
    if(page === count) {
        quizArea.remove();
        answeesArea.remove();
        submitButton.remove();
        bulletsHolder.remove();
        if (rgihtAnswer > count / 2 && rgihtAnswer < count) {
            theResault = `<p><span class="good">Good </span> , ${rgihtAnswer} from ${count} Yartha barkt 3leek ktk waksa</p> <img src='./images/good.jpg'>`;
        } else if (rgihtAnswer === count) {
            theResault = `<p><span class="perfect">perfect </span> , ${rgihtAnswer} from ${count} we yarytk fal7 fy el l3ba</p> <img src='./images/perfect.jpg'>`;
        } else {
            theResault = `<p><span class="bad">bad</span> , ${rgihtAnswer} from ${count} ana mesh htklm ymwkos ybn el mwkosa</p> <img src='./images/bad.jpg'>`;
        }

        resaults.innerHTML= theResault;
        resaults.style.padding = '20px';
        resaults.style.marginTop = '10px';
        resaults.style.backgroundColor = "#FCE09B";
    }
}

function countDown(duration , count){
    if(page < count){
        let minutes , seconds;
        countTimeInterval = setInterval(()=>{
            minutes = parseInt(duration / 60);
            seconds =parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;

            countDownHolder.innerHTML=`${minutes}:${seconds}`;

            if(--duration<0){
                clearInterval()
                submitButton.click();
            }
        },1000)
    }
}