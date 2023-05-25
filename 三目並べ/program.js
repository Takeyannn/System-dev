
let gCanvas;    //canvas
let gCtx;       //context

window.addEventListener('load',()=>{
    //読み込み後に実行
    onload();
},false);

function onload(){
    gCanvas=document.getElementById("main_canvas");
    gCtx=gCanvas.getContext("2d");
    gCanvas.addEventListener('click',mouseClick,false);
    reset();            //ゲームリセット
    turnJikkou();
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
function drawCircle(ctx,cx,cy,r,color="black",width=1){
    //色設定
    ctx.strokeStyle=color;
    //太さ設定
    ctx.lineWidth=width;
    //線を書くための手順
    ctx.beginPath();//パスを開始
    ctx.arc(cx,cy,r,0,Math.PI*2,true);
    ctx.stroke();//描画
}
function fillRectangle(ctx,x,y,w,h,color="white"){
    ctx.fillStyle=color;
    ctx.fillRect(x,y,w,h);
}

//*****************************************************
let board;
const Maru=0;
const Batu=1;
const Nashi=-1;
const Kabe=-2;
let Name=["マル","バツ"];

let turn=Maru;      //初ターンはマル
let kaisu=0;        //盤面を埋めた数 3x3=9で終了
let pass1=false; 
const DX=[1,1,0,-1,-1,-1,0,1];
const DY=[0,1,1,1,0,-1,-1,-1];

const Hito=0;
let playerS = [Hito,Hito];
//*****************************************************
//表示 board[]のデータをGUI画面に表示する
function drawBoard(){
    fillRectangle(gCtx,0,0,210,210,"white");
    for(let i=-0;i<=3;i++){
        drawLine(gCtx,0,i*70,210,i*70);
        drawLine(gCtx,i*70,0,i*70,210);
    }
    //board配列
    for(let y=1;y<=3;y++){
        for(let x=0;x<=3;x++){
            if(board[y][x]==Maru){
                drawCircle(gCtx,35+(x-1)*70,35+(y-1)*70,26,"black");
            }
            else if(board[y][x]==Batu){
                drawLine(gCtx,20+(x-1)*70,20+(y-1)*70,50+(x-1)*70,50+(y-1)*70,"black",width=2);
                drawLine(gCtx,50+(x-1)*70,20+(y-1)*70,20+(x-1)*70,50+(y-1)*70,"black",width=2);
            }
        }
    }
}

//*****************************************************
//初期化
function reset(){
    board=[];
    for(let i=0;i<4;i++){
        board[i]=[];
        for(let x=0;x<4;x++){
            board[i][x]=Nashi;//空で初期化
        }
    }
    for(let i=0;i<4;i++){
        board[i][0]=Kabe;
        board[i][3]=Kabe;
        board[0][i]=Kabe;
        board[3][i]=Kabe;
    }

    drawBoard();
}
//**************************************************
function turnJikkou(){
    if(kaisu>=9){
        shouhai("最後まで行きました.")
        return;
    }
    if(playerS[turn]==Hito){//このターンが人なら,ループから抜ける
        printMsg(Name[turn]+"さんどうぞ");
        return;
    }

}
//*************************************************
function mouseClick(e){ 
    //クリックされた座標から,盤面のx,yを計算する
    let xi=Math.floor(e.offsetX/70)+1;
    let yi=Math.floor(e.offsetY/70)+1;
    console.log("クリックされたx;"+xi+"y:"+yi);
    
    Oku(turn,xi,yi);
    turn=hantai(turn);
    turnJikkou();
    shouhai();
}
//*********************************************
function hantai(maru){
    return 1-maru;
}
//*********************************************
function Oku(maru,x,y){
    board[y][x]=maru;
    kaisu++;
    drawBoard();

}
function printMsg(msg){
    document.getElementById("msg").innerHTML=msg;
}
//************************************************************
//終了のメッセージを表示する
function shouhai(msg){
  if(board[1][1]==Maru&&board[1][2]==Maru&&board[1][3]==Maru){
    printMsg("マルの勝ち  終了");
  }
  else if(board[2][1]==Maru&&board[2][2]==Maru&&board[2][3]==Maru){
    printMsg("マルの勝ち  終了");
  }
  else if(board[3][1]==Maru&&board[3][2]==Maru&&board[3][3]==Maru){
    printMsg("マルの勝ち  終了");
  }
  else if(board[1][1]==Maru&&board[2][1]==Maru&&board[3][1]==Maru){
    printMsg("マルの勝ち  終了");
  }
  else if(board[1][2]==Maru&&board[2][2]==Maru&&board[3][2]==Maru){
    printMsg("マルの勝ち  終了");
  }
  else if(board[1][3]==Maru&&board[2][3]==Maru&&board[3][3]==Maru){
    printMsg("マルの勝ち  終了");
  }
  else if(board[1][1]==Maru&&board[2][2]==Maru&&board[3][3]==Maru){
    printMsg("マルの勝ち  終了");
  }
  else if(board[3][1]==Maru&&board[2][2]==Maru&&board[1][3]==Maru){
        printMsg("マルの勝ち  終了");
  }
  else if(board[1][1]==Batu&&board[1][2]==Batu&&board[1][3]==Batu){
    printMsg("バツの勝ち  終了");
  }
  else if(board[2][1]==Batu&&board[2][2]==Batu&&board[2][3]==Batu){
    printMsg("バツの勝ち  終了");
  }
  else if(board[3][1]==Batu&&board[3][2]==Batu&&board[3][3]==Batu){
    printMsg("バツの勝ち  終了");
  }
  else if(board[1][1]==Batu&&board[2][1]==Batu&&board[3][1]==Batu){
    printMsg("バツの勝ち  終了");
  }
  else if(board[1][2]==Batu&&board[2][2]==Batu&&board[3][2]==Batu){
    printMsg("バツの勝ち  終了");
  }
  else if(board[1][3]==Batu&&board[2][3]==Batu&&board[3][3]==Batu){
    printMsg("バツの勝ち  終了");
  }
  else if(board[1][1]==Batu&&board[2][2]==Batu&&board[3][3]==Batu){
    printMsg("バツの勝ち  終了");
  }
  else if(board[3][1]==Batu&&board[2][2]==Batu&&board[1][3]==Batu){
        printMsg("バツの勝ち  終了");
  }
  else if(kaisu==9){
    printMsg("引き分け 終了")
  }
  else{
    return;
  }
}