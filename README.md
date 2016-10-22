最近在学习网页机器人小开发，这篇博文和大家分享下这方面的小成果，希望对大家的学习有益，实现的最终功能有些单一，不过还是用到了前后端的一点东西，接下来咱们开始吧。

## 方案规划   

俗语说，一个好的开端就等于成功了一半，不论项目的大小，前期的方案规划都举足轻重。我把整个网页机器人小项目开发分为了前端和后端两部分。   

### 前端部分

* 界面布局上，使用Html+Css做基本的界面和样式布局，其中`Html`做基本的页面结构，用`Css`做页面标签的样式定义，为了实现一些动画效果，提高用户体验，增添一些[Css3][url0]的特性，如[animation][url1]和[transition][url2]等。   

* 前端的行为交互上，在和后端的数据交互以及一些前端的展示方面使用`Jquery`库，如果对这个库不熟，可以查看[Jquery文档][url3]，看一些基本的使用就好；用原生的Js虽然也能很好实现，但Jquery封装了兼容各浏览器的函数，使用很方便，不过在一些地方使用Js反而更方便，如创建元素节点和添加元素节点。

* 前端和后端交互上，因为和机器人聊天是一种页面无刷新的状态，[Ajax][url4]技术刚好能解决这类事情，并可实现异步通信，正符合聊天通讯的使用场景。

### 后端部分

* 后端用很多语言包括`Java`和`Php`等实现都可以，我用的是Php，对前端传来的数据做接收和处理。

* 机器人智能问答上，我用了赛科的第三方接口，其他的包括图灵机器人和小i机器人都可以，当然，如果是算法大神，就可以直接略过此地了。。。

### 运行测试

我使用了集成有windows+apache+mysql+php的软件`wamp`，如果想使用这个平台搭建windows本地服务器，可以观看[慕课wamp集成环境安装][url5]，如果系统是Linux，可以观看[LAMP安装与配置][url6]，按照视频的讲解就能轻松愉快地搭建本地服务器了。

## 方案实现   

有了前期大致的规划后，咱们就可以开始动手愉快地做起来了。本博文中所附代码是项目的一部分，完整的代码包可到我的[github][url7]中查看或下载。

### 前端部分

#### Html布置界面基本结构

聊天界面的展示分为标题、对话区和输入区三部分。Html主体的布局如下   

```html
<section id="chat-wrap">
	<!-- 标题 -->
	<header class="chat-header">
		<div class="header-title">JeLiu在线</div>
	</header>
	<!-- 对话区 -->
	<section class="chat-box">  
		<ul></ul>
	</section>	
	<!-- 输入区 -->
	<footer class="chat-input">
		<form id="form">
			<textarea class="input-words" autoFocus></textarea>
			<div class="input-submit">
				<span class="icon-paper-plane-o"></span>
			</div>
		</form>
	</footer>
</section>   
```

#### Css定义页面基本样式

Css页面样式针对Html结构的三部分分别做定义，部分代码如下   

```css
/*标题*/
#chat-wrap .chat-header {
  height:40px;
  padding:0 10px;
  background-color: #666;
}
#chat-wrap .header-title {
  height:40px;
  line-height: 40px;
  font-size: 14px;
  color:#eee;
}
/*对话区*/
#chat-wrap .chat-box{  
  margin:0;
  height:220px;
  list-style: none;
  overflow-y: scroll;
  overflow-x: hidden;
}
/*输入区*/
#chat-wrap .chat-input {
  position: relative;
}
#chat-wrap .chat-input .input-words {
  border:none;
  width:516px;
  height:143px;
  padding:8px;
  font-size: 14px;
  color:#333;
  border-top: 1px solid #ddd;
}
#chat-wrap .chat-input .input-submit {
  position: absolute;
  bottom: 15px;
  right:15px;
  background-color: #518cec;
  border: none;
  width:50px;
  height:50px;
  line-height: 50px;
  font-size: 20px;
  text-align: center;
  border-radius: 100%;
  -moz-box-shadow:0px 0px 2px #444;               
  -webkit-box-shadow:0px 0px 2px #444;            
  box-shadow:0px 0px 2px #444;                    
  -webkit-transition:all 0.5s ease;
  -moz-transition:all 0.5s ease;
  -o-transition:all 0.5s ease;
  opacity: 0.7;
  cursor: pointer;
}
```
通过这两部分可得到下面的布局效果。   

