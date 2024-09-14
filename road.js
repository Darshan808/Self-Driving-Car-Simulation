class road{
    constructor(x,width,numberOfLanes=3){
        this.x = x;
        this.width = width;
        this.numberOfLanes = numberOfLanes;

        this.left = x-width/2+10;
        this.right = x+width/2-10;

        const infinity = 100000;
        this.top = -infinity;
        this.bottom = +infinity;

        const topLeft = {x:this.left,y:this.top};
        const bottomLeft = {x:this.left,y:this.bottom};
        const topRight = {x:this.right,y:this.top};
        const bottomRight = {x:this.right,y:this.bottom};

        this.borders = [
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ]
    }
    draw(c){
        c.lineWidth = 5;
        c.strokeStyle = 'white';
        for (let i=1;i<=this.numberOfLanes-1;i++){
            let x = lerp(this.left,this.right,i/this.numberOfLanes);
            c.setLineDash([20,20]);
            c.beginPath();
            c.moveTo(x,this.top);
            c.lineTo(x,this.bottom);
            c.stroke();
        }
        c.setLineDash([]);
        this.borders.forEach(border=>{
            c.beginPath();
            c.moveTo(border[0].x,border[0].y);
            c.lineTo(border[1].x,border[1].y);
            c.stroke();
        })
    }
    getLaneCenter(laneIndex){
        const laneWidth = this.width/this.numberOfLanes;
        return (this.left+Math.min(laneIndex,this.numberOfLanes-1)*laneWidth+laneWidth/2)-2;
    }
}