class Visualizer{
    static drawNetwork(ctx,network){
        const margin = 50;
        const top = margin;
        const left = margin;
        const width = ctx.canvas.width-2*margin;
        const height = ctx.canvas.height-2*margin;

        //Dividing height into levels and drawing each level input and output
        let levelHeight = height/network.levels.length;
        for(let i = network.levels.length-1; i>=0; i--){
            ctx.setLineDash([7,3]);
            const levelTop  = top+lerp(height-levelHeight,0,network.levels.length===0?0.5:i/(network.levels.length-1));
            Visualizer.drawLevel(ctx,network.levels[i],levelTop,left,width,levelHeight,
                i===network.levels.length-1 ? ['🠉','🠈','🠊','🠋']:[]);
        }
    }
    static drawLevel(ctx,level,top,left,width,height,outputLabels){
        const bottom = top+height;
        const right = left+width;
        const nodeRadius = 18;
        const {inputs,outputs,weights,biases} = level;
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
            ctx.beginPath();
            ctx.moveTo(
                Visualizer.#getNodeX(inputs, left, right, i),
                bottom
            );
            ctx.lineTo(
                Visualizer.#getNodeX(outputs, left, right, j),
                top
            );
            const value = weights[i][j];
            ctx.strokeStyle = getRGBA(value);
            ctx.lineWidth = 2;
            ctx.stroke();
            }
        }
        for(let i=0;i<inputs.length;i++){
            const x = Visualizer.#getNodeX(inputs,left,right,i);
            ctx.beginPath();
            ctx.arc(x,bottom,nodeRadius,0,Math.PI*2);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x,bottom,nodeRadius*0.8,0,Math.PI*2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
        }
        for(let i=0;i<outputs.length;i++){
            const x = Visualizer.#getNodeX(outputs,left,right,i);
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius,0,Math.PI*2);
            ctx.fillStyle = 'black';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x,top,nodeRadius*0.8,0,Math.PI*2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.lineWidth=2;
            ctx.setLineDash([3,3]);
            ctx.stroke();
            ctx.setLineDash([]);

            if(outputLabels[i]){
                ctx.beginPath();
                ctx.textAlign ='center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = 'black';
                ctx.strokeStyle = 'white';
                ctx.font = (nodeRadius*1.5)+"px Arial";
                ctx.fillText(outputLabels[i],x,top+nodeRadius*0.1);
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i], x, top+nodeRadius*0.1);
            }
        }
    }
    static #getNodeX(array,left,right,index){
        return lerp(left,right,array.length===1 ? 0.5:index/(array.length-1))
    }
}