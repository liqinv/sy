var testApp = new Vue({
    el: "#testApp",
    data: {
        searchObj: {  //搜索对象
            pageNo: 1,
            searchCondition: '',
            startDate:'',
            endDate:''
        }
    },
    computed:{
        searchDateRange:function () {
            if(this.searchObj.startDate && this.searchObj.endDate){
                return this.searchObj.startDate + ' / '+this.searchObj.endDate;
            }
            return "";
        }
    },
    mounted: function () {
        this.init();
    },
    methods: {
        init:function(){
            $('#dateRang').daterangepicker({
                autoUpdateInput: false,
                /*ranges: {
                    '清空': ['', ''],
                    '今天': [moment(), moment().add(1, 'days')],
                    '昨天': [moment(), moment().subtract(1, 'days')],
                    '7天': [moment().subtract(7, 'days'), moment()],
                    '30天': [moment().subtract(30, 'days'), moment()],
                    '这个月': [moment().startOf('month'), moment().endOf('month')],
                    '上个月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                },*/
                locale: {
                    format: 'YYYY-MM-DD',
                    applyLabel: "确定",
                    cancelLabel: "取消",
                    daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                }
            },function(start, end){
                testApp.$data.searchObj.startDate = start.format('YYYY-MM-DD');
                testApp.$data.searchObj.endDate = end.format('YYYY-MM-DD');
            });
            //apply.daterangepicker 确认事件
            //清除事件
            $('#dateRang').on('cancel.daterangepicker', function(ev, picker) {
                testApp.$data.searchObj.startDate = '';
                testApp.$data.searchObj.endDate = '';
            });


            $('#singleDate').daterangepicker({
                singleDatePicker: true,
                autoUpdateInput: false,
                showDropdowns: true,
                locale: {
                    format: 'YYYY-MM-DD',
                    applyLabel: "确定",
                    cancelLabel: "取消",
                    daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                }
            }, function(start, end, label) {
                this.element.val(start.format('YYYY-MM-DD'));
            });
        },
        rangDateChange:function(event){
            if(event.target.value == ''){
                this.searchObj.startDate = "";
                this.searchObj.endDate = "";
            }
        },
    }
});