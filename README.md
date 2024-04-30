一个简洁的音乐播放器插件

使用: <br>
在项目里引入<br>
&#60;div id="Yuiplay_box" 
    data-ThemeColor="主题色"
    data-Color="字体颜色"
    data-ProgressColor="进度条颜色"
    data-backgroundColor="背景颜色"
    data-Playlist='[{
    "name":"歌曲名称",
    "path":"歌曲路径",
    "lyrics":"歌词路径"
    }]'&#62;&#60;/div&#62;
&#60;style&#62;
#Yuiplay_box {
    --width:300px;/*不要小于120px*/
    --progress:50;/*不可修改(修改了也没啥效果，最多出现进度条偏差)*/
}
&#60;/style&#62;
&#60;script src='Yuiplay.js'&#62;&#60;/script&#62;
<br>
<br>
示例<br>
https://mykonshshhdhdhdh.github.io/Yuiplay
