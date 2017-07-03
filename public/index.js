'use strict';

let game = null;
let turret = null;
let sight = null;
let rocketsCollisionGroup = null;
let planesCollisionGroup = null;
let planes = null;
let rockets = null;
let explosions = null;
let buttonMinus = null;
let buttonPlus = null;
let textBet = null;
let totalKilled = 0;

const STATE_BATTLE = 1;
const STATE_BOSS = 2;
const STATE_BOXES = 3;
const BOSS_TYPE = 10;
let state = STATE_BATTLE;
let boxes = null;
const BET_INDEX_DEFAULT = 0;
const BETS = [10, 20, 30, 50, 100];
const BET_DEFAULT = BETS[BET_INDEX_DEFAULT];
let betIndex = BET_INDEX_DEFAULT;
let bet = BETS[betIndex];


function preload()
{
    game.load.image('background', 'assets/images/background.png');
    game.load.image('turret', 'assets/images/turret.png');
    game.load.image('sight', 'assets/images/sight.png');
    game.load.atlas('rockets', 'assets/images/rockets.png', 'assets/images/rockets.json', null);
    game.load.atlas('planes', 'assets/images/planes.png', 'assets/images/planes.json', null);
    game.load.atlas('boxes', 'assets/images/boxes.png', 'assets/images/boxes.json', null);
    game.load.image('buttonMinus', 'assets/images/buttonMinus.png');
    game.load.image('buttonPlus', 'assets/images/buttonPlus.png');
    game.load.spritesheet('explode', 'assets/images/explode.png', 128, 128);
    game.load.bitmapFont('desyrel', 'assets/fonts/desyrel.png', 'assets/fonts/desyrel.xml');
    game.load.physics('planePhysics', 'assets/PlanesPhysics.json');
}

function onBetMore()
{
    betIndex++;
    if (betIndex > BETS.length - 1)
        betIndex = BETS.length - 1;
    bet = BETS[betIndex];
    textBet.text = bet;
}

function onBetLess()
{
    betIndex--;
    if (betIndex < 0)
        betIndex = 0;
    bet = BETS[betIndex];
    textBet.text = bet;
}

function setupExplosion (explosion)
{
    explosion.anchor.x = 0.5;
    explosion.anchor.y = 0.5;
    explosion.animations.add('explode');
}

function explode (x, y, scale)
{
    let explosion = explosions.getFirstExists(false);

    explosion.scale.setTo(scale);
    explosion.reset(x, y);
    explosion.play('explode', 30, false, true);
}

function over()
{
    console.log('button over');
}

function spawn(planeType, spriteKey)
{

    let plane = planes.create(game.width * 0.1, game.height * 0.5, 'planes', spriteKey);

    plane.name = game.rnd.uuid();
    plane.anchor.set(0.5, 0.5);
    plane.scale.setTo(0.3);
    game.physics.p2.enable(plane, true);
    plane.body.clearShapes();
    plane.body.loadPolygon('planePhysics', spriteKey, 0.3);
    plane.body.setCollisionGroup(planesCollisionGroup);
    plane.body.collides(rocketsCollisionGroup);

    const angle = 0;
    const speed = 250;

    plane.body.rotation = angle;
    plane.body.dynamic = true;
    plane.body.collideWorldBounds = false;
    plane.body.velocity.x = speed * Math.cos(angle);
    plane.body.velocity.y = speed * Math.sin(angle);

    plane.planeType = planeType;

}

function spawnMobPlane()
{
    if (state !== STATE_BATTLE)
        return;
    let planeType = game.rnd.between(1, 8);
    let index = (planeType % 4) + 1;

    spawn(planeType, index.toString());
}

function spawnBossPlane()
{
    if (state !== STATE_BOSS)
        return;
    let index = game.rnd.between(1, 2);

    spawn(BOSS_TYPE, 'Boss' + index.toString());
}



