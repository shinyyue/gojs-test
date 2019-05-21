import go from 'gojs';
import icons from '../../goIcon';

const show = function ($scope) {
  $scope.model = {
    "class": "GraphLinksModel",
    'linkFromPortIdProperty': 'fromPort',
    'linkToPortIdProperty': 'toPort',
    "nodeDataArray": [{
        "category": "Model",
        "icon": "peidiangui",
        "svgSize": 32,
        "iconSize": 60,
        "runColor": "red",
        "stopColor": "#9E9E9E",
        "key": -2,
        "pos": "-387.5 -528"
      },
      {
        "category": "Text",
        "stroke": "#333",
        "text": "冷却塔",
        "margin": 5,
        "font": "bold 14pt helvetica, bold arial, sans-serif",
        "key": -1,
        "pos": "-422 -556"
      },
      {
        "category": "Model",
        "icon": "peidiangui",
        "svgSize": 32,
        "iconSize": 60,
        "runColor": "red",
        "stopColor": "#9E9E9E",
        "key": -3,
        "pos": "-387 -424"
      },
      {
        "category": "Text",
        "stroke": "#333",
        "text": "冷却塔",
        "margin": 5,
        "font": "bold 14pt helvetica, bold arial, sans-serif",
        "key": -4,
        "pos": "-420 -452"
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
        "pos": "-422 -347"
      }
    ],
    "linkDataArray": []
  }
  $scope.diagram = null;
  $scope.$ = null;

  const $ = go.GraphObject.make;
  $scope.$ = $;

  let diagram = $(go.Diagram, 'diagramContent', {
    autoScale: go.Diagram.Uniform,
    initialAutoScale: go.Diagram.Uniform,
    isReadOnly: true,
    grid: $(
      go.Panel,
      'Grid',
      $(go.Shape, 'LineH', {
        stroke: 'lightgray',
        strokeWidth: 0.5
      }),
      $(go.Shape, 'LineH', {
        stroke: 'gray',
        strokeWidth: 0.5,
        interval: 10
      }),
      $(go.Shape, 'LineV', {
        stroke: 'lightgray',
        strokeWidth: 0.5
      }),
      $(go.Shape, 'LineV', {
        stroke: 'gray',
        strokeWidth: 0.5,
        interval: 10
      })
    )
  });

  $scope.diagram = diagram;

  let diagramInitModel = {
    'class': 'go.GraphLinksModel',
    'linkFromPortIdProperty': 'fromPort',
    'linkToPortIdProperty': 'toPort',
    'nodeDataArray': [],
    'linkDataArray': []
  }

  diagram.model = go.Model.fromJson(diagramInitModel)

  diagram.nodeTemplateMap.add(
    'Model',
    $(
      go.Node,
      'Spot', {
        locationSpot: go.Spot.Center,
        rotateObjectName: 'icon',
        locationObjectName: 'main'
      },
      // 根据pos确定位置
      // Binding第三个参数可以是一个函数，可自定义要设定的参数的值。
      // go.Point.parse 可以从go.Point.stringify生成的字符串中读取Point
      // go.Point.parse('1, 2') => new go.Point(1, 2)
      new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      $(
        go.Shape, {
          width: 1,
          height: 1,
          name: 'icon',
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
  );

  diagram.nodeTemplateMap.add(
    'Text',
    $(
      go.Node,
      'Spot', {
        locationSpot: go.Spot.Center
      },
      $(
        go.TextBlock,
        new go.Binding('text', 'text'),
        new go.Binding('margin'),
        new go.Binding('stroke'),
        new go.Binding('font')
      ),
      // 根据数据pos显示文字位置
      new go.Binding('location', 'pos', go.Point.parse).makeTwoWay(
        go.Point.stringify
      )
    )
  );

  diagram.linkTemplate = $(
    go.Link, {
      toShortLength: 10, // 连线在距离结束端口10的位置停止，可以防止箭头遮盖不住连线。
      routing: go.Link.Orthogonal,
      corner: 10,
      curve: go.Link.JumpGap // 连线时避开其他节点
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
      stroke: 'red',
      scale: 1.5
    })
  );

  diagram.model = go.Model.fromJson($scope.model);

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

export default show;