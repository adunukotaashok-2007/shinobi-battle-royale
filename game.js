/* =========================
   PLAYER
   ========================= */

let player = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    speed: 5,
    health: 100,
    chakra: 100
};


/* =========================
   ENEMY
   ========================= */

let enemy = {
    x: window.innerWidth * 0.70,
    y: window.innerHeight / 2,
    health: 100,
    speed: 1.2,
    attackRange: 70,
    attackCooldown: 0
};


/* =========================
   ELEMENTS
   ========================= */

const playerElement =
    document.getElementById("player");

const enemyElement =
    document.getElementById("enemy");

const messageElement =
    document.getElementById("message");


/* =========================
   START GAME
   ========================= */

function startGame() {

    document.getElementById("menu").style.display =
        "none";

    document.getElementById("game").style.display =
        "block";


    player.x =
        window.innerWidth / 2;

    player.y =
        window.innerHeight / 2;

    player.health = 100;

    player.chakra = 100;


    enemy.x =
        window.innerWidth * 0.70;

    enemy.y =
        window.innerHeight / 2;

    enemy.health = 100;

    enemy.attackCooldown = 0;


    enemyElement.style.display =
        "flex";


    updateHealth();

    updateEnemy();

    updatePlayer();


    messageElement.innerHTML =
        "WASD / Arrow Keys — Move<br>" +
        "SPACE — Throw Kunai";


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================
   PLAYER MOVEMENT
   ========================= */

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();


        if (
            key === "w" ||
            key === "arrowup"
        ) {

            player.y -= player.speed;

        }


        if (
            key === "s" ||
            key === "arrowdown"
        ) {

            player.y += player.speed;

        }


        if (
            key === "a" ||
            key === "arrowleft"
        ) {

            player.x -= player.speed;

        }


        if (
            key === "d" ||
            key === "arrowright"
        ) {

            player.x += player.speed;

        }


        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            attackEnemy();

        }


        keepPlayerInsideMap();

        updatePlayer();

    }
);


/* =========================
   PLAYER LIMIT
   ========================= */

