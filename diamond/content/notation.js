/* =========================================================
   Diamond⭐︎ — 記号の定義（早稲田式・公式寄りの標準）
   ---------------------------------------------------------
   2026-07-29、本人指定の2サイトの「記号早見表」を画像で直接読んで
   確定した。テキスト要約では取り違えたため、図そのものを見ている。

   一次情報:
   ・パ・リーグ.com「野球スコアのつけ方は？」記号の早見表（(C) PLM）
     https://pacificleague.com/news/2023/2/47589
   ・BASEBALL ONE「野球 スコアブックの書き方とは？！」
     https://baseball-one.com/blog/archives/274598/

   ※ 記号に全国共通の公式規格は存在しない（団体ごとに違う）。
     ここは「早稲田式の標準形」であり、使うスコアブックの凡例と
     所属連盟の記録要領が最優先。学校ごとのローカル差は v2 で
     切り替えられるようにする（仕様書 §13 要判断⑦）。

   このファイルは「何が正しい書き方か」の一覧であり、
   辞典・ドリル・凡例・印刷シートはここを参照する（二重管理しない）。
   ========================================================= */
(function (root) {
  'use strict';

  /* ---- 3色のペン ----
     色そのものが「打数に入るか・誰の手柄か」を表す */
  var PENS = [
    {id:'ink',  name:'黒', what:'アウトになった打席・失策・野選・投球経過・進塁の記号',
     why:'打数に入って、打者の手柄ではない'},
    {id:'red',  name:'赤', what:'安打の斜線と守備番号・得点（中央の●）・打点の丸囲み',
     why:'打者の手柄。ひと目で「打った」と分かる'},
    {id:'blue', name:'青', what:'四球・死球・申告敬遠・犠打・犠飛・盗塁',
     why:'打数に入らない（打者の打撃で決まった結果ではない）'}
  ];

  /* ---- 打球の種類 ----
     ゴロは印を付けない。数字をハイフンでつなぐこと自体がゴロの証。 */
  var TRACE = [
    {id:'ground', name:'ゴロ', how:'印は付けない。処理した野手を「-」でつなぐ（例 6-3）'},
    {id:'fly',    name:'フライ', how:'数字の上に ⌒（弧）'},
    {id:'liner',  name:'ライナー', how:'数字の上に −（直線）'},
    {id:'foul',   name:'ファウルフライ', how:'数字に F を添える（例 3F）＋上に弧'}
  ];

  /* ---- 安打 ----
     赤い斜線は「打者が自分の打撃で得た塁」の数だけ引く。
     守備番号に打つ点（・）の位置で、何塁打かがひと目で分かる。 */
  var HITS = [
    {bases:1, name:'単打', dot:'under', how:'赤い斜線1本＋守備番号の【下】に・'},
    {bases:2, name:'二塁打', dot:'over', how:'赤い斜線2本＋守備番号の【上】に・'},
    {bases:3, name:'三塁打', dot:'side', how:'赤い斜線3本＋守備番号の【横】に・'},
    {bases:4, name:'本塁打', dot:null,   how:'赤い斜線4本＋中央に得点の●'}
  ];

  /* ---- 進塁 ----
     ここが早稲田式のいちばんの勘所。
     斜線を足すのではなく、記号で「どうやって進んだか」を残す。 */
  var ADVANCE = {
    reached: '到達した塁の区画に、進めてくれた打者の打順を (3) のように書く',
    passed:  '通過しただけの塁の区画には ↰（矢印）を書く',
    rbi:     '本塁に到達し、それが打点なら打順を ○ で囲む',
    note:    '赤い斜線を引くのは打者自身の安打の分だけ。走者としての進塁は記号で表す'
  };

  /* ---- 打席の結果の記号 ---- */
  var RESULTS = [
    {id:'k',    name:'空振り三振', sym:'K',   pen:'ink'},
    {id:'so',   name:'見逃し三振', sym:'SO',  pen:'ink'},
    {id:'bb',   name:'四球',       sym:'B',   pen:'blue'},
    {id:'db',   name:'死球',       sym:'DB',  pen:'blue'},
    {id:'dib',  name:'申告敬遠',   sym:'DIB', pen:'blue'},
    {id:'sh',   name:'犠打',       sym:'1-3', pen:'blue', box:'square',
     note:'処理の経路を青い四角で囲む'},
    {id:'sf',   name:'犠飛',       sym:'8',   pen:'blue', box:'triangle',
     note:'守備番号を青い三角で囲む'},
    {id:'fc',   name:'野手選択',   sym:'3FC', pen:'ink'},
    {id:'ih',   name:'内野安打',   sym:'6',   pen:'red', oval:true,
     note:'安打の数字を半円（楕円）で囲む'}
  ];

  /* ---- 失策 ----
     E を単独で書かず、送球の経路の中に E を入れて「どこで失敗したか」を残す */
  var ERRORS = [
    {name:'悪送球',            sym:'6E-3', note:'投げた側で失敗＝番号のあとに E'},
    {name:'捕球ミス',          sym:'4-3E', note:'受けた側で失敗＝受け手の番号のあとに E'},
    {name:'落球',              sym:'7E'},
    {name:'後逸・ファンブル',  sym:'5E'},
    {name:'安打＋失策',        sym:'9E ＋ ↰ ＋ 赤い斜線と 9',
     note:'安打の分は赤、失策で進んだ分は矢印で表す'}
  ];

  /* ---- 走者まわり ---- */
  var RUNNER = [
    {name:'盗塁',       sym:'S',   pen:'blue', note:'下に (打順) ＝何番打者の打席中に起きたか'},
    {name:'盗塁死',     sym:'CS',  pen:'blue', note:'同じく (打順) を添える'},
    {name:'暴投',       sym:'WP',  pen:'ink'},
    {name:'捕逸',       sym:'PB',  pen:'ink'},
    {name:'ボーク',     sym:'BK',  pen:'ink'},
    {name:'打撃妨害',   sym:'2IF', pen:'ink'},
    {name:'走塁妨害',   sym:'OB4', pen:'ink'},
    {name:'守備妨害',   sym:'IP2', pen:'ink'},
    {name:'タッチアウト', sym:'4-6-5 T.O', pen:'ink'},
    {name:'併殺打',     sym:'4-6 → 4-6-3 と DP', pen:'ink',
     note:'先にアウトになった走者のマスと、打者のマスの両方に書く'}
  ];

  /* ---- マスの中央（結末） ---- */
  var CENTER = [
    {id:'out1', name:'1アウト目', sym:'Ⅰ', pen:'ink'},
    {id:'out2', name:'2アウト目', sym:'Ⅱ', pen:'ink'},
    {id:'out3', name:'3アウト目', sym:'Ⅲ', pen:'ink'},
    {id:'run',  name:'得点（自責点）', sym:'●', pen:'red'},
    {id:'unearned', name:'得点（自責点でない）', sym:'○', pen:'red'},
    {id:'lob',  name:'残塁', sym:'ℓ', pen:'ink'}
  ];

  /* ---- 投球経過（マス左の細い欄に、上から1球ずつ） ---- */
  var PITCH = [
    {id:'B', name:'ボール',           sym:'●'},
    {id:'S', name:'見逃しストライク', sym:'×'},
    {id:'W', name:'空振りストライク', sym:'⊗', note:'×に線を1本足す'},
    {id:'F', name:'ファウル',         sym:'△'},
    {id:'X', name:'打った（インプレー）', sym:'□'}
  ];

  root.DIAMOND_NOTATION = {
    pens: PENS, trace: TRACE, hits: HITS, advance: ADVANCE,
    results: RESULTS, errors: ERRORS, runner: RUNNER,
    center: CENTER, pitch: PITCH,
    sources: [
      {name:'パ・リーグ.com「野球スコアのつけ方は？」記号の早見表', url:'https://pacificleague.com/news/2023/2/47589'},
      {name:'BASEBALL ONE「野球 スコアブックの書き方とは？！」', url:'https://baseball-one.com/blog/archives/274598/'}
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
