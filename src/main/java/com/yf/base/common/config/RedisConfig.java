package com.yf.base.common.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.cache.RedisCacheWriter;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.lang.reflect.Method;
import java.time.Duration;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Redis缓存配置类
 *
 * @author YYQ
 */
//@Configuration
//@EnableCaching
public class RedisConfig extends CachingConfigurerSupport {

    /**
     * @return 自定义策略生成的key
     * @description 自定义的缓存key的生成策略，若想使用这个key只需要讲注解上keyGenerator的值设置为keyGenerator即可
     */
    @Bean
    public KeyGenerator keyGenerator() {
        return new KeyGenerator() {
            @Override
            public Object generate(Object o, Method method, Object... objects) {
                StringBuffer sb = new StringBuffer();
                sb.append(o.getClass().getName());
                sb.append(".");
                sb.append(method.getName());
                if (objects != null) {
                    sb.append("(");
                    StringBuffer param = new StringBuffer();
                    for (Object item : objects) {
                        if (item != null) {
                            if(param.length()>0){
                                param.append("&");
                            }
                            param.append(item.toString());
                        }
                    }
                    sb.append(param);
                    sb.append(")");
                }
                return sb.toString();
            }
        };
    }

    //缓存管理器
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
        // 设置一个初始化的缓存空间set集合
        Set<String> cacheNames =  new HashSet<>();
        cacheNames.add("days-30-cache");
        cacheNames.add("hours-1-cache");
        FastJsonRedisSerializer<Object> fastJsonRedisSerializer = new FastJsonRedisSerializer<>(Object.class);
        //days-30-cache信息缓存配置
        RedisCacheConfiguration userCacheConfiguration = RedisCacheConfiguration
                .defaultCacheConfig()
                .entryTtl(Duration.ofDays(30))
                .disableCachingNullValues()
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(fastJsonRedisSerializer));

        Map<String, RedisCacheConfiguration> redisCacheConfigurationMap = new HashMap<>();
        redisCacheConfigurationMap.put("days-30-cache", userCacheConfiguration);
        redisCacheConfigurationMap.put("hours-1-cache",userCacheConfiguration.entryTtl(Duration.ofHours(1)));
        //初始化一个RedisCacheWriter
        RedisCacheWriter redisCacheWriter = RedisCacheWriter.nonLockingRedisCacheWriter(connectionFactory);
        //初始化RedisCacheManager
        RedisCacheManager cacheManager = RedisCacheManager.builder(redisCacheWriter)
                .initialCacheNames(cacheNames)
                .withInitialCacheConfigurations(redisCacheConfigurationMap)
                .build();

        return cacheManager;
    }

    /**
     * RedisTemplate配置，redis默认采用byte字节方式序列化缓存对象，这里重置redis的序列化方式，采用fastjson方式，方便观察redis服务中缓存对象
     *
     * @param redisConnectionFactory
     * @return
     */
    @Bean
    @ConditionalOnMissingBean(RedisTemplate.class)
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<String, Object>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        //使用fastjson序列化
        FastJsonRedisSerializer<Object> fastJsonRedisSerializer = new FastJsonRedisSerializer(Object.class);
        RedisSerializer stringSerializer = new StringRedisSerializer();
        // value值的序列化采用fastJsonRedisSerializer
        redisTemplate.setValueSerializer(fastJsonRedisSerializer);
        redisTemplate.setHashValueSerializer(fastJsonRedisSerializer);
        // key的序列化采用StringRedisSerializer
        redisTemplate.setKeySerializer(stringSerializer);
        redisTemplate.setHashKeySerializer(stringSerializer);
        redisTemplate.afterPropertiesSet();
        return redisTemplate;
    }

    /**
     * 继续使用默认方式
     *
     * @param redisConnectionFactory
     * @return
     */
    @Bean
    @ConditionalOnMissingBean(StringRedisTemplate.class)
    public StringRedisTemplate stringRedisTemplate(RedisConnectionFactory redisConnectionFactory) {
        StringRedisTemplate template = new StringRedisTemplate();
        template.setConnectionFactory(redisConnectionFactory);
        return template;
    }
}
