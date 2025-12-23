const button = document.querySelector("#button");
let tokenizer;
// 形態素解析(文章の分析)の準備
kuromoji.builder({ dicPath: "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/" }).
    build(function (error, _tokenizer) {
        if (error) {
            console.log(error);
        } else {
            tokenizer = _tokenizer;
            button.textContent = "審議";
            button.disabled = false;
        }
    });

// 審議ボタンを押したときの処理
button.addEventListener("click", function () {
    if (tokenizer) {
        const message = document.querySelector("#message").value;
        const point = check(message);
        reset();
        judge(point);
    }
});

//表示を元に戻す
function reset() {
    document.querySelector("#result").textContent = "審議中";
    document.querySelector("#result").className = "";
    document.querySelector("#judge_1").className = "judge wait cat1";
    document.querySelector("#judge_2").className = "judge wait cat2";
    document.querySelector("#judge_3").className = "judge wait cat3";
}

// 審議ネコを表示する
function judge(point) {
    // 0.5秒後に審議ネコ1を表示する

    // 1秒後に審議ネコ2を表示する

    // 1.5秒後に審議ネコ3を表示する

    // 2秒後に結果を表示する
}

// 点数を審議する
function check(message) {
    const result1 = check1(message);
    const result2 = check2(message);
    const result3 = check3(message);
    if (result1 == false && result2 == false && result3 == false) {
        return 0;
    }
    if (result1 == true && result2 == false && result3 == false) {
        return 1;
    }
    if (result2 == false && result3 == true) {
        return 3;
    }
    if (result2 == true) {
        return 2;
    }
}

// ダジャレの判定(単純に読みが一致していればOK)
function check1(message) {
    return false;
}

// ダジャレの判定(単純な同じ単語の繰り返しはNG)
function check2(message) {
    return false;
}

// ダジャレの判定(読みがちょっと違っていてもOK)
function check3(message) {
    return false;
}

// 文章を解析して返す
function getSentence(message) {

}

// 単語の読みの補正(ちょっとした違いならOKとする)
function getFuzzyWord(text) {
    text = text.replaceAll("ッ", "[ツッ]?");
    text = text.replaceAll("ァ", "[アァ]?");
    text = text.replaceAll("ィ", "[イィ]?");
    text = text.replaceAll("ゥ", "[ウゥ]?");
    text = text.replaceAll("ェ", "[エェ]?");
    text = text.replaceAll("ォ", "[オォ]?");
    text = text.replaceAll("ズ", "[スズヅ]");
    text = text.replaceAll("ヅ", "[ツズヅ]");
    text = text.replaceAll("ヂ", "[チジヂ]");
    text = text.replaceAll("ジ", "[シジヂ]");
    text = text.replaceAll("ガ", "[カガ]");
    text = text.replaceAll("ギ", "[キギ]");
    text = text.replaceAll("グ", "[クグ]");
    text = text.replaceAll("ゲ", "[ケゲ]");
    text = text.replaceAll("ゴ", "[コゴ]");
    text = text.replaceAll("ザ", "[サザ]");
    text = text.replaceAll("ゼ", "[セゼ]");
    text = text.replaceAll("ゾ", "[ソゾ]");
    text = text.replaceAll("ダ", "[タダ]");
    text = text.replaceAll("デ", "[テデ]");
    text = text.replaceAll("ド", "[トド]");
    text = text.replaceAll("ャ", "[ヤャ]");
    text = text.replaceAll("ュ", "[ユュ]");
    text = text.replaceAll("ョ", "[ヨョ]");
    text = text.replaceAll("ー", "[ー]?");
    text = text.replaceAll("キ[ヤャ]", "(キ[ヤャ]|カ)");
    text = text.replaceAll("シ[ヤャ]", "(シ[ヤャ]|サ)");
    text = text.replaceAll("シ[ヨョ]", "(シ[ヨョ]|ソ)");
    text = text.replaceAll(/[ハバパ]/g, "[ハバパ]");
    text = text.replaceAll(/[ヒビピ]/g, "[ヒビピ]");
    text = text.replaceAll(/[フブプ]/g, "[フブプ]");
    text = text.replaceAll(/[ヘベペ]/g, "[ヘベペ]");
    text = text.replaceAll(/[ホボポ]/g, "[ホボポ]");
    text = text.replaceAll(/([アカサタナハマヤラワャ])ー/g, "$1[アァ]?");
    text = text.replaceAll(/([イキシチニヒミリ])ー/g, "$1[イィ]?");
    text = text.replaceAll(/([ウクスツヌフムユルュ])ー/g, "$1[ウゥ]?");
    text = text.replaceAll(/([エケセテネへメレ])ー/g, "$1[エェ]?");
    text = text.replaceAll(/([オコソトノホモヨロヲョ])ー/g, "$1[ウゥオォ]?");
    return text;
}

// 文中の省略できる文字を省略する
function getShortSentence(text) {
    text = text.replaceAll("ッ", "");
    text = text.replaceAll("ー", "");
    return text;
}
