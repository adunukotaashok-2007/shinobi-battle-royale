/* =========================
   PLAYER
   ========================= */

let player = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    speed: 5
};

let health = 100;
let chakra = 100;


/* =========================
   ENEMY
   ========================= */

let enemyHealth = 100;

let enemy = {
    x: window.innerWidth * 0.7,
    y: window.innerHeight / 2
};


/* =========================
   ELEMENTS
   ========================= */

const playerElement =
    document.getElementById("player");

const enemyElement =
    document.getElementById("enemy");


/* =========================
   START GAME
   ========================= */

function startGame() {

    document.getElementById("menu").style.display =
        "none";

    document.getElementById("game").style.display =
        "block";

    updatePlayer();
}


/* =========================
   MOVEMENT
   ========================= */

document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

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

    if (event.code === "Space") {

        event.preventDefault();

        attackEnemy();

    }

    keepPlayerInsideMap();

    updatePlayer();

});


/* =========================
   MAP LIMIT
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
   ATTACK
   ========================= */

function attackEnemy() {

    if (enemyHealth <= 0) {
        return;
    }


    /* Distance between player and enemy */

    const dx =
        enemy.x - player.x;

    const dy =
        enemy.y - player.y;

    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    /* Attack range */

    const attackRange = 300;


    if (distance > attackRange) {

        document.getElementById(
            "message"
        ).textContent =
            "❌ Too far away! Move closer to the enemy.";

        return;
    }


    /* Create kunai */

    const kunai =
        document.createElement("div");

    kunai.innerHTML = "🗡️";

    kunai.style.position = "absolute";

    kunai.style.left =
        player.x + "px";

    kunai.style.top =
        player.y + "px";

    kunai.style.fontSize = "28px";

    kunai.style.zIndex = "60";

    document.getElementById(
        "village"
    ).appendChild(kunai);


    /* Projectile direction */

    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    const speed = 12;

    const velocityX =
        (dx / length) * speed;

    const velocityY =
        (dy / length) * speed;


    let kunaiX = player.x;
    let kunaiY = player.y;


    /* Move kunai */

    const projectile =
        setInterval(function() {

            kunaiX += velocityX;
            kunaiY += velocityY;


            kunai.style.left =
                kunaiX + "px";

            kunai.style.top =
                kunaiY + "px";


            /* Distance to enemy */

            const hitX =
                enemy.x - kunaiX;

            const hitY =
                enemy.y - kunaiY;

            const hitDistance =
                Math.sqrt(
                    hitX * hitX +
                    hitY * hitY
                );


            /* HIT */

            if (hitDistance < 45) {

                clearInterval(projectile);

                kunai.remove();

                damageEnemy();

            }


            /* Remove projectile outside screen */

            if (
                kunaiX < 0 ||
                kunaiX > window.innerWidth ||
                kunaiY < 0 ||
                kunaiY > window.innerHeight
            ) {

                clearInterval(projectile);

                kunai.remove();

            }

        }, 20);

}


/* =========================
   DAMAGE ENEMY
   ========================= */

function damageEnemy() {

    const damage = 20;

    enemyHealth -= damage;


    if (enemyHealth < 0) {

        enemyHealth = 0;

    }


    document.getElementById(
        "enemy-health-value"
    ).textContent =
        enemyHealth;


    /* Enemy hit animation */

    enemyElement.style.transform =
        "translate(-50%, -50%) scale(1.4)";


    setTimeout(function() {

        enemyElement.style.transform =
            "translate(-50%, -50%) scale(1)";

    }, 150);


    /* Enemy defeated */

    if (enemyHealth === 0) {

        enemyElement.style.display =
            "none";

        document.getElementById(
            "message"
        ).innerHTML =
            "🔥 ENEMY DEFEATED!<br>Press R to respawn.";

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

    enemyHealth = 100;

    enemy.x =
        window.innerWidth * 0.7;

    enemy.y =
        window.innerHeight / 2;


    enemyElement.style.left =
        enemy.x + "px";

    enemyElement.style.top =
        enemy.y + "px";


    enemyElement.style.display =
        "block";


    document.getElementById(
        "enemy-health-value"
    ).textContent =
        enemyHealth;


    document.getElementById(
        "message"
    ).innerHTML =
        "WASD / Arrow Keys — Move<br>SPACE — Throw Kunai";

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
