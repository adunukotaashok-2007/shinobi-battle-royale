/* =========================
   GAME VARIABLES
   ========================= */

let gameStarted = false;

let player = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,

    speed: 7,

    health: 100
};


/* =========================
   ENEMIES
   ========================= */

let enemies = [
    {
        id: 1,
        x: 150,
        y: 180,
        health: 100,
        speed: 1.2
    },

    {
        id: 2,
        x: window.innerWidth - 200,
        y: 180,
        health: 100,
        speed: 1.4
    },

    {
        id: 3,
        x: window.innerWidth - 200,
        y: window.innerHeight - 180,
        health: 100,
        speed: 1.0
    }
];


/* =========================
   GET HTML ELEMENTS
   ========================= */

const menu =
    document.getElementById("menu");

const game =
    document.getElementById("game");

const playerElement =
    document.getElementById("player");

const message =
    document.getElementById("message");


/* =========================
   START BUTTON
   ========================= */

document
    .getElementById("startButton")
    .addEventListener(
        "click",
        startGame
    );


/* =========================
   START GAME
   ========================= */

function startGame() {

    menu.style.display = "none";

    game.style.display = "block";

    gameStarted = true;


    player.x =
        window.innerWidth / 2;

    player.y =
        window.innerHeight / 2;

    player.health = 100;


    enemies[0].x = 150;
    enemies[0].y = 180;
    enemies[0].health = 100;

    enemies[1].x =
        window.innerWidth - 200;

    enemies[1].y = 180;

    enemies[1].health = 100;

    enemies[2].x =
        window.innerWidth - 200;

    enemies[2].y =
        window.innerHeight - 180;

    enemies[2].health = 100;


    updatePlayer();

    updateAllEnemies();

    updateHUD();


    message.innerHTML =
        "WASD / Arrow Keys = Move<br>" +
        "SPACE = Attack";


    requestAnimationFrame(gameLoop);
}


/* =========================
   KEYBOARD
   ========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (!gameStarted) {
            return;
        }


        let key =
            event.key.toLowerCase();


        if (
            key === "w" ||
            key === "arrowup"
        ) {

            player.y -=
                player.speed;

        }


        if (
            key === "s" ||
            key === "arrowdown"
        ) {

            player.y +=
                player.speed;

        }


        if (
            key === "a" ||
            key === "arrowleft"
        ) {

            player.x -=
                player.speed;

        }


        if (
            key === "d" ||
            key === "arrowright"
        ) {

            player.x +=
                player.speed;

        }


        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            attack();

        }


        keepPlayerInside();

        updatePlayer();

    }
);


/* =========================
   PLAYER POSITION
   ========================= */

function updatePlayer() {

    playerElement.style.left =
        player.x + "px";

    playerElement.style.top =
        player.y + "px";

}


/* =========================
   PLAYER LIMIT
   ========================= */

function keepPlayerInside() {

    player.x = Math.max(
        40,
        Math.min(
            window.innerWidth - 120,
            player.x
        )
    );


    player.y = Math.max(
        80,
        Math.min(
            window.innerHeight - 40,
            player.y
        )
    );

}


/* =========================
   UPDATE ENEMIES
   ========================= */

function updateAllEnemies() {

    enemies.forEach(
        function(enemy) {

            let element =
                document.getElementById(
                    "enemy" + enemy.id
                );


            element.style.left =
                enemy.x + "px";

            element.style.top =
                enemy.y + "px";

        }
    );

}


/* =========================
   ENEMY AI
   ========================= */

function moveEnemies() {

    enemies.forEach(
        function(enemy) {

            if (
                enemy.health <= 0
            ) {

                return;

            }


            let dx =
                player.x - enemy.x;

            let dy =
                player.y - enemy.y;


            let distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            /* CHASE */

            if (
                distance > 70
            ) {

                enemy.x +=
                    (dx / distance) *
                    enemy.speed;

                enemy.y +=
                    (dy / distance) *
                    enemy.speed;

            }


            /* ATTACK */

            if (
                distance <= 70
            ) {

                player.health -=
                    0.08;

                if (
                    player.health < 0
                ) {

                    player.health = 0;

                }

                updateHUD();

            }

        }
    );


    updateAllEnemies();

}


