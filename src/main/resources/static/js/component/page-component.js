Vue.component('page-div',{
    props: ['pageobj','infowidthclass','pagewidthclass'],
    template:"<div>\
        <div v-bind:class=\"[infowidthclass?infowidthclass:'col-sm-5','']\">\
            <div class=\"dataTables_info\">共{{pageobj.total}}条，每页显示{{pageobj.pageSize}}条，当前显示第{{pageobj.pageNum}}页</div>\
        </div>\
        <div v-bind:class=\"[pagewidthclass?pagewidthclass:'col-sm-7','']\">\
            <div class='dataTables_paginate'>\
                <ul class='pagination'>\
                    <li :class=\"[pageobj.hasPreviousPage?'':'disabled','paginate_button previous']\"><a href='javascript:;' v-on:click=\"$emit('prepage')\">上一页</a></li>\
                    <li :class=\"[p==pageobj.pageNum?'active':'','paginate_button']\" v-for='p in pageobj.navigatepageNums'><a href='javascript:;' v-on:click=\"$emit('currpage',p)\">{{p}}</a></li>\
                    <li :class=\"[pageobj.hasNextPage?'':'disabled','paginate_button next']\"><a href='javascript:;' v-on:click=\"$emit('nextpage')\">下一页</a></li>\
                </ul>\
            </div>\
        </div>\
    </div>"
});