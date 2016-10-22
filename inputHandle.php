<?php
	//获取前端传来的json数据
	$data = $_POST['jsonDatas'];

	//获取输入框的内容
	$input = $data['input'];

	//调用第三方接口，获取答复内容
	$outPut = talk($input);

	//创建数组
	$arr = array(
		'output' => $outPut
	);

	//将数组转为json数据格式，返回到前端
	echo json_encode($arr);

	//赛课第三方接口
	//将email和appekey换成你的就可以了
	function talk($keyword) {
	    $content = iconv("UTF-8","GB2312//IGNORE",$keyword);
	    $contenta = urlencode($content);
	    $str = file_get_contents("http://dev.skjqr.com/api/weixin.php?email=1349279985@qq.com&appkey=accfdca46233374c16fabf842ca6ea2e&msg=$contenta");
	    $str = str_replace("[msg]","",$str);
	    $str = str_replace("[/msg]","",$str);
	    return $str;
	}
?>