function keepPlayerInsideMap() {

    player.x = Math.max(
        30,
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
   UPDATE PLAYER
   ========================= */

function updatePlayer() {

    playerElement.style.left =
        player.x + "px";

    playerElement.style.top =
        player.y + "px";

}


/* =========================
   UPDATE ENEMY
   ========================= */

function updateEnemy() {

    enemyElement.style.left =
        enemy.x + "px";

    enemyElement.style.top =
        enemy.y + "px";

}


/* =========================
   DISTANCE
   ========================= */

function getDistance() {

    const dx =
        player.x - enemy.x;

    const dy =
        player.y - enemy.y;

    return Math.sqrt(
        dx * dx +
        dy * dy
    );

}


/* =========================
   ENEMY AI
   ========================= */

function enemyAI() {

    if (enemy.health <= 0) {

        return;

    }


    const dx =
        player.x - enemy.x;

    const dy =
        player.y - enemy.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    /* Follow player */

    if (
        distance > enemy.attackRange
    ) {

        enemy.x +=
            (dx / distance) *
            enemy.speed;

        enemy.y +=
            (dy / distance) *
            enemy.speed;

    }


    /* Attack player */

    if (
        distance <= enemy.attackRange &&
        enemy.attackCooldown <= 0
    ) {

        damagePlayer();

        enemy.attackCooldown = 60;

    }


    if (
        enemy.attackCooldown > 0
    ) {

        enemy.attackCooldown--;

    }


    updateEnemy();

}


/* =========================
   ENEMY ATTACK
   ========================= */

function damagePlayer() {

    const damage = 10;

    player.health -= damage;


    if (player.health < 0) {

        player.health = 0;

    }


    updateHealth();


    playerElement.classList.remove(
        "player-hit"
    );


    void playerElement.offsetWidth;


    playerElement.classList.add(
        "player-hit"
    );


    if (player.health <= 0) {

        playerDefeated();

    }

}


/* =========================
   HEALTH
   ========================= */

function updateHealth() {

    document.getElementById(
        "health"
    ).textContent =
        player.health;

}


/* =========================
   PLAYER ATTACK
   ========================= */

function attackEnemy() {

    if (
        enemy.health <= 0 ||
        player.health <= 0
    ) {

        return;

    }


    const dx =
        enemy.x - player.x;

    const dy =
        enemy.y - player.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const attackRange = 350;


    if (
        distance > attackRange
    ) {

        messageElement.innerHTML =
            "❌ Enemy is too far away!<br>" +
            "Move closer.";

        return;

    }


    /* Create kunai */

    const kunai =
        document.createElement("div");

    kunai.className =
        "kunai";

    kunai.textContent =
        "🗡️";


    document.getElementById(
        "village"
    ).appendChild(kunai);


    let kunaiX =
        player.x;

    let kunaiY =
        player.y;


    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const velocityX =
        (dx / length) * 12;

    const velocityY =
        (dy / length) * 12;


    const projectile =
        setInterval(
            function() {

                kunaiX +=
                    velocityX;

                kunaiY +=
                    velocityY;


                kunai.style.left =
                    kunaiX + "px";

                kunai.style.top =
                    kunaiY + "px";


                const hitX =
                    enemy.x - kunaiX;

                const hitY =
                    enemy.y - kunaiY;


                const hitDistance =
                    Math.sqrt(
                        hitX * hitX +
                        hitY * hitY
                    );


                if (
                    hitDistance < 45
                ) {

                    clearInterval(
                        projectile
                    );

                    kunai.remove();

                    damageEnemy();

                }


                if (
                    kunaiX < 0 ||
                    kunaiX >
                    window.innerWidth ||
                    kunaiY < 0 ||
                    kunaiY >
                    window.innerHeight
                ) {

                    clearInterval(
                        projectile
                    );

                    kunai.remove();

                }

            },
            20
        );

}


/* =========================
   DAMAGE ENEMY
   ========================= */

function damageEnemy() {

    if (
        enemy.health <= 0
    ) {

        return;

    }


    enemy.health -= 20;


    if (
        enemy.health < 0
    ) {

        enemy.health = 0;

    }


    document.getElementById(
        "enemy-health-value"
    ).textContent =
        enemy.health;


    enemyElement.classList.remove(
        "enemy-hit"
    );


    void enemyElement.offsetWidth;


    enemyElement.classList.add(
        "enemy-hit"
    );


    if (
        enemy.health <= 0
    ) {

        enemyElement.style.display =
            "none";


        messageElement.innerHTML =
            "🔥 ENEMY DEFEATED!<br>" +
            "Press R to respawn.";

    }

}


/* =========================
   RESPAWN ENEMY
   ========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key.toLowerCase() === "r"
        ) {

            respawnEnemy();

        }

    }
);


function respawnEnemy() {

    if (
        player.health <= 0
    ) {

        restartGame();

        return;

    }


    enemy.health = 100;

    enemy.x =
        window.innerWidth * 0.70;

    enemy.y =
        window.innerHeight / 2;

    enemy.attackCooldown = 0;


    enemyElement.style.display =
        "flex";


    document.getElementById(
        "enemy-health-value"
    ).textContent =
        enemy.health;


    updateEnemy();


    messageElement.innerHTML =
        "WASD / Arrow Keys — Move<br>" +
        "SPACE — Throw Kunai";

}


/* =========================
   PLAYER DEFEATED
   ========================= */

function playerDefeated() {

    player.health = 0;

    updateHealth();


    messageElement.innerHTML =
        "💀 YOU WERE DEFEATED!<br>" +
        "Press R to restart.";

}


/* =========================
   RESTART GAME
   ========================= */

function restartGame() {

    player.health = 100;

    player.chakra = 100;


    player.x =
        window.innerWidth / 2;

    player.y =
        window.innerHeight / 2;


    enemy.health = 100;

    enemy.x =
        window.innerWidth * 0.70;

    enemy.y =
        window.innerHeight / 2;


    enemyElement.style.display =
        "flex";


    document.getElementById(
        "enemy-health-value"
    ).textContent =
        100;


    updateHealth();

    updatePlayer();

    updateEnemy();


    messageElement.innerHTML =
        "WASD / Arrow Keys — Move<br>" +
        "SPACE — Throw Kunai";

}


/* =========================
   GAME LOOP
   ========================= */

function gameLoop() {

    if (
        player.health > 0 &&
        enemy.health > 0
    ) {

        enemyAI();

    }


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================
   RESIZE
   ========================= */

window.addEventListener(
    "resize",
    function() {

        keepPlayerInsideMap();

        updatePlayer();

    }
);
