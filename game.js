// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('game-container').appendChild(renderer.domElement);

// Load and apply the skybox
const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
  'starbox/px.jpg', 'starbox/nx.jpg',
  'starbox/py.jpg', 'starbox/ny.jpg',
  'starbox/pz.jpg', 'starbox/nz.jpg'
], (texture) => {
  texture.side = THREE.BackSide; // Add this line
  scene.background = texture;
});
// Add fog to the scene
const fog = new THREE.FogExp2(0xcccccc, 0.00825); // Color and density
scene.fog = fog;

// Floor setup with color #567d46
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x567d46 });

// Create a canvas to generate the grass texture
const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext('2d');

// Define the shades of green
const greens = [
  '#32CD32', // Lime green
  '#3E8E41', // Medium green
  '#228B22', // Forest green
  '#008000', // Dark green
  '#006400', // Very dark green
];

// Generate the grass texture
for (let x = 0; x < canvas.width; x++) {
  for (let y = 0; y < canvas.height; y++) {
    // Use a simple noise function to determine the color of each pixel
    const noise = Math.random() * 5;
    const color = greens[Math.floor(noise)];
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 1, 1);
  }
}

// Create a texture from the canvas
const textureGrass = new THREE.CanvasTexture(canvas);

// Set the texture on the floor material
floorMaterial.map = textureGrass;
floorMaterial.needsUpdate = true;

const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Brick wall setup
const walls = [];

function createBrickWall() {
    const wallThickness = 0.5;
    const wallHeight = 2; // Reduced height

    // Create walls for each side of the map
    const wallGeometry = new THREE.BoxGeometry(100 + wallThickness * 2, wallHeight, wallThickness);
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 }); // Brick color

    // Bottom wall
    const bottomWall = new THREE.Mesh(wallGeometry, wallMaterial);
    bottomWall.position.set(0, wallHeight / 2, -49 - wallThickness);
    scene.add(bottomWall);
    walls.push(bottomWall);

    // Top wall
    const topWall = new THREE.Mesh(wallGeometry, wallMaterial);
    topWall.position.set(0, wallHeight / 2, 49 + wallThickness);
    scene.add(topWall);
    walls.push(topWall);

    // Left wall
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-49 - wallThickness, wallHeight / 2, 0);
    scene.add(leftWall);
    walls.push(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    rightWall.rotation.y = Math.PI / 2;
    rightWall.position.set(49 + wallThickness, wallHeight / 2, 0);
    scene.add(rightWall);
    walls.push(rightWall);
}
createBrickWall();

// Player setup
function createPlayer() {
    const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 0.5); // Body
    const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8); // Head
    const limbGeometry = new THREE.BoxGeometry(0.4, 1, 0.4); // Limbs
    const gunGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.2); // Increased size
    const gunMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // Minecraft Steve color scheme
    const bodyColor = new THREE.MeshBasicMaterial({ color: 0x1f77b4 }); // Blue shirt
    const pantsColor = new THREE.MeshBasicMaterial({ color: 0x292929 }); // Dark blue pants
    const skinColor = new THREE.MeshBasicMaterial({ color: 0xfbbf8f }); // Skin color
    const hairColor = new THREE.MeshBasicMaterial({ color: 0x6f4f28 }); // Hair color
    const gunBody = new THREE.Mesh(gunGeometry, gunMaterial);
    const gunBarrel = new THREE.Mesh(gunGeometry, gunMaterial);

    // Body parts
    const body = new THREE.Mesh(bodyGeometry, bodyColor);
    const head = new THREE.Mesh(headGeometry, skinColor);
    const leftArm = new THREE.Mesh(limbGeometry, skinColor);
    const rightArm = new THREE.Mesh(limbGeometry, skinColor);
    const leftLeg = new THREE.Mesh(limbGeometry, pantsColor);
    const rightLeg = new THREE.Mesh(limbGeometry, pantsColor);
    const hair = new THREE.Mesh(limbGeometry, hairColor);
    hair.scale.set(2, 0.1, 2); // Scale the hair piece to be 1.5 times larger
    gunBody.position.set(-0.6, 0.75, 0);
    gunBarrel.position.set(-0.3, 0.25, 0);
    gunBody.rotation.z = Math.PI / 2; // Rotate 90 degrees around Z axis
    gunBarrel.rotation.z = Math.PI / 1; // Rotate 90 degrees around Z axis

    body.position.set(0, 0.75, 0);
    head.position.set(0, 1.9, 0);
    leftArm.position.set(-0.7125, 0.75, 0);
    rightArm.position.set(0.7125, 0.75, 0.4); // adjust these values to position the arm correctly
    rightArm.rotation.set(0, -1.6, -Math.PI / 2); // rotate the arm to hold out forward
    leftLeg.position.set(-0.275, -0.25, 0);
    rightLeg.position.set(0.275, -0.25, 0);
    hair.position.set(0, 2.325, 0);

    const player = new THREE.Object3D();
    player.add(body);
    player.add(head);
    player.add(leftArm);
    player.add(rightArm);
    player.add(leftLeg);
    player.add(rightLeg);
    player.add(hair);
    player.add(gunBody);
    player.add(gunBarrel);
    rightArm.add(gunBody);
    rightArm.add(gunBarrel);

    player.position.y = 0.5;

    return player;
}

