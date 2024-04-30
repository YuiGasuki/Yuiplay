/**
 * @author Yui_ <13413925094@139.com>
 * @date 2024-04-04 初始版本
 */

const YuiBox = document.getElementById('Yuiplay_box');
let PlayNumber = 0;
let PlaybackMode = 1;//储存播放方式 1为顺序播放 2为随机顺序 3为单曲循环
/**
 * 获取自定义属性
 * @author Yui_ <13413925094@139.com>
 * @returns {object} 返回一个自定义属性对象
 */
const GetCustomization = () =>{

    let ThemeColor = YuiBox.getAttribute('data-ThemeColor');
    let Color = YuiBox.getAttribute('data-Color');
    let ProgressColor = YuiBox.getAttribute('data-ProgressColor');
    let BackgroundColor = YuiBox.getAttribute('data-backgroundColor');
    let Playlist = JSON.parse(YuiBox.getAttribute('data-Playlist'));  
    let PlaylistPath = '';
    for(let i=0;i<Playlist.length;i++){
        PlaylistPath += `<li onclick="SwitchSongs(`+i+`)" id="`+i+`">`+Playlist[i].name+`</li>`;
    }
    
    
    return {
        ThemeColor:ThemeColor,
        Color:Color,
        ProgressColor:ProgressColor,
        BackgroundColor:BackgroundColor,
        Playlist:{
            name:Playlist[0].name,
            path:Playlist[0].path,
            lyrics:Playlist[0].lyrics 
        },
        PlaylistPath:PlaylistPath
    }
    
}
GetCustomization();



/**
 * 时间编码
 * @param {Number} number
 * @returns {String}
 */
const switchingTime = (number) =>{
    let minute = parseInt(number / 60);
    if(minute < 10){
        minute = '0' + minute;
    }
    let second = parseInt(number - (minute * 60));
    if(second < 10){
        second = '0' + second;
    }
    return minute+':'+second
}

/**
 * 这是标签间通讯，校对播放器信息
 */
const channel = new BroadcastChannel('Yuiplay-1');

/*
 * 监听消息，根据接收的数据改变播放器信息
 */
channel.addEventListener('message', (e) => {
    if(!e.data){
        return
    }
    if(e.data==="0"){
    //如果接收的数据为"0"，则返回校对信息
        ProofreadSongs(1);
        ProofreadSongs();
    return
    }
    if(e.data.Type===1){
        const YuiplayAudio = document.getElementById('Yuiplay_audio');
        YuiplayAudio.currentTime = e.data.CurrentTime;
        YuiplayAudio.play();
        return
    }
    
    PlaybackMode = Number(e.data.PlaybackMode);
    ModifyPlaybackMode('0');
    PlayNumber = Number(e.data.PlayNumber)
    SwitchSongs(0,'0');
})

/*
 * 发送消息
 * @param {Number} Type 判断发送啥信息
 */
const ProofreadSongs = (Type) =>{
    if(Type){
        const YuiplayAudio = document.getElementById('Yuiplay_audio');
        channel.postMessage({
            CurrentTime:YuiplayAudio.currentTime,
            Type:1
        });
        return
    }
    channel.postMessage({
    	PlayNumber:PlayNumber,
    	PlaybackMode:PlaybackMode,
    	Type:0
    	
    })
}



let datab=[];
const GetLyricsContent = (path) =>{
fetch(path).then((res)=>{
if (res.ok) {
return res.text()
}
}).then(data =>{
data=data.split('\n');

for(let i=0;i<data.length;i++){
let a = data[i].split(']')[0].split('[')[1];
let b = String(a).split(':');
let c=0;
for(let li=b.length-1;li>=0;li=li-1){
let d;
if(Math.abs(li-(b.length-1))===0){
d=Number(b[li]);
}else{
d=Number(b[li]);
for(let bi=Math.abs(li-(b.length-1));bi>0;bi=bi-1){
d = d * 60;
}
}
c=c+d;
}
datab.push([c,data[i].split(']')[1]]);
}
})
}
const GetLyrics = (time) =>{

for(let i=0;i<datab.length;i++){
if(i===datab.length-1){
if(time>=datab[i][0]){
return datab[i][1];
break
}
}
if(time>=datab[i][0]&&time<datab[i+1][0]){
return datab[i][1];
break
}
}

}




