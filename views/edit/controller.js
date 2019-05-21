import go from 'gojs';
import icons from '../../goIcon';
import GuidedDraggingTool from '../../utils/go_guidedgragtool'

const controller = function ($scope) {

  $scope.$ = null
  $scope.diagram = null
  $scope.currentNode = null
  $scope.currentText = ''
  $scope.checkedColor = ''


  let diagram, $, palette;
  $ = go.GraphObject.make;




  /* diagram========== */
  diagram = $(go.Diagram, 'editDiagram', {
    draggingTool: new GuidedDraggingTool(),
    // 允许滚轮控制缩放
    "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
    initialAutoScale: go.Diagram.Uniform,
    // 设置可撤销和回复撤销
    'undoManager.isEnabled': true,
    // 设置后用户可拖动单个的连接（palette中单独的连接）
    'draggingTool.dragsLink': true,
    // 根据网格显示标尺？？
    'draggingTool.isGridSnapEnabled': true,
    // 用户可以重新链接(不加这个属性的话，单个的连接没办法识别node的端口)
    'relinkingTool.isUnconnectedLinkValid': true,
    'relinkingTool.portGravity': 20,
    // 设置重新连接的开始端的样式
    "relinkingTool.fromHandleArchetype": $(go.Shape, "Diamond", {
      segmentIndex: 0,
      cursor: "pointer",
      desiredSize: new go.Size(8, 8),
      fill: "tomato",
      stroke: "darkred"
    }),
    "relinkingTool.toHandleArchetype": $(go.Shape, "Diamond", {
      segmentIndex: -1,
      cursor: "pointer",
      desiredSize: new go.Size(8, 8),
      fill: "tomato",
      stroke: "darkred"
    }),
    // 避免将连接的两端连接到同一个节点上
    'linkingTool.portGravity': 20,
    // 设置后不需要验证结束点是否连接到了端点上
    // "linkingTool.isUnconnectedLinkValid": true,
    "linkReshapingTool.handleArchetype": $(go.Shape, "Diamond", {
      desiredSize: new go.Size(7, 7),
      fill: "lightblue",
      stroke: "deepskyblue"
    }),
    // 旋转
    "rotatingTool.handleAngle": 270,
    "rotatingTool.handleDistance": 30,
    "rotatingTool.snapAngleMultiple": 15,
    "rotatingTool.snapAngleEpsilon": 15,
    grid: $(
      go.Panel,
      'Grid',
      $(go.Shape, 'LineH', {
        stroke: '#f2f2f2',
        strokeWidth: 0.5
      }),
      $(go.Shape, 'LineV', {
        stroke: '#f2f2f2',
        strokeWidth: 0.5
      }),
      $(go.Shape, 'LineH', {
        stroke: 'lightgray',
        strokeWidth: 0.5,
        interval: 10
      }),
      $(go.Shape, 'LineV', {
        stroke: 'lightgray',
        strokeWidth: 0.5,
        interval: 10
      })
    )
  });

  let diagramInitModel = {
    'class': 'go.GraphLinksModel',
    'linkFromPortIdProperty': 'fromPort',
    'linkToPortIdProperty': 'toPort',
    'nodeDataArray': [],
    'linkDataArray': []
  }

  diagram.model = go.Model.fromJson(diagramInitModel)
  $scope.$ = $
  $scope.diagram = diagram

  // 设置缩放的样式模板
  let nodeResizeAdornmentTemplate =
    $(go.Adornment, 'Spot', {
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


  // 设置旋转的配置
  let nodeRotateAdornmentTemplate =
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
  // 设置节点被选中时的状态
  let nodeSelectionAdornmentTemplate =
    $(go.Adornment, "Auto",
      $(go.Shape, {
        fill: null,
        stroke: "deepskyblue",
        strokeWidth: 1.5,
        strokeDashArray: [4, 2]
      }),
      $(go.Placeholder)
    );
  // 设置category === 'Text'类型的节点模板
  diagram.nodeTemplateMap.add('Text',
    $(go.Node, 'Spot', {
        locationSpot: go.Spot.Center
      },
      // 记录节点的位置
      new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      $(go.TextBlock,
        new go.Binding('text', 'text'),
        new go.Binding('stroke'),
        new go.Binding('margin'),
        new go.Binding('font')
      )
    )
  );

  // 设置category === 'Model'类型的节点模板
  diagram.nodeTemplateMap.add('Model',
    $(go.Node, 'Spot', {
        locationSpot: go.Spot.Center
      },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
        resizable: true,
        resizeObjectName: "PANEL",
        resizeAdornmentTemplate: nodeResizeAdornmentTemplate
      }, {
        rotatable: true,
        rotateAdornmentTemplate: nodeRotateAdornmentTemplate
      }, {
        selectable: true,
        selectionAdornmentTemplate: nodeSelectionAdornmentTemplate
      },
      $(go.Panel, 'Auto', {
          name: "PANEL"
        },
        // 设置model节点样式
        $(go.Shape, 'RoundedRectangle', {
          fill: '#f2f2f2',
          isPanelMain: true,
          stroke: null,
          name: 'main',
          portId: ''
        }),
        $(go.Shape, {
            width: 1,
            height: 1,
            stroke: 'gray',
            strokeWidth: 0.5,
            fill: 'gray',
            name: 'icon'
          },
          new go.Binding('geometry', 'icon', (geoname) => {
            let geo = icons[geoname]
            if (typeof geo === 'string') {
              geo = icons[geoname] = go.Geometry.parse(geo, true)
            }
            return geo
          }),
          new go.Binding('strokeWidth', 'strokeWidth'),
          new go.Binding('stroke', 'color'),
          new go.Binding('fill', 'color'),
          new go.Binding('width', 'svgSize').makeTwoWay(),
          new go.Binding('height', 'svgSize').makeTwoWay(),
        )
      ),
      // 设置默认端口
      makePort("T", go.Spot.Top, true, true),
      makePort("L", go.Spot.Left, true, true),
      makePort("R", go.Spot.Right, true, true),
      makePort("B", go.Spot.Bottom, true, true), {
        mouseEnter: function (e, node) {
          showSmallPorts(node, true)
        },
        mouseLeave: function (e, node) {
          showSmallPorts(node, false);
        }
      },
    )
  );

  diagram.nodeTemplateMap.add('ImgModel',
    $(go.Node, 'Spot', {
        locationSpot: go.Spot.Center,
      },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
        resizable: true,
        resizeObjectName: "PANEL",
        resizeAdornmentTemplate: nodeResizeAdornmentTemplate
      }, {
        rotatable: true,
        rotateAdornmentTemplate: nodeRotateAdornmentTemplate
      }, {
        selectable: true,
        selectionAdornmentTemplate: nodeSelectionAdornmentTemplate
      },
      $(go.Panel, 'Auto', {
          name: "PANEL",
        },
        $(go.Picture, {
            isPanelMain: true,
            name: 'mainPic',
            portId: '',
            fromLinkable: true,
            toLinkable: true,
            cursor: 'pointer',
          },
          new go.Binding('source'),
        )
      ),

      // fixme: 此部分存在的意义：做出一块可以拖拽的区域。
      $(go.TextBlock, {
        text: '拖拽部分',
        font: "bold 12pt Helvetica, Arial, sans-serif",
        stroke: 'transparent',
        wrap: go.TextBlock.WrapFit,
        margin: 4
      }),

      // 设置默认端口
      makePort("T", go.Spot.Top, true, true),
      makePort("L", go.Spot.Left, true, true),
      makePort("R", go.Spot.Right, true, true),
      makePort("B", go.Spot.Bottom, true, true), {
        mouseEnter: function (e, node) {
          showSmallPorts(node, true)
        },
        mouseLeave: function (e, node) {
          showSmallPorts(node, false);
        }
      },
    )
  );

  diagram.nodeTemplateMap.add('TextModel',
    $(go.Node, 'Spot', {
        locationSpot: go.Spot.Center
      }, {
        resizable: true,
        resizeObjectName: "PANEL",
        resizeAdornmentTemplate: nodeResizeAdornmentTemplate
      }, {
        rotatable: true,
        rotateAdornmentTemplate: nodeRotateAdornmentTemplate
      },
      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Panel, 'Auto', {
          name: "PANEL"
        },
        // 设置model节点样式
        $(go.Shape, 'RoundedRectangle', {
          fill: '#f2f2f2',
          isPanelMain: true,
          stroke: null,
          name: 'main',
          portId: ''
        }),
        $(go.TextBlock, '文字', {
            editable: true
          },
          new go.Binding('strokeWidth'),
          new go.Binding('strokeWidth', 'strokeWidth'),
          new go.Binding('stroke'),
          new go.Binding('font'),
          new go.Binding('margin'),
          // 保证修改后的text可以和model同步
          new go.Binding("text").makeTwoWay()
        )
      ),
      // 设置默认端口
      makePort("T", go.Spot.Top, true, true),
      makePort("L", go.Spot.Left, true, true),
      makePort("R", go.Spot.Right, true, true),
      makePort("B", go.Spot.Bottom, true, true), {
        mouseEnter: function (e, node) {
          showSmallPorts(node, true)
        },
        mouseLeave: function (e, node) {
          showSmallPorts(node, false);
        }
      },
    )
  )

  var linkSelectionAdornmentTemplate =
    $(go.Adornment, "Link",
      $(go.Shape, {
        isPanelMain: true,
        fill: null,
        stroke: "deepskyblue",
        strokeWidth: 0.5
      })
    );

  // 从model出发的连线
  diagram.linkTemplate =
    $(go.Link, {
        toShortLength: 4,
        routing: go.Link.AvoidsNodes,
        corner: 5,
        curve: go.Link.JumpOver,
      }, {
        // 设置后可选中连线
        selectable: true,
        selectionAdornmentTemplate: linkSelectionAdornmentTemplate
      }, {
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true
      },
      new go.Binding("points").makeTwoWay(),
      $(go.Shape, {
          isPanelMain: true,
          stroke: 'gray',
          strokeWidth: 6,
        },
        new go.Binding('stroke', 'runColor')
      ),
      $(go.Shape, {
        stroke: '#f2f2f2',
        strokeWidth: 4,
        isPanelMain: true,
        name: 'PIPE',
        strokeDashArray: [4, 8]
      }),
      $(go.Shape, {
        toArrow: 'Standard',
        fill: 'red',
        stroke: null,
        scale: 1.5
      }), {
        click: (e, node) => {
          const link = diagram.findLinkForData(node.part.data)
        }
      }
    )

  /* palette============= */
  let paletteNodeData = [{
      category: 'ImgModel',
      source: '../../static/img/machine1.png',
      width: 121,
      height: 40,
      type: 'lengji1'
    },
    {
      category: 'ImgModel',
      source: '../../static/img/machine2.png',
      width: 52,
      height: 30,
      type: 'lengji2'
    },
    {
      category: 'ImgModel',
      source: '../../static/img/machine3.png',
      width: 52,
      height: 30,
      type: 'lengdongbeng'
    },
    {
      category: 'ImgModel',
      source: '../../static/img/machine4.png',
      width: 52,
      height: 30,
      type: 'lengdongbeng'
    },
    {
      category: 'Text',
      stroke: '#333',
      text: '文字',
      margin: 5,
      font: 'bold 16px helvetica, bold arial, sans-serif'
    }
  ];

  let paletteLinkData = [{
    runColor: 'blue',
    points: new go.List(go.Point).addAll([new go.Point(0, 0), new go.Point(0, 40), new go.Point(40, 40)])
  }, {
    runColor: 'green',
    points: new go.List(go.Point).addAll([new go.Point(0, 0), new go.Point(0, 40), new go.Point(40, 40)])
  }, {
    runColor: 'pink',
    points: new go.List(go.Point).addAll([new go.Point(0, 0), new go.Point(0, 40), new go.Point(40, 40)])
  }, {
    runColor: 'skyblue',
    points: new go.List(go.Point).addAll([new go.Point(0, 0), new go.Point(0, 40), new go.Point(40, 40)])
  }];

  palette = $(go.Palette, 'fPaletteDiv', {
    // 水平垂直方向允许有滚动条
    allowHorizontalScroll: true,
    allowVerticalScroll: true,
    model: new go.GraphLinksModel(paletteNodeData, paletteLinkData),
    nodeTemplateMap: diagram.nodeTemplateMap,
    // 
    linkTemplate: // simplify the link template, just in this Palette
      $(go.Link, { // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
          // to line up the Link in the same manner we have to pretend the Link has the same location spot
          locationSpot: go.Spot.Center,
          selectionAdornmentTemplate: $(go.Adornment, "Link", {
              locationSpot: go.Spot.Center
            },
            $(go.Shape, {
              isPanelMain: true,
              fill: null,
              stroke: "deepskyblue",
              strokeWidth: 0
            }),
            $(go.Shape, // the arrowhead
              {
                toArrow: "Standard",
                stroke: null
              })
          )
        }, {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4
        },
        new go.Binding("points"),
        $(go.Shape, {
            isPanelMain: true,
            stroke: 'gray',
            strokeWidth: 6,
          },
          new go.Binding('stroke', 'runColor')
        ),
        $(go.Shape, {
          stroke: '#f2f2f2',
          strokeWidth: 4,
          isPanelMain: true,
          name: 'PIPE',
          strokeDashArray: [4, 8]
        }),
        $(go.Shape, {
          toArrow: 'Standard',
          fill: 'red',
          stroke: null,
          scale: 1.5
        }),
      ),
  })

  // 修改palette.nodetemplateMap部分样式,注意要在model设置之后添加
  palette.nodes.each(node => {
    if (node.category === 'ImgModel') {
      node.part.maxSize = new go.Size(130, 50);
      node.part.maxSize = new go.Size(120, node.data.height / node.data.width * 120);
    }
  })


  // diagram相关设置方法
  function makePort(name, spot, output, input) {
    return $(go.Shape, 'Circle', {
      fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
      stroke: null,
      desiredSize: new go.Size(7, 7),
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
    node.ports.each(function (port) {
      if (port.portId !== "") { // don't change the default port, which is the big shape
        port.fill = show ? "rgba(0,0,0,.3)" : null;
      }
    });
  }

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

  // loop()

  /* 事件监听=========== */

  // 当选择的node发生改变时，动态修改$scope.currentNode
  /* diagram.addDiagramListener('ChangedSelection', function (e) {
    const model = e.diagram.model
    const data = model.nodeDataArray[0]
    const node = e.diagram.findPartForData(data)

    $scope.currentNode = null

    e.diagram.selection.each(sel => {
      const node = diagram.findPartForKey(sel.key)
      if (!node) return
      $scope.currentNode = node.part.data;
    })

    // todo: 直接修改currentText没用啊！！
    $scope.$apply(function () {
      $scope.currentText = $scope.currentNode ? $scope.currentNode.text : ''
    });
  }); */
  diagram.addDiagramListener('ChangedSelection', function (e) {
    $scope.$apply(() => {
      $scope.currentNode = null;
    });

    // e.diagram.selection 当前选中的所有node的集合
    if (e.diagram.selection.length > 1) return;
    e.diagram.selection.each(sel => {
      let tmpNode = null;

      // todo: 用!sel.category来判断是model自身发出的link不准确
      if (!sel.category) {
        tmpNode = {
          category: 'Link',
          runColor: 'blue',
          ...sel.data
        };
        // diagram.model.set(sel.data, 'category', 'Link');
        // diagram.model.set(sel.data, 'runColor', 'blue');
        diagram.model.set(sel, 'data', tmpNode)
      } else {
        tmpNode = sel.data;
      }

      $scope.$apply(() => {
        $scope.currentNode = tmpNode;
      });

      console.log('currentNode----', $scope.currentNode)
    });
  });

  $scope.save = () => {
    // diagram.model.modelData.position = go.Point.stringify(diagram.position)
    console.log('new model data-----', diagram.model.toJson())
  }

  $scope.$watch('checkedColor', () => {
    if (!$scope.currentNode) return
    diagram.model.setDataProperty($scope.currentNode, 'runColor', $scope.checkedColor)
    console.log(111, $scope.currentNode)
    console.log(222, diagram.findLinkForData($scope.currentNode).data)
    // diagram.findLinkForData($scope.currentNode).data.runColor = $scope.checkedColor
  })

  // 拖拽文字后修改文字
  $scope.$watch('currentText', function (newValue, oldValue) {
    if (!$scope.currentNode) return;
    diagram.model.set($scope.currentNode, 'text', $scope.currentText);
    diagram.model.set($scope.currentNode, 'font', '30px sans-serif ');
    // diagram.model.set($scope.currentNode, 'stroke', 'red');
  });

  // $scope.model = {
  //   "class": "GraphLinksModel",
  //   "nodeDataArray": [{
  //       "category": "TextModel",
  //       "text": "冷却塔",
  //       "bgSize": 40,
  //       "margin": 5,
  //       "stroke": "#333",
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -5,
  //       "loc": "-360 -150"
  //     },
  //     {
  //       "category": "TextModel",
  //       "text": "冷却塔",
  //       "bgSize": 40,
  //       "margin": 5,
  //       "stroke": "#333",
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -2,
  //       "loc": "-350 60"
  //     },
  //     {
  //       "category": "TextModel",
  //       "text": "冷却塔",
  //       "bgSize": 40,
  //       "margin": 5,
  //       "stroke": "#333",
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -3,
  //       "loc": "-360 -50"
  //     },
  //     {
  //       "category": "TextModel",
  //       "text": "冷却泵",
  //       "bgSize": 40,
  //       "margin": 5,
  //       "stroke": "#333",
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -4,
  //       "loc": "100 -170"
  //     },
  //     {
  //       "category": "TextModel",
  //       "text": "冷却泵",
  //       "bgSize": 40,
  //       "margin": 5,
  //       "stroke": "#333",
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -6,
  //       "loc": "110 80"
  //     },
  //     {
  //       "category": "TextModel",
  //       "text": "冷却泵",
  //       "bgSize": 40,
  //       "margin": 5,
  //       "stroke": "#333",
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -7,
  //       "loc": "100 -50"
  //     },
  //     {
  //       "category": "TextModel",
  //       "text": "冷机",
  //       "bgSize": 40,
  //       "margin": 5,
  //       "stroke": "#333",
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -8,
  //       "loc": "390 -170"
  //     },
  //     {
  //       "category": "TextModel",
  //       "text": "冷机",
  //       "bgSize": 40,
  //       "margin": 5,
  //       "stroke": "#333",
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -9,
  //       "loc": "390 -40"
  //     },
  //     {
  //       "category": "TextModel",
  //       "text": "冷机",
  //       "bgSize": 40,
  //       "margin": 5,
  //       "stroke": "#333",
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -10,
  //       "loc": "390 80"
  //     },
  //     {
  //       "category": "TextModel",
  //       "text": "冷冻泵",
  //       "bgSize": 40,
  //       "margin": 5,
  //       "stroke": "#333",
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -11,
  //       "loc": "650 -170"
  //     },
  //     {
  //       "category": "TextModel",
  //       "text": "冷冻泵",
  //       "bgSize": 40,
  //       "margin": 5,
  //       "stroke": "#333",
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -12,
  //       "loc": "650 -40"
  //     },
  //     {
  //       "category": "TextModel",
  //       "text": "冷冻泵",
  //       "bgSize": 40,
  //       "margin": 5,
  //       "stroke": "#333",
  //       "font": "bold 16pt helvetica, bold arial, sans-serif",
  //       "key": -13,
  //       "loc": "650 80"
  //     }
  //   ],
  //   "linkDataArray": [{
  //       "runColor": "blue",
  //       "points": [693.2564036075523, -170, 703.2564036075523, -170, 763.4437125423967, -170, 763.4437125423967, -254.5377064573683, 763.4437125423967, -339.0754129147366, 763.4437125423967, -349.0754129147366],
  //       "from": -11
  //     },
  //     {
  //       "runColor": "blue",
  //       "points": [690.2564036075523, -39.99999999999999, 700.2564036075523, -39.99999999999999, 764.8048104774086, -39.99999999999999, 764.8048104774086, -186.42176786562612, 764.8048104774086, -332.84353573125225, 764.8048104774086, -342.84353573125225],
  //       "from": -12
  //     },
  //     {
  //       "runColor": "blue",
  //       "points": [690.2564036075523, 80, 700.2564036075523, 80, 764.8048104774086, 80, 764.8048104774086, -332.84353573125225, 761.7021540454516, -332.84353573125225, 761.7021540454516, -342.84353573125225],
  //       "from": -13
  //     },
  //     {
  //       "runColor": "green",
  //       "points": [419.59141032141963, -170, 429.59141032141963, -170, 514.6675033569336, -170, 514.6675033569336, -170, 599.7435963924476, -170, 609.7435963924476, -170],
  //       "from": -8,
  //       "to": -11
  //     },
  //     {
  //       "runColor": "green",
  //       "points": [419.59141032141963, -39.99999999999999, 429.59141032141963, -39.99999999999999, 514.6675033569336, -39.99999999999999, 514.6675033569336, -39.99999999999999, 599.7435963924476, -39.99999999999999, 609.7435963924476, -39.99999999999999],
  //       "from": -9,
  //       "to": -12
  //     },
  //     {
  //       "runColor": "green",
  //       "points": [419.59141032141963, 80, 429.59141032141963, 80, 514.6675033569336, 80, 514.6675033569336, 80, 599.7435963924476, 80, 609.7435963924476, 80],
  //       "from": -10,
  //       "to": -13
  //     },
  //     {
  //       "runColor": "green",
  //       "points": [505.73299840899637, -356.8054896750589, 505.73299840899637, -346.8054896750589, 505.73299840899637, -273.3080733350312, 390, -273.3080733350312, 390, -199.81065699500357, 390, -189.81065699500357],
  //       "to": -8
  //     },
  //     {
  //       "runColor": "green",
  //       "points": [507.7618590758914, -352.2945038625984, 507.7618590758914, -342.2945038625984, 507.7618590758914, -340, 507.7618590758914, -340, 507.7618590758914, 19.546735521329197, 390, 19.546735521329197, 390, 50.189343004996424, 390, 60.189343004996424],
  //       "to": -10
  //     },
  //     {
  //       "runColor": "green",
  //       "points": [504.95733430100717, -110.76483462086617, 494.95733430100717, -110.76483462086617, 390, -110.76483462086617, 390, -90.28774580793487, 390, -69.81065699500357, 390, -59.81065699500357],
  //       "to": -9
  //     },
  //     {
  //       "runColor": "green",
  //       "points": [360.4085896785804, -170, 350.4085896785804, -170, 250.3324966430664, -170, 250.3324966430664, -170, 150.25640360755241, -170, 140.25640360755241, -170],
  //       "from": -8,
  //       "to": -4
  //     },
  //     {
  //       "runColor": "green",
  //       "points": [363.4085896785804, -47.71904239215155, 353.4085896785804, -47.71904239215155, 251.8324966430664, -47.71904239215155, 251.8324966430664, -49.99999999999999, 150.25640360755241, -49.99999999999999, 140.25640360755241, -49.99999999999999],
  //       "to": -7
  //     },
  //     {
  //       "runColor": "green",
  //       "points": [360.4085896785804, 80, 350.4085896785804, 80, 255.3324966430664, 80, 255.3324966430664, 80, 160.2564036075524, 80, 150.2564036075524, 80],
  //       "from": -10,
  //       "to": -6
  //     },
  //     {
  //       "runColor": "pink",
  //       "points": [59.74359639244759, -170, 49.74359639244759, -170, -89.09692197477295, -170, -89.09692197477295, -49.99999999999999, -309.74359639244756, -49.99999999999999, -319.74359639244756, -49.99999999999999],
  //       "from": -4,
  //       "to": -3
  //     },
  //     {
  //       "runColor": "pink",
  //       "points": [59.74359639244759, -49.99999999999999, 49.74359639244759, -49.99999999999999, -129.99999999999997, -49.99999999999999, -129.99999999999997, -49.99999999999999, -309.74359639244756, -49.99999999999999, -319.74359639244756, -49.99999999999999],
  //       "from": -7,
  //       "to": -3
  //     },
  //     {
  //       "runColor": "pink",
  //       "points": [69.74359639244759, 80, 59.743596392447586, 80, -89.09692197477295, 80, -89.09692197477295, -49.99999999999999, -309.74359639244756, -49.99999999999999, -319.74359639244756, -49.99999999999999],
  //       "from": -6,
  //       "to": -3
  //     },
  //     {
  //       "runColor": "pink",
  //       "points": [-144.53500675907617, -49.498289985985025, -154.53500675907617, -49.498289985985025, -215.81254433889455, -49.498289985985025, -215.81254433889455, -150, -309.74359639244756, -150, -319.74359639244756, -150],
  //       "to": -5
  //     },
  //     {
  //       "runColor": "pink",
  //       "points": [-212.73569076468232, -56.81065699500357, -212.73569076468232, -46.81065699500357, -212.73569076468232, 56.220752406166646, -254.73964357856494, 56.220752406166646, -296.74359639244756, 56.220752406166646, -306.74359639244756, 56.220752406166646],
  //       "to": -2
  //     },
  //     {
  //       "runColor": "skyblue",
  //       "points": [-400.2564036075524, -147, -410.2564036075524, -147, -410.2564036075524, -119.18934300499642, 390, -119.18934300499642, 390, -137.18934300499643, 390, -147.18934300499643],
  //       "from": -5,
  //       "to": -8
  //     },
  //     {
  //       "runColor": "skyblue",
  //       "points": [320.4085896785804, -116.56065699500357, 320.4085896785804, -106.56065699500357, 320.4085896785804, 8.97928163011062, 390, 8.97928163011062, 390, -10.189343004996417, 390, -20.189343004996417],
  //       "to": -9
  //     },
  //     {
  //       "runColor": "skyblue",
  //       "points": [320.4085896785804, -6.560656995003569, 320.4085896785804, 3.439343004996431, 320.4085896785804, 129.30165547359348, 390, 129.30165547359348, 390, 109.81065699500357, 390, 99.81065699500357],
  //       "to": -10
  //     }
  //   ]
  // }

  // diagram.model = go.Model.fromJson($scope.model);
};

export default controller;