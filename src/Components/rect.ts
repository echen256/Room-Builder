export default class Rect {

    width : number;
    height : number
    x : number
    y : number

    constructor (width : number, height: number, x: number, y: number ){
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y; 
        
    }

  
    
    static Equals(a : Rect, b: Rect){
        return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
    }

    Equals (other : Rect){
        return Rect.Equals(this,other)
    }

    area (){
        return this.x * this.y
    }

    getRotatedRect (rotation: number) {
          
        var rotatedWidth = Math.round(this.width * Math.cos( rotation) - this.height * Math.sin( rotation));
        var rotatedHeight = Math.round(this.width * Math.sin( rotation) + this.height * Math.cos(rotation));

        var rotatedX = this.x;
        var rotatedY = this.y;
      
         return new Rect(Math.abs(rotatedWidth),Math.abs(rotatedHeight),rotatedX, rotatedY);
    }

    contains (otherRect : Rect){
        var minBx = otherRect.x;
        var minAx = this.x;
        var maxAx = this.x + this.width;
        var maxBx = otherRect.x + otherRect.width;

        
        var minBy = otherRect.y;
        var minAy = this.y;
        var maxAy = this.y + this.height;
        var maxBy = otherRect.y + otherRect.height;
 
        return minBy >= minAy && minBx >= minAx && maxBy <= maxAy && maxBx <= maxAx
    }

    overlaps (otherRect : Rect) {
        var minBx = otherRect.x;
        var minAx = this.x;
        var maxAx = this.x + this.width;
        var maxBx = otherRect.x + otherRect.width;

        
        var minBy = otherRect.y;
        var minAy = this.y;
        var maxAy = this.y + this.height;
        var maxBy = otherRect.y + otherRect.height;


        var aLeftOfB = maxAx <= minBx;
        var aRightOfB = minAx >= maxBx;
        var aAboveB = minAy >= maxBy;
       var aBelowB = maxAy <= minBy;
    
        return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
    }
}