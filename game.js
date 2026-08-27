let player = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    speed: 5
};

let health = 100;
let chakra = 100;

const playerElement = document.getElementById("player");

function startGame() {

    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "block";

    updatePlayer();
}

document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    if (key === "w" || event.key === "arrowup") {
        player.y -= player.speed;
    }

    if (key === "s" || event.key === "arrowdown") {
        player.y += player.speed;
    }

    if (key === "a" || event.key === "arrowleft") {
        player.x -= player.speed;
    }

    if (key === "d" || event.key === "arrowright") {
        player.x += player.speed;
    }

    keepPlayerInsideMap();

    updatePlayer();
});

function keepPlayerInsideMap() {

    player.x = Math.max(
        30,
        Math.min(window.innerWidth - 30, player.x)
    );

    player.y = Math.max(
        70,
        Math.min(window.innerHeight - 30, player.y)
    );
}

function updatePlayer() {

    playerElement.style.left = player.x + "px";
    playerElement.style.top = player.y + "px";

    document.getElementById("health").textContent = health;
    document.getElementById("chakra").textContent = chakra;
}