/**
 * 播放音乐
 */
const playMusic = () =>{
    let GetData = GetCustomization();
    const ProgressBox = document.getElementById('Progress_Box');
    const YuiplayBody = document.getElementById('Yuiplay_Body');
    const YuiplayAudio = document.getElementById('Yuiplay_audio');
    const YuiplayBodyWhole = document.getElementById('Yuiplay_Body_Whole');
    const YuiplayBodyPresent = document.getElementById('Yuiplay_Body_Present');
    const YuiplayPlayButton = document.getElementById('Yuiplay_PlayButton');    
    
    

    /**
     * 校对进度条
     * @author Yui_ <13413925094@139.com>
     */
    const CombinedProgress = () =>{
        YuiplayBody.style.setProperty('--progress',ProgressBox.value / ProgressBox.max * 100);
        YuiplayAudio.currentTime = ProgressBox.value;
        
        ProgressBox.addEventListener('input',CombinedProgress);
    }
    
    
    /**
     * 校对音乐播放进度与进度条
     * @author Yui_ <13413925094@139.com>
     */
    const CombinedTime = () =>{
        ProgressBox.value = YuiplayAudio.currentTime;
        if((ProgressBox.value / ProgressBox.max * 100).toString(10)=='NaN'){
            YuiplayBody.style.setProperty('--progress',0);
        }else{
            YuiplayBody.style.setProperty('--progress',ProgressBox.value / ProgressBox.max * 100);
        }
        
        let Lyrics = GetLyrics(YuiplayAudio.currentTime);
        if(Lyrics){
        document.getElementById('Lyrics').innerText=Lyrics;
        }else{
        document.getElementById('Lyrics').innerText="";
        }
        
        YuiplayBodyPresent.innerText = switchingTime(YuiplayAudio.currentTime);
        YuiplayAudio.addEventListener('timeupdate',CombinedTime);
        
    }
    
    
    /**
     * 检测视频是否获取到信息
     * @author Yui_ <13413925094@139.com>
    */
    YuiplayAudio.ondurationchange = () =>{
        channel.postMessage("0");
        ProgressBox.max = YuiplayAudio.duration;     
        YuiplayBodyWhole.innerText = switchingTime(YuiplayAudio.duration);
        CombinedProgress();
        CombinedTime();        
    }
    
    
    const YuiplayPlayButtonOnclick = () =>{
            if(YuiplayAudio.paused){
                  YuiplayPlayButton.innerHTML = `<svg t="1706010361462" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4208" width="22" height="22" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z" fill="`+GetData.ThemeColor+`" p-id="4209"></path></svg>`;
            
            }else{

                  YuiplayPlayButton.innerHTML = `<svg t="1706010319077" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5251" width="22" height="22" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M128 106.858667C128 94.976 137.621333 85.333333 149.12 85.333333h85.76c11.648 0 21.12 9.6 21.12 21.525334V917.12c0 11.882667-9.621333 21.525333-21.12 21.525333H149.12A21.290667 21.290667 0 0 1 128 917.141333V106.88z m640 0c0-11.882667 9.621333-21.525333 21.12-21.525334h85.76c11.648 0 21.12 9.6 21.12 21.525334V917.12c0 11.882667-9.621333 21.525333-21.12 21.525333h-85.76a21.290667 21.290667 0 0 1-21.12-21.525333V106.88z" fill="`+GetData.ThemeColor+`" p-id="5252"></path></svg>`;
            }
        }
    
    
    YuiplayAudio.onended = () =>{
        let Playlist = JSON.parse(YuiBox.getAttribute('data-Playlist'));  
        if(PlaybackMode===1){
            if(PlayNumber===Playlist.length-1){
                PlayNumber=0;
                SwitchSongs(0);
            }else{
                SwitchSongs(PlayNumber+1);
            }
        }else if(PlaybackMode===2){
                let number = Math.trunc(Math.random()*Playlist.length);
                PlayNumber = number;
                SwitchSongs(number);
                YuiplayAudio.play();
        }else if(PlaybackMode===3){
            YuiplayAudio.currentTime=0;
            YuiplayAudio.play();
        }
    
        
        
    }
    
    YuiplayAudio.onplay = () =>{
        YuiplayPlayButtonOnclick();
    }
    YuiplayAudio.onpause = () =>{
        YuiplayPlayButtonOnclick();
    }
    
    /**
     * 检测视频是否可以播放
     * @author Yui_ <13413925094@139.com>
     */
    YuiplayAudio.oncanplaythrough = () =>{
        YuiplayPlayButtonOnclick();

        document.addEventListener('visibilitychange',function(){
            if(document.visibilityState==='visible'){
                YuiplayAudio.play();
                channel.postMessage("0");
            }else if(document.visibilityState==='hidden'){
                YuiplayAudio.pause();
                ProofreadSongs(1);
            }
        })
        
        /**
         * 按钮点击控制音乐播放
         * @author Yui_ <13413925094@139.com>
         */
        
        YuiplayPlayButton.onclick = () =>{            
            if(YuiplayAudio.paused){
                YuiplayAudio.play();
            }else{
                YuiplayAudio.pause();
            }
            
        }
    }
}