const player = createPlayer();
scene.add(player);

// Initial camera setup
const initialCameraDistance = 15; // Start distance
let cameraDistance = initialCameraDistance; // Current distance from the player

camera.position.set(0, 10, initialCameraDistance); // Start position
camera.lookAt(player.position); // Look at the player

// Movement variables
let movementSpeed = 0.1;
const keysPressed = {};

// Shooting variables
const bullets = [];
let bulletSpeed = 0.55;
let shootInterval = 125;
let bulletDamage = 10;

// Enemy setup
const enemies = [];
let enemySpeed = 0.04;
let enemySpawnInterval = 1000;

// Health system
let playerHealth = 100;

// Scoring system
let Money = 0;
let killCount = 0;

// Timer
const timerElement = document.getElementById('timer');
let startTime = Date.now();

// UI Elements
const healthElement = document.getElementById('health');
const MoneyElement = document.getElementById('Money');

// Black hole ability
let blackHoleActive = false;
let blackHoleStartTime = 0;
const blackHoleDuration = 5000; // 5 seconds
const blackHoleCooldown = 40000; // 40 seconds
let lastBlackHoleUsage = 0;

// Event listeners for player controls
document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;

    if (event.key === '1' && !blackHoleActive && Date.now() - lastBlackHoleUsage >= blackHoleCooldown) {
        createBlackHole();
        lastBlackHoleUsage = Date.now();
    }
});

document.addEventListener('keyup', (event) => keysPressed[event.key] = false);

// Event listener for scroll wheel
document.addEventListener('wheel', (event) => {
    const delta = event.deltaY * 0.01;
    cameraDistance = Math.max(0, Math.min(100, cameraDistance - delta)); // Constrain the camera distance
});

// Function to create bullets
function shootBullet() {
    if (enemies.length === 0) return;

    let closestEnemy = enemies[0];
    let minDistance = player.position.distanceTo(enemies[0].position);

    enemies.forEach((enemy) => {
        const distance = player.position.distanceTo(enemy.position);
        if (distance < minDistance) {
            closestEnemy = enemy;
            minDistance = distance;
        }
    });

    const bulletGeometry = new THREE.SphereGeometry(0.125, 8, 8);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xC0C0C0 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bullet.position.copy(player.position);
    bullet.direction = closestEnemy.position.clone().sub(player.position).normalize();
    bullets.push(bullet);
    scene.add(bullet);
}

// Turret setup
const turrets = [];
let turretCooldown = 60000; // 60 seconds
let lastTurretUsage = 0;

