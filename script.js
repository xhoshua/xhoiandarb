var myGamePiece;
var myObstacles = [];
var postoblock;
var slow;
var person1 = [];var person2 = [];var person3 = [];


function startGame() {
    myGamePiece = new component(30, 60, "main-car.png", 450, 200,"image");
    postoblock = new component(15, 695, "#ffffff00", 1230, 30);
    slow = new component(1100, 57, "#ffffff00", 0, 342);
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1300;
        this.canvas.height = 650;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            e.preventDefault();
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
    },
    stop : function() {
        clearInterval(this.interval);
    },    
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.angle = 0;
    this.moveAngle = 0;
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
          } 
        else if (type == "image") {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.drawImage(this.image, 
                this.width / -2, this.height / -2,
                this.width, this.height);
                ctx.restore(); 
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    } 
    this.newPos = function() {
        this.angle += this.moveAngle * Math.PI / 180;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
          crash = false;}
        return crash;
      }
}

function updateGameArea() {
    var x, y;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            alert('GAME OVER');
            return;
        }  if (myGamePiece.crashWith(postoblock)) {
            myGameArea.stop();
            alert('GAME OVER');
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 10 || everyinterval(110)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 600;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        y = myGameArea.canvas.height - 200;
        myObstacles.push(new component(60, 30, "police1.png", x, height,"image"));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -2;
        myObstacles[i].update();
    }
    if (myGameArea.frameNo == 5 || everyinterval(100)) {
        y = myGameArea.canvas.height;
        minWidth = 20;
        maxWidth = 950;
        width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
        x = myGameArea.canvas.width - 200;
        person1.push(new component(30, 40, "person_1.png", width, y-655,"image"));
    }
    for (i = 0; i < person1.length; i += 1){
        if (myGamePiece.crashWith(person1[i])) {
            person1[i].image.src = "persondead.png";
            person1[i].height=45;
            person1[i].width=45;
            person1[i].y -= 1; 
            }}
    for (i = 0; i < person1.length; i += 1){
        person1[i].y += 1;
        person1[i].update();
    }
    
    postoblock.update();
    slow.update();
    myGamePiece.moveAngle = 0;
    myGamePiece.speed = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.moveAngle = -3; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.moveAngle = 3; }

    if (myGamePiece.crashWith(slow)) {
        if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speed= 1; }
        if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speed= -1; }
        }else{
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speed= 5; }
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speed= -5; }}
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
