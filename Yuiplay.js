/**
 * @author Yui_ <13413925094@139.com>
 * @date 2024-04-04 初始版本
 */

const YuiBox = document.getElementById('Yuiplay_box');
let PlayNumber = 0;
/**
 * 获取自定义属性
 * @author Yui_ <13413925094@139.com>
 * @returns {object} 返回一个自定义属性对象
 */
const GetCustomization = () =>{

    let ThemeColor = YuiBox.getAttribute('data-ThemeColor');
    let Playlist = JSON.parse(YuiBox.getAttribute('data-Playlist'));  
    let PlaylistPath = '';
    for(let i=0;i<Playlist.length;i++){
        PlaylistPath += `<li onclick="SwitchSongs(`+i+`)" id="`+i+`">`+Playlist[i].name+`</li>`;
    }
    
    
    return {
        ThemeColor:ThemeColor,
        Playlist:{
            name:Playlist[0].name,
            path:Playlist[0].path        
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
        
        
        YuiplayBodyPresent.innerText = switchingTime(YuiplayAudio.currentTime);
        YuiplayAudio.addEventListener('timeupdate',CombinedTime);
        
    }
    
    
    /**
     * 检测视频是否获取到信息
     * @author Yui_ <13413925094@139.com>
    */
    YuiplayAudio.ondurationchange = () =>{
        ProgressBox.max = YuiplayAudio.duration;     
        YuiplayBodyWhole.innerText = switchingTime(YuiplayAudio.duration);
        CombinedProgress();
        CombinedTime();        
    }
    
    
    YuiplayAudio.onended = () =>{
    
        let Playlist = JSON.parse(YuiBox.getAttribute('data-Playlist'));  
        if(PlayNumber===Playlist.length-1){
            SwitchSongs(0);
        }else{
            SwitchSongs(PlayNumber+1);
        }
        
    }
    
    
    
    /**
     * 检测视频是否可以播放
     * @author Yui_ <13413925094@139.com>
     */
    YuiplayAudio.oncanplaythrough = () =>{
        /**
         * 按钮点击控制音乐播放
         * @author Yui_ <13413925094@139.com>
         */
         
        const YuiplayPlayButtonOnclick = () =>{
            if(YuiplayAudio.paused){
            YuiplayPlayButton.innerHTML = `<svg t="1706010319077" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5251" width="22" height="22" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M128 106.858667C128 94.976 137.621333 85.333333 149.12 85.333333h85.76c11.648 0 21.12 9.6 21.12 21.525334V917.12c0 11.882667-9.621333 21.525333-21.12 21.525333H149.12A21.290667 21.290667 0 0 1 128 917.141333V106.88z m640 0c0-11.882667 9.621333-21.525333 21.12-21.525334h85.76c11.648 0 21.12 9.6 21.12 21.525334V917.12c0 11.882667-9.621333 21.525333-21.12 21.525333h-85.76a21.290667 21.290667 0 0 1-21.12-21.525333V106.88z" fill="`+GetData.ThemeColor+`" p-id="5252"></path></svg>`;
            
            }else{
            YuiplayPlayButton.innerHTML = `<svg t="1706010361462" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4208" width="22" height="22" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z" fill="`+GetData.ThemeColor+`" p-id="4209"></path></svg>`;
            
            }
        }
        
        YuiplayPlayButton.onclick = () =>{
            YuiplayPlayButtonOnclick();
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
                background:#eee; 
                filter: drop-shadow(0px 0px 5px  #AAAAAA);               
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
                background:white;
                border-radius:6px;
                filter: drop-shadow(0px 0px 5px  #AAAAAA);
            }
            #progress_already {
                height:8px;
                --fatherwidth:calc(var(--width) - 16px);
                margin-left:calc(var(--fatherwidth) / 100 * var(--progress));
                width:var(--fatherwidth);
                
                background:white;
                border-radius:8px;
            }
            #Yuiplay_Body_Present {
                font-size:12px;
                margin-left:8px;
                color:`+GetData.ThemeColor+`;
            }
            #Yuiplay_Body_Whole {
                font-size:12px;
                margin-top:-24px;
                margin-left:calc(var(--width) - 16px - 24px);
                color:`+GetData.ThemeColor+`;
            }
            #Yuiplay_PlayButton {
                height:22px;
                position:absolute;
                --fatherwidth:calc(var(--width) - 16px);
                margin-top:-5px;
                margin-left:calc(var(--fatherwidth) / 2 - 11px);
                
            }
            #Yuiplay_Body_playlist {
                margin-top:16px;
                overflow:auto; 
                max-height:200px;                
            }
            #Yuiplay_Body_playlist ul {
                list-style:none;
                margin-left:-32px;                       
                margin-top:0px;    
                margin-bottom:0px;
                background:linear-gradient(to right, #DB000A,#DB000A)no-repeat left top;
                background-size: 100% 1px;
            }
            #Yuiplay_Body_playlist ul li {
                padding-top:8px;
                padding-bottom:8px;
                color:#AAAAAA;         
            }
            #Yuiplay_Body_playlist ul li:hover {
                color:`+GetData.ThemeColor+`;
            }
            #Yuiplay_Body_playlist ul li:first-child {
                color:`+GetData.ThemeColor+`;
                padding-top:16px;
                
            }
     
        </style>        
        <div id="Yuiplay_Body">
            <p id="Yuiplay_Body_h1">`+GetData.Playlist.name+`</p>
            <div id="Yuiplay_PlayButton">
              <svg t="1706010361462" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4208" width="22" height="22" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z" fill="`+GetData.ThemeColor+`" p-id="4209"></path></svg>
            </div>
            <p id="Yuiplay_Body_Present">00:00</p>
          
            <p id="Yuiplay_Body_Whole">00:00</p>
            <div class="progress_box">
                <div id="progress_range"></div>
                <div id="progress_already"></div>
            </div>
            <input type="range" class="progress_box" style="position:absolute;margin-top:-8px;opacity:0;z-index:2;" id="Progress_Box" min="0" value="0">
            <div id="Yuiplay_Body_playlist">
            <svg id="Yuiplay_Body_playlist_svg" t="1712217105707" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1487" width="22" height="22" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M880.245529 681.54683c3.287261 74.378806-47.322115 157.716302-134.163616 207.892194-113.067344 65.311744-244.44943 53.824391-293.469361-35.401278-47.141496-85.830035 3.034395-206.483367 116.101739-271.758986 91.356969-52.740678 193.840054-51.765337 255.936783-5.057326V117.907927c0-15.460966 12.643313-28.032032 28.104279-28.032032 15.49709 0 28.032032 12.534942 28.032032 28.032032v561.074117c0 0.86697-0.433485 1.661693-0.541856 2.564786z m-65.022754-43.492997c-39.158147-59.965428-146.517938-61.988359-230.036053-11.667972-83.518115 50.428758-123.579356 146.228948-84.421209 206.194377 39.230395 60.037676 142.869439 61.482626 226.387554 11.126115 83.518115-50.428758 127.300102-145.614845 88.069708-205.65252z m-130.767983-295.709035H179.516986c-15.49709 0-28.104279-12.534942-28.104279-28.032031 0-15.569337 12.643313-28.104279 28.104279-28.104279h504.937806c15.460966 0 28.032032 12.534942 28.032032 28.104279a28.032032 28.032032 0 0 1-28.032032 28.032031z m0-168.300561H179.516986c-15.49709 0-28.104279-12.534942-28.104279-28.032031 0-15.569337 12.643313-28.104279 28.104279-28.104279h504.937806c15.460966 0 28.032032 12.534942 28.032032 28.104279a28.032032 28.032032 0 0 1-28.032032 28.032031zM179.516986 454.509049h308.496843c15.569337 0 28.104279 12.534942 28.104279 28.104279 0 15.460966-12.534942 28.032032-28.104279 28.032031h-308.496843c-15.49709 0-28.104279-12.534942-28.104279-28.032031 0-15.533213 12.643313-28.104279 28.104279-28.104279z m0 168.336684h168.300561c15.460966 0 28.032032 12.534942 28.032031 28.104279a28.032032 28.032032 0 0 1-28.032031 28.032032H179.516986c-15.49709 0-28.104279-12.534942-28.104279-28.032032 0-15.569337 12.643313-28.104279 28.104279-28.104279z" fill="`+GetData.ThemeColor+`" p-id="1488"></path></svg>
            <ul id="Yuiplay_Body_playlist_ul">
