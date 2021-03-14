// Config
const api = "https://knightrider-307600.ue.r.appspot.com/";
const sensitivity = 5;
const platformSize = 35;

// This IS a hackathon. So hacky globals ensue.
let offsetVert = 0;
let offsetHoriz = 0;
let didGyroAsk = false;
let calVert = 0;
let calHoriz = 0;
let bullOffsetVert = 0;
let bullOffsetHoriz = 0;

let currentTime = 0;
let isPlaying = false;
let didConsent = false;

window.onload = () => {
    // High Score Counter
    if (Number(window.localStorage.getItem("hiScore")))
        document.getElementById("hiCount").innerText = `${window.localStorage.getItem("hiScore")} Seconds`;
    else
    document.getElementById("hiCount").innerText = `No scores!`;

    // Initialize buttons
    // I opted to use a For loop to get ALL the buttons and make them navigatable.
    const allToGame = document.getElementsByClassName("toPlay");
    for (let i = 0; i < allToGame.length; i++){
        allToGame[i].addEventListener("click", ()=>{nav("game")});
    }

    const allToScore = document.getElementsByClassName("toScore");
    for (i = 0; i < allToScore.length; i++){
        allToScore[i].addEventListener("click", ()=>{nav("score")});
    }

    const allToHome = document.getElementsByClassName("toHome");
    for (i = 0; i < allToHome.length; i++){
        allToHome[i].addEventListener("click", ()=>{nav("home")});
    }

    const allToSubmit = document.getElementsByClassName("toSubmit");
    for (i = 0; i < allToSubmit.length; i++){
        allToSubmit[i].addEventListener("click", ()=>{sellYourDataToUs(true)});
    }

    const allToSocial = document.getElementsByClassName("toSocial");
    for (i = 0; i < allToSocial.length; i++){
        allToSocial[i].addEventListener("click", ()=>{
            const shareStr = `I stayed on NotRocky for ${Math.floor(currentTime * 100) / 100} seconds on KnightRider!`;
            if (navigator.share)
                navigator.share({
                    title: "KnightRider",
                    url: "https://knightrider.tech/",
                    text: shareStr
                });
            else
                window.open(`https://twitter.com/intent/tweet?url=https%3A%2F%2Fknightrider.tech%2F&text=${encodeURI(shareStr)}&hashtags=KnightRider`, "_blank");
        });
    }
    
    // Bull movement.
    window.setInterval(triggerMovement, 25);

    // Game-end detection
    window.setInterval(gameEndCondition, 100);
}

function nav(pageName) {
    const pages = document.querySelector(".page.active").classList.remove("active");
    document.querySelector(`.page#${pageName}`).classList.add("active");

    // Enable gyro.
    if (pageName === "game" && !didGyroAsk) gyroRequest();

    // Start game
    if (pageName === "game") {
        currentTime = 0;
        isPlaying = true;
    }

    // Load high scores from server.
    if (pageName === "score") {
        fetch(api).then((resp) => {
            return resp.json();
        }).then((json) => {
            console.log(json)
            for (let i = 0; i < json.length; i++) {
                let score = json[i]["Score"];
                let name = json[i]["Name"];

                // We have the scores. Now do something with them!
                let row = document.createElement("tr");
                let placeEl = document.createElement("td")
                if (i % 10 === 0) placeEl.innerText = `${i + 1}st`;
                else if (i % 10 === 1 && !(i > 10 && i < 19)) placeEl.innerText = `${i + 1}nd`;
                else if (i % 10 === 2 && !(i > 10 && i < 19)) placeEl.innerText = `${i + 1}rd`;
                else placeEl.innerText = `${i + 1}th`;

                let nickEl = document.createElement("td");
                nickEl.innerText = name;

                let scoreEl = document.createElement("td");
                scoreEl.innerText = `${score} seconds`;

                // Append all these elements to the row element.
                row.append(placeEl);
                row.append(nickEl);
                row.append(scoreEl);
                document.querySelector("tbody").append(row);
            }
        });
    }
}

function gyroRequest() {
    // Gyro request code: https://trekhleb.dev/blog/2021/gyro-web/
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        // Handle iOS 13+ devices.
        DeviceMotionEvent.requestPermission().then((state) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', knightTilt);
            } else {
              console.error('Request to access the orientation was rejected');
            }
          })
          .catch(console.error);
      } else {
        // Handle regular non iOS 13+ devices.
        window.addEventListener('deviceorientation', knightTilt);
      }
}

function knightTilt(evt) {
    // Do nothing if not in game session.
    if (!isPlaying) return;

    const vert = evt.beta;
    const horiz = evt.gamma;

    if (!didGyroAsk) {
        // Calibration
        calVert = vert;
        calHoriz = horiz;
        didGyroAsk = true;
    }

    const diffVert = vert - calVert;
    const diffHoriz = horiz - calHoriz;

    if (diffVert < -sensitivity) offsetVert++;
    else if (diffVert > sensitivity) offsetVert--;

    if (diffHoriz > sensitivity) offsetHoriz++;
    else if (diffHoriz < -sensitivity) offsetHoriz--;

    const knightEl = document.querySelectorAll(".knight");
    for (let i = 0; i < knightEl.length; i++) {
        knightEl[i].style.bottom = `${offsetVert}px`;
        knightEl[i].style.left = `${offsetHoriz}px`;
    }
}

