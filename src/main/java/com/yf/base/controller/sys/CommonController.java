package com.yf.base.controller.sys;

import com.yf.base.common.BaseController;
import com.yf.base.common.ReturnResult;
import com.yf.base.model.sys.SysFile;
import com.yf.base.model.sys.vo.SysConfigVo;
import com.yf.base.service.sys.SysConfigService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

@Api(tags="公共接口模块")
@Controller
@RequestMapping("/common")
public class CommonController extends BaseController {
    @Autowired
    private SysConfigService configService;

    private static String UPLOADED_FOLDER = "D://emergency/";

    @ResponseBody
    @RequestMapping("/fileUpload") // //new annotation since 4.3
    public ReturnResult fileUpload(HttpServletRequest request) {
        ReturnResult rr = ReturnResult.SUCCESS();
        List<SysFile> fileList = new ArrayList<>();
        try {
            MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
            Iterator<String> iter = multiRequest.getFileNames();
            System.out.println("----------");
            while (iter.hasNext()) {
                MultipartFile multipartFile = multiRequest.getFile(iter.next());
                String fileName = multipartFile.getOriginalFilename();
                System.out.println(fileName);
                SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
                String time = sdf.format(new Date());
                // 获取文件扩展名
                String extName = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
                // 文件新名称
                String generatefileName = this.getUUID32() + extName;
                String realPath = request.getSession().getServletContext().getRealPath("/");
                String filePath = realPath + "/" + generatefileName;
//                String filePath = realPath +"/event/"+ time + "/" + generatefileName;
//                File dirFile = new File(realPath +"/event/"+ time + "/");
//                if(!dirFile.exists()){ {
//                    dirFile.mkdir();
//                }}
                multipartFile.transferTo(new File(filePath));
                SysFile sysFile = new SysFile();
                sysFile.setCreateUserId(this.getLoginUser().getId());
                sysFile.setCreateTime(new Date());
                sysFile.setActive(1);
                sysFile.setOriginalPath("/" + generatefileName);
                sysFile.setFileName(fileName);
                if (extName.equals(".jpg") || extName.equals(".png") || extName.equals(".jpeg") || extName.equals(".gif")) {
                    sysFile.setFileType(1);
                    sysFile.setThumbnailPath("/" + generatefileName);
                } else {
                    sysFile.setFileType(2);
                }
                fileList.add(sysFile);
            }
            rr.setData(fileList);
        } catch (IOException e) {
            rr = ReturnResult.FAILUER("文件上传失败！");
            e.printStackTrace();
        }

        return rr;
    }

    @ApiOperation(value="查询指定类型的一级配置列表",  httpMethod ="POST")
    @ResponseBody
    @RequestMapping("/configList")
    public ReturnResult configList(Integer type) {
        ReturnResult rr = ReturnResult.SUCCESS();
        List<SysConfigVo> list = configService.selectConfigList(type);
        rr.setData(list);
        return rr;
    }

    @ApiOperation(value="查询指定类型的二级配置列表",  httpMethod ="POST")
    @ResponseBody
    @RequestMapping("/configList2")
    public ReturnResult configList2(Integer type) {
        ReturnResult rr = ReturnResult.SUCCESS();
        List<SysConfigVo> list = configService.selectConfigList2(type);
        rr.setData(list);
        return rr;
    }

    private String getUUID32(){
        String uuid = UUID.randomUUID().toString().replace("-", "").toLowerCase();
        return uuid;
    }

}