!['图片'](https://upload.wikimedia.org/wikipedia/commons/f/ff/WebRobot2016.png)

可是细看后，在对话区并没有聊天气泡，只有一个空空的聊天框结构在这儿，这就不免有些尴尬了，下面我们来看看静态的聊天气泡怎么通过`Html`和`Css`实现

#### 聊天气泡的实现   

首先，我们在Html基本结构的对话区加入两个分别针对`用户`和`机器人`的`li`标签，并加上`class`名称，如下，不过，我们现在实现的是静态的展示，之后，我们会用Js做动态地添加聊天气泡，实现真正地像微信那样的聊天，目前实现的功能只限文字聊天。   

```html
<!-- 对话区 -->
<section class="chat-box">  
	<ul>
		<li class="user">你是JeLiu吗？</li>
		<li class="robot">亲，我不是JeLiu</li>
		<li class="user">那你是谁？</li>
	</ul>
</section>	
```
在Css里面，我们需要分别针对用户和机器人的li标签做样式定义，部分代码如下   

```css
/*给对话区中用户的聊天气泡设置样式*/
#chat-wrap .chat-box li.user {
  float: right;
  margin-right: 70px;
  background-color: #ddd;
}
/*聊天头像*/
#chat-wrap .chat-box li.user:before {
  right: -70px;
  background: url('../images/author.jpg') no-repeat center center;
  background-size:44px 44px;
}
/*聊天气泡尖角*/
#chat-wrap .chat-box li.user:after {
  border-right: 10px solid transparent;
  border-top: 10px solid #ddd;
  right: -10px;
}

/*给对话区中机器人的聊天气泡设置样式*/
#chat-wrap .chat-box li.robot {
  float: left;
  margin-left: 70px;
  background-color: #75a5f4;
  color:#333;
}
#chat-wrap .chat-box li.robot:before {
  left: -70px;
  background: url('../images/robot.png') no-repeat center center;
  background-size:44px 44px;
}
#chat-wrap .chat-box li.robot:after {
  border-left: 10px solid transparent;
  border-top: 10px solid #75a5f4;
  left: -10px;
}

```
通过这样的设置后，可得到如下的效果图

!['图片'](https://upload.wikimedia.org/wikipedia/commons/2/2c/WebRobot2016323.png)

#### Js实现前后端数据交互   

##### 监听输入文本事件   

小项目里使用了两种方式监听输入区的文字输入，键盘按键监听和页面按钮监听；其中，键盘按键监听是监听键盘回车键，代码示例如下   

```js
//监听页面n按钮发送事件
$('#chat-wrap .input-submit').click(function(event) {
	//处理输入文字
	dealInputText();
});

//监听回车键发送事件
$(document).keydown(function(event) {
	//检测是否是回车键，且输入框已聚焦光标
	if(event.keyCode==13 && $('#chat-wrap .input-words').is(':focus')) {
		//取消回车的默认行为，防止光标移动到下一行
		event.preventDefault();
		//处理输入文字
		dealInputText();					
	}
});
```

##### 过滤并处理文本    

这部分是对输入的文本做过滤处理，并送到`Ajax`区域发送数据到后端，做过滤是去除输入文字前后的空白符，防止空白内容作为有效字符传送到j后端，过滤部分代码如下   

```js
//除去文字中的前后空白符
function getValidText(data) {
	var validData = data.replace(/(^\s*)|(\s*$)/g,"");
	return (validData.length > 0) ? validData : 0;
}
```
在过滤空白字符获得有效输入内容后，如下代码所示，在数据处理函数`dealInputText()`中先在函数`showData()`中显示用户输入数据的聊天气泡，之后再将Ajax处理作为其回调函数发送数据到后端，从而可将用户聊天内容的显示和后端回复内容的显示独立开，以免冲突，`showData()`函数的实现留在稍后边儿讲   

```js
//处理获取的输入文字
function dealInputText() {

	//获取输入框文字
	var inputText = $('#chat-wrap .input-words').val();

	//判断输入的文字是否有效
	if(getValidText(inputText)) {

		//获取除去了前后空白符的有效文字
		var validText = getValidText(inputText);

		//显示用户输入文字的对话框并调用实现回调函数
		showData(validText, true, function() {

			//输入文字的对话框输出后，回调这块区域的代码
			//创建和后端交互的数据格式
			var jsonDatas = createJsonDatas(validText);

			//ajax发送和异步接收后端的数据
			ajaxSend(jsonDatas);
		});
	}
}
```

##### Ajax发送和接收数据  

在这部分，获取有效输入数据后，通过Jquery库封装的Ajax函数发送数据，项目里采用的是`POST`发送方式，
在发送数据前，先将数据封装成`Json`对象，如下   

```js
//创建前后端交互的数据格式，这里创建的是json格式
function createJsonDatas(inputData) {
	return {
		"input":inputData
	};
}
```

这里只封装了一个输入数据，如果有多个数据，也可按照这个格式添加。数据格式封装完成后，就是
Ajax发送数据了，在Ajax中可设置很多字段，约定和后端交互的一些参数，这个小项目里使用的设置如下   

```js
    //ajax方式发送数据和其异步接收数据
	function ajaxSend(datas) {
		$.ajax({

			//后端接收数据的地址
			url: 'inputHandle.php',

			//约定POST发送数据
			type: 'POST',

			//约定后端传的数据格式
			dataType: 'json',

			//发送的数据
			data: {jsonDatas:datas},

			//成功收到后端发的数据
			success: function(jsonResult){

				//获取后端反馈的答复文字
				var output = jsonResult['output'];

				//检测后端数据是否有效
				if(getValidText(output)) {

					//除去文字中的前后空白符
					var outPutData = getValidText(output);

					//显示机器人的答复框
					showData(outPutData, false);
				}
			},

			//请求失败时调用
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert('连接失败');
			}
		});	
	}
```
数据发送成功后，便可异步接收后端反馈的数据，成功接收到后端的数据后，可在`success`函数中对数据进行处理。
接下来就是对后端传来的数据在页面的展示。

##### 展示后端回复数据   

这部分，需要通过Js创建聊天气泡需要的标签，并添加class名称，最后将标签添加到页面中，实现部分代码如下   

```js
//js创建答复框需要的标签，将对话框输出到对话区
function showData(data, isUser, callback) {

	//创建li元素标签
	var liElement = document.createElement('li');

	//创建文本节点
	var textElement = document.createTextNode(data);

	//判断isUser是否为用户，若为用户，则给li元素添加名为'user'的classname
	//若为后端反馈的数据，即'机器人'，则给li元素添加名为'robot'的classname
	isUser === true ? liElement.setAttribute('class','user'):
	                  liElement.setAttribute('class','robot');

	//将文本节点添加到li标签中
	liElement.appendChild(textElement);

	//将li元素标签添加到ul标签中
	$('#chat-wrap .chat-box ul').get(0).appendChild(liElement);
	
	//清除输入框中的内容
	$('#chat-wrap .input-words').val('');

	//滚动条回到低端
	toBottom();

	//调用回调函数
	if(callback) callback();
}
```

### 后端部分   

#### 数据接收   

前端将数据封装成Json数据通过Ajax指定地址发送到后端后，后端可通过相对应的方式接收数据，因为前面Ajax发送数据时，使用的是POST方式发送的，后端接收时同样需要使用POST方式接收，Php中使用关键字`$_POST`代表接收方式是POST方式，代码如下   

```php
//获取前端传来的json数据
$data = $_POST['jsonDatas'];

//获取输入框的内容
$input = $data['input'];

//调用第三方接口，获取答复内容
$outPut = talk($input);
```

#### 智能机器人应答   

获取到前端数据后，这部分调用的是第三方接口完成智能应答，本项目中使用的是赛科提供的接口，在官网申请注册后可得到`appKey`，便可使用它的接口了，调用它处理数据的程序如下   

```php
//赛科第三方接口
//将email和appekey换成你的就可以了
function talk($keyword) {
    $content = iconv("UTF-8","GB2312//IGNORE",$keyword);
    $contenta = urlencode($content);
    $str = file_get_contents("http://dev.skjqr.com/api/weixin.php?email=1349279985@qq.com&appkey=accfdca46233374c16fabf842ca6ea2e&msg=$contenta");
    $str = str_replace("[msg]","",$str);
    $str = str_replace("[/msg]","",$str);
    return $str;
}
```

#### 封装回复数据格式  

因为前端在Ajax发送数据时，指定后端的回复格式`dataType`是json格式，则不可直接把文本做h回复，需要对其进行封装，我使用的是先建一个数组，将数据添加到数据中，再将数组转为json数据格式进行传输，代码如下   

```php
//创建数组
$arr = array(
	'output' => $outPut
);

//将数组转为json数据格式，返回到前端
echo json_encode($arr);
```

## 方案总结  

在此，整个网页机器人小项目就实现了，小项目在`Firefox 48.0.2`、`ie 13.1`、`safari 5.1.7`、`Chrome 50.0.2`和`opera 40.0`亲测可用，不过这个小项目实现的是基本的文字聊天功能，肯定还能进一步扩展它，丰富它的功能。

[url0]:http://www.w3school.com.cn/css3/
[url1]:http://www.w3school.com.cn/cssref/pr_animation.asp
[url2]:http://www.w3school.com.cn/cssref/pr_transition.asp
[url3]:http://www.w3school.com.cn/jquery/
[url4]:http://www.w3school.com.cn/ajax/ajax_intro.asp
[url5]:http://www.imooc.com/learn/54
[url6]:http://www.imooc.com/learn/703
[url7]:https://github.com/1349279985/
