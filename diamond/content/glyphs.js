/* =========================================================
   Diamond⭐︎ — マスの描画データ（glyph）
   ---------------------------------------------------------
   記号の正は content/notation.js（2026-07-29に記号早見表の画像を
   直接読んで確定）。ここはその「実物の見本」にあたる。

   データの形:
     pitches : 投球経過 ['B','S','W','F','X']（左の細い欄に上から）
     result  : 右下に書く打席の結果
                 text  : 文字（6-3 / K / B / 9 など）
                 trace : 'fly'(上に弧) | 'liner'(上に直線) | なし
                         ※ ゴロは印を付けない（数字をつなぐのが証）
                 dot   : 打球がどこへ飛んだか（何塁打かではない）
                         'under'＝その野手の前／'over'＝越えた／'side'＝ライン際
                 half  : true で半円囲み（内野安打。弦は安打の斜線）
                 bh    : true で斜線の上に BH（バントヒット）
                 box   : 'square'(犠打) | 'triangle'(犠飛)
                 mirror: true で左右反転
     kind    : 'hit'(赤) | 'walk'(青) | 'sac'(青) ／ 省略で黒
     hit     : 赤い斜線の本数＝打者が自分の打撃で得た塁（0〜4）
                 斜線は「走路のひし形」（マスの4辺の中点を結ぶ大きい方）に引く。
                 真ん中の小さい点線のひし形は案内で、なぞらない
     marks   : 進塁の記号 { 2:'(3)', 3:'↰', 4:{circle:'4'} }
                 到達した塁＝(打順番号)／通過しただけ＝↰／打点＝丸囲み
                 ※ 進塁では斜線を増やさない
     center  : 結末 { out:1|2|3 } | { run:true, unearned:bool } | { lob:true }
     outAt   : 走者がアウトになった経路 { base, text }
   ========================================================= */
