Page({
  data: {
    rows: new Array(101),            // 控制行数
    cols: new Array(7),          // 控制列数
    data: [],                      // 存储每个单元格的背景颜色
  },

  onLoad: function () {
    let data = [];
    for (let i = 0; i < 7; i++) {
      let rowData = ['#F5F9EA'];   // 第一列的背景颜色为淡绿色
      for (let j = 1; j < 101; j++) {
        rowData.push('#8BC34A');   // 其他列的背景颜色为浅绿色
      }
      data.push(rowData);
    }
    this.setData({ data: data });
  },
})
