// This IS a hackathon. So hacky globals ensue.
let offsetLeft = 0;
let offsetRight = 0;

window.onload = () => {
    // Initialize buttons
    // I opted to use a For loop to get ALL the buttons and make them navigatable.
    const allToGame = document.getElementsByClassName("toPlay")
    for (let i = 0; i < allToGame.length; i++){
        allToGame[i].addEventListener("click", ()=>{nav("game")});
    }

    const allToScore = document.getElementsByClassName("toScore")
    for (let i = 0; i < allToScore.length; i++){
        allToScore[i].addEventListener("click", ()=>{nav("score")});
    }
}

function nav(pageName) {
    const pages = document.querySelector(".page.active").classList.remove("active");
    document.querySelector(`.page#${pageName}`).classList.add("active");
}

// Triggers a random movement event and update the UI to accomodate.
function triggerMovement() {
    // The state is one of eight possible 
    const state = Math.floor(Math.random() * 10) % 8;
    switch (state) {
        // Bull moves N.
        case 0:
            break;
        // Bull moves NE.
        case 1:
            break;
        // Bull moves E.
        case 2:
            break;
        // Bull moves SE.
        case 3:
            break;
        // Bull moves S.
        case 4:
            break;
        // Bull moves SW.
        case 5:
            break;
        // Bull moves W.
        case 6:
            break;
        // Bull moves NW.
        case 7:
            break;

    }
}