// Function to create a turret
function createTurret() {
    setInterval(() => {
        const remainingTime = turretCooldown - (Date.now() - lastTurretUsage);
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        if (remainingTime <= 0) {
            document.getElementById('turret-cooldown').textContent = ` 0s`;
        } else {
            document.getElementById('turret-cooldown').textContent = ` ${seconds.toString().padStart(2, '0')}s`;
        }
    }, 1000);
    // Create turret body
    const turretBaseGeometry = new THREE.CylinderGeometry(0.57, 0.57, 1, 64);
    const turretBaseMaterial = new THREE.MeshBasicMaterial({ color: 0xfbeccf });
    const turretBase = new THREE.Mesh(turretBaseGeometry, turretBaseMaterial);

    // Create turret barrel
    const turretBarrelGeometry = new THREE.CylinderGeometry(0.25, 1.5, 1, 64);
    const turretBarrelMaterial = new THREE.MeshBasicMaterial({ color: 0xdc4017 });
    const turretBarrel = new THREE.Mesh(turretBarrelGeometry, turretBarrelMaterial);
    turretBarrel.position.y = 1.5;

    // Combine turret parts
    const turret = new THREE.Object3D();
    turret.add(turretBase);
    turret.add(turretBarrel);
    turret.position.copy(player.position);

    // Add turret to scene and track it
    turrets.push({ turret, startTime: Date.now() });
    scene.add(turret);

    // Function to shoot bullets from turret
    function shootTurretBullet() {
        if (enemies.length === 0) return;

        // Find the closest enemy
        let closestEnemy = enemies[0];
        let minDistance = turret.position.distanceTo(enemies[0].position);

        enemies.forEach((enemy) => {
            const distance = turret.position.distanceTo(enemy.position);
            if (distance < minDistance) {
                closestEnemy = enemy;
                minDistance = distance;
            }
        });

        const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xC0C0C0 });
        const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
        bullet.position.copy(turret.position);
        bullet.direction = closestEnemy.position.clone().sub(turret.position).normalize(); // Aim at closest enemy
        bullets.push(bullet);
        scene.add(bullet);
    }
    

    // Shoot bullets every second
    const turretShootInterval = setInterval(shootTurretBullet, 200);

    // Stop shooting and remove turret after 20 seconds
    setTimeout(() => {
        clearInterval(turretShootInterval);
        scene.remove(turret);
        const index = turrets.findIndex(t => t.turret === turret);
        if (index > -1) turrets.splice(index, 1);
    }, 8000);
        // Make the turret chase enemies
        function updateTurretPosition() {
            if (enemies.length === 0) return;
    
            let closestEnemy = enemies[0];
            let minDistance = turret.position.distanceTo(enemies[0].position);
    
            enemies.forEach((enemy) => {
                const distance = turret.position.distanceTo(enemy.position);
                if (distance < minDistance) {
                    closestEnemy = enemy;
                    minDistance = distance;
                }
            });
    
            // Move the turret towards the closest enemy
            const direction = closestEnemy.position.clone().sub(turret.position).normalize();
            turret.position.add(direction.multiplyScalar(0.05)); // adjust the speed as needed
        }
    
        // Update the turret position every frame
        function animate() {
            updateTurretPosition();
            requestAnimationFrame(animate);
        }
        animate();
    }

// Event listener for turret ability
document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;

    if (event.key === '2' && Date.now() - lastTurretUsage >= turretCooldown) {
        createTurret();
        lastTurretUsage = Date.now();
    }

    // Existing black hole activation
    if (event.key === '1' && !blackHoleActive && Date.now() - lastBlackHoleUsage >= blackHoleCooldown) {
        createBlackHole();
        lastBlackHoleUsage = Date.now();
    }
});

document.addEventListener('keyup', (event) => keysPressed[event.key] = false);

// Update player rotation to face nearest enemy
function updatePlayerRotation() {
    if (enemies.length > 0) {
      let nearestEnemy = enemies[0];
      let minDistance = player.position.distanceTo(nearestEnemy.position);
  
      enemies.forEach((enemy) => {
        const distance = player.position.distanceTo(enemy.position);
        if (distance < minDistance) {
          nearestEnemy = enemy;
          minDistance = distance;
        }
      });
  
      const direction = nearestEnemy.position.clone().sub(player.position).normalize();
      const rotation = Math.atan2(direction.x, direction.z);
      player.rotation.y = rotation;
    }
  }
  
  // Update function with turret logic
  function update() {
    const moveDirection = new THREE.Vector3();
    if (keysPressed['w']) moveDirection.z -= movementSpeed;
    if (keysPressed['s']) moveDirection.z += movementSpeed;
    if (keysPressed['a']) moveDirection.x -= movementSpeed;
    if (keysPressed['d']) moveDirection.x += movementSpeed;
  
    player.position.add(moveDirection);
    player.position.y = 0.5;
  
    // Update camera position to follow the player
    camera.position.set(player.position.x, 10, player.position.z + cameraDistance);
    camera.lookAt(player.position);
  
    updateBullets();
    updateEnemies();
    detectCollisions();
    updateTimer();
    updatePlayerRotation();
  }

