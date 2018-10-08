package com.yf.base.common.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;

//@Configuration
//@MapperScan(basePackages = "com.yf.base.dao.base",sqlSessionTemplateRef = "pmSqlSessionTemplate")
public class DataSourcePMConfig {

    @Primary
    @Bean("pmDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.base")
    public DataSource pmDataSource(){
        return DataSourceBuilder.create().build();
    }

    @Primary
    @Bean("pmSqlSessionFactory")
    public SqlSessionFactory pmSqlSessionFactory(@Qualifier("pmDataSource")DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mybatis/mysql/base/**/*Mapper.xml"));
        return bean.getObject();
    }

    @Primary
    @Bean("pmDataSourceTransactionManager")
    public DataSourceTransactionManager pmDataSourceTransactionManager(@Qualifier("pmDataSource")DataSource dataSource){
        return new DataSourceTransactionManager(dataSource);
    }

    @Primary
    @Bean("pmSqlSessionTemplate")
    public SqlSessionTemplate pmSqlSessionTemplate(@Qualifier("pmSqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception{
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
