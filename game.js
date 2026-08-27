/* =========================
   PLAYER
   ========================= */

let player = {

    x: window.innerWidth * 0.25,

    y: window.innerHeight / 2,

    speed: 6,

    health: 100,

    chakra: 100

};


/* =========================
   ENEMY
   ========================= */

let enemy = {

    x: window.innerWidth * 0.75,

    y: window.innerHeight / 2,

    health: 100,

    speed: 1.5,

    attackRange: 75,

    attackCooldown: 0

};


/* =========================
   GAME
   ========================= */

let gameRunning = false;


/* =========================
   ELEMENTS
   ========================= */

const playerElement =
    document.getElementById("player");

const enemyElement =
    document.getElementById("enemy");

const enemyCharacter =
    document.getElementById("enemy-character");

const message =
    document.getElementById("message");


/* =========================
   START GAME
   ========================= */

function startGame() {

    document.getElementById("menu").style.display =
        "none";

    document.getElementById("game").style.display =
        "block";

    document.getElementById("game-over").style.display =
        "none";


    resetGame();


    gameRunning = true;


    message.innerHTML =
        "WASD / Arrow Keys — Move<br>" +
        "SPACE — Throw Kunai";


    requestAnimationFrame(gameLoop);

}


/* =========================
   RESET GAME
   ========================= */

function resetGame() {

    player.x =
        window.innerWidth * 0.25;

    player.y =
        window.innerHeight / 2;

    player.health = 100;

    player.chakra = 100;


    enemy.x =
        window.innerWidth * 0.75;

    enemy.y =
        window.innerHeight / 2;

    enemy.health = 100;

    enemy.attackCooldown = 0;


    enemyElement.style.display =
        "block";


    updatePlayer();

    updateEnemy();

    updateHUD();

    updateEnemyHealth();

}


