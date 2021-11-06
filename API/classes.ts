const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./database.db');
function errorCallback(err: Error) {
    return new Promise((resolve, reject) => {
        if (err) {
            console.log(err);
        } else {
            return this.lastID;
        }
    })
}

export class Game {
    // Properties
    gameId: number;;
    hasStarted: boolean;
    hasEnded: boolean;

    // FK
    gamePlayers: GamePlayer[];
    rounds: Round[];

    // Methods
    startGame = (): void => {
        let sql = `UPDATE Game SET hasStarted = true WHERE gameId = ?`;
        db.run(sql, [this.gameId], errorCallback);
    };
    endGame = (gameId: number): void => {
        let sql = `UPDATE Game SET hasEnded = true WHERE gameId = ?`;
        db.run(sql, [this.gameId], errorCallback);
    };

    // CRUD
    static async create(): Promise<Game> {
        let sql = `INSERT INTO Game DEFAULT VALUES`;
        return await new Promise((resolve, reject) => {
            db.run(sql, [], function (err: Error) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    };
    static async read(gameId: number): Promise<Game[]> {
        let sql = `SELECT * FROM Game WHERE gameId = ?`;
        return await new Promise((resolve, reject) => {
            db.get(sql, [gameId], function (err: Error, rows: any) {            
                if (err) {
                    console.log(err)
                    reject(err);;
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

export class GamePlayer {
    // Properties
    gamePlayerId: number;
    gamePlayOrder: number;
    hasFlipped: boolean;

    // FK
    player: Player;
    game: Game;

    // Methods
    updateHasFlipped = (): void => {
        let sql = `UPDATE GamePlayer SET hasFlipped = true WHERE gamePlayerId = ?`;
        db.run(sql, [this.gamePlayerId], errorCallback);
    };
}

export class Player {
    // Properties
    playerId: number;
    name: string;
    color: string;

    // Methods
    joinGame = (gameId: number, gamePlayOrder: number): void => {
        let sql = `INSERT INTO GamePlayer (gameId, playerId, gamePlayOrder, hasFlipped) 
            VALUES (?, ?, ?, false)`;
        db.run(sql, [gameId, this.playerId, gamePlayOrder], errorCallback);
    };
}

export class Card {
    // Properties
    cardId: number;
    isInPlay: boolean;
    orderOfPlay: number;
    isFlipped: boolean;
    hasBeenRemoved: boolean;
    isSkull: boolean;

    // FK
    gamePlayer: GamePlayer;

    // Methods    
    addCardToPlay = (): void => {    
        let sql = `UPDATE Card SET isInPlay = true WHERE cardId = ?`;
        db.run(sql, [this.cardId], errorCallback);
    };
    removeCardFromPlay = (): void => {
        let sql = `UPDATE Card SET isInPlay = false WHERE cardId = ?`;
        db.run(sql, [this.cardId], errorCallback);
    };
    flipCard = (): void => {
        let sql = `UPDATE Card SET isFlipped = true WHERE cardId = ?`;
        db.run(sql, [this.cardId], errorCallback);
    };
    unflipCard = (): void => {
        let sql = `UPDATE Card SET isFlipped = false WHERE cardId = ?`;
        db.run(sql, [this.cardId], errorCallback);
    };
    addCardPermission = (gamePlayerId: number): void => {
        let sql = `INSERT INTO CardPermission (cardId, gamePlayerId) VALUES (?, ?)`;
        db.run(sql, [this.cardId, gamePlayerId], errorCallback);
    };

}

export class CardPermission {
    // Properties
    cardPermissionId: number;

    // FK
    card: Card;
    gamePlayer: GamePlayer;

    // Methods
}

export class Round {
    // Properties    
    roundId: number;
    roundNumber: number;
    biddingHasBegun: boolean;
    biddingHasEnded: boolean;
    winningBidId: number;

    // FK
    game: Game;

    // Methods
    startBidding = (): void => {
        let sql = `UPDATE Round SET biddingHasBegun = true WHERE roundId = ?`;
        db.run(sql, [this.roundId], errorCallback);        
    }
    endBidding = (roundId: number): void => {
        let sql = `UPDATE Round SET biddingHasEnded = true WHERE roundId = ?`;
        db.run(sql, [this.roundId], errorCallback);        
    }
    addWinningBid = (winningBidId: number): void => {        
        let sql = `UPDATE Round SET winningBidId = ? WHERE roundId = ?`;
        db.run(sql, [winningBidId, this.roundId], errorCallback);  
    }

    // CRUD
}

export class GamePlayerRoundBid {
    // Properties
    gamePlayerRoundBidId: number;
    hasPassed: boolean;
    bidAmount: number;

    // FK
    gamePlayer: GamePlayer;
    round: Round;
    
    // Methods
    updateBid = (bidAmount: number, hasPassed: boolean): void => {
        let sql = `UPDATE GamePlayerRoundBid SET bidAmount = ?, hasPassed = ? WHERE roundId = ?`;
        db.run(sql, [bidAmount, hasPassed, this.round.roundId], errorCallback);
    };

    // CRUD
    static create = (gamePlayerId: number, roundId: number, bid: number): void => {
        let sql = `INSERT INTO GamePlayerRoundBid (gamePlayerId, roundId) VALUES (?, ?)`;
        db.run(sql, [gamePlayerId, roundId], errorCallback);
    };
}