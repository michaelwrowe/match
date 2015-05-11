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
	entities: [],
	nextBubble: 100,
	
		
	
	
	
	/*******************************************************************
		 
		 INIT FUNCTION
		  
	******************************************************************/
	
	init:function(){
		
		// The proportion of the width to the height
		GAME.RATIO = GAME.WIDTH / GAME.HEIGHT;
		
		// These will change when the screen is resized
		GAME.currentWidth = GAME.WIDTH;
		GAME.currentHeight = GAME.HEIGHT;
		
		// This is the canvas element
		GAME.canvas = document.getElementsByTagName('canvas')[0];
		
		// setting this is important
        // otherwise the browser will
        // default to 320 x 200
		
		GAME.canvas.width = GAME.WIDTH;
		GAME.canvas.height = GAME.HEIGHT;
		
		// the canvas context enables us to 
        // interact with the canvas api

		GAME.ctx = GAME.canvas.getContext('2d');
			
		
		// we need to sniff out Android and iOS
		// so that we can hide the address bar in
		// our resize function
		GAME.ua = navigator.userAgent.toLowerCase();
		GAME.android = GAME.ua.indexOf('android') > -1 ? true : false;
		GAME.ios = ( GAME.ua.indexOf('iphone') > -1 || GAME.ua.indexOf('ipad') > -1  ) ? 
		    true : false;
		
		
		// listen for clicks
		window.addEventListener('click', function(e) {
		    e.preventDefault();
		    GAME.Input.set(e);
		    
		}, false);
		
		// listen for touches
		window.addEventListener('touchstart', function(e) {
		    e.preventDefault();
		    // the event object has an array
		    // named touches; we just want
		    // the first touch
		    
		    GAME.Input.set(e.touches[0]);
		}, false);
		window.addEventListener('touchmove', function(e) {
		    // we're not interested in this,
		    // but prevent default behaviour
		    // so the screen doesn't scroll
		    // or zoom
		    e.preventDefault();
		}, false);
		window.addEventListener('touchend', function(e) {
		    // as above
		    e.preventDefault();
		}, false);
		
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
				
			}
			
		};
		
		
		
		

		// We're ready to resize:
		
		GAME.resize();
		
		GAME.loop();
		
		
	},/*  <---  END init function  */
	
	
	/*******************************************************************
		 
		 UPDATE function
		  
	******************************************************************/
	
	update: function(){
		var i;
		
		checkCollision = false;
		GAME.nextBubble -= 1;
		
		if(GAME.nextBubble < 0){	
			GAME.entities.push(new GAME.Bubble());
			GAME.nextBubble = (Math.random() * 100) + 100;
			
		}
		
		
		if(GAME.Input.tapped){
			GAME.entities.push(new GAME.Touch(GAME.Input.x, GAME.Input.y));
			GAME.Input.tapped = false;
			checkCollision = true;
			
		};
		
		for(i=0; i < GAME.entities.length; i += 1){
			GAME.entities[i].update();
			
			
			if(GAME.entities[i].type === 'bubble' && checkCollision){
				hit = GAME.collides(GAME.entities[i],{x:GAME.Input.x,y:GAME.Input.y,r:7});
				GAME.entities[i].remove = hit;
				
			}
			
			
			
			if(GAME.entities[i].remove){
				GAME.entities.splice(i,1);
				
			}
		}
	},
	
	/*******************************************************************
		 
		 RENDER function
		  
	******************************************************************/
	
	render: function(){
		
		var i;

   		GAME.Draw.rect(0, 0, GAME.WIDTH, GAME.HEIGHT, '#036');
   		

	    // cycle through all entities and render to canvas
	    for (i = 0; i < GAME.entities.length; i += 1) {
	        GAME.entities[i].render();
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
        // resize the width in proportion
        // to the new height
        GAME.currentWidth = GAME.currentHeight * GAME.RATIO;
        // this will create some extra space on the
        // page, allowing us to scroll past
        // the address bar, thus hiding it.
        if (GAME.android || GAME.ios) {
            document.body.style.height = (window.innerHeight + 50) + 'px';
        }
        // set the new canvas style width and height
        // note: our canvas is still 320 x 480, but
        // we're essentially scaling it with CSS
        GAME.canvas.style.width = GAME.currentWidth + 'px';
        GAME.canvas.style.height = GAME.currentHeight + 'px';
        
        // the amount by which the css resized canvas
        // is different to the actual (480x320) size.
        GAME.scale = GAME.currentWidth / GAME.WIDTH;
        // position of canvas in relation to
        // the screen
        GAME.offset.top = GAME.canvas.offsetTop;
        GAME.offset.left = GAME.canvas.offsetLeft;
        
        
        // we use a timeout here because some mobile
        // browsers don't fire if there is not
        // a short delay
        window.setTimeout(function() {
                window.scrollTo(0,1);
        }, 1);		
	}
	
};

GAME.Touch = function(x, y) {

    this.type = 'touch';    // we'll need this later
    this.x = x;             // the x coordinate
    this.y = y;             // the y coordinate
    this.r = 5;             // the radius
    this.opacity = 1;       // initial opacity; the dot will fade out
    this.fade = 0.05;       // amount by which to fade on each game tick
    this.remove = false;    // flag for removing this entity. POP.update
                            // will take care of this

    this.update = function() {
        // reduce the opacity accordingly
        this.opacity -= this.fade; 
        // if opacity if 0 or less, flag for removal
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

GAME.Bubble = function(){
	this.type = 'bubble';
	this.r = (Math.random() * 20) + 10;
	this.speed = (Math.random() * 3) + 1;
	this.x = (Math.random() * (GAME.WIDTH) - this.r);
	this.y = GAME.HEIGHT + (Math.random() * 100) + 100;
	this.remove = false;
	this.update = function(){
		
		// move up the screen by 1 pixel
		this.y -= this.speed;
		
		// if off-screen, flag for removal
		if(this.y < -100){			
			this.remove = true;
		};		
		this.render = function(){
			GAME.Draw.circle(this.x,this.y, this.r,'rgba(255,255,255,1)');			
		};	
	};	
};
GAME.collides = function(a, b) {

        var distance_squared = ( ((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y)));

        var radii_squared = (a.r + b.r) * (a.r + b.r);

        if (distance_squared < radii_squared) {
            return true;
        } else {
            return false;
        }
};



window.addEventListener('load', GAME.init, false);
window.addEventListener('resize', GAME.resize, false);