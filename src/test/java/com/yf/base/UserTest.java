package com.yf.base;

import com.yf.base.yfbase.YFBaseApplication;
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

@RunWith(SpringRunner.class)
@SpringBootTest(classes = YFBaseApplication.class)
public class UserTest {

    private MockMvc mvc;

    @Autowired
    private WebApplicationContext context;

    @Before
    public void setUp(){
        mvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    public void getHello() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/user/hello")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                //.param("lat", "123.123").param("lon", "456.456")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.content().string(Matchers.containsString("pmanager")));
    }

    @Test
    public void getUserList() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/base/user/getUserList")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .param("userId", "13")
                .param("roleId","5")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(1));
    }

    @Test
    public void getUserList_pmTest() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/base/user/getUserListPMTest")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .param("userId", "13")
                .param("roleId","5")
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].id").value(1));
    }

    @Test
    public void getSession() throws Exception{
        mvc.perform(MockMvcRequestBuilders.get("/user/session")
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andDo(MockMvcResultHandlers.print())
                .andReturn();
    }
}
