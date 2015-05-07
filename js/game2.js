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
	numOfTiles: 6,
	newX:1,
	newY:2,
	
	tiles: [],
	
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
		
		var img = new Image();
		img.src = 'tile-cover.gif';
		
		for(var i = 1; i < (GAME.numOfTiles * GAME.numOfTiles)+1; i ++){
			
			GAME.tiles.push(new GAME.Tile(GAME.newX,GAME.newY,img));
			GAME.newX += 53;
			if(i % 6 == 0){
				GAME.newY += 53;
				GAME.newX = 1;
			}
				
		}
		
		
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
			img: function(x,y,img){
				GAME.ctx.drawImage(img,x,y);
				
			}
			
		};
		
		GAME.resize();
		
		GAME.loop();	
		
	},/*  <---  END init function  */
	
	
	/*******************************************************************
		 
		 UPDATE function
		  
	******************************************************************/
	
	update: function(){
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

GAME.Touch = function(x, y) {
    this.type = 'touch';   
    this.x = x;            
    this.y = y;           
    this.r = 5;          
    this.opacity = 1;       
    this.fade = 0.05;     
    this.remove = false;                            
    this.update = function() { 
        this.opacity -= this.fade; 
        this.remove = (this.opacity < 0) ? true : false;
    };
    this.render = function() {
        GAME.Draw.circle(this.x, this.y, this.r, 'rgba(255,0,0,'+this.opacity+')');
    };
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

GAME.Tile = function(x,y,img){
	this.type = 'tile';
	this.img = img;
	this.x = x;
	this.y = y;
	this.update = function(){			
		this.render = function(){
			
			//GAME.Draw.rect(this.x,this.y,53,53,'rgba(112,112,112,1)');	
			GAME.Draw.img(this.x,this.y,this.img);			
		};	
	};	
};



window.addEventListener('load', GAME.init, false);
window.addEventListener('resize', GAME.resize, false);