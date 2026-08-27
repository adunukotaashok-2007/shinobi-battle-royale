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

let enemyHealth = 100;


/* =========================
   HTML ELEMENTS
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
   PLAYER MOVEMENT
   ========================= */

document.addEventListener(
    "keydown",
    function(event) {

        const key =
            event.key.toLowerCase();


        /* MOVE UP */

        if (
            key === "w" ||
            key === "arrowup"
        ) {

            player.y -= player.speed;

        }


        /* MOVE DOWN */

        if (
            key === "s" ||
            key === "arrowdown"
        ) {

            player.y += player.speed;

        }


        /* MOVE LEFT */

        if (
            key === "a" ||
            key === "arrowleft"
        ) {

            player.x -= player.speed;

        }


        /* MOVE RIGHT */

        if (
            key === "d" ||
            key === "arrowright"
        ) {

            player.x += player.speed;

        }


        /* ATTACK */

        if (event.code === "Space") {

            attackEnemy();

        }


        keepPlayerInsideMap();

        updatePlayer();

    }
);


/* =========================
   KEEP PLAYER INSIDE MAP
   ========================= */

function keepPlayerInsideMap() {

    const playerSize = 30;


    player.x = Math.max(

        playerSize,

        Math.min(
            window.innerWidth - 120,
            player.x
        )

    );


    player.y = Math.max(

        80,

        Math.min(
            window.innerHeight - playerSize,
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


    document.getElementById(
        "health"
    ).textContent = health;


    document.getElementById(
        "chakra"
    ).textContent = chakra;

}


/* =========================
   ATTACK ENEMY
   ========================= */

function attackEnemy() {

    /* Enemy already defeated */

    if (enemyHealth <= 0) {

        return;

    }


    /* DAMAGE */

    const damage = 20;

    enemyHealth -= damage;


    /* Prevent negative health */

    if (enemyHealth < 0) {

        enemyHealth = 0;

    }


    /* Update health bar */

    document.getElementById(
        "enemy-health-value"
    ).textContent =
        enemyHealth;


    /* Attack animation */

    playerElement.classList.add(
        "attack-effect"
    );


    setTimeout(
        function() {

            playerElement.classList.remove(
                "attack-effect"
            );

        },
        200
    );


    /* Enemy hit effect */

    enemyElement.style.transform =
        "translate(-50%, -50%) scale(1.3)";


    setTimeout(
        function() {

            enemyElement.style.transform =
                "translate(-50%, -50%) scale(1)";

        },
        150
    );


    /* Check enemy defeat */

    if (enemyHealth === 0) {

        enemyElement.style.display =
            "none";


        document.getElementById(
            "message"
        ).innerHTML =
            "🔥 ENEMY DEFEATED!<br>Press R to restart the enemy.";

    }

}


/* =========================
   RESTART ENEMY
   ========================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key.toLowerCase() === "r"
        ) {

            restartEnemy();

        }

    }
);


/* =========================
   RESTART ENEMY FUNCTION
   ========================= */

function restartEnemy() {

    enemyHealth = 100;


    document.getElementById(
        "enemy-health-value"
    ).textContent =
        enemyHealth;


    enemyElement.style.display =
        "block";


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

        keepPlayerInsideMap();

        updatePlayer();

    }
);
