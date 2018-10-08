package com.yf.base.common.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;

import javax.sql.DataSource;

//@Configuration
//@MapperScan(basePackages = "com.yf.base.dao.pm_test",sqlSessionTemplateRef = "pmTestSqlSessionTemplate")
public class DataSourcePMTestConfig {

    @Bean("pmTestDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.pmtest")
    public DataSource pmTestDataSource(){
        return DataSourceBuilder.create().build();
    }

    @Bean("pmTestSqlSessionFactory")
    public SqlSessionFactory pmTestSqlSessionFactory(@Qualifier("pmTestDataSource")DataSource dataSource) throws Exception {
        SqlSessionFactoryBean bean = new SqlSessionFactoryBean();
        bean.setDataSource(dataSource);
        bean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mybatis/mysql/pm_test/**/*Mapper.xml"));
        return bean.getObject();
    }

    @Bean("pmTestDataSourceTransactionManager")
    public DataSourceTransactionManager pmTestDataSourceTransactionManager(@Qualifier("pmTestDataSource")DataSource dataSource){
        return new DataSourceTransactionManager(dataSource);
    }

    @Bean("pmTestSqlSessionTemplate")
    public SqlSessionTemplate pmTestSqlSessionTemplate(@Qualifier("pmTestSqlSessionFactory") SqlSessionFactory sqlSessionFactory) throws Exception{
        return new SqlSessionTemplate(sqlSessionFactory);
    }
}