/* =========================
   PLAYER ATTACK
   ========================= */

function attack() {

    let target =
        findNearestEnemy();


    if (!target) {

        message.innerHTML =
            "🏆 ALL ENEMIES DEFEATED!";

        return;

    }


    let dx =
        target.x - player.x;

    let dy =
        target.y - player.y;


    let distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (
        distance > 450
    ) {

        message.innerHTML =
            "❌ Enemy is too far away!";

        return;

    }


    let kunai =
        document.createElement(
            "div"
        );


    kunai.className =
        "kunai";

    kunai.textContent =
        "🗡️";


    document
        .getElementById("village")
        .appendChild(kunai);


    let x =
        player.x;

    let y =
        player.y;


    let speed = 15;


    let vx =
        (dx / distance) *
        speed;

    let vy =
        (dy / distance) *
        speed;


    kunai.style.left =
        x + "px";

    kunai.style.top =
        y + "px";


    let timer =
        setInterval(
            function() {

                x += vx;
                y += vy;


                kunai.style.left =
                    x + "px";

                kunai.style.top =
                    y + "px";


                let hitX =
                    target.x - x;

                let hitY =
                    target.y - y;


                let hitDistance =
                    Math.sqrt(
                        hitX * hitX +
                        hitY * hitY
                    );


                if (
                    hitDistance < 50
                ) {

                    clearInterval(timer);

                    kunai.remove();

                    target.health -= 25;


                    if (
                        target.health < 0
                    ) {

                        target.health = 0;

                    }


                    updateEnemyHealth(
                        target
                    );


                    if (
                        target.health <= 0
                    ) {

                        defeatEnemy(
                            target
                        );

                    }

                }


                if (
                    x < 0 ||
                    x > window.innerWidth ||
                    y < 0 ||
                    y > window.innerHeight
                ) {

                    clearInterval(timer);

                    kunai.remove();

                }

            },
            20
        );

}


/* =========================
   FIND NEAREST ENEMY
   ========================= */

function findNearestEnemy() {

    let nearest = null;

    let nearestDistance =
        Infinity;


    enemies.forEach(
        function(enemy) {

            if (
                enemy.health <= 0
            ) {

                return;

            }


            let dx =
                enemy.x - player.x;

            let dy =
                enemy.y - player.y;


            let distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance < nearestDistance
            ) {

                nearestDistance =
                    distance;

                nearest =
                    enemy;

            }

        }
    );


    return nearest;

}


/* =========================
   ENEMY HEALTH
   ========================= */

function updateEnemyHealth(enemy) {

    let health =
        document.getElementById(
            "enemyHealth" +
            enemy.id
        );


    health.style.width =
        enemy.health + "%";

}


/* =========================
   DEFEAT ENEMY
   ========================= */

function defeatEnemy(enemy) {

    let element =
        document.getElementById(
            "enemy" +
            enemy.id
        );


    element.style.display =
        "none";


    updateHUD();


    let remaining =
        enemies.filter(
            function(enemy) {

                return enemy.health > 0;

            }
        ).length;


    message.innerHTML =
        "🔥 Enemy " +
        enemy.id +
        " defeated! " +
        remaining +
        " remaining.";


    if (
        remaining === 0
    ) {

        gameStarted = false;


        message.innerHTML =
            "🏆 YOU WIN! ALL ENEMIES DEFEATED!";

    }

}


/* =========================
   HUD
   ========================= */

function updateHUD() {

    document.getElementById(
        "health"
    ).textContent =
        Math.ceil(
            player.health
        );


    let remaining =
        enemies.filter(
            function(enemy) {

                return enemy.health > 0;

            }
        ).length;


    document.getElementById(
        "enemyCount"
    ).textContent =
        remaining;

}


/* =========================
   GAME LOOP
   ========================= */

function gameLoop() {

    if (!gameStarted) {
        return;
    }


    moveEnemies();


    if (
        player.health <= 0
    ) {

        gameStarted = false;


        message.innerHTML =
            "💀 YOU WERE DEFEATED! " +
            "Refresh the page to restart.";

        return;

    }


    requestAnimationFrame(
        gameLoop
    );

}
