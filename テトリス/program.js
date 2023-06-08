
let gCanvas ;   //canvasのグローバル関数
let gCtx;       //contextのグローバル関数

window.addEventListener('load',()=>{
    onload();
},false);

function onload(){
    gCanvas=document.getElementById("main_canvas");
    gCtx=gCanvas.getContext("2d");

    //ゲームを初期化
    initGame();

    //キーボード入力
    document.addEventListener('keydown',(event)=>{
        if(event.key=="ArrowLeft"){
            Hidari();
        }
        else if(event.key=="ArrowRight"){
            Migi();
        }
        else if(event.key=="ArrowUp"){
            kaiten();
        }
        else if(event.key=="ArrowDown"||event.key==" "){
            Shita();
        }
    });
}
function printMsg(msg){
    document.getElementById("msg").innerHTML=msg;
}
function drawLine(ctx,x1,y1,x2,y2,color="black",width=1){
    //色設定
    ctx.strokeStyle=color;
    //太さ設定
    ctx.lineWidth=width;
    //線を書くための手順
    ctx.beginPath();//パスを開始
    ctx.moveTo(x1,y1);//始点に移動
    ctx.lineTo(x2,y2);//終点に移動
    ctx.closePath();//パスを閉じる
    ctx.stroke();//描画
}

//四角形を描く
function drawRectangle(ctx,x,y,w,h,color="black",width=1){
    //色設定
    ctx.strokeStyle=color;
    //太さ設定
    ctx.lineWidth=width;
    //戦を書くための手順
    ctx.beginPath();//パスを開始
    ctx.moveTo(x,y);//始点に移動
    ctx.lineTo(x+w,y);//頂点に移動
    ctx.lineTo(x+w,y+h);//頂点に移動
    ctx.lineTo(x,y+h);//頂点に移動
    //ctx.lineTo(x,y);//終点に移動
    ctx.closePath();//パスを閉じる
    ctx.stroke();//描画
}

//四角形を塗りつぶす
function fillRectangle(ctx,x,y,w,h,color="black"){
    ctx.fillStyle=color;
    ctx.fillRect(x,y,w,h);
}


//**************************************************************************************
//1.盤面の表示
function displayBanmen(){
    fillRectangle(gCtx,0,0,300,600,"lightgrey");
    for(let x=4;x<=13;x++){
        for(let y=4;y<=23;y++){
            if(banmen[x][y]!=0){
            fillRectangle(gCtx,(x-4)*30,(y-4)*30,30,30,"grey");
            }
        }
    }

    if(blkNow !=null&&gamestat<=2){
        for (let xi=0;xi<blkNow.size;xi++){
            for(let yi=0;yi<blkNow.size;yi++){
                if(blkNow.katachi[xi][yi]!=0){
                    let x=blkNow.ichiX+xi;
                    let y=blkNow.ichiY+yi;
                    fillRectangle(gCtx,(x-4)*30,(y-4)*30,30,30,colorTbl[blkNow.num]);
                }
            }
        }
    }
    for(let i=1;i<=20;i++){     
        drawLine(gCtx,0,i*30,300,i*30,"white");
        drawLine(gCtx,i*30,0,i*30,600,"white");
    }
}
//初期化処理
function initGame(){

    banmen=[];
    for (let x=0;x<18;x++){
        banmen[x]=[];
        for(let y=0;y<25;y++){
            banmen[x][y]=0;
        }
    }
    //両脇の壁
    for (let y=0;y<25;y++){
        for(let x=0;x<4;x++){
            banmen[x][y]=-1;
            banmen[x+14][y]=-1;
        }
    }
    //底辺
    for(let x=0;x<18;x++){
        banmen[x][24]=-1;
    }

    //1つ目のブロック
    let nbnum;
    while(true){  
        nbnum=Math.floor(Math.random()*7)+1;
        if(nbnum!=3&&nbnum!=4)break;//sとzの禁止
    }
    blkNow=createBlock(nbnum,0,0);
    while(true){
        nbnum=Math.floor(Math.random()*7)+1;
        if(nbnum!=3&&nbnum!=4&&nbnum!=blkNow.num)break;
    }
    blkNext=createBlock(nbnum,0,0);
    blkNow.ichiX=Math.floor(Math.random()*(10-blkNow.size))+4;
    blkNow.ichiY=3-blkNow.size;
    
    timerInterval=1000;

    gamestat=1;

    score=0;
    printMsg("Score:0");
}

