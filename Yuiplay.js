/**
 * @author Yui_ <13413925094@139.com>
 * @date 2024-04-04 初始版本
 */

const YuiBox = document.getElementById('Yuiplay_box');

/**
 * 获取自定义属性
 * @author Yui_ <13413925094@139.com>
 * @returns {object} 返回一个自定义属性对象
 */
const GetCustomization = () =>{

    let ThemeColor = YuiBox.getAttribute('data-ThemeColor');
    let Playlist = JSON.parse(YuiBox.getAttribute('data-Playlist'));   
    return {
        ThemeColor:ThemeColor,
        Playlist:{
            name:Playlist.name,
            path:Playlist.path        
        }
    }
}



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
                background:white;
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
                width:calc(var(--fatherwidth) / 100 * var(--progress));
                
                background:`+GetData.ThemeColor+`;
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
            <input type="range" class="progress_box" style="position:absolute;margin-top:-8px;opacity:0;" id="Progress_Box" min="0" value="0">
            
        </div>
        <audio id="Yuiplay_audio">
          <source src="`+GetData.Playlist.path+`" type="audio/mpeg" >
        </audio>
    `;
    
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
    YuiplayAudio.play();
    ProgressBox.addEventListener('input',CombinedProgress);
    }
    
    
    /**
     * 校对音乐播放进度与进度条
     * @author Yui_ <13413925094@139.com>
     */
    const CombinedTime = () =>{
        ProgressBox.value = YuiplayAudio.currentTime;
        YuiplayBody.style.setProperty('--progress',ProgressBox.value / ProgressBox.max * 100);
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
            YuiplayAudio.play();
            }else{
            YuiplayPlayButton.innerHTML = `<svg t="1706010361462" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4208" width="22" height="22" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z" fill="`+GetData.ThemeColor+`" p-id="4209"></path></svg>`;
            YuiplayAudio.pause(); 
            }
        }
        YuiplayPlayButtonOnclick();
        YuiplayPlayButton.onclick = () =>{
            YuiplayPlayButtonOnclick();
        }
    }  
    return
}
GeneratingSubject();//生成主体




 


