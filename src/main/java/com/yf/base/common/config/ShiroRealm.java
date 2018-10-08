package com.yf.base.common.config;

import com.yf.base.common.Constants;
import com.yf.base.model.sys.vo.SysPermissionVo;
import com.yf.base.model.sys.vo.SysRoleVo;
import com.yf.base.model.sys.vo.SysUserVo;
import com.yf.base.service.sys.SysPermissionService;
import com.yf.base.service.sys.SysRoleService;
import com.yf.base.service.sys.SysUserService;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class ShiroRealm extends AuthorizingRealm {
    @Autowired
    private SysUserService sysUserService;
    @Autowired
    private SysRoleService sysRoleService;
    @Autowired
    private SysPermissionService sysPermissionService;

    /*进行角色和权限认证。*/
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        System.out.println("权限配置-->ShiroRealm.doGetAuthorizationInfo()");
        SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
        SysUserVo loginUser  = (SysUserVo)principals.getPrimaryPrincipal();
        for(SysRoleVo roleVo:loginUser.getRoleVoList()){
            authorizationInfo.addRole(roleVo.getName());
            for(SysPermissionVo permissionVo:roleVo.getPermissionVoList()){
                authorizationInfo.addStringPermission(permissionVo.getPermission());
            }
        }
        return authorizationInfo;
    }

    /*进行身份认证的，也就是说验证用户输入的账号和密码是否正确。*/
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token)
            throws AuthenticationException {
        String username = (String)token.getPrincipal();
        System.out.println("MyShiroRealm.doGetAuthenticationInfo():"+username);

        //通过username从数据库中查找 User对象
        SysUserVo paramVo = new SysUserVo();
        paramVo.setAccount(username);
        SysUserVo loginUser = sysUserService.getSysUserVo(paramVo);
        if(loginUser != null){
            //获取用户角色和权限
            List<SysRoleVo> roleVoList = sysRoleService.selectRoleListByUserId(loginUser.getId());
            for(SysRoleVo roleVo : roleVoList) {
                List<SysPermissionVo> permissionVoList = sysPermissionService.selectListByRoleId(roleVo.getId());
                roleVo.setPermissionVoList(permissionVoList);
            }
            loginUser.setRoleVoList(roleVoList);
            //获取用户导航菜单树
            List<SysPermissionVo> permissionTree = sysPermissionService.selectTreeByUserAndType(loginUser.getId(), Constants.RESOURCE_TYPE_MENU);
            loginUser.setPermissionTree(permissionTree);

            SimpleAuthenticationInfo authenticationInfo = new SimpleAuthenticationInfo(
                    loginUser, //用户名
                    loginUser.getPassword(), //密码
                    ByteSource.Util.bytes(loginUser.getSalt()),
                    getName()  //realm name
            );
            return authenticationInfo;
        }
        return null;
    }

}
