
document.querySelectorAll(".btn").forEach(button => {
    console.log(button);
    button.addEventListener("click", function() {
        console.log(this);
        let id = this.id;
        if (id == "normal") {
            window.location.href = "normalbot.html";
        }
        if (id == "back-btn") {
            window.location.href = "index.html";
        }
        if (id == "player2") {
            window.location.href = "player2.html";
        }
        if (id == "hard") {
            window.location.href = "hardbot.html";
        }
    });
});