
var fileUploadObj = {
    testBugFileList:[],//测试新增bug附件
    testBugFileImgList:[],
    //上传附件
    uploadFile: function (fileId, imgDiv) {
        $.ajaxFileUpload({
            url: baseUrl + "/common/fileUpload/jsonFile?path=event", // 用于文件上传的服务器端请求地址
            secureuri: false, // 是否需要安全协议，一般设置为false
            fileElementId: fileId, // 文件上传域的ID
            success: function (data) {// 服务器成功响应处理函数
                var index = 0;
                var item = JSON.parse($(data).find("body").text());
                var fileObj = {
                    "thumbnailPath":item.data[0].copy,
                    "originalPath": item.data[0].url,
                    "fileName": item.data[0].hasName,
                    "fileType": item.data[0].fileType,
                    "fileSize": item.data[0].size
                };
                var m = 1;
                if ("test_fileUpload" == fileId) {//测试新增bug上传图片
                    m = 1;
                    index = fileObj.fileType == 1 ? fileUploadObj.testBugFileImgList.length : fileUploadObj.testBugFileList.length;
                }
                if ("edit_upload" == fileId) {//修改上传图片
                    m = 1;
                    index = fileObj.fileType == 1 ? fileUploadObj.testBugFileImgList.length : fileUploadObj.testBugFileList.length;
                }
                if ("uploadAdd" == fileId) {//新增上传图片
                    m = 1;
                    index = fileObj.fileType == 1 ? fileUploadObj.testBugFileImgList.length : fileUploadObj.testBugFileList.length;
                }

                if (fileObj.fileType == 1) {
                    var imgurl = '<div id="imgdiv' + index + '" class="uploadImgDiv"><span class="uploadSpan"></span><img class="uploadimg" src = ' + baseUrl + fileObj.thumbnailPath + '>' + '<img class="hoverSpan" src="../../img/a7.png" onclick="fileUploadObj.delImg(' + m + ',' + index + ',1)"></div>';
                    $("#" + imgDiv).prepend(imgurl);
                } else {
                    var fileHTML = '<div id="imgdiv_file' + index + '" class="uploadImgDiv"><span style="max-width: 300px;margin-right: 10px;color: #0A94DD;min-width: 100px;" >' + fileObj.fileName + '</span><span style="cursor: pointer;width: 38px;display: inline-block;" onclick="fileUploadObj.delImg(' + m + ',' + index + ',7)">删除</span></div>';
                    $("#" + imgDiv + "_file").prepend(fileHTML);
                }

                if ("test_fileUpload" == fileId) {//测试新增bug上传图片
                    if (fileObj.fileType == 1) {
                        fileUploadObj.testBugFileImgList.push(fileObj);
                    } else {
                        fileUploadObj.testBugFileList.push(fileObj);
                    }
                }
                
                if ("edit_upload" == fileId) {//修改上传图片
                    if (fileObj.fileType == 1) {
                        fileUploadObj.testBugFileImgList.push(fileObj);
                    } else {
                        fileUploadObj.testBugFileList.push(fileObj);
                    }
                }
                
                if ("uploadAdd" == fileId) {//新增上传图片
                    if (fileObj.fileType == 1) {
                        fileUploadObj.testBugFileImgList.push(fileObj);
                    } else {
                        fileUploadObj.testBugFileList.push(fileObj);
                    }
                }
                
                
                
            }
        });
    },
    //删除图片 fileId 上传的图片地址 index 图片下标
    delImg: function (m, index, type) {
        if (1 == m) {// 人工新增事件上传图片
            if (type == 1) {
                fileUploadObj.testBugFileImgList.splice(index, 1);
            } else {
                fileUploadObj.testBugFileList.splice(index, 1);
            }
        }
        // 移除图片div
        if (type == 1) {
            $("#imgdiv" + index).remove();
        } else {
            $("#imgdiv_file" + index).remove();
        }
    },
    clear_file:function(){
        $("[id^=imgdiv]").remove();
        $('img[name="edit_fileImg"]').remove();
    },
    /**
	 * 显示已存在的附件
     * @param fileList
     * @param fileId
     * @param imgDiv
     */
	showFileList:function(fileList,fileId,imgDiv){
		if(!fileList){
			return;
		}
		for(var i=0;i< fileList.length;i++) {
            var fileObj = fileList[i];
            var m = 1;
            var index = 0;
                index = fileObj.fileType==1? fileUploadObj.testBugFileImgList.length : fileUploadObj.testBugFileList.length; 
                if(fileObj.fileType==1){
                    var imgurl = '<div id="imgdiv' + index + '" class="uploadImgDiv"><span class="uploadSpan"></span><img class="uploadimg" src = ' + baseUrl + fileObj.originalPath + '>' + '<img class="hoverSpan" src="../../img/a7.png" onclick="fileUploadObj.delImg(' + m + ',' + index + ',1)"></div>';
                    $("#" + imgDiv).prepend(imgurl);
                    fileUploadObj.testBugFileImgList.push(fileObj);
                }else{
                    var fileHTML = '<div id="imgdiv_file' + index + '" class="uploadImgDiv"><span style="max-width: 300px;margin-right: 10px;color: #0A94DD;min-width: 100px;" >'+fileObj.fileName+'</span><span style="cursor: pointer;width: 38px;display: inline-block;" onclick="fileUploadObj.delImg(' + m + ',' + index + ',7)">删除</span></div>';
                    $("#" + imgDiv+"_file").prepend(fileHTML);
                    fileUploadObj.testBugFileList.push(fileObj);
                }
                
        }
	},
    /**
	 * 显示已存在的附件,并可以下载
     * @param fileList
     * @param fileId
     * @param imgDiv
     */
	showUploadFileList:function(fileList,fileId,imgDiv){
		if(!fileList){
			return;
		}
		for(var i=0;i< fileList.length;i++) {
            var fileObj = fileList[i];
            var m = 1;
            var index = 0;
                index = fileObj.fileType==1? fileUploadObj.testBugFileImgList.length : fileUploadObj.testBugFileList.length; 
                if(fileObj.fileType==1){
                    var imgurl = '<div id="imgdiv' + index + '" class="uploadImgDiv"><span class="uploadSpan"></span><img class="uploadimg" src = ' + baseUrl + fileObj.originalPath + '>' + '<img class="hoverSpan" src="../../img/a7.png" onclick="fileUploadObj.delImg(' + m + ',' + index + ',1)"></div>';
                    $("#" + imgDiv).prepend(imgurl);
                    fileUploadObj.testBugFileImgList.push(fileObj);
                }else{
                    var fileHTML = '<div id="imgdiv_file' + index + '" class="uploadImgDiv"><span style="max-width: 300px;margin-right: 10px;color: #0A94DD;min-width: 100px;" >'+fileObj.fileName+
                    '</span><span style="cursor: pointer;width: 38px;display: inline-block;" onclick="fileUploadObj.delImg(' + m + ',' + index + ',7)">删除</span><span style="cursor: pointer;width: 38px;display: inline-block;" onclick="prototypeObj.download(\''+fileObj.originalPath+'\',\''+fileObj.fileName+'\')">下载</span></div>';
                    $("#" + imgDiv+"_file").prepend(fileHTML);
                    fileUploadObj.testBugFileList.push(fileObj);
                }
                
        }
	}
};