(function (root) {
  'use strict';

  var G = {};

  /* ---- 空のマス・地図 ---- */
  G['empty'] = { title: '空のマス' };
  G['empty-nodiamond'] = { title: '空のマス（下敷きなし）', noDiamond: true };
  G['empty-map'] = { title: '4つに割れたマス' };
  G['empty-guides'] = { title: 'マスの地図（塁の名前つき）', guides: true };
  G['empty-quad1'] = { title: '右下の区画（ここ）', highlight: 1 };
  G['empty-quad2'] = { title: '右上の区画（ここ）', highlight: 2 };
  G['empty-quad3'] = { title: '左上の区画（ここ）', highlight: 3 };
  G['empty-quad4'] = { title: '左下の区画（ここ）', highlight: 4 };

  /* ---- ホームの主役デモ ----
     中前安打で出て、盗塁で二塁、3番の適時打で生還。
     斜線は自分の安打の1本だけが赤。あとの進塁は記号で残る。 */
  G['hero'] = {
    title: '1マスは「出てから還るまで」の記録',
    pitches: ['B','S','F','X'],
    kind: 'hit', hit: 1,
    result: { text: '8', dot: 'under' },
    marks: { 2: 'S', 3: '(3)', 4: { circle: '3' } },
    center: { run: true },
    captions: {
      pitches: '左の細い欄に、投げられた球を上から1球ずつ。●ボール ×見逃し ⊗空振り △ファウル □打った',
      result: '中堅の前へ安打。書くのは打った方向でなく、処理した野手の番号（8）。安打は赤',
      dot: '8の下の点＝中堅手の【前】に落ちた。上なら越えた、横ならライン際',
      'slash:1': '一塁へ。赤い斜線は「自分の打撃で得た塁」の分だけ引く',
      'mark:2': '盗塁で二塁へ。ここから先は斜線を足さず、記号で残す（S＝盗塁）',
      'mark:3': '3番の安打で三塁へ。(3)＝3番の打撃で進んだ、という意味',
      'mark:4': '本塁に到達。丸囲みの③＝この1点は3番の打点',
      center: '中央に●（赤）＝得点'
    }
  };

  /* ---- アウト（黒） ---- */

  G['ground63-out1'] = {
    title: '遊ゴロ 6-3・1アウト目',
    pitches: ['B','W','X'],
    result: { text: '6-3' },
    center: { out: 1 },
    captions: {
      result: '遊撃手（6）が捕って一塁手（3）が受けた。ハイフン＝送球。ゴロは印を付けない——番号をつなぐこと自体がゴロの証',
      center: 'アウトの瞬間に中央へ。Ⅰ＝この回の1アウト目'
    }
  };

  G['fly8-out2'] = {
    title: '中堅フライ・2アウト目',
    pitches: ['S','X'],
    result: { text: '8', trace: 'fly' },
    center: { out: 2 },
    captions: {
      result: '捕った野手の番号（8＝中堅手）',
      trace: '数字の上の弧＝フライ（上がって落ちた）',
      center: '中央にⅡ'
    }
  };

  G['liner-out'] = {
    title: 'ライナーでアウト',
    result: { text: '5', trace: 'liner' },
    center: { out: 3 },
    captions: {
      result: '捕った野手の番号（5＝三塁手）',
      trace: '数字の上の直線＝ライナー（まっすぐ飛んだ）'
    }
  };

  G['foulfly'] = {
    title: 'ファウルフライ',
    result: { text: '3F', trace: 'fly' },
    center: { out: 2 },
    captions: {
      result: '守備番号に F を添える＝ファウルフライ（3F＝一塁手が捕った）'
    }
  };

  G['dp-batter'] = {
    title: '併殺打（打者のマス）',
    result: { text: '4-6-3' },
    center: { out: 2 },
    captions: {
      result: '触った順に全部つなぐ。二塁（4）→遊撃（6）→一塁（3）。先にアウトになった走者のマスにも書く'
    }
  };

  G['k-swing'] = {
    title: '空振り三振',
    pitches: ['S','F','W'],
    result: { text: 'K' },
    center: { out: 1 },
    captions: { result: 'K＝空振り三振' }
  };

  G['k-look'] = {
    title: '見逃し三振',
    pitches: ['B','W','F','S'],
    result: { text: 'SO' },
    center: { out: 3 },
    captions: {
      result: 'SO＝見逃し三振（空振りは K）',
      center: 'Ⅲ＝3アウト目。ここで攻撃終了'
    }
  };

  /* ---- 安打（赤）---- */

  G['single'] = {
    title: '単打（右前安打）',
    kind: 'hit', hit: 1,
    result: { text: '9', dot: 'under' },
    captions: {
      result: '打球方向＝処理した野手（9＝右翼手）。安打は赤で書く',
      dot: '9の【下】に点＝右翼手の前に落ちた（右前）',
      'slash:1': '一塁への赤い斜線1本。真ん中の点線をなぞらず、その外側を大きく回る'
    }
  };

  G['double'] = {
    title: '二塁打（左越え）',
    kind: 'hit', hit: 2,
    result: { text: '7', dot: 'over' },
    captions: {
      result: '最初に打球を捕った野手の番号（7＝左翼手）',
      dot: '7の【上】に点＝左翼手の頭を越えた（左越え）',
      'slash:2': '赤い斜線2本＝二塁まで自分の打撃で進んだ。何塁打かは点でなく本数で分かる'
    }
  };

  G['triple'] = {
    title: '三塁打（右翼線）',
    kind: 'hit', hit: 3,
    result: { text: '9', dot: 'side' },
    captions: {
      result: '9＝右翼手',
      dot: '9の【横】に点＝右翼線への打球',
      'slash:3': '赤い斜線3本＝三塁まで自分の打撃で進んだ'
    }
  };

  G['homerun'] = {
    title: '本塁打',
    kind: 'hit', hit: 4,
    result: { text: '7' },
    marks: { 4: { circle: '5' } },
    center: { run: true },
    captions: {
      result: '打球方向を右下に（7＝左翼手）。本塁打は点を打たなくても、形で分かる',
      'slash:4': '赤い斜線4本で◇が完成',
      'mark:4': '自分の打点なので、自分の打順を丸で囲む',
      center: '中央に●＝得点。本塁打は点を打たなくても、この形で分かる'
    }
  };

  G['infield-hit'] = {
    title: '内野安打',
    kind: 'hit', hit: 1,
    result: { text: '4', dot: 'under', half: true },
    captions: {
      result: '二塁手（4）が捕ったが、足で一塁を陥れた',
      dot: '4の【下】に点＝二塁手の前の打球',
      'slash:1': 'まず安打の斜線を1本',
      half: 'その斜線を弦にした半円で数字を囲む＝内野安打。斜線と半円で数字を挟む形'
    }
  };

  G['bunt-hit'] = {
    title: 'バントヒット（内野安打）',
    kind: 'hit', hit: 1,
    result: { text: '5', dot: 'under', half: true, bh: true },
    captions: {
      result: '三塁手（5）へのバント',
      'slash:1': '安打の斜線を1本',
      half: '半円で数字を囲む＝内野安打',
      bh: '斜線の上に BH＝バントによる内野安打（バントヒット）'
    }
  };

  /* ---- 打たずに出る ---- */

  G['bb'] = {
    title: '四球',
    kind: 'walk',
    pitches: ['B','S','B','B','F','B'],
    result: { text: 'B' },
    captions: {
      pitches: 'ボール4つで四球。左の欄を見れば、どう歩いたかまで分かる',
      result: 'B＝四球。打数に入らないので青。斜線は引かない（打撃で得た塁ではないから）'
    }
  };

  G['db'] = {
    title: '死球',
    kind: 'walk',
    result: { text: 'DB' },
    captions: { result: 'DB＝死球。四球と同じく青' }
  };

  G['dib'] = {
    title: '申告敬遠',
    kind: 'walk',
    result: { text: 'DIB' },
    captions: { result: 'DIB＝申告敬遠。投球数には加算されない' }
  };

  G['error'] = {
    title: '失策で出塁（悪送球）',
    result: { text: '6E-3' },
    captions: {
      result: '経路の中に E を入れる。6E-3＝遊撃手が投げてそれた（悪送球）。捕り損ねなら 4-3E'
    }
  };

  G['fc'] = {
    title: '野手選択',
    result: { text: '3FC' },
    captions: { result: 'FC＝守備が他の走者を優先した結果、打者が生きた' }
  };

  G['sh'] = {
    title: '犠打（送りバント）',
    kind: 'sac',
    result: { text: '1-3', box: 'square' },
    center: { out: 1 },
    captions: {
      result: '処理の経路を青い四角で囲む＝犠打。打数に入らない',
      center: '自分はアウトになって走者を進めた'
    }
  };

  G['sf'] = {
    title: '犠飛（犠牲フライ）',
    kind: 'sac',
    result: { text: '8', box: 'triangle' },
    center: { out: 2 },
    captions: {
      result: '守備番号を青い三角で囲む＝犠飛。打数に入らない'
    }
  };

  /* ---- 走者の記録 ---- */

  G['walk-to2nd-lob'] = {
    title: '四球で出て、3番の打撃で二塁 → 残塁',
    kind: 'walk',
    pitches: ['B','S','B','B','B'],
    result: { text: 'B' },
    marks: { 2: '(3)' },
    center: { lob: true },
    captions: {
      result: 'B＝四球（青）。斜線は引かない',
      'mark:2': '(3)＝3番の打撃で二塁へ進んだ',
      center: 'ℓ＝そのまま塁に残った（残塁）'
    }
  };

  G['single-to3rd'] = {
    title: '単打で出て、二塁を通過して三塁へ',
    kind: 'hit', hit: 1,
    result: { text: '8', dot: 'under' },
    marks: { 2: '↰', 3: '(4)' },
    captions: {
      'slash:1': '自分の安打なので、一塁までは赤い斜線',
      'mark:2': '通過しただけの塁には ↰（矢印）',
      'mark:3': '到達した塁に (4)＝4番の打撃で進んだ'
    }
  };

  G['steal'] = {
    title: '安打で出て、盗塁で二塁へ',
    kind: 'hit', hit: 1,
    result: { text: '9', dot: 'under' },
    marks: { 2: 'S' },
    captions: { 'mark:2': 'S＝盗塁。何番打者の打席中かを (2) のように添える流儀もある' }
  };

  G['scored'] = {
    title: '二塁打で出て、4番の適時打で生還',
    kind: 'hit', hit: 2,
    result: { text: '8', dot: 'over' },
    marks: { 3: '↰', 4: { circle: '4' } },
    center: { run: true },
    captions: {
      result: '8の上の点＝中堅手を越えた打球。二塁打なのは斜線2本の方が表す',
      'mark:3': '三塁は通過しただけなので矢印（得点までの通過は赤）',
      'mark:4': '本塁に到達。丸囲みの④＝4番の打点',
      center: '中央に●＝得点'
    }
  };

  /* ---- 1イニング再現（教材ドリル14の第1問）で使うマス ---- */

  G['in1-b1'] = {
    title: '1番: 遊ゴロ 6-3',
    pitches: ['B','W','X'],
    result: { text: '6-3' },
    center: { out: 1 },
    captions: {
      pitches: '初球ボール、2球目空振り、3球目を打った',
      result: '遊撃手（6）が捕って一塁手（3）が受けた。ゴロに印は付けない',
      center: 'この回の1アウト目なので中央にⅠ'
    }
  };

  G['in1-b2-a'] = {
    title: '2番: 四球で一塁',
    kind: 'walk',
    pitches: ['B','S','B','B','B'],
    result: { text: 'B' },
    captions: { result: 'B＝四球（青）。斜線は引かない' }
  };
  G['in1-b2-b'] = {
    title: '2番: 3番の安打で二塁へ',
    kind: 'walk',
    pitches: ['B','S','B','B','B'],
    result: { text: 'B' },
    marks: { 2: '(3)' },
    captions: { 'mark:2': '(3)＝3番の打撃で二塁へ進んだ' }
  };
  G['in1-b2-c'] = {
    title: '2番: 4番の適時打で生還',
    kind: 'walk',
    pitches: ['B','S','B','B','B'],
    result: { text: 'B' },
    marks: { 3: '↰', 4: { circle: '4' } },
    center: { run: true },
    captions: {
      'mark:3': '三塁は通過しただけなので矢印。得点まで駆け抜けた通過は赤で書く',
      'mark:4': '本塁に到達。丸囲みの④＝この1点は4番の打点',
      center: '中央に●（赤）＝得点。斜線は増やさない（◇が線で完成するのは本塁打だけ）'
    }
  };

  G['in1-b3-a'] = {
    title: '3番: 右前安打',
    kind: 'hit', hit: 1,
    pitches: ['S','X'],
    result: { text: '9', dot: 'under' },
    captions: {
      result: '右翼手（9）の前への安打。赤で書く',
      dot: '9の下の点＝右翼手の前に落ちた'
    }
  };
  G['in1-b3-b'] = {
    title: '3番: 4番の安打で二塁へ',
    kind: 'hit', hit: 1,
    pitches: ['S','X'],
    result: { text: '9', dot: 'under' },
    marks: { 2: '(4)' },
    captions: { 'mark:2': '(4)＝4番の打撃で進んだ' }
  };
  G['in1-b3-end'] = {
    title: '3番: 二塁に残って残塁',
    kind: 'hit', hit: 1,
    pitches: ['S','X'],
    result: { text: '9', dot: 'under' },
    marks: { 2: '(4)' },
    center: { lob: true },
    captions: { center: '3アウトの時点で塁上に残ったので ℓ' }
  };

  G['in1-b4'] = {
    title: '4番: 左前へ適時打',
    kind: 'hit', hit: 1,
    pitches: ['B','X'],
    result: { text: '7', dot: 'under' },
    captions: { result: '左翼手（7）の前への安打' }
  };
  G['in1-b4-end'] = {
    title: '4番: 一塁に残って残塁',
    kind: 'hit', hit: 1,
    pitches: ['B','X'],
    result: { text: '7', dot: 'under' },
    center: { lob: true },
    captions: { center: '一塁に残ったので ℓ' }
  };

  G['in1-b5'] = {
    title: '5番: 見逃し三振',
    pitches: ['S','B','S','S'],
    result: { text: 'SO' },
    center: { out: 2 },
    captions: {
      result: 'SO＝見逃し三振',
      center: 'この回2つ目のアウトなのでⅡ'
    }
  };

  G['in1-b6'] = {
    title: '6番: 一塁側のファウルフライ',
    pitches: ['B','X'],
    result: { text: '3F', trace: 'fly' },
    center: { out: 3 },
    captions: {
      result: '守備番号に F を添える＝ファウルフライ。一塁手が捕ったので 3F',
      center: 'Ⅲ＝3アウト目。攻撃終了'
    }
  };

  root.DIAMOND_GLYPHS = G;
})(typeof window !== 'undefined' ? window : globalThis);
