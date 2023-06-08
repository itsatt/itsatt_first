var wxCharts = require("../../utils/wxcharts.js");//相对路径
Page({

  data:{
    imageWidth:0
  },
  onLoad:function(){

   
  },
  onShow:function(){
    new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      categories: ['2012', '2013', '2014', '2015', '2016', '2017'],
      series: [{
          name: '成交量1',
          data: [15, 20, 45, 37, 4, 80]
      }],
      yAxis: {
          format: function (val) {
              return val + '万';
          },
          /*max:400,
          min:0*/
      },
      width: 320,
      height: 200
  });
  }

})