/**
 * 生成基本UI(函数名为机器翻译)
 * @author Yui_ <13413925094@139.com>
 */
const GeneratingSubject = () =>{
    let GetData = GetCustomization();//获取自定义值 类型为 object   
    
    YuiBox.innerHTML=`
        <style>       
            #Yuiplay_Body {
                width:var(--width);
                padding: 16px 8px 16px 8px;
                border-radius:8px;
                background:`+GetData.BackgroundColor+`; 
                filter: drop-shadow(0px 0px 5px  `+GetData.Color+`);               
            }
            #Yuiplay_Body_h1 {
                color:`+GetData.ThemeColor+`;
                margin-left:8px;
                padding-top:3px;
                margin-top:-3px;
            }
            .progress_box {
                width:calc(var(--width) - 16px);
                margin-left:8px;
                border-radius:5px;
                height:8px;
                background:`+GetData.ThemeColor+`;
                overflow:hidden;
            }
            #progress_range {
                height:12px;
                width:12px;
                margin-top:-2px;
                --fatherwidth:calc(var(--width) - 16px);
                margin-left:calc(var(--fatherwidth) / 100 * var(--progress) - 6px);
                position:absolute;
                background:`+GetData.ProgressColor+`;
                border-radius:6px;
                filter: drop-shadow(0px 0px 5px  `+GetData.Color+`);
            }
            #progress_already {
                height:8px;
                --fatherwidth:calc(var(--width) - 16px);
                margin-left:calc(var(--fatherwidth) / 100 * var(--progress));
                width:var(--fatherwidth);
                
                background:`+GetData.ProgressColor+`;
                border-radius:8px;
            }
            #PlayInformation_Box {
            height:35px;
            }
            #Yuiplay_Body_Present {
                font-size:12px;
                margin-left:8px;
                position:absolute;
                color:`+GetData.ThemeColor+`;
            }
            #Yuiplay_Body_Whole {
                font-size:12px;             
                position:absolute;
                margin-left:calc(var(--width) - 16px - 24px);
                color:`+GetData.ThemeColor+`;
            }
            #Yuiplay_PlayButton {
                height:22px;
                position:absolute;
                --fatherwidth:calc(var(--width) - 16px);
                margin-top:5px;
                margin-left:calc(var(--fatherwidth) / 2 - 3px);
                
            }
            #Yuiplay_Body_playlist {
                margin-top:16px;
                overflow:auto; 
                max-height:200px;                
            }
            #Yuiplay_Body_playlist ul {
                list-style:none;
                margin-left:-32px;     
                padding-top:32px;
                margin-top:0px;    
                margin-bottom:-8px;
                
            }
            #Yuiplay_Body_playlist ul li {
                padding-top:8px;
                padding-bottom:8px;
                color:`+GetData.Color+`;    
                white-space:nowrap;
                width:100%;
                overflow:auto;     
            }
            #Yuiplay_Body_playlist ul li:hover {
                color:`+GetData.ThemeColor+`;
            }
            #Yuiplay_Body_playlist ul li:first-child {
                color:`+GetData.ThemeColor+`;
                padding-top:8px;
                
            }
            #Yuiplay_Body_playlist_svg {
                position:absolute;
            }
            #Playback_Mode {                
                margin-left:36px;
                position:absolute;            
            }
            #Playlist_svg_Box {
                height:22px;
                background:`+GetData.BackgroundColor+`;
                position:absolute;        
                width:var(--width); 
                border-style:none;
                border-bottom-style:none;
                border-bottom-width:1px;
                border-bottom-color:`+GetData.ThemeColor+`;
            }
     
        </style>        
        <div id="Yuiplay_Body">
            <p id="Yuiplay_Body_h1">`+GetData.Playlist.name+`</p>
            <p id="Lyrics"></p>
            <div id="PlayInformation_Box">
            <div id="Yuiplay_PlayButton">
              <svg t="1706010361462" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4208" width="22" height="22" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z" fill="`+GetData.ThemeColor+`" p-id="4209"></path></svg>
            </div>
            <p id="Yuiplay_Body_Present">00:00</p>
          
            <p id="Yuiplay_Body_Whole">00:00</p>
            </div>
            <div class="progress_box">
                <div id="progress_range"></div>
                <div id="progress_already"></div>
            </div>
            <input type="range" class="progress_box" style="position:absolute;margin-top:-8px;opacity:0;z-index:2;" id="Progress_Box" min="0" value="0">
            <div id="Yuiplay_Body_playlist">
            <div id="Playlist_svg_Box">
            <svg id="Yuiplay_Body_playlist_svg" t="1712217105707" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1487" width="22" height="22" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M880.245529 681.54683c3.287261 74.378806-47.322115 157.716302-134.163616 207.892194-113.067344 65.311744-244.44943 53.824391-293.469361-35.401278-47.141496-85.830035 3.034395-206.483367 116.101739-271.758986 91.356969-52.740678 193.840054-51.765337 255.936783-5.057326V117.907927c0-15.460966 12.643313-28.032032 28.104279-28.032032 15.49709 0 28.032032 12.534942 28.032032 28.032032v561.074117c0 0.86697-0.433485 1.661693-0.541856 2.564786z m-65.022754-43.492997c-39.158147-59.965428-146.517938-61.988359-230.036053-11.667972-83.518115 50.428758-123.579356 146.228948-84.421209 206.194377 39.230395 60.037676 142.869439 61.482626 226.387554 11.126115 83.518115-50.428758 127.300102-145.614845 88.069708-205.65252z m-130.767983-295.709035H179.516986c-15.49709 0-28.104279-12.534942-28.104279-28.032031 0-15.569337 12.643313-28.104279 28.104279-28.104279h504.937806c15.460966 0 28.032032 12.534942 28.032032 28.104279a28.032032 28.032032 0 0 1-28.032032 28.032031z m0-168.300561H179.516986c-15.49709 0-28.104279-12.534942-28.104279-28.032031 0-15.569337 12.643313-28.104279 28.104279-28.104279h504.937806c15.460966 0 28.032032 12.534942 28.032032 28.104279a28.032032 28.032032 0 0 1-28.032032 28.032031zM179.516986 454.509049h308.496843c15.569337 0 28.104279 12.534942 28.104279 28.104279 0 15.460966-12.534942 28.032032-28.104279 28.032031h-308.496843c-15.49709 0-28.104279-12.534942-28.104279-28.032031 0-15.533213 12.643313-28.104279 28.104279-28.104279z m0 168.336684h168.300561c15.460966 0 28.032032 12.534942 28.032031 28.104279a28.032032 28.032032 0 0 1-28.032031 28.032032H179.516986c-15.49709 0-28.104279-12.534942-28.104279-28.032032 0-15.569337 12.643313-28.104279 28.104279-28.104279z" fill="`+GetData.ThemeColor+`" p-id="1488"></path></svg>
            <div id="Playback_Mode" onclick="ModifyPlaybackMode()">
               <svg  t="1712238023977" class="icon" viewBox="0 0 1165 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4301" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18"><path d="M0.000117 218.508507a54.571099 54.571099 0 0 1 54.683154-54.683155h879.188586l-74.741115-72.612057a52.105875 52.105875 0 0 1 0-75.189338 54.683154 54.683154 0 0 1 77.318395 0l168.083466 168.083467a54.459043 54.459043 0 0 1 0 77.206339l-168.083466 168.083466a54.346988 54.346988 0 0 1-77.318395-0.896445 56.027822 56.027822 0 0 1 0-78.438951l74.741115-76.758116H54.683271A54.683154 54.683154 0 0 1 0.000117 218.508507z" fill="`+GetData.ThemeColor+`" p-id="4302"></path><path d="M0.000117 875.49075m54.683154 0l1011.078079 0q54.683154 0 54.683155 54.683154l0 0.112056q0 54.683154-54.683155 54.683154l-1011.078079 0q-54.683154 0-54.683154-54.683154l0-0.112056q0-54.683154 54.683154-54.683154Z" fill="`+GetData.ThemeColor+`" p-id="4303"></path><path d="M0.000117 539.323816m54.683154 0l1011.078079 0q54.683154 0 54.683155 54.683155l0 0.112056q0 54.683154-54.683155 54.683154l-1011.078079 0q-54.683154 0-54.683154-54.683154l0-0.112056q0-54.683154 54.683154-54.683155Z" fill="`+GetData.ThemeColor+`" p-id="4304"></path></svg>
               </div>
            </div>
            <ul id="Yuiplay_Body_playlist_ul">
`+GetData.PlaylistPath+`
            </ul>
            </div>
            
        </div>
        <audio id="Yuiplay_audio" autoplay="autoplay">
          <source src="`+GetData.Playlist.path+`" type="audio/mpeg" >
        </audio>
    `;
    
    playMusic();
    
    
    /**
     * 歌单展开与合并
     * @author Yui_ <13413925094@139.com>
     */
    GetLyricsContent(GetData.Playlist.lyrics);
    const PlaylistSvg = document.getElementById('Yuiplay_Body_playlist_svg');
    const PlaylistUl = document.getElementById('Yuiplay_Body_playlist_ul');
    const PlaylistSvgBox = document.getElementById('Playlist_svg_Box');
    let PlaylistSvgTF = false;
    let PlaylistSvgHeight = PlaylistUl.offsetHeight+'px';
    PlaylistUl.style.maxHeight="0px";    
    PlaylistUl.style.overflow="hidden";
    PlaylistSvg.onclick = () =>{    
    PlaylistUl.style.transition="0.5s";      
    if(PlaylistSvgTF===false){    
    PlaylistUl.style.maxHeight=PlaylistSvgHeight;
    PlaylistUl.style.overflow="auto";
    PlaylistSvgBox.style.borderBottomStyle="solid";
    PlaylistSvgTF=true;
    }else{
    PlaylistUl.style.maxHeight="0px";
    PlaylistUl.style.overflow="hidden";
    PlaylistSvgBox.style.borderBottomStyle="none";
    PlaylistSvgTF=false;
    }
    }
    

    
    
    return
}
GeneratingSubject();//生成主体

