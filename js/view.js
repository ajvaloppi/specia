/***
 * Scaffolded by Jingjie (Vincent) Zheng on June 24, 2015.
 */

'use strict';

/**
 * A function that creates and returns the spaceship model.
 */

function createViewModule() {
  var SpaceshipView = function(model, canvas) {
    /**
     * Obtain the SpaceshipView itself.
     */
    var self = this;

    /**
     * Maintain the model.
     */
    this.model = model;

    /**
     * Maintain the canvas and its context.
     */
    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    /**
     * Update the canvas. 
     * You should be able to do this trivially by first clearing the canvas, then call the rootNode's 
     * renderAll() with the context.
     */
    this.update = function() {
        this.context.clearRect(0,0, canvas.width, canvas.height);
        this.model.rootNode.renderAll(this.context);
    };

    /**
     * You should add the view as a listener to each node in the scene graph, so that the view can get 
     * updated when the model is changed.
     */
    this.model.rootNode.addListener(this);
    this.model.headNode.addListener(this);
    this.model.tailNode.addListener(this);
    this.model.fireNode.addListener(this);
    this.model.handleNode.addListener(this);
    this.model.bodyNode.addListener(this);
    this.model.spaceshipNode.addListener(this);
    this.model.wingsNode.addListener(this);

    /**
     * Handle mousedown events.
     * You should perform a hit detection here by calling the model's performHitDetection().
     */ 
    canvas.addEventListener('mousedown', function(e) {
      self.model.clicked = self.model.performHitDetection([e.layerX, e.layerY]);
      if (self.model.clicked === self.model.bodyNode) {
        self.model.move = true;
        self.model.originalX = e.layerX;
        self.model.originalY = e.layerY;
      }
      else if (self.model.clicked === self.model.handleNode) {
        self.model.resize = true;
        self.model.originalX = e.layerX;
        self.model.originalY = e.layerY;
      }
    });

    /**
     * Handle mousemove events.
     */ 
    canvas.addEventListener('mousemove', function(e) {
      //TODO
      //change cursors
      self.model.on = self.model.performHitDetection([e.layerX, e.layerY]);
      if (self.model.on === self.model.handleNode || self.model.resize) {
        document.getElementById("canvas").style.cursor = "pointer";
      }
      else if (self.model.on === self.model.bodyNode || self.model.move) {
        document.getElementById("canvas").style.cursor = "move";
      }
      else {
        document.getElementById("canvas").style.cursor = "default";
      }

      if (self.model.move) {
        if (self.model.spaceshipRotation === 0) {
            var x = e.layerX - self.model.originalX;
            var y = e.layerY - self.model.originalY;
            self.model.spaceshipNode.translate(x, y);
            self.update();
            self.model.originalX = e.layerX;
            self.model.originalY = e.layerY;
        }
        else {
            var x = e.layerX - self.model.originalX;
            var y = e.layerY - self.model.originalY;

            var rotations = self.model.spaceshipRotation / 5;

            self.model.spaceshipNode.rotate(rotations * Math.PI/36, 0, 100);
            self.model.spaceshipNode.translate(0,-100);
        
            self.model.spaceshipNode.translate(x, y);

            var rotations = - self.model.spaceshipRotation / 5;

            self.model.spaceshipNode.rotate(rotations * Math.PI/36, 0, 100);
            self.model.spaceshipNode.translate(0,-100);

            self.update();
            self.model.originalX = e.layerX;
            self.model.originalY = e.layerY; 
        }
      }

      if (self.model.resize) {

        var x = e.layerX - self.model.originalX;
        var y = e.layerY - self.model.originalY;

        //var dist = Math.sqrt(y*y + x*x);

        var dist = - x*Math.sin(self.model.spaceshipRotation * (Math.PI / 180)) + y*Math.cos(self.model.spaceshipRotation * (Math.PI / 180));

        if (self.model.bodyNode.localBoundingBox.h - dist > 100) {
            self.model.bodyNode.localBoundingBox.h -= dist;
            self.model.bodyNode.translate(0, dist);
            self.model.headNode.translate(0, dist);
            self.update();

            self.model.originalX = e.layerX;
            self.model.originalY = e.layerY;
        }
      }
    });


    /**
     * Handle mouseup events.
     */ 
    canvas.addEventListener('mouseup', function(e) {
      self.model.move = false;
      self.model.resize = false;
    });

    /**
     * Handle keydown events.
     */ 
    document.addEventListener('keydown', function(e) {
      if (e.keyIdentifier === "Up") {
        if (self.model.tailRotation === 0) {
            self.model.spaceshipNode.translate(0, self.model.speed);
            self.model.fireNode.shown = true;
            self.update();
        }
        else {
            var rotations = - self.model.tailRotation / 5;

            self.model.spaceshipNode.rotate(rotations * Math.PI/36, 0, 100);
            self.model.spaceshipNode.translate(0,-100);
            self.model.spaceshipNode.translate(0, self.model.speed);
            self.model.fireNode.shown = true;
            self.update();
            
            if (self.model.tailRotation > 0) {
                self.model.spaceshipRotation += self.model.tailRotation;

                if (self.model.spaceshipRotation >= 360) {
                    self.model.spaceshipRotation -= 360;
                }
            }
            else {
                self.model.spaceshipRotation += (360 + self.model.tailRotation);

                if (self.model.spaceshipRotation >= 360) {
                    self.model.spaceshipRotation -= 360;
                }
            }
        }

        var transformation = self.model.spaceshipNode.globalTransformation;

        if (transformation.m02_ > 1000) {
            self.model.spaceshipNode.translate(0, 1100);
            self.update();
        }
        else if (transformation.m02_ < -200) {
            self.model.spaceshipNode.translate(0, 1100);
            self.update();
        }

        if (transformation.m12_ < -200) {
            self.model.spaceshipNode.translate(0, 900);
            self.update();
        }
        else if (transformation.m12_ > 800) {
            self.model.spaceshipNode.translate(0, 900);
            self.update();
        }
      }
      else if (e.keyIdentifier === "Right" && (self.model.tailRotation < 45)) {
        self.model.tailNode.rotate(Math.PI/36, 0, 0);
        self.model.tailRotation += 5;
        self.update();
      }
      else if (e.keyIdentifier === "Left" && (self.model.tailRotation > -45)) {
        self.model.tailNode.rotate(-Math.PI/36, 0, 0);
        self.model.tailRotation -= 5;
        self.update();
      }
    });

    /**
     * Handle keyup events.
     */ 
    document.addEventListener('keyup', function(e) {
      if (e.keyIdentifier === "Up") {
        self.model.fireNode.shown = false;
        self.update();
      }

      else if (e.keyIdentifier === "U+0020" && !self.model.powerUp) { //space bar

        self.model.powerUp = true;
        if (self.model.tailRotation === 0) {
            self.model.speed = self.model.speed * 2;
        }
        self.model.spaceshipNode.scale(2,2);
        self.update();

        var x = setTimeout(function ()  {
            self.model.powerUp = false;
            self.model.speed = self.model.speed * 1/2;
            self.model.spaceshipNode.scale(1/2,1/2);
            self.update();
        }, 5000);

               
      }

    });

    /**
     * Update the view when first created.
     */
    this.update();
  };

  return {
    SpaceshipView: SpaceshipView
  };
}