//**********************************************************************************
//2.ミノの出現
let blkNow=null;//現在落ちている途中のブロック
let blkNext=null;//次のブロック
let score=0;    //スコア

//現在の状態
let gamestat=1;
//  1   落ちている途中  
//  2   落ち切っている  
//  3   動かせない      
//  4   見せるだけ      
let timerInterval=1200; //タイマーの間隔
let tickCount=1;        //タイマーのtickを数えて、ある回数になったら速度を上げる

//色のテーブル  ブロックの色の指定
let colorTbl=[
    "white",        //何もないところ
    "skyblue",    // 1 I
    "gold",         // 2 O
    "green",        // 3 S
    "red",          // 4 Z
    "blue",         // 5 J
    "orange",       // 6 L
    "purple",       // 7 T
];

let banmen=[];

//ブロックの形
let katachiList=[
    [[0]],
    [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]],//I型
    [[2,2],[2,2]],              //O型
    [[0,0,0],[0,3,3],[3,3,0]],  //S型
    [[0,0,0],[4,4,0],[0,4,4]],  //Z型
    [[0,0,0],[5,0,0],[5,5,5]],  //J型
    [[0,0,0],[0,0,6],[6,6,6]],  //L型
    [[0,0,0],[0,7,0],[7,7,7]],  //T型
];

let started =false; 


function start(){
    if(started) return; //二重スタート防止 

    started=true;
    //BGM   音楽再生（無限） ロシア民謡
    let bgm =new Audio("Korobeyniki_polka.mp3");
    bgm.loop=true;
    bgm.play();

    //最初のtickへ
    setTimeout(tick,timerInterval);
}

//ブロックを表すオブジェクト（のコンストラクタ）
//  javaScriptではクラスではなくコンストラクタを作る
function createBlock(t,x,y){
    const obj={};
    obj.katachi=Array.from(katachiList[t]);//クローンする
    obj.num=t;       //どの形か？
    obj.ichiX=x;    //現在の位置
    obj.ichiY=y;    //
    obj.size=obj.katachi.length;//配列の大きさ
    return obj;
}
//つぎのブロック
function newBlock(){
    let nbnum=0;
    while(true){//NowとNext以外の形になるように乱数で決める
        nbnum=Math.floor(Math.random()*7)+1;
        if(nbnum!=blkNow.num&&nbnum!=blkNext.num)
        break;
    }
    blkNow=blkNext;
    blkNext=createBlock(nbnum,0,0);
    blkNow.ichiX=Math.floor(Math.random()*(10-blkNow.size))+4;
    blkNow.ichiY=4-blkNow.size;
    displayBanmen();
}