/* =========================
   KEYBOARD
   ========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (!gameRunning) {

            return;

        }


        const key =
            event.key.toLowerCase();


        /* UP */

        if (
            key === "w" ||
            key === "arrowup"
        ) {

            player.y -=
                player.speed;

        }


        /* DOWN */

        if (
            key === "s" ||
            key === "arrowdown"
        ) {

            player.y +=
                player.speed;

        }


        /* LEFT */

        if (
            key === "a" ||
            key === "arrowleft"
        ) {

            player.x -=
                player.speed;

        }


        /* RIGHT */

        if (
            key === "d" ||
            key === "arrowright"
        ) {

            player.x +=
                player.speed;

        }


        /* ATTACK */

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
        40,
        Math.min(
            window.innerWidth - 130,
            player.x
        )
    );


    player.y = Math.max(
        90,
        Math.min(
            window.innerHeight - 60,
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

    if (
        enemy.health <= 0 ||
        player.health <= 0
    ) {

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


    /* =========================
       CHASE PLAYER
       ========================= */

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


    /* =========================
       ATTACK PLAYER
       ========================= */

    if (
        distance <= enemy.attackRange
    ) {

        if (
            enemy.attackCooldown <= 0
        ) {

            enemyAttack();

            enemy.attackCooldown =
                60;

        }

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

function enemyAttack() {

    const damage = 10;


    player.health -=
        damage;


    if (
        player.health < 0
    ) {

        player.health = 0;

    }


    updateHUD();


    /* Attack animation */

    enemyCharacter.classList.remove(
        "enemy-attacking"
    );


    void enemyCharacter.offsetWidth;


    enemyCharacter.classList.add(
        "enemy-attacking"
    );


    /* Player hit */

    playerElement.classList.remove(
        "player-hit"
    );


    void playerElement.offsetWidth;


    playerElement.classList.add(
        "player-hit"
    );


    message.innerHTML =
        "⚔️ ENEMY ATTACKED YOU!";


    /* Game over */

    if (
        player.health <= 0
    ) {

        playerDefeated();

    }

}


/* =========================
   UPDATE HUD
   ========================= */

function updateHUD() {

    document.getElementById(
        "health"
    ).textContent =
        player.health;


    document.getElementById(
        "chakra"
    ).textContent =
        player.chakra;

}


/* =========================
   ATTACK ENEMY
   ========================= */

function attackEnemy() {

    if (
        !gameRunning ||
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


    const attackRange =
        400;


    /* Too far */

    if (
        distance > attackRange
    ) {

        message.innerHTML =
            "❌ Too far away! Move closer.";

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
        (dx / length) * 15;

    const velocityY =
        (dy / length) * 15;


    kunai.style.left =
        kunaiX + "px";

    kunai.style.top =
        kunaiY + "px";


    /* Projectile */

    const projectile =
        setInterval(
            function() {

                if (
                    enemy.health <= 0
                ) {

                    clearInterval(
                        projectile
                    );

                    kunai.remove();

                    return;

                }


                kunaiX +=
                    velocityX;

                kunaiY +=
                    velocityY;


                kunai.style.left =
                    kunaiX + "px";

                kunai.style.top =
                    kunaiY + "px";


                /* Collision */

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
                    hitDistance < 50
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

    enemy.health -=
        20;


    if (
        enemy.health < 0
    ) {

        enemy.health = 0;

    }


    updateEnemyHealth();


    /* Hit effect */

    enemyElement.classList.remove(
        "enemy-hit"
    );


    void enemyElement.offsetWidth;


    enemyElement.classList.add(
        "enemy-hit"
    );


    message.innerHTML =
        "💥 HIT! Enemy HP: " +
        enemy.health;


    /* Defeat */

    if (
        enemy.health <= 0
    ) {

        enemyDefeated();

    }

}


/* =========================
   ENEMY HEALTH
   ========================= */

function updateEnemyHealth() {

    const percentage =
        enemy.health + "%";


    document.getElementById(
        "enemy-health-fill"
    ).style.width =
        percentage;

}


/* =========================
   ENEMY DEFEATED
   ========================= */

function enemyDefeated() {

    enemy.health = 0;


    enemyElement.style.display =
        "none";


    message.innerHTML =
        "🔥 ENEMY DEFEATED!<br>" +
        "Press R to fight again.";

}


/* =========================
   PLAYER DEFEATED
   ========================= */

function playerDefeated() {

    gameRunning = false;


    document.getElementById(
        "game-over"
    ).style.display =
        "block";


    message.innerHTML =
        "💀 Your ninja has fallen.";

}


/* =========================
   R KEY
   ========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key.toLowerCase() === "r"
        ) {

            if (
                document.getElementById(
                    "game-over"
                ).style.display === "block"
            ) {

                restartGame();

            }
            else {

                resetEnemy();

            }

        }

    }
);


/* =========================
   RESET ENEMY
   ========================= */

function resetEnemy() {

    enemy.health = 100;


    enemy.x =
        window.innerWidth * 0.75;

    enemy.y =
        window.innerHeight / 2;


    enemy.attackCooldown = 0;


    enemyElement.style.display =
        "block";


    updateEnemy();

    updateEnemyHealth();


    message.innerHTML =
        "WASD / Arrow Keys — Move<br>" +
        "SPACE — Attack";

}


/* =========================
   RESTART GAME
   ========================= */

function restartGame() {

    document.getElementById(
        "game-over"
    ).style.display =
        "none";


    resetGame();


    gameRunning = true;


    message.innerHTML =
        "WASD / Arrow Keys — Move<br>" +
        "SPACE — Attack";


    requestAnimationFrame(
        gameLoop
    );

}


/* =========================
   GAME LOOP
   ========================= */

function gameLoop() {

    if (
        gameRunning
    ) {

        enemyAI();

        requestAnimationFrame(
            gameLoop
        );

    }

}


/* =========================
   WINDOW RESIZE
   ========================= */

window.addEventListener(
    "resize",
    function() {

        if (
            !gameRunning
        ) {

            return;

        }


        keepPlayerInsideMap();

        updatePlayer();

    }
);
