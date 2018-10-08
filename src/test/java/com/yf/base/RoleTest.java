package com.yf.base;

import com.alibaba.fastjson.JSON;
import com.yf.base.model.sys.vo.SysPermissionVo;
import com.yf.base.model.sys.vo.SysRoleVo;
import com.yf.base.service.sys.SysPermissionService;
import com.yf.base.service.sys.SysRoleService;
import com.yf.base.yfbase.YFBaseApplication;
import lombok.extern.slf4j.Slf4j;
import org.hamcrest.Matchers;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(classes = YFBaseApplication.class)
public class RoleTest {

    private MockMvc mvc;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private SysRoleService roleService;
    @Autowired
    private SysPermissionService permissionService;

    @Before
    public void setUp(){
        mvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    public void getRoleList() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/role/list")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                //.param("lat", "123.123").param("lon", "456.456")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.content().string(Matchers.containsString("K")));
    }

    @Test
    public void testSplit() throws Exception {
        mvc.perform(MockMvcRequestBuilders.get("/role/per")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                //.param("lat", "123.123").param("lon", "456.456")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print());
    }

    @Test
    public void testSelectRoleListByUserId() throws Exception {
        List<SysRoleVo> result = roleService.selectRoleListByUserId(1);
        log.info("----返回结果:"+ JSON.toJSONString(result));
    }

    @Test
    public void testSelectPermissionListByRoleId() throws Exception {
        List<SysPermissionVo> result = permissionService.selectListByRoleId(1);
        log.info("----返回结果:"+ JSON.toJSONString(result));
    }
}
