// http://paulirish.com/2011/requestanimationframe-for-smart-animating
// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


var GAME = {
	
	WIDTH: 320,
	HEIGHT: 480,
	RATIO: null,
	currentWidth: null,
	currentHeight: null,
	canvas:null,
	ctx: null,
	ua: null,
    android: null,
    ios: null,
	scale: 1,
	offset: {top: 0, left: 0},
	// Tile 
	numOfTiles: 6,
	numbers: (function(){
		var nums = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17];
		var randSet = [];
		while(nums.length > 0){
		    var randPos = Math.floor(Math.random()*nums.length);
		    var item = nums[randPos];
		    nums.splice(randPos,1);
		    randSet.push(item);
		}
		return randSet;
	})(),
	spriteTile:(function(){
		var img = new Image();
		img.src = 'img/cats.jpg';
		return img;
	})(),
	
	tiles: [],
	taps:[],
	numOfTaps:0,
	tilesTapped: 0,
	matches:0,
	tries: 0,
	
	/*******************************************************************
		 
		 INIT FUNCTION
		  
	******************************************************************/
	
	init:function(){	
		
		
		
		GAME.RATIO = GAME.WIDTH / GAME.HEIGHT;	
		GAME.currentWidth = GAME.WIDTH;
		GAME.currentHeight = GAME.HEIGHT;	
		GAME.canvas = document.getElementsByTagName('canvas')[0];
		GAME.canvas.width = GAME.WIDTH;
		GAME.canvas.height = GAME.HEIGHT;
		GAME.ctx = GAME.canvas.getContext('2d');
		GAME.ua = navigator.userAgent.toLowerCase();
		GAME.android = GAME.ua.indexOf('android') > -1 ? true : false;
		GAME.ios = ( GAME.ua.indexOf('iphone') > -1 || GAME.ua.indexOf('ipad') > -1  ) ? true : false;
		

		window.addEventListener('click', function(e) {
		    e.preventDefault();
		    GAME.Input.set(e);   	    
		}, false);
	
		window.addEventListener('touchstart', function(e) {
		    e.preventDefault();	    
		    GAME.Input.set(e.touches[0]);
		}, false);
		
		window.addEventListener('touchmove', function(e) {
		    e.preventDefault();
		}, false);
		
		window.addEventListener('touchend', function(e) {
		    e.preventDefault();
		}, false);
		
		var tempX = 2;
		var tempY = 30;
		
		for(var i = 1; i < (GAME.numOfTiles * GAME.numOfTiles)+1; i ++){			
			GAME.tiles.push(new GAME.Tile(GAME.spriteTile, 918, 0, 51, 51, tempX, tempY, 51, 51,GAME.numbers[i-1]));
			tempX += 53;
			if(i % 6 == 0){
				tempY += 53;
				tempX = 2;
			};	
			//console.log('Tile # ' + i + ' has random location of ' +GAME.numbers[i-1]);			
		};
		
		
		/*******************************************************************
		 
		 DRAW OBJECT
		  
		 ******************************************************************/
		
		GAME.Draw = {			
			clear: function(){
				GAME.ctx.clearRect(0,0,GAME.WIDTH,GAME.HEIGHT);
			},
			rect: function(x,y,w,h,col){
				GAME.ctx.fillStyle = col;
				GAME.ctx.fillRect(x,y,w,h);
			},
			circle: function(x,y,r,col){
				GAME.ctx.fillStyle = col;
				GAME.ctx.beginPath();
				GAME.ctx.arc(x + 5, y + 5, r, 0, Math.PI * 2, true);
				GAME.ctx.closePath();
				GAME.ctx.fill();				
			},
			text: function(string,x,y,size,col){
				GAME.ctx.font = 'bold '+size+'px Monospace';
				GAME.ctx.fillStyle = col;
				GAME.ctx.fillText(string,x,y);				
			},
			img: function(img, sx, sy, sw, sh, dx, dy, dw, dh){ // img, sx, sy, sw, sh, dx, dy, dw, dh
				GAME.ctx.drawImage(img,sx,sy,51,51,dx,dy,50,50);
				
			}
			
		};
		//GAME.Draw.circle(100, 350, 10, 'rgba(255,0,0,1');
		GAME.resize();
		
		GAME.loop();	
		
	},/*  <---  END init function  */
	
	
	/*******************************************************************
		 
		 UPDATE function
		  
	******************************************************************/
	
	update: function(){
		// If the user taps the screen
		if(GAME.Input.tapped){	
			//console.log('min y: '+ GAME.tiles[0].dy);
			//console.log('user tap: '+ GAME.Input.y);
			if(GAME.Input.y > GAME.tiles[0].dy && GAME.Input.y < GAME.tiles[35].dy + 50){
			// only continue of there are less than two taps registered
				if(GAME.tilesTapped < 2){ 				
					GAME.tilesTapped += 1; // register one tap
					GAME.taps.push({x:GAME.Input.x, y:GAME.Input.y}); // store the first tap
					GAME.Input.tapped = false; // reset the taps to false
					// Check the first tap's location, and reveal the corresponding tile
					if(GAME.tilesTapped == 1){		
						for(var i=0; i < GAME.tiles.length; i += 1){	
							if(GAME.taps[0].x > GAME.tiles[i].dx && GAME.taps[0].x < GAME.tiles[i].dx + 51 && GAME.taps[0].y > GAME.tiles[i].dy && GAME.taps[0].y < GAME.tiles[i].dy + 51){
								GAME.taps[0].num = GAME.tiles[i].randLoc;
								GAME.taps[0].index = i;
								GAME.tiles[i].selected = true;
								console.log('First index: ' + i);
							}
						}								
					}
					// Check the second tap's location, and reveal the corresponding tile
					if(GAME.tilesTapped == 2){
						GAME.tries +=1;
						for(var i=0; i < GAME.tiles.length; i += 1){
							if(GAME.taps[1].x > GAME.tiles[i].dx && GAME.taps[1].x < GAME.tiles[i].dx + 51 && GAME.taps[1].y > GAME.tiles[i].dy && GAME.taps[1].y < GAME.tiles[i].dy + 51){
								GAME.taps[1].num = GAME.tiles[i].randLoc;
								GAME.taps[1].index = i;
								GAME.tiles[i].selected = true;
								console.log('Second index: ' + i);
							}
						}	
						// If the two registerd taps match...					
						if(GAME.taps[0].num == GAME.taps[1].num){
							console.log('MATCH!');
							GAME.tilesTapped = 0;
							GAME.taps = [];			
							GAME.matches += 1;		
						}else{
							console.log('NO MATCH!');						
							setTimeout(function(){ 					
								GAME.tiles[GAME.taps[0].index].selected = false;
								GAME.tiles[GAME.taps[1].index].selected = false;
								GAME.taps = [];
								GAME.tilesTapped = 0;						
							}, 1000);					
						};
					};			
				};
			};
		};
		
		for(i=0; i < GAME.tiles.length; i += 1){
			GAME.tiles[i].update();
		}
		
		
		
		
	},
	
	/*******************************************************************
		 
		 RENDER function
		  
	******************************************************************/
	
	render: function(){	
	    for (var i = 0; i < GAME.tiles.length; i += 1) {  	
	        GAME.tiles[i].render();
	    }
	    GAME.Draw.rect(2,2,(GAME.WIDTH) - 5,26,'#FF0000');
	},
	
	/*******************************************************************
		 
		 LOOP function
		  
	******************************************************************/
	
	loop: function(){	
		requestAnimFrame(GAME.loop);	
		GAME.update();
		GAME.render();	
	},
	
	/*******************************************************************
		 
		 RESIZE function
		  
	******************************************************************/
	
	resize:function(){		
		GAME.currentHeight = window.innerHeight;
        GAME.currentWidth = GAME.currentHeight * GAME.RATIO;
        if (GAME.android || GAME.ios) {
            document.body.style.height = (window.innerHeight + 50) + 'px';
        }
        GAME.canvas.style.width = GAME.currentWidth + 'px';
        GAME.canvas.style.height = GAME.currentHeight + 'px';
        GAME.scale = GAME.currentWidth / GAME.WIDTH;
        GAME.offset.top = GAME.canvas.offsetTop;
        GAME.offset.left = GAME.canvas.offsetLeft;
        window.setTimeout(function() {
                window.scrollTo(0,1);
        }, 1);		
	}	
};
GAME.flipTile = function(x,y){
	
	
};

GAME.Input = {
	x: 0,
	y: 0,
	tapped: false,
	set: function(data){
		this.x = (data.pageX - GAME.offset.left) / GAME.scale;
		this.y = (data.pageY - GAME.offset.top) / GAME.scale;
		this.tapped = true;
	}	
};

GAME.Tile = function(img, sx, sy, sw, sh, dx, dy, dw, dh,randLoc){
	this.type = 'tile';
	this.img = img;
	this.sx = sx;
	this.sy = sy;
	this.sw = sw;
	this.sh = sh;
	this.dx = dx;
	this.dy = dy;
	this.dw = dw;
	this.dh = dh;
	this.randLoc = randLoc;
	this.selected = false;
	this.update = function(){	
		if(this.selected){
			this.sx = this.randLoc * 51;		
		}else{
			this.sx = 918;
		}		
		this.render = function(){
			GAME.Draw.img(this.img,this.sx,this.sy,this.sw,this.sh,this.dx,this.dy,this.dw,this.dh);			
		};	
	};	
};


window.addEventListener('load', GAME.init, false);
window.addEventListener('resize', GAME.resize, false);