### 侧边设备的配置列表

```bash
# 图片
{
  categroy: 'ImgModel',
  width: 100,
  height: 100,
  source: 'https://www.google.com/img/xxx',
  type: 'lengji'
}

# 文字
{
  category: 'Text',
  stroke: '#333',
  text: '文字',
  margin: 5,
  font: 'bold 16px helvetica, bold arial, sans-serif'
}


# 数据点
{
  category: 'Value',
  stroke: '#333',
  text: '文字',
  margin: 5,
  font: 'bold 16px helvetica, bold arial, sans-serif'
}

# 链接
  # stopColor: 停止流动的连线的底色
  # runColor: 正在流动的连线的底色
  # points: 这个属性值是 |_ 这个样的拐角线。
{
  category: 'Link',
  stopColor: 'gray',
  runColor: 'blue',
  points: new go.List(go.Point).addAll([
    new go.Point(0, 0),
    new go.Point(0, 40),
    new go.Point(40, 40)
  ]),
  type: 'flow' // flow/normal
}
```

### 详情页面接口统计及数据结构

1. 获取画布信息接口(返回前端在新建的时候提交的数据)

2. 获取画布上所有数据点的接口

```bash
# 有两种数据点: 1. 与设备绑定的 2.独立的点
[{
  pid: 1, //设备id
  attrId: 1, // 属性id
  value: '1' // 属性值
}, {
  pid: 0, //独立的点,为了区分,pid设置为0
  attrId: 2, // 属性id
  value: '2' // 属性值
}]
```

3. 根据设备 id 获取设备的所有属性, 并标注此信息的需要何种操作来编辑的.(optType 来表示操作类型, 值包括几种: 只读\可拖拽到画布\可修改且输入框\可修改且选择框)

```bash
[{
  attrName: '状态',
  attrValue: 'on',
  optType: 'readonly'
},{
  attrName: '时间',
  attrValue: '0.1',
  optType: 'drag'
}, {
  attrName: '启停控制',
  attrValue: 'SC',
  optType: 'input'
}]
```

- 编辑页面接口统计及模板

1. 获取左侧菜单中设备的配置列表 (最好是做成可配置的,配置的类型还需要定义一下)

```bash
[{
  categroy: 'ImgModel',
  width: 100,
  height: 100,
  source: 'https://www.google.com/img/xxx1111',
  type: 'lengji'
}, {
  categroy: 'ImgModel',
  width: 100,
  height: 100,
  source: 'https://www.google.com/img/xxx2222',
  type: 'beng'
}]
```

2. 根据设备的 type 来获取编号列表

3. 根据设备编号来获取设备的属性信息, 并标注此信息的需要何种操作来编辑的. (同上 3)

4. 根据 type 获取所有的独立属性. 返回数据参照(上 3)

5. 调用保存画布数据的接口.