function spawnBox(spriteKey)
{
    const spawnY = 0.2 * game.height;
    const spawnX = (0.125 + (0.25 * spriteKey)) * game.width;
    let box = boxes.create(spawnX, spawnY, 'boxes', (spriteKey + 1));

    box.anchor.set(0.5, 0.5);
    box.scale.setTo(0.3);
    box.name = spriteKey;

    game.add.tween(box).to( { y: game.height * (0.4 + (spriteKey % 2 === 0 ? 0.1 : 0))}, 3000, 'Linear', true);
}
function spawnBoxes()
{
    if (state !== STATE_BOXES)
        return;
    for (let i = 0; i < 4; i++)
        spawnBox(i);

}



function hitPlane(rocketBody, planeBody)
{
    rocketBody.sprite.kill();
    planeBody.sprite.kill();
    explode(rocketBody.x, rocketBody.y, 0.3);
    explode(planeBody.x, planeBody.y, 1);
    totalKilled += 1;
    if (totalKilled === 2)
    {
        state = STATE_BOSS;
        game.time.events.remove(spawnMobPlane);
        game.time.events.add(Phaser.Timer.SECOND * 2, spawnBossPlane, this);
    }

    if (planeBody.sprite.planeType === BOSS_TYPE)
    {
        state = STATE_BOXES;
        game.time.events.add(Phaser.Timer.SECOND * 2, spawnBoxes, this);
    }
}


function onTap()
{

    let rocket = rockets.create(turret.x, turret.y, 'rockets');
    let betScale = Math.sqrt(Math.sqrt(bet / BET_DEFAULT));
    let scale = 75 * betScale / rocket.width;

    rocket.customValues = {};
    rocket.customValues.bet = bet;
    game.physics.p2.enable(rocket, true);
    rocket.body.setRectangle(60, 20);
    rocket.body.setCollisionGroup(rocketsCollisionGroup);
    rocket.body.collides(planesCollisionGroup, hitPlane, this);
    rocket.anchor.set(0.5, 0.5);
    rocket.scale.setTo(scale);

    const angle = turret.rotation;
    const speed = 300+(bet*2);

    rocket.body.rotation = turret.rotation;
    rocket.body.dynamic = true;
    rocket.body.collideWorldBounds = false;
    rocket.body.velocity.x = speed * Math.cos(angle);
    rocket.body.velocity.y = speed * Math.sin(angle);
}

function create()
{
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);

    game.add.image(0, 0, 'background');

    turret = game.add.sprite(game.width * 0.5, game.height * 0.85, 'turret');
    turret.anchor.set(0.335, 0.5);
    turret.scale.set(0.25);

    sight = game.add.sprite(game.width * 0.5, game.height * 0.5, 'sight');
    sight.anchor.set(0.5, 0.5);
    sight.scale.set(0.7);

    buttonMinus = game.add.button(game.width * 0.4, game.height * 0.95, 'buttonMinus', onBetLess, this);
    buttonMinus.anchor.set(0.5, 0.5);
    buttonMinus.scale.set(0.5);
    buttonMinus.onInputOver.add(over, this);

    buttonPlus = game.add.button(game.width * 0.6, game.height * 0.95, 'buttonPlus', onBetMore, this);
    buttonPlus.anchor.set(0.5, 0.5);
    buttonPlus.scale.set(0.5);
    buttonPlus.onInputOver.add(over, this);

    game.input.onTap.add(onTap, this);

    game.time.events.loop(Phaser.Timer.SECOND*3, spawnMobPlane, this);

    rocketsCollisionGroup = game.physics.p2.createCollisionGroup();
    planesCollisionGroup = game.physics.p2.createCollisionGroup();

    planes = game.add.group();
    rockets = game.add.group();
    boxes = game.add.group();
    explosions = game.add.group();

    explosions.createMultiple(30, 'explode');
    explosions.forEach(setupExplosion, this);

    textBet = game.add.bitmapText(game.width * 0.5, game.height * 0.93, 'desyrel', bet, 64);
    textBet.anchor.set(0.5);
}

function update()
{
    let x = game.input.activePointer.clientX;
    let y = game.input.activePointer.clientY;

    turret.rotation = Math.atan2(y - turret.y, x - turret.x);
    sight.x = x;
    sight.y = y;
}

game = new Phaser.Game(800, 600, Phaser.CANVAS, 'aircraft', { preload: preload, create: create, update: update});