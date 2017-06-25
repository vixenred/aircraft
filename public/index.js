'use strict';

let game = null;
let turret = null;
let sight = null;
let rocket1 = null;


function preload()
{
    game.load.image('background', 'assets/images/background.png');
    game.load.image('turret', 'assets/images/Turret.png');
    game.load.image('sight', 'assets/images/Sight.png');
    game.load.image('rocket1', 'assets/images/Rocket1.png');
    game.load.image('rocket2', 'assets/images/Rocket2.png');
    game.load.image('rocket3', 'assets/images/Rocket3.png');
    game.load.image('rocket4', 'assets/images/Rocket4.png');
}
function create()
{
    game.add.image(0, 0, 'background');
    turret = game.add.sprite(game.width*0.5, game.height*0.9, 'turret');
    turret.anchor.set(0.5, 0.7416);
    turret.scale.set(0.25);
    sight = game.add.sprite(game.width*0.5, game.height*0.5, 'sight');
    sight.anchor.set(0.5, 0.5);
    sight.scale.set(0.7);
    rocket1 = game.add.sprite(game.width*0.5, game.height*0.5, 'rocket1');
    rocket1.anchor.set(0.5, 0.5);
    rocket1.scale.set(0.3);
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
function render(){}

game = new Phaser.Game(800, 600, Phaser.CANVAS, 'aircraft', { preload: preload, create: create, update: update, render: render});
