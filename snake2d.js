var Snake2d = function (canvas, options) {

    this.ctx = canvas.getContext("2d");
    this.displayGrid = options.displayGrid === true;
    this.canvasSize = options.canvasSize;
    this.gridSize = options.gridSize;
    this.blockSize = {
        x: this.canvasSize.x / this.gridSize.x,
        y: this.canvasSize.y / this.gridSize.y
    };

    this.game = new Snake({
        draw: function () {
            ui.paint();
        },
        gridSize: options.gridSize,
        win: function () {
            alert('You won!');
        },
        lose: function (message) {
            alert(message);
        },
        speed: options.speed ? options.speed : 100
    });

    this.init = function () {
        var ui = this;

        document.addEventListener('keydown', function (key) {
            switch (key.keyCode) {
                case 37:
                    ui.game.direction = 0;
                    break;
                case 38:
                    ui.game.direction = 1;
                    break;
                case 39:
                    ui.game.direction = 2;
                    break;
                case 40:
                    ui.game.direction = 3;
                    break;
                default:
                    return;
            }

            if (!ui.game.isRunning()) {
                ui.game.start();
            }
        });

        ui.paint();
    };

    this.getCanvasXY = function(pos) {
        return {
            x: pos.x * this.blockSize.x,
            y: pos.y * this.blockSize.y
        }
    };

    this.paint = function () {
        var ctx = this.ctx;

        // Fill the background
        ctx.fillStyle = '#e5e5e5';
        ctx.fillRect(0, 0, this.canvasSize.y, this.canvasSize.x);

        // draw snake
        for (var x = 0; x <= this.game.gridSize.x; x++) {
            for (var y = 0; y <= this.game.gridSize.y; y++) {

                var blockGamePos = {x: x, y: y};
                var blockCanvasPos = ui.getCanvasXY(blockGamePos);

                if (this.game.snake.containsPos(blockGamePos)) {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(blockCanvasPos.x, blockCanvasPos.y, this.blockSize.x, this.blockSize.y);
                } else {
                    ctx.fillStyle = '#e5e5e5';
                    ctx.fillRect(blockCanvasPos.x, blockCanvasPos.y, this.blockSize.x, this.blockSize.y);
                }
            }
        }

        // draw apple
        if (this.game.apple) {
            ctx.fillStyle = 'yellow';
            var appleCanvasPos = ui.getCanvasXY(this.game.apple);
            ctx.fillRect(appleCanvasPos.x, appleCanvasPos.y, this.blockSize.x, this.blockSize.y);
        }

        // draw grid lines
        if (this.displayGrid) {
            ctx.strokeStyle = '#ccc';
            for (var x=0; x <= this.canvasSize.x; x += this.blockSize.x) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, this.canvasSize.y);
                ctx.stroke();
            }
            for (var y=0; y <= this.canvasSize.y; y += this.blockSize.y) {
                ctx.moveTo(0, y);
                ctx.lineTo(this.canvasSize.x, y);
                ctx.stroke();
            }
        }
    }
};
