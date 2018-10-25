package com.yf.base.common;

import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;

import java.net.URLEncoder;
@Slf4j
public class SmsUtil {

    private static final String CorpID = "zhangxuomei";
    private static final String Pwd = "123456";

    public static String sendSMS(String[] mobiles, String content ) {
        try {
            String sendMobiles = StringUtils.join(mobiles, ",");
            String sendContent = URLEncoder.encode(content, "GB2312");
            String url = "http://sms.cdht.gov.cn/ws/BatchSend2.aspx?CorpID="+CorpID+"&Pwd="+Pwd+"&Mobile="+sendMobiles+"&Content="+sendContent+"&Cell=&SendTime=";
            log.info("url:::"+url);
            String reponse = HttpclientUtils.doGet(url);
            log.info("reponse:::"+Integer.parseInt(reponse));
            if (Integer.parseInt(reponse) > 0) {
                return "SUCCESS";
            }
            log.error("SMS SEND FAILED..........................");
            return "FAIL";


        } catch (Exception e) {
            log.error("SMS SEND FAILED..........................");
            e.printStackTrace();
            return "FAIL";
        }
    }

    public static void main(String[] args) {
        String[] mobiles = {"13880403060","18080013016"};
        String content = "你好，测试！";
        sendSMS(mobiles,content);
    }
}