`+GetData.PlaylistPath+`
            </ul>
            </div>
            
        </div>
        <audio id="Yuiplay_audio">
          <source src="`+GetData.Playlist.path+`" type="audio/mpeg" >
        </audio>
    `;
    
    playMusic();
    
    
    /**
     * 歌单展开与合并
     * @author Yui_ <13413925094@139.com>
     */
    const PlaylistSvg = document.getElementById('Yuiplay_Body_playlist_svg');
    const PlaylistUl = document.getElementById('Yuiplay_Body_playlist_ul');
    let PlaylistSvgTF = false;
    let PlaylistSvgHeight = PlaylistUl.offsetHeight+'px';
    PlaylistUl.style.maxHeight="0px";
    PlaylistSvg.onclick = () =>{
    PlaylistUl.style.transition="0.5s";      
    if(PlaylistSvgTF===false){    
    PlaylistUl.style.maxHeight=PlaylistSvgHeight;
    PlaylistSvgTF=true;
    }else{
    PlaylistUl.style.maxHeight="0px";
    PlaylistSvgTF=false;
    }
    }
    

    
    
    return
}
GeneratingSubject();//生成主体

/**
 * 这是切换音乐函数
 * @param {Number} serial
 */
const SwitchSongs = (serial) =>{
    PlayNumber = serial;
    let Playlist = JSON.parse(YuiBox.getAttribute('data-Playlist'));  
    let GetData = GetCustomization();
    document.querySelectorAll("li").forEach(item=>{
    item.style.color='#AAAAAA';
});
    const e =  document.getElementById(PlayNumber);
    e.style.color=GetData.ThemeColor;
    const YuiplayAudio = document.getElementById('Yuiplay_audio');
    const YuiplayBodyH1 = document.getElementById('Yuiplay_Body_h1');
    YuiplayAudio.src = Playlist[PlayNumber].path;
    YuiplayBodyH1.innerText = Playlist[PlayNumber].name;
    const YuiplayPlayButton = document.getElementById('Yuiplay_PlayButton');    
    YuiplayPlayButton.innerHTML = `<svg t="1706010361462" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4208" width="22" height="22" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z" fill="`+GetData.ThemeColor+`" p-id="4209"></path></svg>`;
    playMusic();
    
}


 

