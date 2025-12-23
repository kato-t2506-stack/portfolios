
function think(_cells, _turn, _level, _settai_mode) {
    const result = miniMax(_cells, _turn, _level, _settai_mode);
    return result[1];
}

// 一番いい手を探す
function miniMax(_cells, _turn, _depth, _settai_mode) {
    const gameState = judge(_cells);

    // 決着がついたら評価値を返す
    if (gameState !== CONTINUE) {
        return [gameState, null];
    }

    if (_depth === 0) {
        return [0, null]; // depthが0なら評価値0で終了
    }

    // 最も良い手の点数を記憶する変数。最低値で初回化しておく
    let bestValue;
    if (_settai_mode) {
        bestValue = (_turn === 1) ? Infinity : -Infinity;
    } else {
        bestValue = (_turn === 1) ? -Infinity : Infinity;
    }
    let bestMove = null;

    // とりうる手をすべて試す
    const hands = showHands(_cells);
    for (let hand of hands) {
        // コピーを作成して手を指す
        const newCells = structuredClone(_cells);
        newCells[hand[0]][hand[1]] = _turn;

        // 次の手番
        const nextTurn = -_turn;

        // 再帰的に探索してみる
        const [value] = miniMax(newCells, nextTurn, _depth - 1, _settai_mode);
        // 良い手だったら記憶しておく
        if (_settai_mode) {
            if ((_turn === 1 && value < bestValue) || (_turn === -1 && value > bestValue)) {
                bestValue = value;
                bestMove = hand;
            }
        } else {
            if ((_turn === 1 && value > bestValue) || (_turn === -1 && value < bestValue)) {
                bestValue = value;
                bestMove = hand;
            }
        }
    }

    return [bestValue, bestMove];
}
// AIのターン（-1）なら自動で打たせる
// 全16マスにクリックイベントをつける
for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
        const cell = document.querySelector(`#cell_${row}_${col}`);
        cell.addEventListener('click', () => {
            // ゲーム中 かつ 自分の番(1) かつ 空きマス なら打つ
            if (result === CONTINUE && turn === 1 && cells[row][col] === 0) {
                putMark(row, col);
            }
        });
    }
}
function putMark(row, col) {
    // 1. すでに置かれている場所なら何もしない
    if (cells[row][col] !== 0) return;

    // 2. 盤面にマークを置く処理
    const cell = document.querySelector(`#cell_${row}_${col}`);
    cells[row][col] = turn;
    cell.textContent = turn === 1 ? "O" : "X";
    cell.classList.add(turn === 1 ? "o" : "x");

    // 3. 勝敗判定
    result = judge(cells);
    check(result); 

    // 4. ゲームが継続中ならターンを交代し、AIの番ならAIを動かす
    if (result === CONTINUE) {
        turn = -turn; 

        // ★ ここにAIの呼び出しコードを入れます！
        if (turn === -1) {
            const move = think(cells, turn, 3, false); 
            if (move) {
                setTimeout(() => {
                    putMark(move[0], move[1]);
                }, 500); 
            }
        }
    }
}