/**
 * 这是切换音乐函数
 * @param {Number} serial
 * @param {String} judge
 */
const SwitchSongs = (serial,judge) =>{
    if(!judge){
        PlayNumber = serial;
        ProofreadSongs();    
    }    
    let Playlist = JSON.parse(YuiBox.getAttribute('data-Playlist'));  
    let GetData = GetCustomization();
    document.querySelectorAll("li").forEach(item=>{
        item.style.color=GetData.Color;
    });
    const e =  document.getElementById(PlayNumber);
    e.style.color=GetData.ThemeColor;
    const YuiplayAudio = document.getElementById('Yuiplay_audio');
    const YuiplayBodyH1 = document.getElementById('Yuiplay_Body_h1');
    YuiplayAudio.src = Playlist[PlayNumber].path;
    GetLyricsContent(Playlist[PlayNumber].lyrics);
    YuiplayBodyH1.innerText = Playlist[PlayNumber].name;
    const YuiplayPlayButton = document.getElementById('Yuiplay_PlayButton');    
    YuiplayPlayButton.innerHTML = `<svg t="1706010361462" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4208" width="22" height="22" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z" fill="`+GetData.ThemeColor+`" p-id="4209"></path></svg>`;
    playMusic();
    
}


/**
 * 修改播放方式
 * @param {String} judge
 */