// Triggers a random movement event and update the UI to accomodate.
function triggerMovement() {
    if (!isPlaying) return;

    // The state is one of four possible.
    const state = Math.floor(Math.random() * 4);
    const mag = Math.floor(Math.random() * 10);
    switch (state) {
        // Bull moves N.
        case 0:
            bullOffsetVert += mag;
            break;
        // Bull moves E.
        case 1:
            bullOffsetHoriz += mag;
            break;
        // Bull moves S.
        case 2:
            bullOffsetVert -= mag;
            break;
        // Bull moves W.
        case 3:
            bullOffsetHoriz -= mag;
            break;
    }

    const bullEl = document.querySelectorAll(".bull");
    for (let i = 0; i < bullEl.length; i++) {
        bullEl[i].style.bottom = `${bullOffsetVert}px`;
        bullEl[i].style.left = `${bullOffsetHoriz}px`;
    }
}

function gameEndCondition() {
    // Overlap detection
    const overlap = (Math.abs(offsetHoriz - bullOffsetHoriz) < platformSize && Math.abs(offsetVert - bullOffsetVert) < platformSize)
    
    if (!isPlaying) {
        // do nothing.
    }else if (overlap) {
        currentTime += 0.1;
        document.getElementById("counter").innerText = `${String((Math.floor(currentTime * 100)/100))} sec`;
    } else {
        // Game over
        isPlaying = false;

        // Prepare "game over" screen
        document.getElementById("counterFin").innerText = `${String((Math.floor(currentTime * 100)/100))} sec`;
        let wittyStr = "Damn. Maybe we should misappropaite funds for you.";

        if (currentTime < 1) wittyStr = "Okay, that was depressing.";
        else if (currentTime < 2) wittyStr = "Hey, at least you’re better than USF’s football team.";
        else if (currentTime < 3) wittyStr = "Even Knugget the pony could do better than that.";
        else if (currentTime < 4) wittyStr = "Hey, at least you’re better than USF’s football team.";
        else if (currentTime < 5) wittyStr = "And you call yourself a \"national champion.\"";
        else if (currentTime < 6) wittyStr = "Not too shabby. Did you practice at FSU?";
        else if (currentTime < 7) wittyStr = "Maybe you should try with a Gator.";

        document.getElementById("ranking").innerText = wittyStr;
        nav("fall");

        // Reset our game environment
        bullOffsetVert = 0;
        bullOffsetHoriz = 0;
        offsetVert = 0;
        offsetHoriz = 0;

        const bullEl = document.querySelectorAll(".bull");
        for (let i = 0; i < bullEl.length; i++) {
            bullEl[i].style.bottom = `${bullOffsetVert}px`;
            bullEl[i].style.left = `${bullOffsetHoriz}px`;
        }

        const knightEl = document.querySelectorAll(".knight");
        for (i = 0; i < knightEl.length; i++) {
            knightEl[i].style.bottom = `${offsetVert}px`;
            knightEl[i].style.left = `${offsetHoriz}px`;
        }

        // High score detection
        let currentHi = window.localStorage.getItem("hiScore");
        if (!Number(currentHi))
            window.localStorage.setItem("hiScore", "0");

        if (Number(currentHi) < currentTime)
            window.localStorage.setItem("hiScore", String((Math.floor(currentTime * 100)/100)));
        
        document.getElementById("hiCount").innerText = `${window.localStorage.getItem("hiScore")} Seconds`;

        if (didConsent)
            sellYourDataToUs(false);
    }
}

function sellYourDataToUs(firstRun) {
    let score = Math.floor(currentTime * 100) / 100;
    let storedName;
    let storedNum
    if (firstRun) {
        storedName = document.querySelector('input[type="text"]').value;
        storedNum = document.querySelector('input[type="tel"]').value;

        window.localStorage.setItem("personName", storedName);
        window.localStorage.setItem("phoneNum", storedNum);
        didConsent = true;
    } else {
        storedName = window.localStorage.getItem("personName");
        storedNum = window.localStorage.getItem("phoneNum");
    }

    fetch(api + `post/?Name=${storedName}&Score=${score}&Phone=${storedNum}`).then((resp) => {
        return resp.json();
    }).then((json) => {
        const container = document.getElementById("signUp");
        container.innerHTML = "";
        const place = Number(json["Place"]);
        const el = document.createElement("h2");
        if (place % 10 === 0) el.innerText = `You ranked ${place}st place.`;
        else if (place % 10 === 1 && !(place > 10 && place < 19)) el.innerText = `You ranked ${place}nd place.`;
        else if (place % 10 === 2 && !(place > 10 && place < 19)) el.innerText = `You ranked ${place}rd place.`;
        else el.innerText = `You ranked ${place}th place.`;
        container.append(el);
    });
}