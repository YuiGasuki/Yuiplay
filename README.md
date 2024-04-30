一个简洁的音乐播放器插件

使用: <br>
在项目里引入<br>
&#60;div id="Yuiplay_box" <br>
    data-ThemeColor="主题色"<br>
    data-Color="字体颜色"<br>
    data-ProgressColor="进度条颜色"<br>
    data-backgroundColor="背景颜色"<br>
    data-Playlist='[{<br>
    "name":"歌曲名称",<br>
    "path":"歌曲路径",<br>
    "lyrics":"歌词路径"<br>
    }]'&#62;&#60;/div&#62;<br>
&#60;style&#62;<br>
#Yuiplay_box {<br>
    --width:300px;/*不要小于120px*/<br>
    --progress:50;/*不可修改(修改了也没啥效果，最多出现进度条偏差)*/<br>
}<br>
&#60;/style&#62;<br>
&#60;script src="https://yuiandazucat.github.io/Yuiplay/Yuiplay.js"&#62;&#60;/script&#62;
<br>
<br>
示例<br>
https://yuiandazucat.github.io/Yuiplay
