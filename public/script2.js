document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;
  const isTimer = path == "/short-16" || path == "/long-3";
  const shortIntro =
    path == "/short-2-15" ||
    path == "/short-16" ||
    path == "/long-3" ||
    path == "/long-2";
  /**
   * short conditions:
   * 1. full practice + 4 minutes block (no timer + no progress bar)
   *     URL NAME: short-1
   * 2-15. short intro text + 4 minute experimental block (no timer + no progress bar)
   *     URL NAME: short-2-15
   * 16. short intro text + 15 minute experimental block (with timer + with progress bar)
   *     URL NAME: short-16
   * long conditions
   * 1. full practice + 30 muinutes experimental block (no timer + no progress bar)
   *     URL NAME: long-1
   * 2. short intro text + 30 minute experimental block (no timer + no progress bar)
   *    URL NAME: long-2
   * 3. short intro text + 15 minute experimental block (with timer + with progress bar)
   *   URL NAME: long-3
   */
  // Get the canvas and its context
  const canvas = this.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  //SPACESHIP CODE
  const spaceshipSprite = new Image();

  function drawSpaceship() {
    ctx.save(); // Save the current canvas state
    ctx.translate(spaceship.x, spaceship.y); // Move the origin to the spaceship's position
    ctx.rotate(spaceship.angle); // Rotate the spaceship
    ctx.drawImage(
      spaceshipSprite,
      -spaceship.width / 2,
      -spaceship.height / 2,
      spaceship.width,
      spaceship.height
    ); // Draw the spaceship sprite
    ctx.restore(); // Restore the canvas state
  }

  spaceshipSprite.src = "ship1.png";

  // Define spaceship properties
  const spaceship = {
    x: canvas.width / 2, // Initial x-coordinate (centered)
    y: canvas.height / 2, // Initial y-coordinate (centered)
    width: 37, // Width of the spaceship
    height: 36, // Height of the spaceship
    angle: 0, // Initial angle (in radians) - facing upward
    speed: 0, // Adjust the speed as needed
    acceleration: 0.05, // Acceleration rate (pixels per frame squared)
    deceleration: 0.02, // Deceleration rate (pixels per frame squared)
    maxSpeed: 2, // Maximum speed (pixels per frame)
  };

  let accelerating = false; // Track if the up arrow key is currently pressed
  let rotatingLeft = false; // left
  let rotatingRight = false; // right

  // Function to update spaceship position and rotation
  function updateSpaceship() {
    // Update speed (accelerate when up arrow key is pressed)
    if (accelerating) {
      spaceshipSprite.src = "ship2.png";
      // Accelerate forward when the up arrow key is pressed
      if (spaceship.speed < spaceship.maxSpeed) {
        spaceship.speed += spaceship.acceleration;
      }
    } else {
      spaceshipSprite.src = "ship1.png";
      // Decelerate when the up arrow key is released
      if (spaceship.speed > 0) {
        spaceship.speed -= spaceship.deceleration;
      }
    }
    spaceship.x += Math.cos(spaceship.angle) * spaceship.speed;
    spaceship.y += Math.sin(spaceship.angle) * spaceship.speed;

    // Wrap the spaceship around the canvas
    if (spaceship.x > canvas.width) spaceship.x = 0;
    if (spaceship.x < 0) spaceship.x = canvas.width;
    if (spaceship.y > canvas.height) spaceship.y = 0;
    if (spaceship.y < 0) spaceship.y = canvas.height;

    // Rotate the spaceship
    if (rotatingLeft) {
      // Rotate left
      spaceship.angle -= 0.05; // Adjust the rotation speed as needed
    }
    if (rotatingRight) {
      // Rotate right
      spaceship.angle += 0.05; // Adjust the rotation speed as needed
    }
  }

  //ASTEROID CODE
  const asteroidSprite = new Image();
  let score = 0;

  // Function to draw asteroids on the canvas
  function drawAsteroids() {
    asteroids.forEach((asteroid) => {
      const asteroidWidth = asteroidSprite.width * 0.3; // Adjust the scaling factor as needed
      const asteroidHeight = asteroidSprite.height * 0.3; // Adjust the scaling factor as needed

      ctx.drawImage(
        asteroidSprite,
        asteroid.x,
        asteroid.y,
        asteroidWidth,
        asteroidHeight
      );
    });
  }

  asteroidSprite.src = "asteroid_blue.png";

  // Function to generate a random position for an asteroid
  function generateRandomAsteroidPosition() {
    const asteroid = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
    };

    // Check the distance from the spaceship
    const distance = Math.sqrt(
      (asteroid.x - spaceship.x) ** 2 + (asteroid.y - spaceship.y) ** 2
    );

    // Ensure the asteroid doesn't spawn within 10px of the spaceship
    if (distance < 10) {
      return generateRandomAsteroidPosition(); // Regenerate position
    }

    return asteroid;
  }

  // Array to store asteroid objects
  const asteroids = [];

  let asteroidCount = 0;
  const maxAsteroids = 13;

  // Function to create a new asteroid and add it to the array
  function createAsteroid() {
    if (asteroidCount < maxAsteroids) {
      const asteroid = generateRandomAsteroidPosition();
      asteroids.push(asteroid);
      asteroidCount++;
    }
  }

  // Function to start spawning asteroids at a specific interval
  function startAsteroidSpawner(interval) {
    setInterval(() => {
      createAsteroid();
    }, interval);
  }

  // Call this function to start spawning asteroids every 2000 milliseconds (2 seconds)

  //EXPLOSION CODE
  const explosionSpriteSheet = new Image();

  explosionSpriteSheet.src = "explosion_alpha.png";

  const explosion = {
    x: 0,
    y: 0,
    frameWidth: 128, // Width of each frame in the sprite sheet
    frameHeight: 128, // Height of each frame in the sprite sheet
    frameIndex: 0, // Current frame index
    numFrames: 24, // Total number of frames in the sprite sheet
    frameRate: 30, // Frames per second for the explosion animation
    timer: 0, // Timer to control frame switching
    isActive: false, // Flag to indicate if the explosion is active
  };

  function startExplosion(x, y) {
    explosion.x = x;
    explosion.y = y;
    explosion.frameIndex = 0;
    explosion.timer = 0;
    explosion.isActive = true;
  }

  // Function to update the explosion animation
  function updateExplosion() {
    if (explosion.isActive) {
      explosion.timer++;

      if (explosion.timer >= 60 / explosion.frameRate) {
        explosion.frameIndex++;

        if (explosion.frameIndex >= explosion.numFrames) {
          // Animation is complete
          explosion.isActive = false;
        }

        explosion.timer = 0;
      }
    }
  }

  function drawExplosion() {
    if (explosion.isActive) {
      ctx.drawImage(
        explosionSpriteSheet,
        explosion.frameIndex * explosion.frameWidth,
        0,
        explosion.frameWidth,
        explosion.frameHeight,
        explosion.x - explosion.frameWidth / 2,
        explosion.y - explosion.frameHeight / 2,
        explosion.frameWidth,
        explosion.frameHeight
      );
    }
  }

  //MISSILE CODE
  const missileSprite = new Image();

  let isFiringMissile = false; // Flag to track if a missile is already in flight

  // Event listener for firing missiles when the spacebar key is pressed
  let isSpacebarPressed = false; // Flag to track if the spacebar is currently pressed

  missileSprite.src = "shot2.png";

  // Array to store missile objects
  const missiles = [];

  // Define missile properties
  const missile = {
    width: 4, // Width of the missile
    height: 4, // Height of the missile
    speed: 5.5, // Speed of the missile (pixels per frame)
    maxDistance: 200, // Maximum distance the missile can travel
  };

  // Function to create a new missile fired from the spaceship
  function createMissile() {
    const missileObj = {
      x: spaceship.x, // Initial x-coordinate of the missile (same as spaceship)
      y: spaceship.y, // Initial y-coordinate of the missile (same as spaceship)
      angle: spaceship.angle, // Initial angle (same as spaceship)
      distance: 0, // Initial distance traveled by the missile
    };

    missiles.push(missileObj);
  }

  // Function to update missile positions and remove them when they reach the max distance
  function updateMissiles() {
    for (let i = missiles.length - 1; i >= 0; i--) {
      const missileObj = missiles[i];

      // Calculate the new position of the missile based on its angle and speed
      missileObj.x += Math.cos(missileObj.angle) * missile.speed;
      missileObj.y += Math.sin(missileObj.angle) * missile.speed;

      // Calculate the distance traveled by the missile
      missileObj.distance += missile.speed;

      // Remove the missile if it reaches the maximum distance
      if (missileObj.distance >= missile.maxDistance) {
        missiles.splice(i, 1);
      }
    }
  }

  // Function to draw missiles on the canvas
  function drawMissiles() {
    missiles.forEach((missileObj) => {
      ctx.drawImage(
        missileSprite,
        missileObj.x - missile.width / 2,
        missileObj.y - missile.height / 2,
        missile.width,
        missile.height
      );
    });
  }

  //GENERAL CODE
  // Arrow key event listeners for rotation
  function handleRotation() {
    document.addEventListener("keydown", (handleRotation) => {
      if (handleRotation.key === "ArrowLeft") {
        // Start rotating left when the left arrow key is pressed
        rotatingLeft = true;
      } else if (handleRotation.key === "ArrowRight") {
        // Start rotating right when the right arrow key is pressed
        rotatingRight = true;
      }
    });

    // Arrow key event listeners for stopping rotation
    document.addEventListener("keyup", (handleRotation) => {
      if (handleRotation.key === "ArrowLeft") {
        // Stop rotating left when the left arrow key is released
        rotatingLeft = false;
      } else if (handleRotation.key === "ArrowRight") {
        // Stop rotating right when the right arrow key is released
        rotatingRight = false;
      }
    });
  }

  function handleAcceleration() {
    // Event listener for the up arrow key (keydown to start accelerating)
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        // Start accelerating when the up arrow key is pressed
        accelerating = true;
      }
    });

    // Event listener for the up arrow key (keyup to stop accelerating)
    document.addEventListener("keyup", (event) => {
      if (event.key === "ArrowUp") {
        // Stop accelerating when the up arrow key is released
        accelerating = false;
      }
    });
  }

  function handleMissiles() {
    // Event listener for firing missiles when the spacebar key is pressed
    document.addEventListener("keydown", (event) => {
      if (event.key === " " && !isFiringMissile) {
        createMissile(); // Create a new missile
        isFiringMissile = true; // Set the flag to prevent firing more missiles
      }
    });

    // Event listener to reset the missile firing flag when the spacebar key is released
    document.addEventListener("keyup", (event) => {
      if (event.key === " ") {
        isFiringMissile = false;
      }
    });
  }

  // Function to check for collisions between the spaceship and asteroids
  function checkCollisions() {
    for (let i = asteroids.length - 1; i >= 0; i--) {
      const asteroid = asteroids[i];

      // Calculate the distance between the spaceship and the asteroid
      const distance = Math.sqrt(
        (asteroid.x - spaceship.x) ** 2 + (asteroid.y - spaceship.y) ** 2
      );

      // If the distance is less than a threshold (e.g., 50 pixels), it's a collision
      if (distance < 30) {
        startExplosion(asteroid.x, asteroid.y);
        // Remove the asteroid from the array
        asteroids.splice(i, 1);
        asteroidCount--;
        score -= 5;
      }
    }
  }

  function checkMissileHit() {
    for (let i = 0; i < missiles.length; i++) {
      const missile = missiles[i];

      for (let j = 0; j < asteroids.length; j++) {
        const asteroid = asteroids[j];

        // Calculate the distance between the missile and asteroid
        const distance = Math.sqrt(
          Math.pow(missile.x - asteroid.x, 2) +
            Math.pow(missile.y - asteroid.y, 2)
        );

        // Check if the missile and asteroid have collided
        if (distance < missileSprite.width / 3 + asteroidSprite.width / 3) {
          // Trigger an explosion at the collision point
          startExplosion(asteroid.x, asteroid.y);
          asteroidCount--;
          numHit++;
          score += 10;

          // Remove the missile and asteroid from their respective arrays
          missiles.splice(i, 1);
          asteroids.splice(j, 1);

          // Exit the inner loop to avoid checking other asteroids for this missile
          break;
        }
      }
    }
  }

  function showScore() {
    document.getElementById(
      "score-tracker"
    ).innerHTML = `<span>Score = ${score}</span>`;
  }

  function startTimer(timer, display) {
    let intervalId = setInterval(function () {
      let minutes = parseInt(timer / 60, 10);
      let seconds = parseInt(timer % 60, 10);
      let milliseconds = parseInt((timer - Math.floor(timer)) * 1000, 10); // Extract milliseconds

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      milliseconds = milliseconds < 100 ? "0" + milliseconds : milliseconds; // Adjust for three-digit display

      display.textContent = `${minutes}:${seconds}`;

      if (--timer < 0) {
        clearInterval(intervalId);
        endGame(); // Clear the interval when the timer reaches 0
        sendScoreToServer();
      }
    }, 1000); // Update every 100 milliseconds

    move();
  }

  var i = 0;
  function move() {
    if (i == 0) {
      i = 1;
      var elem = document.getElementById("myBar");
      var width = 1;
      var id = setInterval(frame, 9000);
      function frame() {
        if (width >= 100) {
          clearInterval(id);
          i = 0;
        } else {
          width++;
          elem.style.width = width + "%";
        }
      }
    }
  }

  function setTimer(duration) {
    return duration; // Simply return the initial duration
  }

  // Call this function to start the timer when your loop or event begins
  function startTimerWhenLoopStarts() {
    const four = 60 * 4 - 1;
    const thirty = 60 * 30 - 1;
    const fifteen = 60 * 15 - 1;
    var display = document.querySelector("#timer");
    var initialTimerValue;
    switch (path) {
      case "/short-1":
        initialTimerValue = setTimer(four);
        break;
      case "/short-2-15":
        initialTimerValue = setTimer(four);
        break;
      case "/short-16":
        initialTimerValue = setTimer(fifteen);
        break;
      case "/long-1":
        initialTimerValue = setTimer(thirty);
        break;
      case "/long-2":
        initialTimerValue = setTimer(thirty);
        break;
      case "/long-3":
        initialTimerValue = setTimer(fifteen);
        break;
      default:
        initialTimerValue = setTimer(four);
    }
    startTimer(initialTimerValue, display);
  }
  //PRACTICE

  // bonus credit/money
  //if you miss questionnaires you dont get a bonus
  //if you dont see the checkmark and press n you have to reload

  //Define practice stages
  const stages = [
    {
      name: "Welcome to the Experiment!",
      instructions:
        "This is a practice session. You will be asked to practice the various controls for the game. When you complete a stage successfully, you will see a green checkmark. You may then press 'n' to continue to the next stage. You must complete all practice stages, otherwise you will have to restart! If you go to the next stage before seeing the green checkmark, you will be forced to reload the page. You will have the opportunity to gain a bonus after the experiment. Please press 'n' to continue",
    },
    {
      name: "Rotate Right",
      instructions:
        "Use the right arrow key to rotate the spaceship right. Rotate the spaceship at least 360 degrees and then press 'n' to continue",
    },
    {
      name: "Rotate Left",
      instructions:
        "Use the left arrow key to rotate the spaceship left. Rotate the spaceship at least 360 degrees and then press 'n' to continue",
    },
    {
      name: "Acceleration",
      instructions:
        "Use the up arrow key to accelerate. The spaceship can go outside of the screen. Try going out of bounds 3 times, then press 'n' to continue. Be careful, there are no brakes! ",
    },
    {
      name: "Shooting",
      instructions:
        "Press spacebar to shoot asteroids. Your score will be on the top left corner of the screen. It will increase by 10 with every accurate hit and decrease by 5 every time your spaceship collides with an asteroid. Shoot 5 asteroids and then press 'n' to continue",
    },
    {
      name: "Questionnaire",
      instructions:
        "In the next stage, you will be asked to indicate how good or bad you are feeling right now. You can choose your answer using the mouse. Please try to be as accurate as possible. In the upcoming stages, every 30 seconds of the game you will be asked to rate this questionnaire. In the next screen you will have 100 seconds to answer, but in the following stages, you will only have 10 seconds. To give you time to prepare for the game again, the questionnaire will stay up for 1 second after you answer. <strong> If you fail to respond to too many questionnaires, you will not get a bonus at the end of the experiment. </strong> Press 'n' to continue",
    },
    {
      name: "",
      instructions: ``,
    },
    {
      name: "Free Practice",
      instructions:
        "You can practice freely! Press 'n' to continue and the game will begin!",
    },
    {
      name: "",
      instructions: "",
    },
  ];

  const keyImages = [
    "keyboard_right.png",
    "keyboard_left.png",
    "keyboard_up.png",
    "keyboard_space.png",
  ];

  // Initialize stage manager
  let currentStageIndex = 0; // Start with the first stage

  // Function to handle advancing to the next stage
  function advanceToNextStage() {
    pStage++;
    if (shortIntro && pStage === 1) {
      pStage = 7;
      startAsteroidSpawner(500);
    }
    const currentStage = stages[pStage];
    if (pStage < stages.length) {
      // Display instructions for the next stage
      document.getElementById("instructions").innerHTML = `
        <h1>${currentStage.name}</h1>
        <p>${currentStage.instructions}</p>
      `;
      // Update the displayed key image for the next stage
      updateKeyImage(pStage);
    } else {
      currentStage.name.display = "none";
      currentStage.instructions.display = "none";
    }
  }

  function updateKeyImage(stageIndex) {
    const keyImageElement = document.getElementById("keyImage");
    if (
      stageIndex == 1 ||
      stageIndex == 2 ||
      stageIndex == 3 ||
      stageIndex == 4
    ) {
      // Update the image source based on the current practice stage
      keyImageElement.src = keyImages[stageIndex - 1];
      // You can also adjust the position or visibility of the image here
      keyImageElement.style.height = "120px";
      keyImageElement.style.width = "400px";
      keyImageElement.style.visibility = "visible";
    } else {
      // Hide the image if there are no more practice stages
      keyImageElement.style.visibility = "hidden";
      keyImageElement.style.height = "0px";
      keyImageElement.style.width = "0px";
    }
  }

  // Event listener for the "N" key to advance to the next stage
  function nEventListener() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "n" || event.key === "N") {
        advanceToNextStage();
      }
    });
  }

  // Initial instructions for the first stage
  function firstStageInstructions() {
    document.getElementById("instructions").innerHTML = `
    <h1>${stages[0].name}</h1>
    <p>${stages[0].instructions}</p>
  `;
  }
  function shortInstructions() {
    document.getElementById("instructions").innerHTML = `
    <h1>Welcome back to the experiment!</h1>
    <p>Welcome back! In this session, we will go over the game's controls and let you play around a bit before the session starts. Press the left and right arrow keys to turn left and right, press the up arrow key to accelerate, and press spacebar to shoot missiles at asteroids! Don't forget that there will be questionnaires that you must answer using your mouse cursor. If you miss too many, you will not get a bonus at the end of the experiment. Good Luck! Press 'n' to practice</p>
  `;
  }

  function clearEventListeners() {
    document.removeEventListener("keydown", handleRotation);
    document.removeEventListener("keydown", handleAcceleration);
    document.removeEventListener("keydown", handleMissiles);
  }

  let pStage = 0;

  function stage0() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    updateSpaceship();
    if (pStage != 0) {
      onStage0Finish();
      return;
    }
    if (shortIntro) {
      shortInstructions();
    } else {
      firstStageInstructions();
    }
    requestAnimationFrame(stage0);
  }

  var buns = true;

  // Create a div element for the checkmark
  const checkmarkDiv = document.createElement("div");
  checkmarkDiv.innerHTML = "&#x2713;"; // Checkmark Unicode

  // Apply styles
  checkmarkDiv.style.fontSize = "50px";
  checkmarkDiv.style.color = "green";
  checkmarkDiv.style.position = "fixed";
  checkmarkDiv.style.top = "50%";
  checkmarkDiv.style.left = "50%";
  checkmarkDiv.style.transform = "translate(-50%, -50%)";

  // Append the checkmark element to the body
  document.body.appendChild(checkmarkDiv);

  checkmarkDiv.style.display = "none";

  function stage1() {
    // console.log(localStorage.getItem("id"));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    updateSpaceship();
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        rotatingRight = true;
      }
    });
    document.addEventListener("keyup", (event) => {
      if (event.key === "ArrowRight") {
        rotatingRight = false;
      }
    });
    if (spaceship.angle > 6.28) {
      checkmarkDiv.style.display = "block";
    }
    if (pStage != 1 && spaceship.angle > 6.28) {
      onStage1Finish();
      return;
    }
    requestAnimationFrame(stage1);
  }

  function stage2() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.removeEventListener("keydown", handleRotation);
    drawSpaceship();
    updateSpaceship();
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        rotatingLeft = true;
      }
    });
    document.addEventListener("keyup", (event) => {
      if (event.key === "ArrowLeft") {
        rotatingLeft = false;
      }
    });
    if (spaceship.angle < 0) {
      checkmarkDiv.style.display = "block";
    }
    if (pStage != 2 && spaceship.angle < 0) {
      onStage2Finish();
      return;
    }
    requestAnimationFrame(stage2);
  }

  let outBounds = 0;

  function stage3() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    handleAcceleration();
    updateSpaceship();
    if (
      spaceship.x >= canvas.width ||
      spaceship.x <= 0 ||
      spaceship.y >= canvas.height ||
      spaceship.y <= 0
    ) {
      outBounds++;
    }
    if (outBounds >= 3) {
      checkmarkDiv.style.display = "block";
    }
    if (pStage != 3 && outBounds >= 3) {
      onStage3Finish();
      return;
    }
    requestAnimationFrame(stage3);
  }

  let numHit = 0;

  function stage4() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    drawMissiles();
    updateSpaceship();
    updateMissiles();
    handleMissiles();
    showScore();
    drawAsteroids();
    if (explosion.isActive) {
      updateExplosion();
      drawExplosion();
    }
    checkMissileHit();
    checkCollisions();
    console.log(numHit);
    if (numHit >= 5) {
      checkmarkDiv.style.display = "block";
    }
    if (pStage != 4 && numHit >= 5) {
      onStage4Finish();
      return;
    }
    requestAnimationFrame(stage4);
  }

  function stage5() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    drawMissiles();
    updateSpaceship();
    updateMissiles();
    handleMissiles();
    showScore();
    drawAsteroids();
    if (explosion.isActive) {
      updateExplosion();
      drawExplosion();
    }
    checkMissileHit();
    checkCollisions();
    if (pStage != 5) {
      onStage5Finish();
      return;
    }
    requestAnimationFrame(stage5);
  }

  var answeredQ = false;
  var canSeeQ = false;
  var wannaGo = false;

  function stage6() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    drawMissiles();
    updateSpaceship();
    updateMissiles();
    handleMissiles();
    showScore();
    drawAsteroids();
    if (explosion.isActive) {
      updateExplosion();
      drawExplosion();
    }
    checkMissileHit();
    checkCollisions();
    if (!canSeeQ) {
      seeQuestionnaire();
      countdown(100 * 1000);
      canSeeQ = true;
    }
    if (canSeeQ) {
      setTimeout(() => {
        wannaGo = true;
        hideQuestionnaire();
      }, 100 * 1000);
    }
    if (answeredQ == true) {
      hideQuestionnaire();
      checkmarkDiv.style.display = "block";
    }
    if (pStage != 6) {
      onStage6Finish();
      return;
    }
    requestAnimationFrame(stage6);
  }

  //var timerON = false;

  function stage7() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSpaceship();
    drawAsteroids();
    drawMissiles();
    handleRotation();
    handleAcceleration();
    handleMissiles();
    updateSpaceship();
    updateMissiles();
    showScore();
    if (explosion.isActive) {
      updateExplosion();
      drawExplosion();
    }
    checkMissileHit();
    checkCollisions();
    if (pStage != 7) {
      onStage7Finish();
      return;
    }
    requestAnimationFrame(stage7);
  }

  var startTime = 0;

  // Game loop to continuously update and draw the spaceship
  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawSpaceship(); // Draw the spaceship
    drawAsteroids();
    drawMissiles();
    showScore();
    handleRotation();
    handleAcceleration();
    handleMissiles();
    updateSpaceship();
    updateMissiles();
    if (explosion.isActive) {
      updateExplosion();
      drawExplosion();
    }
    checkMissileHit();
    checkCollisions();
    if (currentGameLoop != gameLoop) {
      return;
    }
    if (end) {
      cancelAnimationFrame(currentGameLoop);
      return;
    }
    if (startTime === 0) {
      startTime = performance.now();
      console.log(startTime);
    }
    requestAnimationFrame(gameLoop);
  }

  function gameLoop2() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawSpaceship(); // Draw the spaceship
    drawAsteroids();
    drawMissiles();
    showScore();
    handleRotation();
    handleAcceleration();
    handleMissiles();
    updateSpaceship();
    updateMissiles();
    if (explosion.isActive) {
      updateExplosion();
      drawExplosion();
    }
    checkMissileHit();
    checkCollisions();
    if (currentGameLoop != gameLoop2) {
      return;
    }
    if (end) {
      cancelAnimationFrame(currentGameLoop);
      return;
    }
    requestAnimationFrame(gameLoop2);
  }

  let currentGameLoop;

  function switchGameLoop() {
    // Switch to the other game loop
    if (currentGameLoop === gameLoop) {
      currentGameLoop = gameLoop2;
      otherLoop = gameLoop;
    } else {
      currentGameLoop = gameLoop;
      otherLoop = gameLoop2;
    }
  }

  let otherLoop;

  function startRandomloop() {
    startAsteroidSpawner(500); // Adjust the interval as needed
    const randomVal = Math.random();
    if (randomVal < 0.5) {
      if (isTimer) {
        startTimerWhenLoopStarts();
      }

      currentGameLoop = gameLoop;
      otherLoop = gameLoop2;
    } else {
      if (isTimer) {
        startTimerWhenLoopStarts();
      }
      currentGameLoop = gameLoop2;
      otherLoop = gameLoop;
    }
    requestAnimationFrame(currentGameLoop);
  }

  function clearEventListeners() {
    document.removeEventListener("keydown", handleRotation);
    document.removeEventListener("keydown", handleAcceleration);
    document.removeEventListener("keydown", handleMissiles);
  }

  let wantContinue = false;

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      wantContinue = true;
    }
  });

  var seeQ = false;
  var practice = true;

  function startSequentially(data) {
    // if (pStage != 6) {
    //   console.log("test");
    //   //return;
    // }
    practice = false;
    score = 0;
    startRandomloop();
    setTimeout(() => {
      clearEventListeners();
      switchGameLoop();
      startAsteroidSpawner(500); // Adjust the interval as needed
      requestAnimationFrame(currentGameLoop);
    }, 5000);
    setInterval(() => {
      if (end === true) {
        return;
      }
      seeQuestionnaire();
      seeQ = true;
      countdown(10 * 1000);
      startqTimerDuringQ();
      setTimeout(() => {
        hideQuestionnaire();
      }, 10000);
    }, 30000);
  }

  function onStage0Finish() {
    clearEventListeners();
    if (shortIntro) {
      stage7();
    } else {
      stage1();
    }
  }

  function onStage1Finish() {
    ctx.restore();
    clearEventListeners();
    checkmarkDiv.style.display = "none";
    stage2();
  }

  function onStage2Finish() {
    clearEventListeners();
    checkmarkDiv.style.display = "none";
    stage3();
  }

  function onStage3Finish() {
    clearEventListeners();
    checkmarkDiv.style.display = "none";
    startAsteroidSpawner();
    stage4();
  }

  function onStage4Finish() {
    clearEventListeners();
    checkmarkDiv.style.display = "none";
    score = 0;
    stage5();
  }

  function onStage5Finish() {
    clearEventListeners();
    checkmarkDiv.style.display = "none";
    score = 0;
    stage6();
  }

  function onStage6Finish() {
    clearEventListeners();
    checkmarkDiv.style.display = "none";
    startTimer2(450, document.querySelector(".random"));
    document.querySelector(".random").style.display = "block";
    stage7();
  }

  var wannaQuit = false;

  function onStage7Finish() {
    clearEventListeners();
    wannaQuit = true;
    document.querySelector(".random").style.visibility = "hidden";
    pracOverScreen.style.display = "none";
    startSequentially();
  }

  // Initialize an array to store spacebar press events
  const spacebarPressEvents = [];

  // Event listener for capturing spacebar press events
  document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      var timestamp;
      if (practice) {
        timestamp = -1;
      } else {
        timestamp = performance.now() - startTime;
      }
      spacebarPressEvents.push({ timestamp }); // Store the event with timestamp
      // Send this spacebar press event to the server
      console.log(timestamp);
      sendSpacebarPressToServer({ timestamp });
    }
  });

  // Function to send spacebar press event to the server
  function sendSpacebarPressToServer(event) {
    const id = localStorage.getItem("id");
    //localStorage.removeItem("id");
    console.log(id);
    fetch("http://localhost:3000/submit-spacebar-press", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event, id }),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Spacebar press event saved successfully");
        } else {
          console.error("Failed to save spacebar press event");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async function exportToCSV() {
    try {
      const response = await fetch("/export-to-csv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Include any necessary request body if needed
        // body: JSON.stringify({ /* your request body */ }),
      });

      if (response.ok) {
        console.log("Export initiated! Check the server logs for progress.");
      } else {
        const errorMessage = await response.text();
        console.error(`Export failed: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  }

  window.addEventListener("beforeunload", async function (event) {
    // Export to CSV before leaving the page
    await exportToCSV();
  });

  const modal = document.createElement("div");

  function showQuestionnaire() {
    // Create a modal or a UI element for the questionnaire
    modal.id = "questionnaireModal";
    modal.innerHTML = `
      <div style="width: 800px; height: 600px; background-color: white; border: 1px solid #ccc; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <div class="questionnaireDiv" style="display: flex; justify-content: space-around;">
        <h2 class="questionnaireQ" style="text-align: center;">How are you feeling?</h2>
        <h3 id="qTimer" style="font-size: 24px;"></h3>
          <button class="questionnaireBtn" data-answer="5">+5 (Very Good)</button>
          <button class="questionnaireBtn" data-answer="4">+4</button>
          <button class="questionnaireBtn" data-answer="3">+3 (Good)</button>
          <button class="questionnaireBtn" data-answer="2">+2</button>
          <button class="questionnaireBtn" data-answer="1">+1 (Fairly Good)</button>
          <button class="questionnaireBtn" data-answer="0">0 (Neutral)</button>
          <button class="questionnaireBtn" data-answer="-1">-1 (Fairly Bad)</button>
          <button class="questionnaireBtn" data-answer="-2">-2</button>
          <button class="questionnaireBtn" data-answer="-3">-3 (Bad)</button>
          <button class="questionnaireBtn" data-answer="-4">-4</button>
          <button class="questionnaireBtn" data-answer="-5">-5 (Very bad)</button>
        </div>
      </div>
    `;

    // Add the modal to the document
    document.body.appendChild(modal);

    // Add event listeners to each button
    const buttons = modal.querySelectorAll(".questionnaireBtn");
    buttons.forEach((button) => {
      button.addEventListener("click", handleButtonClick);
    });

    modal.style.display = "none";
  }

  function handleButtonClick(event) {
    answeredQ = true;
    const answer = event.target.dataset.answer;
    console.log(`User's answer: ${answer}`);
    //1.5 second delay until questionnaire goes away
    setTimeout(() => {
      hideQuestionnaire();
    }, 1000);
  }

  let isQuestionnaireVisible = false;

  function seeQuestionnaire() {
    // Show the questionnaire if it's not already visible
    if (!isQuestionnaireVisible) {
      modal.style.display = "block";
      isQuestionnaireVisible = true;
    }
  }

  let stop = false;

  function hideQuestionnaire() {
    // Hide the questionnaire
    modal.style.display = "none";
    isQuestionnaireVisible = false;
    stop = true;
  }

  // Function to send questionnaire answer to the server
  function sendQuestionnaireAnswer(answer) {
    const id = localStorage.getItem("id");
    console.log(id);
    if (practice) {
      qTime = -1;
    } else {
      qTime = performance.now() - startTime;
    }
    fetch("http://localhost:3000/submit-answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, answer, qTime }),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Questionnaire answer saved successfully");
        } else {
          console.error("Failed to save questionnaire answer");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Event listener for questionnaire buttons
  document.addEventListener("click", (event) => {
    const isQuestionnaireButton =
      event.target.classList.contains("questionnaireBtn");

    if (isQuestionnaireButton) {
      const answer = event.target.dataset.answer; // Assuming the answer is stored as a data attribute
      sendQuestionnaireAnswer(answer);
    }
  });

  let end = false;

  function endGame() {
    end = true;
    hideQuestionnaire();
    const gameOverScreen = document.createElement("div");
    gameOverScreen.innerHTML = `
      <div style="color: white; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
        <h1>Session Over</h1>
        <p style="color: white";">This session is now over. You may close the tab. Thank you for playing!</p>
      </div>
    `;

    // Add the game-over screen to the document body
    document.body.appendChild(gameOverScreen);
  }

  function countdown(timerleft) {
    var timeLeft = timerleft; // 10 seconds in milliseconds
    var timer = setInterval(function () {
      var seconds = Math.floor(timeLeft / 1000);
      var remainingMilliseconds = timeLeft % 1000;

      document.getElementById("qTimer").innerHTML =
        seconds + ":" + remainingMilliseconds;
      timeLeft -= 10;

      if (timeLeft < 0) {
        timeLeft = 10 * 1000;
        clearInterval(timer);
        hideQuestionnaire();
      }

      if (wannaGo) {
        timeLeft = 10 * 1000;
        clearInterval(timer);
      }
    }, 10); // update every 10 milliseconds
  }

  const pracOverScreen = document.createElement("div");
  pracOverScreen.innerHTML = `
  <div style="color: white; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
    <h1>Practice Over</h1>
    <p style="color: white";">Press 'n' to continue to the main game!</p>
  </div>
`;
  document.body.appendChild(pracOverScreen);
  pracOverScreen.style.display = "none";

  function startTimer2(timer, display) {
    let intervalId = setInterval(function () {
      let minutes = parseInt(timer / 60, 10);
      let seconds = parseInt(timer % 60, 10);
      let milliseconds = parseInt((timer - Math.floor(timer)) * 1000, 10); // Extract milliseconds

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      milliseconds = milliseconds < 100 ? "0" + milliseconds : milliseconds; // Adjust for three-digit display

      display.textContent = `${minutes}:${seconds}`;

      if (--timer < 0) {
        pracOverScreen.style.display = "block";
        clearInterval(intervalId);
      }
      if (wannaQuit === true) {
        clearInterval(intervalId);
      }
    }, 1000); // Update every 100 milliseconds
  }

  function sendScoreToServer() {
    const id = localStorage.getItem("id");
    //localStorage.removeItem("id");
    console.log(id);
    fetch("http://localhost:3000/submit-score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, score }),
    })
      .then((response) => {
        if (response.status === 200) {
          console.log("Score saved successfully");
        } else {
          console.error("Failed to save score");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  if (!isTimer) {
    document.getElementById("myBar").style.width = "0%";
    document.getElementById("myProgress").style.width = "0%";
  }
  showQuestionnaire();
  stage0();
  nEventListener();
});
