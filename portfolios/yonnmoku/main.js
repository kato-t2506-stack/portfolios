// 1. 定数と変数の定義 (関数の外でもOK)
const CONTINUE = null;
const WIN_PLAYER_1 = 1;
const WIN_PLAYER_2 = -1;
const DRAW_GAME = 0;

let turn = 1; 
let result = CONTINUE;
const cells = [
    [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]
];

// 2. HTMLが完全に読み込まれてから実行する
window.onload = function() {

    // クリックイベントの登録
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const cell = document.querySelector(`#cell_${row}_${col}`);
            if (cell) {
                cell.addEventListener('click', () => {
                    // 人間のターン(1)かつ、空きマスなら打つ
                    if (result === CONTINUE && turn === 1 && cells[row][col] === 0) {
                        putMark(row, col);
                    }
                });
            }
        }
    }

    // --- 以降、関数定義 ---

    function putMark(row, col) {
        if (cells[row][col] !== 0) return;

        const cell = document.querySelector(`#cell_${row}_${col}`);
        cells[row][col] = turn;
        cell.textContent = turn === 1 ? "O" : "X";
        cell.classList.add(turn === 1 ? "o" : "x");

        result = judge(cells);
        check(result); 

        if (result === CONTINUE) {
            turn = -turn; 
            if (turn === -1) {
                // AIの思考（深さ3）
                const move = think(cells, turn, 3, false); 
                if (move) {
                    setTimeout(() => putMark(move[0], move[1]), 500); 
                }
            }
        }
    }

    function think(_cells, _turn, _level, _settai_mode) {
        const res = miniMax(_cells, _turn, _level, _settai_mode);
        return res[1];
    }

    function miniMax(_cells, _turn, _depth, _settai_mode) {
        const gameState = judge(_cells);
        if (gameState !== CONTINUE) return [gameState, null];
        if (_depth === 0) return [0, null];

        let bestValue = _settai_mode ? (_turn === 1 ? Infinity : -Infinity) : (_turn === 1 ? -Infinity : Infinity);
        let bestMove = null;

        const hands = showHands(_cells);
        for (let hand of hands) {
            const newCells = structuredClone(_cells);
            newCells[hand[0]][hand[1]] = _turn;
            // 再帰呼び出し（_settai_modeを忘れずに！）
            const [value] = miniMax(newCells, -_turn, _depth - 1, _settai_mode);

            if (_settai_mode) {
                if ((_turn === 1 && value < bestValue) || (_turn === -1 && value > bestValue)) {
                    bestValue = value; bestMove = hand;
                }
            } else {
                if ((_turn === 1 && value > bestValue) || (_turn === -1 && value < bestValue)) {
                    bestValue = value; bestMove = hand;
                }
            }
        }
        return [bestValue, bestMove];
    }

    function showHands(_cells) {
        const hands = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (_cells[r][c] === 0) hands.push([r, c]);
            }
        }
        return hands;
    }

    function judge(_cells) {
        const lines = [
            ...[0,1,2,3].map(i => [_cells[i][0], _cells[i][1], _cells[i][2], _cells[i][3]]), // 横
            ...[0,1,2,3].map(i => [_cells[0][i], _cells[1][i], _cells[2][i], _cells[3][i]]), // 縦
            [_cells[0][0], _cells[1][1], _cells[2][2], _cells[3][3]], // 斜め1
            [_cells[0][3], _cells[1][2], _cells[2][1], _cells[3][0]]  // 斜め2
        ];
        for (let line of lines) {
            const sum = line[0] + line[1] + line[2] + line[3];
            if (sum === 4) return WIN_PLAYER_1;
            if (sum === -4) return WIN_PLAYER_2;
        }
        if (showHands(_cells).length === 0) return DRAW_GAME;
        return CONTINUE;
    }

    function check(res) {
        const message = document.querySelector("#message");
        if (res === WIN_PLAYER_1) message.textContent = "〇の勝ち!";
        else if (res === WIN_PLAYER_2) message.textContent = "✕の勝ち!";
        else if (res === DRAW_GAME) message.textContent = "引き分け!";
    }
};