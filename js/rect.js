/**
 * Rect
 * low-level utility class for basic geometry
 */

( function( window, factory ) {
  'use strict';
  // universal module definition
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( factory );
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    window.Packery = window.Packery || {};
    window.Packery.Rect = factory();
  }

}( window, function factory() {
'use strict';

// -------------------------- Packery -------------------------- //

// global namespace
var Packery = window.Packery = function() {};

// -------------------------- Rect -------------------------- //

function Rect( props ) {
  // extend properties from defaults
  for ( var prop in Rect.defaults ) {
    this[ prop ] = Rect.defaults[ prop ];
  }

  for ( prop in props ) {
    this[ prop ] = props[ prop ];
  }

}

// make available
Packery.Rect = Rect;

Rect.defaults = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
};

/**
 * Determines whether or not this rectangle wholly encloses another rectangle or point.
 * @param {Rect} rect
 * @returns {Boolean}
**/
Rect.prototype.contains = function( rect ) {
  // points don't have width or height
  var otherWidth = rect.width || 0;
  var otherHeight = rect.height || 0;
  return this.x <= rect.x &&
    this.y <= rect.y &&
    this.x + this.width >= rect.x + otherWidth &&
    this.y + this.height >= rect.y + otherHeight;
};

/**
 * Determines whether or not the rectangle intersects with another.
 * @param {Rect} rect
 * @returns {Boolean}
**/
Rect.prototype.overlaps = function( rect ) {
  var thisRight = this.x + this.width;
  var thisBottom = this.y + this.height;
  var rectRight = rect.x + rect.width;
  var rectBottom = rect.y + rect.height;

  // http://stackoverflow.com/a/306332
  return this.x < rectRight &&
    thisRight > rect.x &&
    this.y < rectBottom &&
    thisBottom > rect.y;
};

/**
 * @param {Rect} rect - the overlapping rect
 * @returns {Array} freeRects - rects representing the area around the rect
**/
Rect.prototype.getMaximalFreeRects = function( rect, minY ) {

  var freeRects = [];
  var freeRect;

  this.x = Math.round(this.x);
  this.y = Math.round(this.y);
  rect.x = Math.round(rect.x);
  rect.y = Math.round(rect.y);

  var thisRight = this.x + this.width;
  var thisBottom = this.y + this.height;
  var rectRight = rect.x + rect.width;
  var rectBottom = rect.y + rect.height;

  // if no intersection, return original
  if ( !this.overlaps( rect ) ) {
    if ( this.y < rect.y ) {
      return [];
    } else {
      if ( thisRight <= rect.x ) {
        // left
        if (this.y > rect.y && this.y < rectBottom) {
          freeRect = new Rect({
            x: this.x,
            y: this.y,
            width: this.width,
            height: rectBottom - this.y
          });
          freeRects.push( freeRect );
        } else {
          freeRects.push( this );
        }
      } else if ( this.x >= rectRight ) {
        // right
        if (this.y > rect.y && this.y < rectBottom) {
          freeRect = new Rect({
            x: this.x,
            y: this.y,
            width: this.width,
            height: rectBottom - this.y
          });
          freeRects.push( freeRect );
        } else {
          freeRects.push( this );
        }
      } else if ( this.y >= rectBottom ) {
        // bottom
        freeRects.push( this );
      }
      return freeRects
    }
  }

  // top
  /*
  if ( this.y < rect.y ) {
    freeRect = new Rect({
      x: this.x,
      y: this.y,
      width: this.width,
      height: rect.y - this.y
    });
    freeRects.push( freeRect );
  }
  */

  // right
  /*
  if ( thisRight > rectRight ) {
    freeRect = new Rect({
      x: rectRight,
      y: this.y,
      width: thisRight - rectRight,
      height: this.height
    });
    freeRects.push( freeRect );
  }
  */
  //console.log(this)
  //console.log(rect)
  if ( thisRight > rectRight ) {
    if (this.y <= rect.y) {
      freeRect = new Rect({
        x: rectRight,
        y: rect.y,
        width: thisRight - rectRight,
        height: this.height
      });
      freeRects.push( freeRect );
    } else if (this.y > rect.y && this.y < rectBottom) {
      freeRect = new Rect({
        x: rectRight,
        y: rectBottom,
        width: thisRight - rectRight,
        height: rectBottom - this.y
      });
      freeRects.push( freeRect );
    } else {
      freeRect = new Rect({
        x: rectRight,
        y: this.y,
        width: thisRight - rectRight,
        height: this.height
      });
      freeRects.push( freeRect );
    }

    //console.log('RIGHT')
    //console.log(freeRect)
  }

  // left
  /*
  if ( this.x < rect.x ) {
    freeRect = new Rect({
      x: this.x,
      y: this.y,
      width: rect.x - this.x,
      height: this.height
    });
    freeRects.push( freeRect );
  }
  */
  if ( this.x < rect.x ) {
    if ( this.y <= rect.y ) {
      freeRect = new Rect({
        x: this.x,
        y: rect.y,
        width: rect.x - this.x,
        height: this.height
      });
      freeRects.push( freeRect );
    } else if ( this.y > rect.y && this.y < rectBottom ) {
      freeRect = new Rect({
        x: this.x,
        y: this.y,
        width: rect.x - this.x,
        height: rectBottom - this.y
      });
      freeRects.push( freeRect );
    } else {
      freeRect = new Rect({
        x: this.x,
        y: this.y,
        width: rect.x - this.x,
        height: this.height
      });
      freeRects.push( freeRect );
    }


    //console.log('LEFT')
    //console.log(freeRect)
  }

  // bottom
  /*
  if ( thisBottom > rectBottom ) {
    freeRect = new Rect({
      x: this.x,
      y: rectBottom,
      width: this.width,
      height: thisBottom - rectBottom
    });
    //console.log('BOTTOM')
    //console.log(freeRect)
    freeRects.push( freeRect );
  }
  */
  if ( this.y <= rectBottom && thisBottom > rectBottom ) {
    freeRect = new Rect({
      x: this.x,
      y: Math.max( minY, rectBottom, this.y ),
      width: this.width,
      height: thisBottom - rectBottom
    });
    //console.log('BOTTOM')
    //console.log(freeRect)
    freeRects.push( freeRect );
  }

  return freeRects;
};

Rect.prototype.canFit = function( rect ) {
  return this.width >= rect.width && this.height >= rect.height;
};

return Rect;

}));
