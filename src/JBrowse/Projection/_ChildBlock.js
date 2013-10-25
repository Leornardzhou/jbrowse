define([
           'dojo/_base/declare',

           '../Projection'
       ],
       function(
           declare,

           ProjectionBase
       ) {

var ChildBlock = declare( ProjectionBase, {

  constructor: function( args ) {
      this.childOffset = args.childOffset;
      this.bOffset = 0;

      this.parent = args.parent;
      var thisB = this;
      this._parentWatch = this.parent.watch(
          function( change ) {
              thisB._notifyChanged( change );
          });
  },

  deflate: function() {
      return {
          $class: 'JBrowse/Projection/ContinuousLinear',
          parent: this.parent.deflate(),
          bOffset: this.bOffset,
          childOffset: this.childOffset,
          bName: this.getBName(),
          aName: this.getAName()
      };
  },

  getScale: function() { return this.scale || this.parent.scale; },

  getValidRangeA: function() {
      var parent = this.parent;
      var offset = parent.bOffset + this.childOffset + this.bOffset;
      var aStart = -offset/parent.scale;
      var aEnd   = ( parent.bLength - offset )/parent.scale;

      if( aStart > aEnd ) {
          var tmp = aStart;
          aStart = aEnd;
          aEnd = tmp;
      }

      return {
          l: Math.max( aStart, parent.aStart ),
          r: Math.min( aEnd, parent.aEnd )
      };
  },

  projectPoint: function(a) {
      return this.parent.scale * a + this.childOffset + this.parent.bOffset + this.bOffset;
  },

  reverseProjectPoint: function(b) {
      return (b - this.childOffset - this.parent.bOffset - this.bOffset)/this.parent.scale;
  },

  destroy: function() {
      this._parentWatch.remove();
      delete this._parentWatch;
  }

});

return ChildBlock;
});