const ModifyPlaybackMode = (judge) =>{   
    let GetData = GetCustomization();
    const iDPlaybackMode = document.getElementById('Playback_Mode');     
    if(!judge){
        PlaybackMode++;
        ProofreadSongs();
    }
    if(PlaybackMode>=4){
        PlaybackMode=1;
    }
    if(PlaybackMode===1){
        iDPlaybackMode.innerHTML = `<svg  t="1712238023977" class="icon" viewBox="0 0 1165 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4301" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18"><path d="M0.000117 218.508507a54.571099 54.571099 0 0 1 54.683154-54.683155h879.188586l-74.741115-72.612057a52.105875 52.105875 0 0 1 0-75.189338 54.683154 54.683154 0 0 1 77.318395 0l168.083466 168.083467a54.459043 54.459043 0 0 1 0 77.206339l-168.083466 168.083466a54.346988 54.346988 0 0 1-77.318395-0.896445 56.027822 56.027822 0 0 1 0-78.438951l74.741115-76.758116H54.683271A54.683154 54.683154 0 0 1 0.000117 218.508507z" fill="`+GetData.ThemeColor+`" p-id="4302"></path><path d="M0.000117 875.49075m54.683154 0l1011.078079 0q54.683154 0 54.683155 54.683154l0 0.112056q0 54.683154-54.683155 54.683154l-1011.078079 0q-54.683154 0-54.683154-54.683154l0-0.112056q0-54.683154 54.683154-54.683154Z" fill="`+GetData.ThemeColor+`" p-id="4303"></path><path d="M0.000117 539.323816m54.683154 0l1011.078079 0q54.683154 0 54.683155 54.683155l0 0.112056q0 54.683154-54.683155 54.683154l-1011.078079 0q-54.683154 0-54.683154-54.683154l0-0.112056q0-54.683154 54.683154-54.683155Z" fill="`+GetData.ThemeColor+`" p-id="4304"></path></svg>`;
    }else if(PlaybackMode===2){
        iDPlaybackMode.innerHTML = `<svg t="1712238085398" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4276" xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20"><path fill="`+GetData.ThemeColor+`" d="M753.564731 337.471035c-45.8697 0-160.259984 113.849978-243.789399 194.548928C383.134027 654.383848 263.508509 773.284865 167.764911 773.284865l-58.892295 0c-24.068162 0-43.581588-19.526729-43.581588-43.581588s19.513426-43.581588 43.581588-43.581588l58.892295 0c60.504002 0 183.002964-121.68134 281.432741-216.784348 119.79641-115.744117 223.254713-219.029482 304.368102-219.029482l56.209186 0-59.641355-57.828057c-17.033955-16.993023-17.060561-42.902112-0.057305-59.927881 17.002232-17.030885 44.596707-17.064654 61.631686-0.065492l134.207631 133.874033c8.192589 8.172123 12.794397 19.238157 12.794397 30.803563 0 11.564383-4.601808 22.604834-12.794397 30.776957L811.706943 461.72599c-8.505721 8.486278-19.646456 12.522198-30.78719 12.522198-11.166317 0-22.333658-4.676509-30.844495-13.199627-17.003256-17.025769-16.975627-45.432749 0.057305-62.425771l59.641355-61.151755L753.564731 337.471035zM811.706943 561.66105c-17.034978-16.999163-44.629453-16.972557-61.631686 0.058328-17.003256 17.024745-16.975627 46.257533 0.057305 63.250556l59.641355 61.150732-56.209186 0c-35.793204 0-95.590102-52.946886-154.87637-108.373243-17.576307-16.435321-45.161572-16.3422-61.594847 1.226944-16.444531 17.568121-15.523555 46.393633 2.053776 62.823837 90.322122 84.458577 151.246703 131.484613 214.417441 131.484613l56.209186 0-59.641355 57.824987c-17.033955 16.993023-17.060561 43.736107-0.057305 60.761875 8.511861 8.523117 19.678178 12.369725 30.844495 12.369725 11.140735 0 22.281469-4.453429 30.78719-12.939707L945.914574 757.311055c8.192589-8.173147 12.794397-19.315928 12.794397-30.881334 0-11.564383-4.601808-22.682605-12.794397-30.855752L811.706943 561.66105zM108.871593 337.471035l58.892295 0c45.932122 0 114.40154 58.455343 168.915108 107.942431 8.352225 7.576559 18.832927 12.140505 29.29214 12.140505 11.852956 0 23.673166-4.394077 32.270984-13.857613 16.182564-17.807574 14.859429-46.823422-2.958378-62.998823-85.247546-77.381391-156.561755-130.388652-227.519854-130.388652l-58.892295 0c-24.068162 0-43.581588 19.526729-43.581588 43.581588S84.804455 337.471035 108.871593 337.471035z" p-id="4277"></path></svg>`;
    }else if(PlaybackMode===3){   
        iDPlaybackMode.innerHTML = `<svg t="1712237968697" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4284" xmlns:xlink="http://www.w3.org/1999/xlink" width="22" height="22"><path d="M192 789.333333a21.24 21.24 0 0 1-12.8-4.28 344.513333 344.513333 0 0 1-99.333333-118A341.246667 341.246667 0 0 1 384 170.666667h256q6.36 0 12.733333 0.233333l-49.153333-49.146667a21.333333 21.333333 0 0 1 30.173333-30.173333l85.333334 85.333333a21.333333 21.333333 0 0 1 0 30.173334l-85.333334 85.333333a21.333333 21.333333 0 0 1-30.173333-30.173333l48.666667-48.666667Q646.126667 213.333333 640 213.333333H384c-164.666667 0-298.666667 134-298.666667 298.666667 0 94.833333 43.546667 181.933333 119.48 238.966667A21.333333 21.333333 0 0 1 192 789.333333z m228.433333 143.06a21.333333 21.333333 0 0 0 0-30.173333l-49.153333-49.146667q6.366667 0.233333 12.733333 0.233334H640a341.46 341.46 0 0 0 304.146667-496.42 344.513333 344.513333 0 0 0-99.333334-118 21.333333 21.333333 0 1 0-25.626666 34.113333C895.12 330.066667 938.666667 417.166667 938.666667 512c0 164.666667-134 298.666667-298.666667 298.666667H384q-6.12 0-12.246667-0.246667l48.666667-48.666667a21.333333 21.333333 0 0 0-30.173333-30.173333l-85.333334 85.333333a21.333333 21.333333 0 0 0 0 30.173334l85.333334 85.333333a21.333333 21.333333 0 0 0 30.173333 0zM554.666667 618.666667V405.333333a21.333333 21.333333 0 0 0-21.333334-21.333333h-42.666666a21.333333 21.333333 0 0 0 0 42.666667h21.333333v192a21.333333 21.333333 0 0 0 42.666667 0z" fill="`+GetData.ThemeColor+`" p-id="4285"></path></svg>`;
    }
}



