import go, { Binding } from 'gojs';

const json = require('../../goModel.json');

const icons = require('../../goIcon.js');

import dataArray from '../../goValue.js';
const loginController = function() {
  var $,
    myDiagram,
    points = [],
    datas = [];

  $ = go.GraphObject.make;

  json.nodeDataArray.forEach(item => {
    if (item.category === 'Number' || item.category === 'Model') {
      points.push(item.pt);
      datas[item.pt] = 0;
    }
  });

  json.linkDataArray.forEach((item, index) => {
    if (item.pt) {
      points.push(item.pt);
      datas[item.pt] = 0;
    }
  });

  // 1.创建视图
  myDiagram = $(go.Diagram, 'myDiagramDiv', {
    initialAutoScale: go.Diagram.Uniform, // 缩放到适合视图的比例
    initialContentAlignment: go.Spot.TopCenter, // 确保文档在视图窗口的顶部正中心
    'toolManager.mouseWheelBehavior': go.ToolManager.WheelZoom
  });

  // 2.编辑样式
  //  myDiagram.nodeTemplateMap.add() 添加节点模板的样式; 接口返回的数据中，category与此时设置nodeTemplateMap的name对应

  // 创建视图的六个区域的模板显示
  myDiagram.nodeTemplateMap.add(
    'Area',
    $(
      go.Node,
      'Vertical',
      {
        locationSpot: go.Spot.Center
        // layerName: "Background",
        // selectionAdorned: false // 调节图形大小去边框
      },
      new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      $(
        go.Shape,
        {
          name: 'SHAPE',
          strokeWidth: 1,
          stroke: '#9E9E9E',
          strokeMiterLimit: 5,
          strokeDashArray: [4, 4],
          width: 40,
          height: 40,
          figure: 'RoundedRectangle',
          fill: 'rgba(21,101,192,0.1)',
          opacity: 0.1
        },
        new go.Binding('strokeWidth', 'strokeWidth'),
        new go.Binding('width', 'width'),
        new go.Binding('height', 'height'),
        new go.Binding('stroke', 'stroke'),
        new go.Binding('fill', 'stroke'),
        new go.Binding('strokeDashArray', 'strokeDashArray')
      )
    )
  );

  // 文本模板的显示
  myDiagram.nodeTemplateMap.add(
    'Text',
    $(
      go.Node,
      'Auto',
      {
        locationSpot: go.Spot.Center
        // layerName: "Background",
        // selectionAdorned: false // 调节图形大小去边框
      },
      new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),

      $(
        go.TextBlock,
        'defaultText',
        {
          stroke: 'grey',
          font: 'bold 16pt helvetica, bold arial, sans-serif'
        },
        new go.Binding('font'),
        new go.Binding('stroke'),
        new go.Binding('text')
      )
    )
  );

  // 数字模板的显示
  myDiagram.nodeTemplateMap.add(
    'Number',
    $(
      go.Node,
      'Auto',
      {
        locationSpot: go.Spot.Center,
        layerName: 'Background',
        selectionAdorned: false
      },
      new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      $(
        go.TextBlock,
        {
          stroke: 'grey',
          font: 'bold 16pt helvetica, bold arial, sans-serif'
        },
        new go.Binding('text', 'text'),
        new go.Binding('stroke', 'stroke'),
        new go.Binding('font', 'font'),
        new go.Binding('pt', 'pt')
      )
    )
  );

  // 电路图中icon的显示
  myDiagram.nodeTemplateMap.add(
    'Model',
    $(
      go.Node,
      'Spot',
      {
        locationSpot: go.Spot.Center,
        // layerName: "Background",
        // selectionAdorned: false,
        // resizable: true,
        rotateObjectName: 'icon',
        locationObjectName: 'main'
      },
      new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),

      $(
        go.Panel,
        'Auto',
        $(
          go.Shape,
          'RoundedRectangle',
          {
            name: 'main',
            stroke: null,
            strokeWidth: 0,
            fill: 'rgba(158,158,158,0.2)'
          },
          new go.Binding('width', 'iconSize').makeTwoWay(),
          new go.Binding('height', 'iconSize').makeTwoWay()
        ),
        $(
          go.Shape,
          {
            angle: 0,
            name: 'icon',
            width: 1,
            height: 1,
            stroke: '#9E9E9E',
            strokeWidth: 0.5,
            fill: '#9E9E9E'
          },
          new go.Binding('fill', 'color'),
          new go.Binding('stroke', 'color'),
          new go.Binding('angle'),
          new go.Binding('width', 'svgSize'),
          new go.Binding('height', 'svgSize'),
          new go.Binding('geometry', 'icon', geoname => {
            var geo = icons[geoname];
            if (typeof geo === 'string') {
              geo = icons[geoname] = go.Geometry.parse(geo, true);
            }
            return geo;
          })
        )
      )
    )
  );

  // todo: 设置click模板的显示

  // 设置link的样式
  myDiagram.linkTemplate = $(
    go.Link,
    {
      selectionAdorned: false,
      layerName: 'Background',
      routing: go.Link.Orthogonal,
      corner: 10,
      curve: go.Link.JumpGap
    },
    new go.Binding('points').makeTwoWay(),
    $(
      go.Shape,
      {
        isPanelMain: true,
        stroke: '#9E9E9E',
        strokeWidth: 6
      },
      new go.Binding('strokeWidth', 'strokeWidth'),
      new go.Binding('stroke', 'runColor')
    ),
    $(go.Shape, {
      isPanelMain: true,
      stroke: '#E0E0E0',
      strokeWidth: 4,
      name: 'PIPE',
      strokeDashArray: [12, 24]
    })
  );

  // 处理category === Number的数据
  points.map((item, index) => {
    datas[item] = dataArray[index];
  });

  // function infoString(obj) {
  //     var part = obj.part;
  //     if (part instanceof go.Adornment) part = part.adornedPart;
  //     var msg = "";
  //     if (part instanceof go.Link) {
  //         msg = "";
  //     } else if (part instanceof go.Node) {
  //         msg = part.data.text + ":\n\n" + part.data.description;
  //     }
  //     return msg;
  // }

  // function geoFunc(geoname) {
  //     var geo = icons[geoname];
  //     if (typeof geo === "string") {
  //         geo = icons[geoname] = go.Geometry.parse(geo, true);
  //     }
  //     return geo;
  // }

  // 3.创建model
  // 为model赋值的两种方式
  // 方式一
  myDiagram.model = go.Model.fromJson(json);

  /* json中，
        category === 'area'表示样式中数据展示的几个区块。 
        category === 'model'表示
        category === 'number'表示需要数字显示的项
        category === text 表示需要以文字显示的项
        category === 'click'要和category === 'text'联合使用，实现点击
        */

  // 方式二
  // let myModel = $(go.GraphLinksModel)
  // myModel.nodeDataArray = json.nodeDataArray
  // myModel.linkDataArray = json.linkDataArray
  // myDiagram.model = myModel

  console.log(44555, myDiagram.nodes);

  // 4.完成视图和model的绑定后,调用接口进行数据填充.
  myDiagram.nodes.each(node => {
    if (node.category === 'Number') {
      myDiagram.model.set(node.part.data, 'text', datas[node.part.data.pt]);
    } else if (node.category === 'Model') {
      myDiagram.model.set(
        node.part.data,
        'color',
        datas[node.part.data.pt]
          ? node.part.data.runColor
          : node.part.data.stopColor
      );
    }
  });

  // 5.根据数据对link样式进行动态设置
  function makePIPERun() {
    myDiagram.links.each(link => {
      let shape = link.findObject('PIPE');
      if (!shape) return;
      let offset = shape.strokeDashOffset;
      let number = datas[link.part.data.pt];

      if (number > 0) {
        offset -= 3;
      }
      if (number < 0) {
        offset += 3;
      }
      myDiagram.model.set(
        link.part.data,
        'runColor',
        number ? link.part.data.color : '#9E9E9E'
      );
      shape.strokeDashOffset = offset > 0 ? offset : 100;
    });
    setTimeout(() => {
      makePIPERun();
    }, 100);
  }

  makePIPERun();
};

export default loginController;