// Function to create enemies with different types and difficulties
function spawnEnemy() {
    const type = Math.floor(Math.random() * 3); // 3 types of enemies
    const colors = [
      { body: 0x00ff00, pants: 0x006400, shirt: 0x228B22 }, // Green Zombie
      { body: 0xffa500, pants: 0xff4500, shirt: 0xff6347 }, // Orange Zombie
      { body: 0xff0000, pants: 0x8b0000, shirt: 0xb22222 } // Red Zombie
    ];
    const healthValues = [50, 100, 150]; // Health values for Green, Orange, and Red zombies
    const speeds = [0.06, 0.04, 0.02]; // Movement speeds for Green, Orange, and Red zombies
  
    const color = colors[type];
    const health = healthValues[type];
    const speed = speeds[type];

    // Create body parts for zombie color scheme
    const bodyGeometry = new THREE.BoxGeometry(1, 1.5, 0.5); // Body
    const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8); // Head
    const limbGeometry = new THREE.BoxGeometry(0.4, 1, 0.4); // Limbs

    const body = new THREE.Mesh(bodyGeometry, new THREE.MeshBasicMaterial({ color: color.shirt }));
    const head = new THREE.Mesh(headGeometry, new THREE.MeshBasicMaterial({ color: color.body }));
    const leftArm = new THREE.Mesh(limbGeometry, new THREE.MeshBasicMaterial({ color: color.body }));
    const rightArm = new THREE.Mesh(limbGeometry, new THREE.MeshBasicMaterial({ color: color.body }));
    const leftLeg = new THREE.Mesh(limbGeometry, new THREE.MeshBasicMaterial({ color: color.pants }));
    const rightLeg = new THREE.Mesh(limbGeometry, new THREE.MeshBasicMaterial({ color: color.pants }));

    body.position.set(0, 0.75, 0);
    head.position.set(0, 1.75, 0);
    leftArm.position.set(-0.75, 0.5, 0);
    rightArm.position.set(0.75, 0.5, 0);
    leftLeg.position.set(-0.5, -0.75, 0);
    rightLeg.position.set(0.5, -0.75, 0);

    const enemy = new THREE.Object3D();
    enemy.add(body);
    enemy.add(head);
    enemy.add(leftArm);
    enemy.add(rightArm);
    enemy.add(leftLeg);
    enemy.add(rightLeg);

    enemy.position.set(
        Math.random() * 50 - 25,
        0.5,
        Math.random() * 50 - 25
    );

    enemy.health = health;
    enemy.speed = speed;

    // Add health bar
    const healthBarGeometry = new THREE.PlaneGeometry(3, 0.15);
    const healthBarMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const healthBar = new THREE.Mesh(healthBarGeometry, healthBarMaterial);
    healthBar.position.set(0, 2.6, 0);
    enemy.add(healthBar);

    enemy.healthBar = healthBar;
    enemies.push(enemy);
    scene.add(enemy);
}

// Function to detect collisions
function detectCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
      enemies.forEach((enemy, enemyIndex) => {
        const distance = bullet.position.distanceTo(enemy.position);
        if (distance < 1) {
          scene.remove(bullet);
          bullets.splice(bulletIndex, 1);
  
          enemy.health -= bulletDamage; // <--- Use the bulletDamage variable
  
          if (enemy.health > 50) {
            enemy.healthBar.material.color.set(0x00ff00); // Green
          } else if (enemy.health > 0) {
            enemy.healthBar.material.color.set(0xffff00); // Yellow
          } else {
            enemy.healthBar.material.color.set(0xff0000); // Red
          }
          enemy.healthBar.scale.x = enemy.health / 150;
  
          if (enemy.health <= 0) {
            scene.remove(enemy);
            enemies.splice(enemyIndex, 1);
            killCount++;
            Money += 10;
            MoneyElement.textContent = 'Money: ' + Money;
            healthElement.textContent = 'Health: ' + playerHealth;
          }
        }
      });
    });
  }

    enemies.forEach((enemy, enemyIndex) => {
        const distance = player.position.distanceTo(enemy.position);
        if (distance < 1) {
            playerHealth -= 10;
            healthElement.textContent = 'Health: ' + playerHealth;
            scene.remove(enemy);
            enemies.splice(enemyIndex, 1);

            if (playerHealth <= 0) {
                healthElement.textContent = 'Health: 0';
                // Stop the game
                cancelAnimationFrame(animateId);
                timerElement.textContent = 'Timer: ' + Math.floor((Date.now() - startTime) / 1000) + 's';
            }
        }
    });

