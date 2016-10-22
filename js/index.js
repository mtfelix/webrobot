$(function(){

	//检测发送事件
	$('#chat-wrap .input-submit').click(function(event) {
		//处理输入文字
		dealInputText();
	});

	//检测回车键发送事件
	$(document).keydown(function(event) {
		//检测是否是回车键，且输入框已聚焦光标
		if(event.keyCode==13 && $('#chat-wrap .input-words').is(':focus')) {
			//取消回车的默认行为，防止光标移动到下一行
			event.preventDefault();
			//处理输入文字
			dealInputText();					
		}
	});

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

	//滚动条回到低端
	function toBottom() {
		var charBoxElement = $('#chat-wrap .chat-box'),
			//获取对话区的总高度，包括其可见区域高度和其内滚动条可滚动的高度
			//获取其可见区域高度
			viewHeight = charBoxElement.outerHeight(),
			//获取其内滚动条可滚动的高度
			maxScrollHeight = charBoxElement.get(0).scrollHeight - viewHeight,
			//获取其内滚动条到其顶端的位置
			chatScrollHeight = charBoxElement.scrollTop();
		//滚动条不在对话区最低端时让其动画滚动到最低端
		if(chatScrollHeight < maxScrollHeight) {
			charBoxElement.animate({
				scrollTop: maxScrollHeight
			}, 'normal');
		}
	}

	//创建前后端交互的数据格式，这里创建的是json格式
	function createJsonDatas(inputData) {
		return {
			"input":inputData
		};
	}

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

	//除去文字中的前后空白符
	function getValidText(data) {
		var validData = data.replace(/(^\s*)|(\s*$)/g,"");
		return (validData.length > 0) ? validData : 0;
	}
});