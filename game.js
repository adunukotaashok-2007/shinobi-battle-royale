/* =========================
   PLAYER
   ========================= */

let player = {

    x: window.innerWidth / 2,

    y: window.innerHeight / 2,

    speed: 6,

    health: 100,

    chakra: 100

};


/* =========================
   ENEMIES
   ========================= */

let enemies = [

    {
        id: 1,
        x: window.innerWidth * 0.15,
        y: window.innerHeight * 0.25,
        health: 100,
        speed: 1.2,
        attackCooldown: 0,
        emoji: "👹"
    },

    {
        id: 2,
        x: window.innerWidth * 0.80,
        y: window.innerHeight * 0.25,
        health: 100,
        speed: 1.5,
        attackCooldown: 0,
        emoji: "👺"
    },

    {
        id: 3,
        x: window.innerWidth * 0.75,
        y: window.innerHeight * 0.75,
        health: 100,
        speed: 1.0,
        attackCooldown: 0,
        emoji: "👿"
    }

];


/* =========================
   GAME STATE
   ========================= */

let gameRunning = false;


/* =========================
   ELEMENTS
   ========================= */

const playerElement =
    document.getElementById("player");

const enemiesContainer =
    document.getElementById("enemies");

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

    document.getElementById("game-over").style.display =
        "none";


    resetGame();


    gameRunning = true;


    messageElement.innerHTML =
        "WASD / Arrow Keys — Move<br>" +
        "SPACE — Throw Kunai";


    createEnemies();


    requestAnimationFrame(gameLoop);

}


/* =========================
   RESET GAME
   ========================= */

function resetGame() {

    player.x =
        window.innerWidth / 2;

    player.y =
        window.innerHeight / 2;

    player.health = 100;

    player.chakra = 100;


    enemies = [

        {
            id: 1,
            x: window.innerWidth * 0.15,
            y: window.innerHeight * 0.25,
            health: 100,
            speed: 1.2,
            attackCooldown: 0,
            emoji: "👹"
        },

        {
            id: 2,
            x: window.innerWidth * 0.80,
            y: window.innerHeight * 0.25,
            health: 100,
            speed: 1.5,
            attackCooldown: 0,
            emoji: "👺"
        },

        {
            id: 3,
            x: window.innerWidth * 0.75,
            y: window.innerHeight * 0.75,
            health: 100,
            speed: 1.0,
            attackCooldown: 0,
            emoji: "👿"
        }

    ];


    updatePlayer();

    updateHUD();

}


/* =========================
   CREATE ENEMIES
   ========================= */

