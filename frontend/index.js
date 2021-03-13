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