//********************************************************************************************
//3.自由落下
//一つ下に動かす
function move1(){
    blkNow.ichiY++;
    if(cheak(blkNow.katachi,blkNow.ichiX,blkNow.ichiY)){
        return true;
    }
    blkNow.ichiY--;
    return false;
}
//衝突判定
function cheak(a,ichix,ichiy){
    if(blkNow!=null){
        for(let xi=0;xi<blkNow.size;xi++){
            for(let yi=0;yi<blkNow.size;yi++){
                if(a[xi][yi]!=0){
                    let x=ichix+xi;//ブロックの位置
                    let y=ichiy+yi;
                    if(banmen[x][y]!=0){    //重なったらfalse
                        return false;
                    }
                }
            }
        }
    }
    return true;
}
function kakutei(){
    for(let xi=0;xi<blkNow.size;xi++){
        for(let yi=0;yi<blkNow.size;yi++){
            if(blkNow.katachi[xi][yi]!=0){
                let x=blkNow.ichiX+xi;
                let y=blkNow.ichiY+yi;
                banmen[x][y]=-1;
            }
        }
    }
}
//**********************************************************
//4.行の消去
function shoukyo(){
    let keshitaGyou=0;
    let y=23;
    while(y>0){                    
        let flag=true;              
        for(let x=4;x<=13;x++){
            if(banmen[x][y]==0){    
                flag=false;
                break;
            }
        }
        if(flag){
            keshitaGyou++;
            for(let yi=y;yi>0;yi--){
                for(let xi=4;xi<=13;xi++){
                    banmen[xi][yi]=banmen[xi][yi-1]
                }
            }
        }
        else{
            y--;
        }
    console.log("消す"+y)
    }
score+=keshitaGyou*100;//スコア 連続して消したら高得点とかに変更すべき
printMsg("Score:"+score);
}
//これより下に動かせるかチェック
function ugokaseru(){
    blkNow.ichiY++;    
    if(cheak(blkNow.katachi,blkNow.ichiX,blkNow.ichiY)){
        blkNow.ichiY--;
        return  true;
    }
    blkNow.ichiY--;
    return false;
}
//ゲームを進める
function susumeru(){
    console.log("進める"+gamestat);
    if(gamestat==1){    //状態1なら
        move1();
        displayBanmen();
        if(ugokaseru()){
            return;//まだ下に動かせる.続行
        }
        //もう下に動かせない.状態を変更
        gamestat=2;
        return;
    }
    else if(gamestat==2){   //下まで到達,動かせる状態   →確定へ
        //状態2の間に動かせる位置にスライドさせた場合など
        if(ugokaseru()){
            gamestat=1; //まだ下に動かせるので状態1に戻る
            return;
        }
        //もう動かせないので状態確定へ
        kakutei();//確定する
        displayBanmen();
        gamestat=3;
    }
    else if(gamestat==3){   //消す
        shoukyo();  //消去処理
        displayBanmen();
        gamestat=4;
    }
    else if(gamestat==4){
        newBlock();//新しいブロックを生み出す
        displayBanmen();
        gamestat=1;
    }
    console.log("進んだ"+gamestat);
}
//**********************************************************************************
//timer のイベントハンドラ
function tick(){
    tickCount++;
    //一定回数動かしたら早くする
    if(tickCount%100==0){
        timerInterval=1+Math.floor(timerInterval*0.8);  //0にしないように1を足す
    }
    //ゲームを進める
    susumeru();
    setTimeout(tick,timerInterval);//次のtick
}
//**********************************************************************************
//5.回転ボタン
function kaiten(){
    if(gamestat>2)return;//状態3以上では操作不可

    let s=blkNow.size;
    let a=[];//回転した後の形を作ってみる
    for(let x=0;x<s;x++){   //配列をコピーする
        a[x]=[];
        for(let y=0;y<s;y++){
            a[x][y]=blkNow.katachi[y][s-1-x];
        }
    }
    if(cheak(a,blkNow.ichiX,blkNow.ichiY)){
        //回転しても,そこに置けるなら,ブロックを変更
        //blkNow.katachi=Array.from(a);
        blkNow.katachi=a;
        displayBanmen();
    }
    //回転したら置けなかった時は,もとのまま.
}
//**********************************************************************************
//左移動
function Hidari(){
    if(gamestat>2)return;//状態3以上では操作不可
    blkNow.ichiX--;//位置を変更して
    if(!cheak(blkNow.katachi,blkNow.ichiX,blkNow.ichiY)){
        blkNow.ichiX++;//失敗したら（移動できなかったら）元に戻す
    }
    displayBanmen();//表示
    return;
}
//右移動
function Migi(){
    if(gamestat>2)return;//状態3以上では操作不可
    blkNow.ichiX++;//位置を変更して
    if(!cheak(blkNow.katachi,blkNow.ichiX,blkNow.ichiY)){
        blkNow.ichiX--;//失敗して（移動できなかったら）元に戻す
    }
    displayBanmen();//表示
    return;
}
//高速落下
function Shita(){
    if(gamestat!=1)return;  //状態1以外では操作不可
    while(move1());         //動かせるだけ下に動かす
    displayBanmen();        //表示
}