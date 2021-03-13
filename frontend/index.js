window.onload = () => {
}

function nav(pageName) {
    const pages = document.querySelector(".page.active").classList.remove("active");
    document.querySelector(`.page#${pageName}`).classList.add("active");
}