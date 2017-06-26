'use strict';


let game = null;
let turret = null;
let sight = null;

function preload()
{
    game.load.image('background', 'assets/images/background.png');
    game.load.image('turret', 'assets/images/Turret.png');
    game.load.image('sight', 'assets/images/Sight.png');
    game.load.image('rocket', 'assets/images/Rocket1.png');
    game.load.image('rocket2', 'assets/images/Rocket2.png');
    game.load.image('rocket3', 'assets/images/Rocket3.png');
    game.load.image('rocket4', 'assets/images/Rocket4.png');
    game.load.image('plane', 'assets/images/BluePlane.png');
}

function onTap()
{
    let rocket = game.add.sprite(turret.x, turret.y, 'rocket');

    rocket.anchor.set(0.5, 0.5);
    rocket.scale.set(0.3);
    game.physics.p2.enable(rocket, false);

    const angle = turret.rotation - game.math.degToRad(90);
    const speed = 300;

    rocket.body.rotation = turret.rotation;
    rocket.body.dynamic = true;
    rocket.body.collideWorldBounds = false;
    rocket.body.velocity.x = speed * Math.cos(angle);
    rocket.body.velocity.y = speed * Math.sin(angle);
}

function spawn()
{
    let plane = game.add.sprite(game.width * 0.1, game.height * 0.5, 'plane');

    plane.anchor.set(0.5, 0.5);
    plane.scale.set(0.3);
    game.physics.p2.enable(plane, false);

    const angle = 0;
    const speed = 250;

    plane.body.rotation = angle;
    plane.body.dynamic = true;
    plane.body.collideWorldBounds = false;
    plane.body.velocity.x = speed * Math.cos(angle);
    plane.body.velocity.y = speed * Math.sin(angle);

}

function create()
{
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.add.image(0, 0, 'background');
    turret = game.add.sprite(game.width * 0.5, game.height * 0.9, 'turret');
    turret.anchor.set(0.5, 0.7416);
    turret.scale.set(0.25);
    sight = game.add.sprite(game.width * 0.5, game.height * 0.5, 'sight');
    sight.anchor.set(0.5, 0.5);
    sight.scale.set(0.7);
    game.input.onTap.add(onTap, this);
    game.time.events.loop(Phaser.Timer.SECOND*3, spawn, this);

}

function update()
{
    let x = game.input.activePointer.clientX;
    let y = game.input.activePointer.clientY;
    let angle = Math.atan2(y - turret.y, x - turret.x);

    turret.rotation = angle + game.math.degToRad(90);
    sight.x = x;
    sight.y = y;
}

game = new Phaser.Game(800, 600, Phaser.CANVAS, 'aircraft', { preload: preload, create: create, update: update});