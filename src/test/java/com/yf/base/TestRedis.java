package com.yf.base;

import com.yf.base.yfbase.YFBaseApplication;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.concurrent.TimeUnit;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = YFBaseApplication.class)
public class TestRedis {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    @Autowired
    private RedisTemplate redisTemplate;

    @Test
    public void testString(){
        stringRedisTemplate.opsForValue().set("base","redis测试");
        Assert.assertEquals("111",stringRedisTemplate.opsForValue().get("base"));
    }

    @Test
    public void testObj() throws Exception {
//        BaseUser user=new BaseUser();
//        user.setAccount("yyq");
//        user.setActive(0);
//        user.setName("yyq");
//        user.setPhone("1234567890");
//        user.setPassword("qweasdzxc");
//        ValueOperations<String, BaseUser> operations = redisTemplate.opsForValue();
//        operations.set("com.tt", user);
//        operations.set("com.tt.f", user,1, TimeUnit.SECONDS);
//        Thread.sleep(1000);
//        boolean exists=redisTemplate.hasKey("com.neo.f");
//        if(exists){
//            System.out.println("exists is true");
//        }else{
//            System.out.println("exists is false");
//        }
//        Assert.assertEquals("aa", operations.get("com.tt").getName());
    }
}
