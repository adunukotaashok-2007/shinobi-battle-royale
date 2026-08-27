/* =========================
   PLAYER
   ========================= */

let player = {

    x: window.innerWidth / 2,

    y: window.innerHeight / 2,

    speed: 5

};


/* =========================
   PLAYER STATS
   ========================= */

let health = 100;

let chakra = 100;


/* =========================
   ENEMY
   ========================= */

let enemy = {

    x: window.innerWidth * 0.70,

    y: window.innerHeight / 2,

    health: 100

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


    /* Put enemy in correct position */

    enemy.x =
        window.innerWidth * 0.70;

    enemy.y =
        window.innerHeight / 2;


    enemyElement.style.left =
        enemy.x + "px";

    enemyElement.style.top =
        enemy.y + "px";

    enemyElement.style.display =
        "flex";


    updatePlayer();

}


/* =========================
   PLAYER MOVEMENT
   ========================= */

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();


        /* UP */

        if (
            key === "w" ||
            key === "arrowup"
        ) {

            player.y -= player.speed;

        }


        /* DOWN */

        if (
            key === "s" ||
            key === "arrowdown"
        ) {

            player.y += player.speed;

        }


        /* LEFT */

        if (
            key === "a" ||
            key === "arrowleft"
        ) {

            player.x -= player.speed;

        }


        /* RIGHT */

        if (
            key === "d" ||
            key === "arrowright"
        ) {

            player.x += player.speed;

        }


        /* ATTACK */

        if (event.code === "Space") {

            event.preventDefault();

            attackEnemy();

        }


        /* Keep player inside village */

        keepPlayerInsideMap();

        updatePlayer();

    }
);


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
   ATTACK ENEMY
   ========================= */

function attackEnemy() {

    if (enemy.health <= 0) {

        return;

    }


    /* Distance */

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

    const attackRange = 350;


    if (distance > attackRange) {

        document.getElementById(
            "message"
        ).innerHTML =
            "❌ Enemy is too far away!<br>Move closer.";

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


    /* Direction */

    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const velocityX =
        (dx / length) * 12;

    const velocityY =
        (dy / length) * 12;


    kunai.style.left =
        kunaiX + "px";

    kunai.style.top =
        kunaiY + "px";


    /* Projectile movement */

    const projectile =
        setInterval(
            function() {

                kunaiX += velocityX;

                kunaiY += velocityY;


                kunai.style.left =
                    kunaiX + "px";

                kunai.style.top =
                    kunaiY + "px";


                /* Check hit */

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


                /* Outside screen */

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

    enemy.health -= 20;


    if (enemy.health < 0) {

        enemy.health = 0;

    }


    document.getElementById(
        "enemy-health-value"
    ).textContent =
        enemy.health;


    /* Hit animation */

    enemyElement.classList.remove(
        "enemy-hit"
    );


    void enemyElement.offsetWidth;


    enemyElement.classList.add(
        "enemy-hit"
    );


    /* Enemy defeated */

    if (enemy.health === 0) {

        enemyElement.style.display =
            "none";


        document.getElementById(
            "message"
        ).innerHTML =
            "🔥 ENEMY DEFEATED!<br>Press R to respawn.";

    }

}


/* =========================
   RESPAWN
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

    enemy.health = 100;


    enemy.x =
        window.innerWidth * 0.70;

    enemy.y =
        window.innerHeight / 2;


    enemyElement.style.left =
        enemy.x + "px";

    enemyElement.style.top =
        enemy.y + "px";


    enemyElement.style.display =
        "flex";


    document.getElementById(
        "enemy-health-value"
    ).textContent =
        enemy.health;


    document.getElementById(
        "message"
    ).innerHTML =
        "WASD / Arrow Keys — Move<br>SPACE — Attack";

}


/* =========================
   WINDOW RESIZE
   ========================= */

window.addEventListener(
    "resize",
    function() {

        enemy.x =
            window.innerWidth * 0.70;

        enemy.y =
            window.innerHeight / 2;


        enemyElement.style.left =
            enemy.x + "px";

        enemyElement.style.top =
            enemy.y + "px";


        keepPlayerInsideMap();

        updatePlayer();

    }
);