function createEnemies() {

    enemiesContainer.innerHTML = "";


    enemies.forEach(
        function(enemy) {

            const enemyElement =
                document.createElement("div");


            enemyElement.className =
                "enemy";


            enemyElement.id =
                "enemy-" + enemy.id;


            enemyElement.innerHTML = `

                <div class="enemy-health-bar">

                    <div
                        class="enemy-health-fill"
                        id="enemy-health-${enemy.id}">
                    </div>

                </div>

                <div class="enemy-character">

                    ${enemy.emoji}

                </div>

                <div class="enemy-name">

                    ENEMY ${enemy.id}

                </div>

            `;


            enemiesContainer.appendChild(
                enemyElement
            );


            updateEnemyElement(
                enemy
            );

        }
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

function updateEnemyElement(enemy) {

    const element =
        document.getElementById(
            "enemy-" + enemy.id
        );


    if (!element) {

        return;

    }


    element.style.left =
        enemy.x + "px";

    element.style.top =
        enemy.y + "px";

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

            attackNearestEnemy();

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
   ENEMY AI
   ========================= */

function updateEnemies() {

    enemies.forEach(
        function(enemy) {

            if (
                enemy.health <= 0
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


            /* CHASE */

            if (
                distance > 75
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
                distance <= 75
            ) {

                if (
                    enemy.attackCooldown <= 0
                ) {

                    enemyAttack(
                        enemy
                    );

                    enemy.attackCooldown =
                        60;

                }

            }


            if (
                enemy.attackCooldown > 0
            ) {

                enemy.attackCooldown--;

            }


            updateEnemyElement(
                enemy
            );

        }
    );

}


/* =========================
   ENEMY ATTACK
   ========================= */

function enemyAttack(enemy) {

    const damage = 5;


    player.health -=
        damage;


    if (
        player.health < 0
    ) {

        player.health = 0;

    }


    updateHUD();


    const element =
        document.getElementById(
            "enemy-" + enemy.id
        );


    if (element) {

        const character =
            element.querySelector(
                ".enemy-character"
            );


        character.classList.remove(
            "enemy-attacking"
        );


        void character.offsetWidth;


        character.classList.add(
            "enemy-attacking"
        );

    }


    playerElement.classList.remove(
        "player-hit"
    );


    void playerElement.offsetWidth;


    playerElement.classList.add(
        "player-hit"
    );


    messageElement.innerHTML =
        "⚔️ ENEMY " +
        enemy.id +
        " ATTACKED YOU!";


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


    const aliveEnemies =
        enemies.filter(
            function(enemy) {

                return enemy.health > 0;

            }
        ).length;


    document.getElementById(
        "enemy-count"
    ).textContent =
        aliveEnemies;

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


            const dx =
                enemy.x - player.x;

            const dy =
                enemy.y - player.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance < nearestDistance
            ) {

                nearest =
                    enemy;

                nearestDistance =
                    distance;

            }

        }
    );


    return nearest;

}


/* =========================
   PLAYER ATTACK
   ========================= */

function attackNearestEnemy() {

    const target =
        findNearestEnemy();


    if (!target) {

        messageElement.innerHTML =
            "🏆 ALL ENEMIES DEFEATED!";

        return;

    }


    const dx =
        target.x - player.x;

    const dy =
        target.y - player.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const attackRange =
        450;


    if (
        distance > attackRange
    ) {

        messageElement.innerHTML =
            "❌ Enemy is too far away!";

        return;

    }


    createKunai(
        target
    );

}


/* =========================
   CREATE KUNAI
   ========================= */

function createKunai(target) {

    const kunai =
        document.createElement("div");


    kunai.className =
        "kunai";


    kunai.textContent =
        "🗡️";


    document.getElementById(
        "village"
    ).appendChild(kunai);


    let x =
        player.x;

    let y =
        player.y;


    const dx =
        target.x - player.x;

    const dy =
        target.y - player.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const speed = 15;


    const velocityX =
        (dx / distance) *
        speed;

    const velocityY =
        (dy / distance) *
        speed;


    kunai.style.left =
        x + "px";

    kunai.style.top =
        y + "px";


    const projectile =
        setInterval(
            function() {

                if (
                    target.health <= 0
                ) {

                    clearInterval(
                        projectile
                    );

                    kunai.remove();

                    return;

                }


                x +=
                    velocityX;

                y +=
                    velocityY;


                kunai.style.left =
                    x + "px";

                kunai.style.top =
                    y + "px";


                const hitX =
                    target.x - x;

                const hitY =
                    target.y - y;


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


                    damageEnemy(
                        target
                    );

                }


                if (
                    x < 0 ||
                    x > window.innerWidth ||
                    y < 0 ||
                    y > window.innerHeight
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

function damageEnemy(enemy) {

    enemy.health -=
        20;


    if (
        enemy.health < 0
    ) {

        enemy.health = 0;

    }


    updateEnemyHealth(
        enemy
    );


    const element =
        document.getElementById(
            "enemy-" + enemy.id
        );


    if (element) {

        element.classList.remove(
            "enemy-hit"
        );


        void element.offsetWidth;


        element.classList.add(
            "enemy-hit"
        );

    }


    messageElement.innerHTML =
        "💥 HIT ENEMY " +
        enemy.id +
        "! HP: " +
        enemy.health;


    if (
        enemy.health <= 0
    ) {

        defeatEnemy(
            enemy
        );

    }

}


/* =========================
   UPDATE ENEMY HEALTH
   ========================= */

function updateEnemyHealth(enemy) {

    const healthBar =
        document.getElementById(
            "enemy-health-" +
            enemy.id
        );


    if (!healthBar) {

        return;

    }


    healthBar.style.width =
        enemy.health + "%";

}


/* =========================
   DEFEAT ENEMY
   ========================= */

function defeatEnemy(enemy) {

    const element =
        document.getElementById(
            "enemy-" + enemy.id
        );


    if (element) {

        element.remove();

    }


    updateHUD();


    const remaining =
        enemies.filter(
            function(enemy) {

                return enemy.health > 0;

            }
        ).length;


    if (
        remaining === 0
    ) {

        gameWon();

    }
    else {

        messageElement.innerHTML =
            "🔥 ENEMY " +
            enemy.id +
            " DEFEATED! " +
            remaining +
            " REMAINING.";

    }

}


/* =========================
   GAME WON
   ========================= */

function gameWon() {

    gameRunning = false;


    document.getElementById(
        "game-over-title"
    ).textContent =
        "🏆 VICTORY!";


    document.getElementById(
        "game-over-title"
    ).style.color =
        "#ffd700";


    document.getElementById(
        "game-over-text"
    ).textContent =
        "You defeated all the enemies!";


    document.getElementById(
        "game-over"
    ).style.display =
        "block";

}


/* =========================
   PLAYER DEFEATED
   ========================= */

function playerDefeated() {

    gameRunning = false;


    document.getElementById(
        "game-over-title"
    ).textContent =
        "💀 DEFEATED";


    document.getElementById(
        "game-over-title"
    ).style.color =
        "#ff3333";


    document.getElementById(
        "game-over-text"
    ).textContent =
        "The enemies defeated your ninja.";


    document.getElementById(
        "game-over"
    ).style.display =
        "block";

}


/* =========================
   RESTART
   ========================= */

function restartGame() {

    document.getElementById(
        "game-over"
    ).style.display =
        "none";


    resetGame();


    createEnemies();


    gameRunning = true;


    messageElement.innerHTML =
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

        updateEnemies();

        requestAnimationFrame(
            gameLoop
        );

    }

}


/* =========================
   RESIZE
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
