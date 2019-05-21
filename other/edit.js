import go from 'gojs';

import icons from '../goIcon';

const controller = function ($scope) {
  // 设置侧边菜单
  $scope.modelOption = [{
    name: '功能',
    id: 'fPaletteDiv',
    style: 'width:100%;height:400px'
  }];

  $scope.currentText = '文字';
  $scope.currentNode = null;
  $scope.showToolTip = false;

  /* 实现功能：
    1. 完成组件的显示
    2. 点击操作可编辑  
*/

  let $ = go.GraphObject.make;
  let diagram = $(go.Diagram, 'editDiagram', {
    autoScale: go.Diagram.Uniform,
    initialContentAlignment: go.Spot.Center,
    'undoManager.isEnabled': true, // 允许撤销操作
    // linkingTool 设置鼠标连接两个端点
    // relinkingtool 允许用户重新连接
    // 可连接单独的连接
    'draggingTool.dragsLink': true,
    'draggingTool.isGridSnapEnabled': true,
    'linkingTool.isUnconnectedLinkValid': true,
    'relinkingTool.isUnconnectedLinkValid': true,
    'relinkingTool.fromHandleArchetype': $(go.Shape, 'Diamond', {
      segmentIndex: 0,
      cursor: 'pointer',
      desiredSize: new go.Size(8, 8),
      fill: 'lightblue',
      stroke: 'lightblue'
    }),
    'relinkingTool.toHandleArchetype': $(go.Shape, 'Diamond', {
      segmentIndex: -1,
      cursor: 'pointer',
      desiredSize: new go.Size(8, 8),
      fill: 'darkred',
      stroke: 'tomato'
    }),
    'linkReshapingTool.handleArchetype': $(go.Shape, 'Diamond', {
      desiredSize: new go.Size(7, 7),
      fill: 'lightblue',
      stroke: 'deepskyblue'
    }),
    // 'rotatingTool.handleAngle': 270,
    // 'rotatingTool.handleDistance': 30,
    // 'rotatingTool.snapAngleMultiple': 15,
    // 'rotatingTool.snapAngleEpsilon': 15,
    // 设置网格样式
    grid: $(
      go.Panel,
      'Grid',
      $(go.Shape, 'LineH', {
        stroke: 'lightgray',
        strokeWidth: 0.5
      }),
      $(go.Shape, 'LineV', {
        stroke: 'lightgray',
        strokeWidth: 0.5
      }),
      $(go.Shape, 'LineH', {
        stroke: 'gray',
        strokeWidth: 0.5,
        interval: 10
      }),
      $(go.Shape, 'LineV', {
        stroke: 'gray',
        interval: 10,
        strokeWidth: 0.5
      })
    )
  });

  $scope.diagram = diagram

  diagram.linkTemplate = $(
    go.Link, {
      selectionAdorned: false,
      layerName: 'Background',
      routing: go.Link.Orthogonal,
      corner: 10,
      curve: go.Link.JumpGap, // 连线正交
      routing: go.Link.AvoidsNodes // 避开节点
    },
    // 使得连线可编辑
    {
      relinkableFrom: true,
      relinkableTo: true,
      reshapable: true
    },
    new go.Binding('points').makeTwoWay(),
    $(
      go.Shape, {
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
    }),
    $(go.Shape, {
      toArrow: 'Standard',
      fill: 'red',
      stroke: null,
      scale: 1.5
    }), {
      click: (e, node) => {
        console.log('click link--------', e, node)
        diagram.link.set(node, 'runColor', 'pink')
      }
    }
  );

  var nodeSelectionAdornmentTemplate =
    $(go.Adornment, "Auto",
      $(go.Shape, {
        fill: null,
        stroke: "deepskyblue",
        strokeWidth: 1.5,
        strokeDashArray: [4, 2]
      }),
      $(go.Placeholder)
    );

  var nodeResizeAdornmentTemplate =
    $(go.Adornment, "Spot", {
        locationSpot: go.Spot.Right
      },
      $(go.Placeholder),
      $(go.Shape, {
        alignment: go.Spot.TopLeft,
        cursor: "nw-resize",
        desiredSize: new go.Size(6, 6),
        fill: "lightblue",
        stroke: "deepskyblue"
      }),
      $(go.Shape, {
        alignment: go.Spot.Top,
        cursor: "n-resize",
        desiredSize: new go.Size(6, 6),
        fill: "lightblue",
        stroke: "deepskyblue"
      }),
      $(go.Shape, {
        alignment: go.Spot.TopRight,
        cursor: "ne-resize",
        desiredSize: new go.Size(6, 6),
        fill: "lightblue",
        stroke: "deepskyblue"
      }),

      $(go.Shape, {
        alignment: go.Spot.Left,
        cursor: "w-resize",
        desiredSize: new go.Size(6, 6),
        fill: "lightblue",
        stroke: "deepskyblue"
      }),
      $(go.Shape, {
        alignment: go.Spot.Right,
        cursor: "e-resize",
        desiredSize: new go.Size(6, 6),
        fill: "lightblue",
        stroke: "deepskyblue"
      }),

      $(go.Shape, {
        alignment: go.Spot.BottomLeft,
        cursor: "se-resize",
        desiredSize: new go.Size(6, 6),
        fill: "lightblue",
        stroke: "deepskyblue"
      }),
      $(go.Shape, {
        alignment: go.Spot.Bottom,
        cursor: "s-resize",
        desiredSize: new go.Size(6, 6),
        fill: "lightblue",
        stroke: "deepskyblue"
      }),
      $(go.Shape, {
        alignment: go.Spot.BottomRight,
        cursor: "sw-resize",
        desiredSize: new go.Size(6, 6),
        fill: "lightblue",
        stroke: "deepskyblue"
      })
    );

  var nodeRotateAdornmentTemplate =
    $(go.Adornment, {
        locationSpot: go.Spot.Center,
        locationObjectName: "CIRCLE"
      },
      $(go.Shape, "Circle", {
        name: "CIRCLE",
        cursor: "pointer",
        desiredSize: new go.Size(7, 7),
        fill: "lightblue",
        stroke: "deepskyblue"
      }),
      $(go.Shape, {
        geometryString: "M3.5 7 L3.5 30",
        isGeometryPositioned: true,
        stroke: "deepskyblue",
        strokeWidth: 1.5,
        strokeDashArray: [4, 2]
      })
    );

  diagram.nodeTemplateMap.add(
    'Text',
    $(
      go.Node,
      $(
        go.TextBlock,
        new go.Binding('text', 'text'),
        new go.Binding('stroke'),
        new go.Binding('font'),
        new go.Binding('margin')
      ),
      // 记录位置， 并将pos的格式转化为'1 10 20 30'
      new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ), {
        click: (e, node) => {
          // $scope.showToolTip = !$scope.showToolTip
          $scope.currentNode = node.part.data;
        }
      }
    )
  );

  diagram.nodeTemplateMap.add(
    'Model',
    $(
      go.Node,
      'Spot', {
        layerName: 'Background',
        locationSpot: go.Spot.Center,
        locationObjectName: 'main',
        rotatable: true,
        rotateObjectName: 'icon',
      },
      // 记录位置
      new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ), {
        resizable: true,
        resizeObjectName: "PANEL",
        resizeAdornmentTemplate: nodeResizeAdornmentTemplate
      },
      $(
        go.Panel,
        'Auto',
        $(
          go.Shape,
          'RoundedRectangle', {
            name: 'main',
            stroke: null,
            strokeWidth: 0,
            angle: 0,
            fill: 'rgba(158,158,158,0.4)'
          },
          new go.Binding('width', 'iconSize').makeTwoWay(),
          new go.Binding('height', 'iconSize').makeTwoWay()
        ),
        // $(
        //   go.Shape, {
        //     angle: 0,
        //     name: 'icon',
        //     width: 1,
        //     height: 1,
        //     stroke: '#9E9E9E',
        //     strokeWidth: 0.5,
        //     fill: '#9E9E9E'
        //   },
        //   new go.Binding('fill', 'color'),
        //   new go.Binding('stroke', 'color'),
        //   new go.Binding('angle').makeTwoWay(),
        //   new go.Binding('width', 'svgSize').makeTwoWay(),
        //   new go.Binding('height', 'svgSize').makeTwoWay(),
        //   new go.Binding('geometry', 'icon', geoname => {
        //     var geo = icons[geoname];
        //     if (typeof geo === 'string') {
        //       geo = icons[geoname] = go.Geometry.parse(geo, true);
        //     }
        //     return geo;
        //   })
        // )
      ),
      /* {
                click: (e, node) => {
                    let delay = 50;
                    if (this.showAction == true || this.showClick == true) {
                        this.confirm();
                        delay = 500;
                    }
                    setTimeout(() => {
                        this.nodePartData = node.part.data;
                        this.showOption = "graph";
                        this.showAction = true;
                        if (this.nodePartData.pt && this.nodePartData.name) {
                            let ob = {};
                            ob.name = this.nodePartData.name;
                            ob.id = this.nodePartData.pt;
                            this.newPoint = ob;
                        }
                        this.runColor = this.nodePartData.runColor;
                        this.stopColor = this.nodePartData.stopColor;
                        this.modelScale = this.nodePartData.iconSize;
                        // this.tool = false
                    }, delay);
                },
                cursor: "pointer" //改变鼠标样式变成小手
            }, */
      makePort('T', go.Spot.Top, true, true),
      makePort('L', go.Spot.Left, true, true),
      makePort('R', go.Spot.Right, true, true),
      makePort('B', go.Spot.Bottom, true, true), {
        mouseEnter: (e, node) => {
          showSmallPorts(node, true);
        },
        mouseLeave: (e, node) => {
          showSmallPorts(node, false);
        }
      }
    )
  );

  // 创建右侧palette
  $(go.Palette, 'fPaletteDiv', {
    allowHorizontalScroll: false,
    allowVerticalScroll: false,
    nodeTemplateMap: diagram.nodeTemplateMap,
    linkTemplate: $(
      go.Link, {
        locationSpot: go.Spot.Center,
        layerName: 'Background',
        selectionAdornmentTemplate: $(
          go.Adornment,
          'Link', {
            locationSpot: go.Spot.Center
          },
          $(go.Shape, {
            isPanelMain: true,
            fill: '#9E9E9E',
            stroke: '#9E9E9E',
            strokeWidth: 6
          }),
          $(
            go.Shape, // the arrowhead
            {
              toArrow: 'Standard',
              stroke: 'red'
            }
          )
        )
      }, {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpGap,
        corner: 10,
        toShortLength: 4
      },
      new go.Binding('points'),
      $(
        go.Shape, // the link path shape
        {
          isPanelMain: true,
          stroke: '#9E9E9E',
          strokeWidth: 2
        }
      ),
      $(
        go.Shape, // the arrowhead
        {
          toArrow: 'Standard',
          fill: '#9E9E9E',
          stroke: '#9E9E9E'
        }
      )
    ),
    model: new go.GraphLinksModel(
      [{
          category: 'Text',
          stroke: '#333',
          text: '文字',
          margin: 5,
          font: 'bold 12pt helvetica, bold arial, sans-serif'
        },
        {
          category: 'Model',
          icon: 'peidiangui',
          svgSize: 32,
          iconSize: 60,
          runColor: 'red',
          stopColor: '#9E9E9E'
        },
        {
          category: 'Model',
          icon: 'diankongfa',
          svgSize: 32,
          iconSize: 60,
          runColor: 'blue',
          stopColor: '#9E9E9E'
        },
        {
          category: 'Model',
          icon: 'nibianqi',
          svgSize: 32,
          iconSize: 60,
          runColor: 'green',
          stopColor: '#9E9E9E'
        },
        {
          category: 'Model',
          icon: 'chongdianzhuang',
          svgSize: 32,
          iconSize: 60,
          runColor: 'green',
          stopColor: '#9E9E9E'
        }
      ],
      [{
        points: new go.List(go.Point).addAll([
          new go.Point(0, 0),
          new go.Point(0, 30),
          new go.Point(30, 30)
        ])
      }]
    )
  });

  // 拖拽文字后修改文字
  $scope.$watch('currentText', function (newValue, oldValue) {
    if (!$scope.currentNode) return;
    diagram.model.set($scope.currentNode, 'text', $scope.currentText);
    diagram.model.set($scope.currentNode, 'font', 'normal 30px sans-serif ');
    diagram.model.set($scope.currentNode, 'stroke', 'red');
  });

  $scope.model = {
    "class": "GraphLinksModel",
    "nodeDataArray": [{
        "category": "Model",
        "icon": "peidiangui",
        "svgSize": 32,
        "iconSize": 60,
        "runColor": "red",
        "stopColor": "#9E9E9E",
        "key": -2,
        "pos": "-389.5000000000001 -528.0000000000002"
      },
      {
        "category": "Text",
        "stroke": "#333",
        "text": "冷却塔",
        "margin": 5,
        "font": "bold 14pt helvetica, bold arial, sans-serif",
        "key": -1,
        "pos": "-421.9999999999996 -536.9999999999994"
      },
      {
        "category": "Model",
        "icon": "peidiangui",
        "svgSize": 32,
        "iconSize": 60,
        "runColor": "red",
        "stopColor": "#9E9E9E",
        "key": -3,
        "pos": "-388.3037285767502 -418.7850856929992"
      },
      {
        "category": "Text",
        "stroke": "#333",
        "text": "冷却塔",
        "margin": 5,
        "font": "bold 14pt helvetica, bold arial, sans-serif",
        "key": -4,
        "pos": "-422.9999999999999 -429.1776285394989"
      },
      {
        "category": "Model",
        "icon": "peidiangui",
        "svgSize": 32,
        "iconSize": 60,
        "runColor": "red",
        "stopColor": "#9E9E9E",
        "key": -5,
        "pos": "-387.5 -316"
      },
      {
        "category": "Text",
        "stroke": "#333",
        "text": "冷却塔",
        "margin": 5,
        "font": "bold 14pt helvetica, bold arial, sans-serif",
        "key": -6,
        "pos": "-421.9999999999996 -333.00000000000006"
      },
      {
        "category": "Model",
        "icon": "peidiangui",
        "svgSize": 32,
        "iconSize": 60,
        "runColor": "red",
        "stopColor": "#9E9E9E",
        "key": -7,
        "pos": "-90.568536 -550.9022640000001"
      },
      {
        "category": "Model",
        "icon": "peidiangui",
        "svgSize": 32,
        "iconSize": 60,
        "runColor": "red",
        "stopColor": "#9E9E9E",
        "key": -8,
        "pos": "-88.65912000000009 -418.90941599999996"
      },
      {
        "category": "Model",
        "icon": "peidiangui",
        "svgSize": 32,
        "iconSize": 60,
        "runColor": "red",
        "stopColor": "#9E9E9E",
        "key": -9,
        "pos": "-88.8700592319999 -254.04324920102408"
      },
      {
        "category": "Text",
        "stroke": "#333",
        "text": "冷却泵",
        "margin": 5,
        "font": "bold 12pt helvetica, bold arial, sans-serif",
        "key": -10,
        "pos": "-117.29678399999995 -561.9022640000001"
      },
      {
        "category": "Text",
        "stroke": "#333",
        "text": "冷却泵",
        "margin": 5,
        "font": "bold 12pt helvetica, bold arial, sans-serif",
        "key": -12,
        "pos": "-116.07814534474215 -271.1382550450137"
      },
      {
        "category": "Text",
        "stroke": "#333",
        "text": "冷却泵",
        "margin": 5,
        "font": "bold 12pt helvetica, bold arial, sans-serif",
        "key": -13,
        "pos": "-116.56853599999994 -432.90941599999996"
      },
      {
        "category": "Model",
        "icon": "peidiangui",
        "svgSize": 32,
        "iconSize": 60,
        "runColor": "red",
        "stopColor": "#9E9E9E",
        "key": -14,
        "pos": "103.63051200000007 -550.9999999999999"
      },
      {
        "category": "Model",
        "icon": "peidiangui",
        "svgSize": 32,
        "iconSize": 60,
        "runColor": "red",
        "stopColor": "#9E9E9E",
        "key": -15,
        "pos": "103.7210960000001 -418.99284800000004"
      },
      {
        "category": "Model",
        "icon": "nibianqi",
        "svgSize": 32,
        "iconSize": 60,
        "runColor": "green",
        "stopColor": "#9E9E9E",
        "key": -16,
        "pos": "106.44567999999992 -255.7079999999999"
      },
      {
        "category": "Text",
        "stroke": "#333",
        "text": "冷机",
        "margin": 5,
        "font": "bold 12pt helvetica, bold arial, sans-serif",
        "key": -17,
        "pos": "81.44934400000011 -563.9094159999999"
      },
      {
        "category": "Text",
        "stroke": "#333",
        "text": "冷机",
        "margin": 5,
        "font": "bold 12pt helvetica, bold arial, sans-serif",
        "key": -19,
        "pos": "87.59543199999996 -268.29959199999996"
      },
      {
        "category": "Text",
        "stroke": "#333",
        "text": "冷机",
        "margin": 5,
        "font": "bold 12pt helvetica, bold arial, sans-serif",
        "key": -20,
        "pos": "82.63051200000007 -430.63051200000007"
      },
      {
        "category": "Model",
        "icon": "peidiangui",
        "svgSize": 32,
        "iconSize": 60,
        "runColor": "red",
        "stopColor": "#9E9E9E",
        "key": -21,
        "pos": "332.36400000000003 -551"
      },
      {
        "category": "Model",
        "icon": "diankongfa",
        "svgSize": 32,
        "iconSize": 60,
        "runColor": "blue",
        "stopColor": "#9E9E9E",
        "key": -22,
        "pos": "334.57658400000014 -418.175664"
      },
      {
        "category": "Model",
        "icon": "chongdianzhuang",
        "svgSize": 32,
        "iconSize": 60,
        "runColor": "green",
        "stopColor": "#9E9E9E",
        "key": -23,
        "pos": "337.1199999999999 -256.367736"
      },
      {
        "category": "Text",
        "stroke": "#333",
        "text": "冷冻泵",
        "margin": 5,
        "font": "bold 12pt helvetica, bold arial, sans-serif",
        "key": -24,
        "pos": "305.8520000000001 -564.7319999999999"
      },
      {
        "category": "Text",
        "stroke": "#333",
        "text": "冷冻泵",
        "margin": 5,
        "font": "bold 12pt helvetica, bold arial, sans-serif",
        "key": -25,
        "pos": "307.39541600000007 -270.517488"
      },
      {
        "category": "Text",
        "stroke": "#333",
        "text": "冷冻泵",
        "margin": 5,
        "font": "bold 12pt helvetica, bold arial, sans-serif",
        "key": -26,
        "pos": "302.24199999999996 -432.29400000000004"
      },
      {
        "category": "Model",
        "icon": "peidiangui",
        "svgSize": 32,
        "iconSize": 60,
        "runColor": "red",
        "stopColor": "#9E9E9E",
        "key": -27,
        "pos": "488 -731"
      },
      {
        "category": "Model",
        "icon": "nibianqi",
        "svgSize": 32,
        "iconSize": 60,
        "runColor": "green",
        "stopColor": "#9E9E9E",
        "key": -28,
        "pos": "420.18885502584055 -149.13571162490075"
      }
    ],
    "linkDataArray": [{
        "from": -14,
        "to": -21,
        "points": [133.63051200000007, -550.9999999999999, 143.63051200000007, -550.9999999999999, 217.99725600000005, -550.9999999999999, 217.99725600000005, -551, 292.36400000000003, -551, 302.36400000000003, -551]
      },
      {
        "from": -14,
        "to": -7,
        "points": [73.63051200000007, -550.9999999999999, 63.63051200000007, -550.9999999999999, 6.530988000000036, -550.9999999999999, 6.530988000000036, -550.9022640000001, -50.568535999999995, -550.9022640000001, -60.568535999999995, -550.9022640000001]
      },
      {
        "points": [237.74731200000008, -741.5971200000004, 237.74731200000008, -731.5971200000004, 237.74731200000008, -715.7469886358589, 212.50775801028226, -715.7469886358589, 212.50775801028226, -328.53960134104994, 106.44567999999992, -328.53960134104994, 106.44567999999992, -295.7079999999999, 106.44567999999992, -285.7079999999999],
        "to": -16
      },
      {
        "from": -16,
        "to": -23,
        "points": [136.44567999999992, -255.7079999999999, 146.44567999999992, -255.7079999999999, 220.7828399999999, -255.7079999999999, 220.7828399999999, -256.367736, 295.1199999999999, -256.367736, 305.1199999999999, -256.367736]
      },
      {
        "from": -23,
        "to": -27,
        "points": [369.1199999999999, -256.367736, 379.1199999999999, -256.367736, 488, -256.367736, 488, -473.68386799999996, 488, -691, 488, -701]
      },
      {
        "from": -22,
        "to": -27,
        "points": [364.57658400000014, -418.175664, 374.57658400000014, -418.175664, 488, -418.175664, 488, -554.5878319999999, 488, -691, 488, -701]
      },
      {
        "to": -27,
        "points": [362.0738879999999, -555.107256, 362.0738879999999, -565.107256, 362.0738879999999, -554.0166720000001, 488, -554.0166720000001, 488, -691, 488, -701]
      },
      {
        "from": -15,
        "to": -22,
        "points": [135.7210960000001, -418.99284800000004, 145.7210960000001, -418.99284800000004, 220.14884000000012, -418.99284800000004, 220.14884000000012, -418.175664, 294.57658400000014, -418.175664, 304.57658400000014, -418.175664]
      },
      {
        "points": [210.4827120000001, -486.4004640000003, 200.4827120000001, -486.4004640000003, 103.7210960000001, -486.4004640000003, 103.7210960000001, -472.6966560000002, 103.7210960000001, -458.99284800000004, 103.7210960000001, -448.99284800000004],
        "to": -15
      },
      {
        "points": [209.154122307001, -629.2669680000004, 199.154122307001, -629.2669680000004, 103.63051200000007, -629.2669680000004, 103.63051200000007, -610.1334840000002, 103.63051200000007, -590.9999999999999, 103.63051200000007, -580.9999999999999],
        "to": -14
      },
      {
        "from": -15,
        "to": -8,
        "points": [71.7210960000001, -418.99284800000004, 61.7210960000001, -418.99284800000004, 6.530988000000008, -418.99284800000004, 6.530988000000008, -418.90941599999996, -48.65912000000009, -418.90941599999996, -58.65912000000009, -418.90941599999996]
      },
      {
        "from": -16,
        "to": -9,
        "points": [76.44567999999992, -255.7079999999999, 66.44567999999992, -255.7079999999999, 8.78781038400001, -255.7079999999999, 8.78781038400001, -254.04324920102408, -48.8700592319999, -254.04324920102408, -58.8700592319999, -254.04324920102408]
      },
      {
        "points": [-120.568536, -550.9022640000001, -130.568536, -550.9022640000001, -164.26980067052506, -550.9022640000001, -164.26980067052506, -418.78508569299925, -348.3037285767502, -418.78508569299925, -358.3037285767502, -418.78508569299925],
        "from": -7,
        "to": -3
      },
      {
        "points": [-118.65912000000009, -418.90941599999996, -128.6591200000001, -418.90941599999996, -238.48142428837514, -418.90941599999996, -238.48142428837514, -418.78508569299925, -348.3037285767502, -418.78508569299925, -358.3037285767502, -418.78508569299925],
        "from": -8,
        "to": -3
      },
      {
        "points": [-118.8700592319999, -254.04324920102408, -128.8700592319999, -254.04324920102408, -166.87725782402543, -254.04324920102408, -166.87725782402543, -418.78508569299925, -348.3037285767502, -418.78508569299925, -358.3037285767502, -418.78508569299925],
        "from": -9,
        "to": -3
      },
      {
        "points": [-235.97487239178594, -418.49687313681363, -245.97487239178594, -418.49687313681363, -296.737436195893, -418.49687313681363, -296.737436195893, -528.0000000000002, -347.5000000000001, -528.0000000000002, -357.5000000000001, -528.0000000000002],
        "to": -2
      },
      {
        "points": [-246.40470100578756, -417.19314456006344, -256.40470100578756, -417.19314456006344, -301.95235050289375, -417.19314456006344, -301.95235050289375, -316, -347.5, -316, -357.5, -316],
        "to": -5
      },
      {
        "from": -2,
        "to": -14,
        "points": [-421.5000000000001, -528.0000000000003, -431.5000000000001, -528.0000000000003, -453.69754470906906, -528.0000000000003, -453.69754470906906, -165.57352924727513, 10.429828614001508, -165.57352924727513, 10.429828614001508, -550.9999999999999, 63.63051200000007, -550.9999999999999, 73.63051200000007, -550.9999999999999]
      },
      {
        "points": [9.126100037251376, -344.1843442620523, 19.126100037251376, -344.1843442620523, 103.7210960000001, -344.1843442620523, 103.7210960000001, -361.5885961310262, 103.7210960000001, -378.99284800000004, 103.7210960000001, -388.99284800000004],
        "to": -15
      },
      {
        "points": [15.644742921002376, -189.04064362877875, 25.644742921002376, -189.04064362877875, 106.44567999999992, -189.04064362877875, 106.44567999999992, -202.37432181438933, 106.44567999999992, -215.7079999999999, 106.44567999999992, -225.7079999999999],
        "to": -16
      }
    ]
  }
  // $scope.model = {
  //   "class": "GraphLinksModel",
  //   "nodeDataArray": [{
  //       "category": "Model",
  //       "icon": "peidiangui",
  //       "svgSize": 32,
  //       "iconSize": 40,
  //       "runColor": "red",
  //       "stopColor": "#9E9E9E",
  //       "key": -3,
  //       "pos": "-40 -90"
  //     },
  //     {
  //       "category": "Model",
  //       "icon": "diankongfa",
  //       "svgSize": 32,
  //       "iconSize": 40,
  //       "runColor": "blue",
  //       "stopColor": "#9E9E9E",
  //       "key": -4,
  //       "pos": "-160 10"
  //     },
  //     {
  //       "category": "Model",
  //       "icon": "diankongfa",
  //       "svgSize": 32,
  //       "iconSize": 40,
  //       "runColor": "blue",
  //       "stopColor": "#9E9E9E",
  //       "key": -5,
  //       "pos": "90 30"
  //     },
  //     {
  //       "category": "Model",
  //       "icon": "nibianqi",
  //       "svgSize": 32,
  //       "iconSize": 40,
  //       "runColor": "green",
  //       "stopColor": "#9E9E9E",
  //       "key": -6,
  //       "pos": "-260 130"
  //     },
  //     {
  //       "category": "Model",
  //       "icon": "nibianqi",
  //       "svgSize": 32,
  //       "iconSize": 40,
  //       "runColor": "green",
  //       "stopColor": "#9E9E9E",
  //       "key": -7,
  //       "pos": "-30 130"
  //     },
  //     {
  //       "category": "Model",
  //       "icon": "nibianqi",
  //       "svgSize": 32,
  //       "iconSize": 40,
  //       "runColor": "green",
  //       "stopColor": "#9E9E9E",
  //       "key": -8,
  //       "pos": "180 130"
  //     },
  //     {
  //       "category": "Text",
  //       "stroke": "#333",
  //       "text": "发电机",
  //       "margin": 5,
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -1,
  //       "pos": "-76.00000000000001 -67.99999999999994"
  //     },
  //     {
  //       "category": "Text",
  //       "stroke": "#333",
  //       "text": "水箱",
  //       "margin": 5,
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -9,
  //       "pos": "-190 -40"
  //     },
  //     {
  //       "category": "Text",
  //       "stroke": "#333",
  //       "text": "水箱",
  //       "margin": 5,
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -10,
  //       "pos": "70 -20"
  //     },
  //     {
  //       "category": "Text",
  //       "stroke": "#333",
  //       "text": "洗衣机",
  //       "margin": 5,
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -11,
  //       "pos": "-300 150"
  //     },
  //     {
  //       "category": "Text",
  //       "stroke": "#333",
  //       "text": "洗衣机",
  //       "margin": 5,
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -12,
  //       "pos": "-70 160"
  //     },
  //     {
  //       "category": "Text",
  //       "stroke": "#333",
  //       "text": "洗衣机",
  //       "margin": 5,
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -13,
  //       "pos": "150 150"
  //     }
  //   ],
  //   "linkDataArray": [{
  //       "from": -3,
  //       "to": -4,
  //       "points": [-60, -90, -70, -90, -100, -90, -100, 10, -130, 10, -140, 10]
  //     },
  //     {
  //       "from": -3,
  //       "to": -5,
  //       "points": [-20, -90, -10, -90, 25, -90, 25, 30, 60, 30, 70, 30]
  //     },
  //     {
  //       "from": -4,
  //       "to": -6,
  //       "points": [-160, 30, -160, 40, -160, 70, -260, 70, -260, 100, -260, 110]
  //     },
  //     {
  //       "from": -7,
  //       "to": -4,
  //       "points": [-50, 130, -60, 130, -95, 130, -95, 10, -130, 10, -140, 10]
  //     },
  //     {
  //       "from": -5,
  //       "to": -7,
  //       "points": [70, 30, 60, 30, 30, 30, 30, 130, 0, 130, -10, 130]
  //     },
  //     {
  //       "points": [90, 50, 90, 60, 90, 80, 180, 80, 180, 100, 180, 110],
  //       "from": -5,
  //       "to": -8
  //     }
  //   ]
  // };

  diagram.model = go.Model.fromJson($scope.model);

  // 拖拽model，为每一个node建立多个端口，并可与其他node建立连接
  // hover node出现端口

  function makePort(name, spot, output, input) {
    // the port is basically just a small transparent square
    return $(go.Shape, 'Circle', {
      fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
      stroke: null,
      desiredSize: new go.Size(4, 4),
      alignment: spot, // align the port on the main Shape
      alignmentFocus: spot, // just inside the Shape
      portId: name, // declare this object to be a "port"
      fromSpot: spot,
      toSpot: spot, // declare where links may connect at this port
      fromLinkable: output,
      toLinkable: input, // declare whether the user may draw links to/from here
      cursor: 'pointer' // show a different cursor to indicate potential link point
    });
  }

  function showSmallPorts(node, show) {
    node.ports.each(port => {
      if (port.portId !== '') {
        // don't change the default port, which is the big shape
        port.fill = show ? 'rgba(0,0,0,.3)' : null;
      }
    });
  }

  $scope.save = function () {
    // diagram.model.modelData.position = go.Point.stringify(diagram.position);
    // console.log(
    //   2223,
    //   diagram.model.modelData,
    //   go.Point.stringify(diagram.position)
    // );
    console.log('new model----', diagram.model.toJson());
  };

  function loop() {
    var diagram = $scope.diagram;
    setTimeout(function () {
      // 撤销时自动忽略
      var oldskips = diagram.skipsUndoManager;
      diagram.skipsUndoManager = true;
      diagram.links.each(function (link) {
        var shape = link.findObject('PIPE');
        var off = shape.strokeDashOffset - 3;
        shape.strokeDashOffset = off <= 0 ? 60 : off;
      });
      diagram.skipsUndoManager = oldskips;
      loop();
    }, 100);
  }
  loop();
};

export default controller;