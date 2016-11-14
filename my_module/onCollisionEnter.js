function OnCollisionEnter(argument) {
	// body...
}

OnCollisionEnter.prototype.isCollidingRC = function (rect, circle) {
	var distX = Math.abs(circle.x - rect.x - rect.w / 2);
    var distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > (rect.w / 2 + circle.r)) {
        return false;
    }
    if (distY > (rect.h / 2 + circle.r)) {
        return false;
    }

    if (distX <= (rect.w / 2)) {
        return true;
    }
    if (distY <= (rect.h / 2)) {
        return true;
    }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r));
}

OnCollisionEnter.prototype.isCollidingCRA = function (rect, circle, rectAngle){
	// Rotate circle's center point back
	var unrotatedCircleX = Math.cos((rect.rectAngle/180)*Math.PI) * (circle.x - rect.x) - 
	        Math.sin((rect.rectAngle/180)*Math.PI) * (circle.y - rect.y) + rect.x;
	var unrotatedCircleY  = Math.sin((rect.rectAngle/180)*Math.PI) * (circle.x - rect.x) + 
	        Math.cos((rect.rectAngle/180)*Math.PI) * (circle.y - rect.y) + rect.y;
	 
	// Closest point in the rectangle to the center of circle rotated backwards(unrotated)
	var closestX, closestY;
	 
	// Find the unrotated closest x point from center of unrotated circle
	if (unrotatedCircleX  < rect.x)
	    closestX = rect.x;
	else if (unrotatedCircleX  > rect.x + rect.w)
	    closestX = rect.x + rect.w;
	else
	    closestX = unrotatedCircleX ;
	 
	// Find the unrotated closest y point from center of unrotated circle
	if (unrotatedCircleY < rect.y)
	    closestY = rect.y;
	else if (unrotatedCircleY > rect.y + rect.h)
	    closestY = rect.y + rect.h;
	else
	    closestY = unrotatedCircleY;
	 
	// Determine collision
	var collision = false;
	 
	var distance = findDistance(unrotatedCircleX , unrotatedCircleY, closestX, closestY);
	if (distance < circle.r)
	    collision = true; // Collision
	else
	    collision = false;
}

OnCollisionEnter.prototype.isCollidingCC = function (circleA, circleB) {
	var dx = circleA.x - circleB.x;
	var dy = circleA.y - circleB.y;
	var distance = Math.sqrt(dx * dx + dy * dy);
	if(distance <= (circleA.r + circleB.r)){
		//console.log(distance);
		//console.log(circleA);
		//console.log(circleB);
	}
	return (distance <= (circleA.r + circleB.r)); 
}

function findDistance (fromX, fromY, toX, toY) {
	var a = Math.abs(fromX - toX);
    var b = Math.abs(fromY - toY);
 
    return Math.sqrt((a * a) + (b * b));
}

module.exports = OnCollisionEnter;