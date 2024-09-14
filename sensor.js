class Sensor{
    constructor(car){
        this.car = car;
        this.rayLength = 200;
        this.rayCount = 5;
        this.raySpread = Math.PI/2;

        this.rays = [];
        this.readings = [];
    }
    update(c,roadBorders,traffic,drawSensor){
        let readings = [];
        this.rays.forEach(ray=>{
            readings.push(this.#getReading(ray,roadBorders,traffic));
        })
        this.readings=readings;
        this.#castRays(c,drawSensor);
    }
    #getReading(ray,roadBorders,traffic){
        let touches = [];
        for(let i=0;i<roadBorders.length;i++){
            let touch = getIntersection(ray[0],ray[1],roadBorders[i][0],roadBorders[i][1]);
            //Checking for intersection
            if(touch) touches.push(touch);
        }
        for(let i=0;i<traffic.length;i++){
            const poly = traffic[i].polygon;
            for(let j=0;j<poly.length;j++){
                let touch = getIntersection(ray[0],ray[1],poly[j],poly[(j+1)%poly.length]);
                if(touch) touches.push(touch);
            }
        }
        if(touches.length===0) return null;
        else {
            let offsets = touches.map(e=>e.offset);
            let minOffset = Math.min(...offsets);
            return touches.find(e=>e.offset===minOffset);
        }
    }
    #castRays(carCtx,drawSensor){
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
          let start = { x: this.car.x, y: this.car.y };
          let angle =
            lerp(
              this.raySpread / 2,
              -this.raySpread / 2,
              this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;
          let end = {
            x: this.car.x - this.rayLength * Math.sin(angle),
            y: this.car.y - this.rayLength * Math.cos(angle),
          };
          this.rays.push([start, end]);
        }
        if(drawSensor) this.draw(carCtx);
    }
    draw(c){
        c.lineWidth = 1;
        for(let i=0;i<this.rayCount;i++){
            c.beginPath();
            c.moveTo(this.rays[i][0].x,this.rays[i][0].y);
            c.strokeStyle = "yellow";
            if(this.readings[i]){
                c.lineTo(this.readings[i].x,this.readings[i].y);
                c.stroke();
                c.beginPath();
                c.globalAlpha = 0.5;
                c.arc(this.readings[i].x, this.readings[i].y,5,0,Math.PI*2);
                // c.moveTo(this.readings[i].x, this.readings[i].y);
                // c.lineTo(this.rays[i][1].x, this.rays[i][1].y);
                // c.strokeStyle = "black";
                c.fillStyle = 'yellow';
                c.fill();
                c.globalAlpha = 1;
            }
            else{
                c.lineTo(this.rays[i][1].x,this.rays[i][1].y)
                c.stroke();
            };
        }
    }
}