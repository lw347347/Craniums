"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamePlayerRoundBid = exports.Round = exports.CardPermission = exports.Card = exports.Player = exports.GamePlayer = exports.Game = void 0;
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./database.db');
function errorCallback(err) {
    return new Promise((resolve, reject) => {
        if (err) {
            console.log(err);
        }
        else {
            return this.lastID;
        }
    });
}
class Game {
    constructor() {
        // Methods
        this.startGame = () => {
            let sql = `UPDATE Game SET hasStarted = true WHERE gameId = ?`;
            db.run(sql, [this.gameId], errorCallback);
        };
        this.endGame = (gameId) => {
            let sql = `UPDATE Game SET hasEnded = true WHERE gameId = ?`;
            db.run(sql, [this.gameId], errorCallback);
        };
    }
    ;
    // CRUD
    static create() {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = `INSERT INTO Game DEFAULT VALUES`;
            return yield new Promise((resolve, reject) => {
                db.run(sql, [], function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(this.lastID);
                    }
                });
            });
        });
    }
    ;
    static read(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            let sql = `SELECT * FROM Game WHERE gameId = ?`;
            return yield new Promise((resolve, reject) => {
                db.get(sql, [gameId], function (err, rows) {
                    if (err) {
                        console.log(err);
                        reject(err);
                        ;
                    }
                    else {
                        resolve(rows);
                    }
                });
            });
        });
    }
}
exports.Game = Game;
class GamePlayer {
    constructor() {
        // Methods
        this.updateHasFlipped = () => {
            let sql = `UPDATE GamePlayer SET hasFlipped = true WHERE gamePlayerId = ?`;
            db.run(sql, [this.gamePlayerId], errorCallback);
        };
    }
}
exports.GamePlayer = GamePlayer;
class Player {
    constructor() {
        // Methods
        this.joinGame = (gameId, gamePlayOrder) => {
            let sql = `INSERT INTO GamePlayer (gameId, playerId, gamePlayOrder, hasFlipped) 
            VALUES (?, ?, ?, false)`;
            db.run(sql, [gameId, this.playerId, gamePlayOrder], errorCallback);
        };
    }
}
exports.Player = Player;
class Card {
    constructor() {
        // Methods    
        this.addCardToPlay = () => {
            let sql = `UPDATE Card SET isInPlay = true WHERE cardId = ?`;
            db.run(sql, [this.cardId], errorCallback);
        };
        this.removeCardFromPlay = () => {
            let sql = `UPDATE Card SET isInPlay = false WHERE cardId = ?`;
            db.run(sql, [this.cardId], errorCallback);
        };
        this.flipCard = () => {
            let sql = `UPDATE Card SET isFlipped = true WHERE cardId = ?`;
            db.run(sql, [this.cardId], errorCallback);
        };
        this.unflipCard = () => {
            let sql = `UPDATE Card SET isFlipped = false WHERE cardId = ?`;
            db.run(sql, [this.cardId], errorCallback);
        };
        this.addCardPermission = (gamePlayerId) => {
            let sql = `INSERT INTO CardPermission (cardId, gamePlayerId) VALUES (?, ?)`;
            db.run(sql, [this.cardId, gamePlayerId], errorCallback);
        };
    }
}
exports.Card = Card;
class CardPermission {
}
exports.CardPermission = CardPermission;
class Round {
    constructor() {
        // Methods
        this.startBidding = () => {
            let sql = `UPDATE Round SET biddingHasBegun = true WHERE roundId = ?`;
            db.run(sql, [this.roundId], errorCallback);
        };
        this.endBidding = (roundId) => {
            let sql = `UPDATE Round SET biddingHasEnded = true WHERE roundId = ?`;
            db.run(sql, [this.roundId], errorCallback);
        };
        this.addWinningBid = (winningBidId) => {
            let sql = `UPDATE Round SET winningBidId = ? WHERE roundId = ?`;
            db.run(sql, [winningBidId, this.roundId], errorCallback);
        };
        // CRUD
    }
}
exports.Round = Round;
class GamePlayerRoundBid {
    constructor() {
        // Methods
        this.updateBid = (bidAmount, hasPassed) => {
            let sql = `UPDATE GamePlayerRoundBid SET bidAmount = ?, hasPassed = ? WHERE roundId = ?`;
            db.run(sql, [bidAmount, hasPassed, this.round.roundId], errorCallback);
        };
    }
}
exports.GamePlayerRoundBid = GamePlayerRoundBid;
// CRUD
GamePlayerRoundBid.create = (gamePlayerId, roundId, bid) => {
    let sql = `INSERT INTO GamePlayerRoundBid (gamePlayerId, roundId) VALUES (?, ?)`;
    db.run(sql, [gamePlayerId, roundId], errorCallback);
};
//# sourceMappingURL=classes.js.map