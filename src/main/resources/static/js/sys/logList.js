var logList = new Vue({
    el:"#logList",
    data:{
        logData:{},
        searchObj: {
            pageNo:1,
            searchCondition:'',
            parentId:0,
            searchStartDate:'',
            searchEndDate:''
        }
    },
    computed:{
        searchDateRange:function () {
            if (this.searchObj.searchStartDate && this.searchObj.searchEndDate) {
                return this.searchObj.searchStartDate + ' / ' + this.searchObj.searchEndDate;
            }
            return "";
        }
        },
    methods:{
        prePage: function () {
            this.searchObj.pageNo = this.logData.prePage;
            this.selectlogList();
        },
        currPage: function (pageIndex) {
            this.searchObj.pageNo = pageIndex;
            this.selectlogList();
        },
        nextPage: function () {
            this.searchObj.pageNo = this.logData.nextPage;
            this.selectlogList();
        },
        selectlogList: function () {
            var url ="/sys/log/selectLog";
            YF_HTTP.post(url,this.searchObj)
                .then(function (result) {
                    logList.$data.logData = result.data;
                });
        },
        dateFormat:function(time) {
            var date=new Date(time);
            var year=date.getFullYear();
            /* 在日期格式中，月份是从0开始的，因此要加0
             * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
             * */
            var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
            var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
            var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
            var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
            var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
            // 拼接
            return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
        },
        init:function(){
            $('#dateRang').daterangepicker({
                autoUpdateInput: false,
                locale: {
                    format: 'YYYY-MM-DD',
                    applyLabel: "确定",
                    cancelLabel: "取消",
                    daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                }
            },function(start, end, label){
                logList.$data.searchObj.searchStartDate = start.format('YYYY-MM-DD');
                logList.$data.searchObj.searchEndDate = end.format('YYYY-MM-DD');
            });
            //清除事件
            $('#dateRang').on('cancel.daterangepicker', function(ev, picker) {
                logList.$data.searchObj.searchStartDate = '';
                logList.$data.searchObj.searchEndDate = '';
            });
        },
        rangDateChange:function(event){
            if(event.target.value == ''){
                this.searchObj.searchStartDate = "";
                this.searchObj.searchEndDate = "";
            }
        },
    },
    mounted:function () {
        this.selectlogList();
        this.init();
    }

});