// Function to update bullets
function updateBullets() {
    bullets.forEach((bullet, index) => {
        bullet.position.add(bullet.direction.clone().multiplyScalar(bulletSpeed));
        if (bullet.position.length() > 100) {
            scene.remove(bullet);
            bullets.splice(index, 1);
        }
    });
}

// Function to move enemies
function updateEnemies() {
    enemies.forEach((enemy) => {
        const direction = player.position.clone().sub(enemy.position).normalize();
        enemy.rotation.y = Math.atan2(direction.x, direction.z);
        enemy.position.add(direction.multiplyScalar(enemy.speed));
    });
}

// Update timer
function updateTimer() {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    timerElement.textContent = 'Timer: ' + elapsedTime + 's';

    // Update black hole cooldown timer
    const cooldown = Math.max(0, blackHoleCooldown - (Date.now() - lastBlackHoleUsage));
    document.getElementById('black-hole-cooldown').textContent = `${Math.ceil(cooldown / 1000)}s`;
}

// Function to create a black hole
function createBlackHole() {
    blackHoleActive = true;
    blackHoleStartTime = Date.now();

    const blackHoleGeometry = new THREE.SphereGeometry(2.5, 16, 16);
    const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.5 });
    const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
    blackHole.position.copy(player.position);
    scene.add(blackHole);

    const attractEnemies = () => {
        if (blackHoleActive) {
            enemies.forEach((enemy) => {
                const distance = blackHole.position.distanceTo(enemy.position);
                if (distance < 50) {
                    const direction = blackHole.position.clone().sub(enemy.position).normalize();
                    enemy.position.add(direction.multiplyScalar(enemySpeed));
                    enemy.health -= 0.5; // Health decay
                    if (enemy.health > 50) {
                        enemy.healthBar.material.color.set(0x00ff00); // Green
                    } else if (enemy.health > 0) {
                        enemy.healthBar.material.color.set(0xffff00); // Yellow
                    } else {
                        enemy.healthBar.material.color.set(0xff0000); // Red
                    }
                    enemy.healthBar.scale.x = enemy.health / 100;
                }
            });
            requestAnimationFrame(attractEnemies);
        }
    };

    attractEnemies();

    setTimeout(() => {
        blackHoleActive = false;
        scene.remove(blackHole);
    }, blackHoleDuration);
}

// Function to update the game state
function update() {
    const moveDirection = new THREE.Vector3();
    if (keysPressed['w']) moveDirection.z -= movementSpeed;
    if (keysPressed['s']) moveDirection.z += movementSpeed;
    if (keysPressed['a']) moveDirection.x -= movementSpeed;
    if (keysPressed['d']) moveDirection.x += movementSpeed;

    player.position.add(moveDirection);
    player.position.y = 0.5;

    updatePlayerRotation();

    // Update camera position to follow the player
    camera.position.set(player.position.x, 10, player.position.z + cameraDistance);
    camera.lookAt(player.position);

    updateBullets();
    updateEnemies();
    detectCollisions();
    updateTimer();
}

// Render loop
let animateId;
function animate() {
    update();
    animateId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (playerHealth <= 0) {
        // Stop the game
        cancelAnimationFrame(animateId);

        // Show the game over screen
        const gameOverElement = document.createElement('div');
        gameOverElement.id = 'game-over';
        gameOverElement.textContent = 'Game Over!';
        document.body.appendChild(gameOverElement);

        // Add a restart button
        const restartButton = document.createElement('button');
        restartButton.id = 'restart-button';
        restartButton.textContent = 'Restart';
        restartButton.addEventListener('click', restartGame);
        document.body.appendChild(restartButton);
    }

    // ...
}

function restartGame() {
    // Reset the game state
    playerHealth = 100;
    Money = 0;
    killCount = 0;
    startTime = Date.now();

    // Remove the game over screen and restart button
    const gameOverElement = document.getElementById('game-over');
    const restartButton = document.getElementById('restart-button');
    gameOverElement.remove();
    restartButton.remove();

    // Restart the game loop
    animateId = requestAnimationFrame(animate);
}

// Start the game loop
animate();
setInterval(spawnEnemy, enemySpawnInterval);
setInterval(shootBullet, shootInterval);
