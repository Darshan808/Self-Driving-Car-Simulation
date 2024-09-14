class Car{
    constructor(x,y,width,height,type,maxSpeed=3,color='blue'){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.controls = new Controls(type);
        //Linear Physics
        this.speed = 0;
        this.acceleration = 0.2;
        this.useBrain = type==='AI';
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        //Rotational Physics
        this.angle = 0;
        //Sensors
        if(type!=="DUMMY"){
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount,6,4]);
        }
        this.damage = false;
        //Actual corners of car
        this.polygon = [];
        this.img = new Image();
        this.img.src = 'car.png';

        this.mask = document.createElement('canvas');
        this.mask.width = width+10;
        this.mask.height = height+10;
        const maskCtx = this.mask.getContext('2d');
        this.img.onload = ()=>{
            maskCtx.fillStyle = color;
            maskCtx.rect(0,0,this.mask.width,this.mask.height);
            maskCtx.fill();
            maskCtx.globalCompositeOperation = "destination-atop";
            maskCtx.drawImage(this.img,0,0);
        }

    }
    draw(c){
        c.beginPath();
        c.save();
        c.translate(this.x,this.y);
        c.rotate(-this.angle);
        c.drawImage(this.mask,-this.width/2,-this.height/2);
        c.globalCompositeOperation = 'multiply';
        c.drawImage(this.img,-this.width/2,-this.height/2);
        // c.rect(-this.width/2,-this.height/2,this.width,this.height);
        c.fill();
        c.restore();
    }
    update(c,roadBorders,traffic,color,drawSensor = false){
        if(!this.damage){
            this.#move();
            if(this.sensor) this.damage = this.#accessDamage(roadBorders,traffic);
            this.#createPolygon();
        }
        if(this.sensor){
            this.sensor.update(c,roadBorders,traffic,drawSensor);
            const offsets = this.sensor.readings.map(r=>r===null?0:1-r.offset);
            const outputs = NeuralNetwork.feedForward(offsets,this.brain);
            if(this.useBrain){
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
        this.draw(c,color);
    }
    #move(){
        if(this.controls.forward){
            this.speed +=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -=this.acceleration;
        }
        if(this.speed>0){
            this.speed -=this.friction;
        }
        if(this.speed<0){
            this.speed +=this.friction;
        }
        if(this.speed>=this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed<=-this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }
        if(this.speed!=0){
            const flip = this.speed>0 ? 1 : -1;
            if(this.controls.left){
                this.angle +=0.03*flip;
            }
            if(this.controls.right){
                this.angle -=0.03*flip;
            }
            
        }
        this.x -= this.speed * Math.sin(this.angle);
        this.y -= this.speed*Math.cos(this.angle);
    }
    #accessDamage(roadBorders,traffic){
        for(let i=0;i<roadBorders.length;i++){
            if(polyIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polyIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }
    #createPolygon(){
        const polygon = [];
        const rad = Math.hypot(this.width,this.height)/2;
        const alpha = Math.atan2(this.width,this.height);
        polygon.push({
            x:this.x-rad*Math.sin(this.angle-alpha),
            y:this.y-rad*Math.cos(this.angle-alpha),
        })
        polygon.push({
            x:this.x-rad*Math.sin(this.angle+alpha),
            y:this.y-rad*Math.cos(this.angle+alpha),
        })
        polygon.push({
            x:this.x-rad*Math.sin(this.angle-alpha+Math.PI),
            y:this.y-rad*Math.cos(this.angle-alpha+Math.PI),
        })
        polygon.push({
            x:this.x-rad*Math.sin(this.angle+alpha+Math.PI),
            y:this.y-rad*Math.cos(this.angle+alpha+Math.PI),
        })
        this.polygon=polygon;
    }
}