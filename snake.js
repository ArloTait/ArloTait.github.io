function Game(canvas, options) {
	this.canvas= canvas;
	this.context = canvas.getContext('2d');
    
	this.score = 0;
	this.key = 'right';
	this.entities = [];

	this.options = {
		fps: 15
	};

	if (options) {
		for (var i in options) this.options[i] = options[i];
	
    }

	this.scale();

}

Game.prototype.start = function () {
	this.keybindings();
	this.gameLoop();
};


Game.prototype.stop = function() {
	this.pause = true;
};

Game.prototype.scale = function () {
	this.ratio = innerWidth < innerHeight ? innerWidth : innerHeight;
	this.tile = (this.ratio / 20) | 0;
	this.grid = this.ratio / this.tile;

	this.canvas.width = this.canvas.height = this.ratio;
};


Game.prototype.addEntity = function (entity) {
	this.entities.push(entity);
};

Game.prototype.collide = function(a, b){
	return a.x === b.x && a.y === b.y;
};

Game.prototype.keybindings = function (){
	var that = this;

	var keys = {
		a: 65,
		left: 37,
		d: 68,
		right:39,
		w: 87,
		up: 38,
		s:83,
		down:40
	};



	document.onkeydown = function (e) {
        switch ((e.which || e.keyCode) | 0) {
            case keys.a:
            case keys.left:
                if (that.key !== 'right') that.key = 'left';
                break;

            case keys.d:
            case keys.right:
                if (that.key !== 'left') that.key = 'right';
                break;

            case keys.w:
            case keys.up:
                if (that.key !== 'down') that.key = 'up';
                break;

            case keys.s:
            case keys.down:
                if (that.key !== 'up') that.key = 'down';
        }
    };

};



Game.prototype.gameLoop = function () {
    if(this.pause) return;

    var self = this,
        ctx = this.context;

    
    ctx.fillStyle = "#123";

    
    ctx.globalAlpha = 0.5;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    
    ctx.globalAlpha = 1;

    var i = this.entities.length;

    while(i--) {
        var entity = this.entities[i];
        if(entity.update) entity.update();
        if(entity.draw) entity.draw(ctx);
    }
    

    setTimeout(function(){
        self.gameLoop()
    }, 1000 / this.options.fps);
};




function Snake(game, food){
    var tile = game.tile;
    var grid = game.grid;
    var collide = game.collide;

    this.x = 4;
    this.y = 4;
    this.segments = [];

    this.update = function() {

        
        if(game.key === 'left') this.x--;
        if(game.key === 'right') this.x++;
        if(game.key === 'up') this.y--;
        if(game.key === 'down') this.y++;

        
        this.x = (this.x + tile) % tile;
        this.y = (this.y + tile) % tile;
        
        
        if (game.collide(this, food)) {

            
            food.x = food.y = Math.random() * tile | 0;
            
            
            if (!((game.score += 10) % 50)) {
                game.options.fps += 5;
            }
            
        } else {
            
            if (this.segments.length) this.segments.pop();
        }
        
        
       
        this.segments.unshift({x:this.x, y:this.y});
        
       
        var i = this.segments.length;
        while (--i) {
            if(game.collide(this, this.segments[i])) {
                
                return this.segments.splice(i);
            }
        }
 
    };
    
    this.draw = function(ctx) {
        
        var i = this.segments.length;
        while (i--) {
            var segment = this.segments[i];
            ctx.fillStyle = !i ? '#0cf' : '#0ae';
            ctx.fillRect(
            segment.x * grid,
            segment.y * grid,
            grid, grid);
        }
    };
}


function Food(game){
    var grid = game.grid;
    this.x = 4;
    this.y = 4;

    this.draw = function(ctx){
        ctx.fillStyle = "#f05";
        ctx.fillRect(this.x * grid, this.y * grid, grid, grid);
    };
}


var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var game = new Game(canvas);
var food = new Food(game);
var snake = new Snake(game, food);

game.addEntity(food);
game.addEntity(snake);
game.start();
