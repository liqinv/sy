package com.yf.base.service.sys.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.yf.base.common.BaseDao;
import com.yf.base.common.BaseServiceImpl;
import com.yf.base.dao.sys.SysOrganMapper;
import com.yf.base.dao.sys.vo.SysOrganVoMapper;
import com.yf.base.model.sys.SysOrgan;
import com.yf.base.model.sys.vo.SysOrganVo;
import com.yf.base.service.sys.SysOrganService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class SysOrganServiceImpl extends BaseServiceImpl<SysOrgan,Integer> implements SysOrganService {

    @Resource
    private SysOrganMapper sysOrganMapper;
    @Resource
    private SysOrganVoMapper sysOrganVoMapper;
    @Override
    public BaseDao<SysOrgan, Integer> getDao() {
        return sysOrganMapper;
    }
    /**
     * 查询机构信息集合
     * @param sysOrganVo
     * @return
     */
    @Override
    public List<SysOrganVo> selectSysOrganVoList(SysOrganVo sysOrganVo) {
        return sysOrganVoMapper.selectSysOrganVoList(sysOrganVo);
    }

    /**
     * 查询当前级别最大ID
     * @param level  机构级别
     * @return
     */
    @Override
    public Integer getOrganMaxCode(int level) {
        return sysOrganVoMapper.getOrganMaxCode(level);
    }
    /**
     * 查询机构列表，分页
     * @param sysOrganVo
     * @return
     */
    @Override
    public PageInfo selectByPage(SysOrganVo sysOrganVo) {
        List<SysOrganVo> result = sysOrganVoMapper.selectSysOrganVoList(sysOrganVo);
        PageInfo<SysOrganVo> pageInfo = new PageInfo<>(result);
        return pageInfo;
    }
    /**
     * 添加机构
     * @param sysOrganVo
     * @return
     */
    @Override
    public int addSysOrganVo(SysOrganVo sysOrganVo) {
        SysOrgan sysOrgan=sysOrganMapper.selectByPrimaryKey(sysOrganVo.getParentId());
        Integer id=sysOrganVoMapper.getOrganMaxCode(sysOrgan.getLevel().intValue()+1);
        Integer newId=null;
        if(id!=null){
            newId=id.intValue()+1;
        }else{
            newId=Integer.parseInt(sysOrgan.getLevel().intValue()+1+"001");
        }
        sysOrganVo.setId(newId);
        sysOrganVo.setLevel(sysOrgan.getLevel().intValue()+1);
        sysOrganVo.setPath(sysOrgan.getPath()+"/"+newId);

        return sysOrganMapper.insert(sysOrganVo);
    }
    /**
     * 根据机构名称查询重复机构个数
     * @param sysOrgan
     * @return
     */
    @Override
    public int getSysOrganByNameCount(SysOrgan sysOrgan) {
        return sysOrganVoMapper.getSysOrganByNameCount(sysOrgan);
    }
    /**
     * 查询机构总数
     * @param sysOrgan  机构对象
     * @return
     */
    @Override
    public int getOrganListCount(SysOrgan sysOrgan) {
        return sysOrganVoMapper.getOrganListCount(sysOrgan);
    }
    /**
     * 查询单个机构信息
     * @param organVoId 机构ID
     * @return
     */
    @Override
    public SysOrganVo getOrganVoById(Integer organVoId) {
        return sysOrganVoMapper.getOrganVoById(organVoId);
    }
    /**
     * 获取Kendo树所需要的数据源，根据指定的机构节点开始显示
     * @param organId 指定的机构节点ID
     * @author YYQ
     * @return
     */
    @Override
    public List<SysOrganVo> selectTreeSource(Integer organId) {
        SysOrganVo organVo = new SysOrganVo();
        int level=1;
        List<SysOrganVo> allList = selectSysOrganVoList(organVo);
        List<SysOrganVo> resultList =new ArrayList<SysOrganVo>();
        //第一级模块
        for(SysOrganVo item : allList){
            if(item !=null && item.getLevel()==level){
                resultList.add(item);
                //子集模块
                moduleTree(item,allList);
            }
        }
        return resultList;
    }

    /**
     * 迭代构建模块子级
     * @param parentVo
     * @param sourceList
     */
    private void moduleTree(SysOrganVo parentVo,List<SysOrganVo> sourceList) {
        if(sourceList==null || parentVo==null){
            return;
        }
        if(parentVo.getNodes()==null|| parentVo.getNodes().size()<1){
            parentVo.setNodes(new ArrayList<SysOrganVo>());
        }
        for(SysOrganVo item : sourceList){
            if(item!=null && item.getParentId().equals(parentVo.getId())){
                parentVo.getNodes().add(item);
                moduleTree(item,sourceList);
            }
        }
    }

}
