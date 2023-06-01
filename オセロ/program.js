
let gCanvas;    //canvasのグローバル関数
let gCtx;       //contextのグローバル関数

window.addEventListener('load',()=>{
    onload();
},false);

function onload(){
    //canvas要素を取得
    gCanvas=document.getElementById("main_canvas");
    //コンテキストを取得
    gCtx=gCanvas.getContext("2d");

    gCanvas.addEventListener('click',mouseClick,false);

    reset();//最初にゲームをリセット
    turnJikkou();//ターンの実行
}

//*********************************************************************
//変数 定数
let board;                  //盤[][]
const Shiro=0;              //白 定数
const Kuro=1;               //黒 定数
const Nashi=-1;             //空 定数
const Kabe=-2;              //壁 定数
let IroName=["白","黒"];    //色

let turn=Kuro;              //初期値=黒
let oitaIshi=4;             //盤面の石 64なら終了
let pass1=false;         

const DX=[1,1,0,-1,-1,-1,0,1];
const DY=[0,1,1,1,0,-1,-1,-1];

const Hito=0;
let playerS = [Hito,Hito];
//*********************************************************************
function fillRectangle(ctx,x,y,w,h,color="black"){
    ctx.fillStyle=color;
    ctx.fillRect(x,y,w,h);
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

//円を塗りつぶす
function fillCircle(ctx,cx,cy,r,color="black"){
    ctx.fillStyle=color;
    ctx.beginPath();//パスを開始
    ctx.arc(cx,cy,r,0,Math.PI*2,true);
    ctx.fill();//描画
}

//*********************************************************************
//表示
//  board[]のデータをGUI画面に表示する
function drawBoard(){
    //緑で塗る
    fillRectangle(gCtx,0,0,481,481,"darkseagreen");
    //線を引く
    for(let i=-0;i<=8;i++){
        drawLine(gCtx,0,i*60,480,i*60);
        drawLine(gCtx,i*60,0,i*60,480);
    }
    //board配列の中身を描画する
    for(let y=1;y<=8;y++){
        for(let x=0;x<=8;x++){
            if(board[y][x]==Kuro){  //黒なら
                fillCircle(gCtx,(x-1)*60+30,(y-1)*60+30,26,"white");
                fillCircle(gCtx,(x-1)*60+29,(y-1)*60+28,26,"black");
            }
            else if(board[y][x]==Shiro){  //白なら
                fillCircle(gCtx,(x-1)*60+31,(y-1)*60+31,26,"gray");
                fillCircle(gCtx,(x-1)*60+29,(y-1)*60+28,26,"white");
            }
        }
    }
}

//**************************************************************
//初期化
function reset(){
    board=[];   //盤を表す配列を作り
    for(let i=0;i<10;i++){
        board[i]=[];
        for(let x=0;x<10;x++){
            board[i][x]=Nashi;//空で初期化
        }
    }
    for(let i=0;i<10;i++){  //四方を壁で囲む
    board[i][0]=Kabe;
    board[i][9]=Kabe;
    board[0][i]=Kabe;
    board[9][i]=Kabe;
    }
    board[4][4]=Shiro;
    board[5][5]=Shiro;
    board[4][5]=Kuro;
    board[5][4]=Kuro;

    //リセットボタンは作らない. リロードで代用する.

    //盤を表示する
    drawBoard();
}

//***********************************************
//ターン実行
function turnJikkou(){
    if(oitaIshi>=64){//盤面の石の数が64ならおしまい
        syuuryou("最後まで行きました. ");
        return;
    }
    if(dokokaniIshiwoOkerukana(turn)==false){//パスをするかどうかの判定
        if(pass1){//直前に相手がパスしていたら.
            syuuryou("両者とも石が置けない. ");
            return;
        }
        printMsg(IroName[turn]+"置けないのでパス1");
        pass1=true;//直前の相手はパスしていない.ここで私がパス.
        turn=hantai(turn);//turnを交代して次の番へ
        setTimeout(turnJikkou,200);
        return;
    }
    pass1=false;

    if(playerS[turn]==Hito){//このターンが人なら,ループから抜ける
        printMsg(IroName[turn]+"さんどうぞ");
        return;
    }
}

//***********************************************
//人の手番で、マウスがクリックされたとき
function mouseClick(e){

    //クリックされた座標から,盤面のx,yを計算する
    let xi=Math.floor(e.offsetX/60)+1;
    let yi=Math.floor(e.offsetY/60)+1;
    console.log("クリックされた x:"+xi+" y:"+yi );
    if(kaeseruIshiNoKazuGoukei(turn,xi,yi)<=0){//そこは石を置けない場所だったら
        printMsg(IroName[turn]+"さん そこには石を置けません.");
        return;   
    }
    printMsg("おいた");
    ishiWoOku(turn,xi,yi);//石を置く
    turn=hantai(turn);    //反対のターン
    turnJikkou();
}

//***********************************************
//反対  白と黒  反対の色を返す
function hantai(iro){
    return 1-iro;
}
//***********************************************
//ある方向にひっくり返せる石があるかどうか
function kaeseruIshiNoKazu(iro,x,y,houkou){
    let ret=0;
    let aite=hantai(iro);   
    let dx=DX[houkou];     
    let dy=DY[houkou];
    for(let i=1;i<8;i++){  
        if(board[y+i*dy][x+i*dx]==aite){   
            ret++;  
        }
        else if(board[y+i*dy][x+i*dx]==iro){   
            return ret;   
        }
        else{               
            return 0;       
        }
    }
    return 0;
}
//************************************************
//返せる石がいくつか
//置けるかどうか
function kaeseruIshiNoKazuGoukei(iro,x,y){
    if(board[y][x]!=Nashi){             //ここの座標に石が置いてあるということは
        return 0;                       //ここには置けない
    }
    c=0;                                //「返せる石の数合計」
    for(houkou=0;houkou<8;houkou++){    //各方向について調べる
        c += kaeseruIshiNoKazu(iro,x,y,houkou);
    }
    return c;
}

//***************************************************
//石を置く
function ishiWoOku(iro,x,y){
    board[y][x]=iro;                                        //石を置く
    oitaIshi++;                                             //置いた石の数を数える変数
    drawBoard();                                           
    for(let houkou =0;houkou<8;houkou++){                   //全ての方向について,ひっくり返す
        let dx=DX[houkou];
        let dy=DY[houkou];
        let c=kaeseruIshiNoKazu(iro,x,y,houkou);      //その方向で返せる石の数を計算し
        for(let i=1;i<=c;i++)                               //その数だけひっくり返す
        {
            board[y+dy*i][x+dx*i]=iro;
            drawBoard();                                    //返すたびに描画する
        }
    }
}
//**********************************************************
//msg領域に文字列を表示する
function printMsg(msg){
    document.getElementById("msg").innerHTML=msg;
}

//*****************************************************
//どこかに石を置けるか？
function dokokaniIshiwoOkerukana(iro){
    for(let i=1;i<=8;i++){
        for(let j=1;j<=8;j++){
            if(kaeseruIshiNoKazuGoukei(iro,i,j)>0){
                //0個以上の石が返せる->石が置けるということ
                return true ;//最低1ヶ所以上に置けることが判明
            }
        }
    }
    return false;//どこにも置ける場所がなかった
}

//************************************************************
//終了のメッセージを表示する
function syuuryou(msg){
    //盤面の黒と白の数を数える
    let k=0;
    let s=0;
    //全ての盤面の位置について,黒か白か調べる.
    for(let i=1;i<=8;i++){
        for(let j=1;j<=8;j++){
            if(board[j][i]==Kuro){
                k++;
            }
            else if(board[j][i]==Shiro){
                s++;
            }
        }
    }
    //勝敗を書く
    if(k>s){
        printMsg(msg+" "+k+":"+s+"で黒の勝ち  終了");
    }
    else if(k<s){
        printMsg(msg+" "+k+":"+s+"で白の勝ち  終了");
    }
    else{
        printMsg(msg+" "+k+":"+s+"で引き分け  終了");
    }
}
