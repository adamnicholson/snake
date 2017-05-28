var Snake = function (options) {

    var game = this;

    this.lose = options.lose;
    this.win = options.win;
    this.draw = options.draw;
    this.gridSize = options.gridSize;
    this.apple = null;
    this.direction = 0;
    this.speed = options.speed ? options.speed : 100;

    this.snake = [{
        x: Math.floor(this.gridSize.x / 2),
        y: Math.floor(this.gridSize.y / 2)
    }];

    this.snake.containsPos = function (pos) {
        var snakeMap = game.snake.map(function (pos) {
            return 'x'+pos.x+'y'+pos.y;
        });
        return snakeMap.indexOf('x'+pos.x+'y'+pos.y) >= 0;
    };

    this.getRandomFreeSquare = function () {
        var square = {
            x: Math.floor(Math.random() * game.gridSize.x),
            y: Math.floor(Math.random() * game.gridSize.y)
        };
        var attempts = 1;
        while (game.snake.containsPos(square)) {

            if (attempts >= 100) {
                // @todo Be smarter here than forcing 100 attempts
                throw new RangeError('No cubes left');
            }

            square = {
                x: Math.floor(Math.random() * game.gridSize.x),
                y: Math.floor(Math.random() * game.gridSize.y)
            };
            attempts ++;
        }

        return square;
    };

    this.ticker = null;
    this.start = function () {
        var game = this;
        game.ticker = setInterval(function () {
            game.next();
            game.draw();
        }, game.speed);
    };

    this.isRunning = function () {
        return game.ticker !== null;
    };

    this.next = function () {

        var head = game.snake[0];

        var newCubePos = {
            x: head.x,
            y: head.y
        };

        switch (game.direction) {
            case 0:
                // left
                newCubePos.x--;
                break;
            case 1:
                // up
                newCubePos.y--;
                break;
            case 2:
                // right
                newCubePos.x++;
                break;
            case 3:
                // down
                newCubePos.y++;
                break;
            default:
                throw Error('Unknown direction ' + game.direction)
        }

        // eat self - die
        if (game.snake.containsPos(newCubePos)) {
            clearInterval(game.ticker);
            game.ticker = null;
            game.lose('You ate yourself!');
            return;
        }

        // hit side - die
        if (newCubePos.x < 0 || newCubePos.x >= game.gridSize.x || newCubePos.y < 0 || newCubePos.y >= game.gridSize.y) {
            clearInterval(game.ticker);
            game.ticker = false;
            game.lose('You didn\'t stay within the grid!');
            return;
        }

        // Add the head
        game.snake.unshift(newCubePos);

        // eat the apple
        if (game.apple && (game.apple.x === newCubePos.x && game.apple.y === newCubePos.y)) {
            game.apple = null;
        } else {
            game.snake.pop();
        }

        // did we win?!
        try {
            game.getRandomFreeSquare();
        } catch (e) {
            if (e instanceof RangeError) {
                clearInterval(game.ticker);
                game.ticker = null;
                game.draw();
                game.win();
                return;
            }
        }

        // make a new apple
        if (!game.apple) {
            game.apple = game.getRandomFreeSquare();
        }
    }
};
