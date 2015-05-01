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
		
		
		//GAME.Draw.clear();
		//GAME.Draw.rect(120,120,150,150, 'green');
		//GAME.Draw.circle(100,100,50, 'rgba(255,0,0,.5)');
		//GAME.Draw.text('Hello World',100,100,20,'#000000');
		

		// We're ready to resize:
		
		GAME.resize();
		
	
		
		
	},
	
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

GAME.Input = {
	x: 0,
	y: 0,
	tapped: false,
	set: function(data){
		this.x = (data.pageX - GAME.offset.left) / GAME.scale;
		this.y = (data.pageY - GAME.offset.top) / GAME.scale;
		this.tapped = true;
		//console.log('x: '+ this.x);
		//console.log('y: '+ this.y);
		GAME.Draw.circle(this.x,this.y,10,'red');
		
		
	}	
};



window.addEventListener('load', GAME.init, false);
window.addEventListener('resize', GAME.resize, false);