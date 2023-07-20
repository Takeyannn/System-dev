
const RANDOM_SENTENCE_URL_API= "https://api.quotable.io/random";
const typeDisplay=document.getElementById("typeDisplay");
const typeInput=document.getElementById("typeInput");
const timer=document.getElementById("timer");
//*********************************************************************
//inoutテキスト入力、合否判定
    typeInput.addEventListener("input",()=>{
        const sentenceArray=typeDisplay.querySelectorAll("span");
        const arrayValue=typeInput.value.split("");
        //配列に格納
        let correct=true;
        sentenceArray.forEach((characterSpan,index)=>{
            if((arrayValue[index]==null)){
                characterSpan.classList.remove("correct");
                characterSpan.classList.remove("incorrect");
                correct=false;
            }else if(characterSpan.innerText==arrayValue[index]){
                characterSpan.classList.add("correct");
                characterSpan.classList.remove("incorrect");
           }else{
            characterSpan.classList.add("incorrect");
            characterSpan.classList.remove("correct");

            correct=false;
           }
        });
        if(correct==true){
            RenderNextSentence();
        }

    });
//*********************************************************************
//非同期でランダムな文章を取得
function GetRandomSentence(){
    return fetch(RANDOM_SENTENCE_URL_API)
    .then((Response)=>Response.json())
    .then((data)=>data.content);
}
//ランダムな文章を取得して、表示する
async function RenderNextSentence(){
    const sentence=await GetRandomSentence();
    console.log(sentence);

    typeDisplay.innerText="";
    //文章を1文字ずつ分解して、spanタグを生成
    let oneText=sentence.split("");

    oneText.forEach((character)=>{
        const characterSpan=document.createElement("span");
        characterSpan.innerText=character;
        typeDisplay.appendChild(characterSpan);
        //characterSpan.classList.add("correct");
    });
    //テキストボックスの中身をリセット
    typeInput.value="";

    StartTimer();
}
//*********************************************************************
//タイマー
let startTime;  
let originTime=60; // 制限時間設定のグローバル変数

function StartTimer(){
    timer.innerText=originTime;

    startTime=new Date();//今の時刻
    //console.log(startTime);
    setInterval(()=>{
        timer.innerText=originTime - getTimerTime();
        if(timer.innerText<=0)TimeUp();
    },1000);    //1000mm秒＝1秒
}
function getTimerTime(){
    return Math.floor((new Date()-startTime)/1000);//現在の時刻ー1秒前の時刻＝1s
}
//時間切れで次の問題へ
function TimeUp(){
    RenderNextSentence();
}
RenderNextSentence();