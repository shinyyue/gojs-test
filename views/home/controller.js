import {
    gzip
} from "zlib";
import {
    Spot
} from "gojs";

const homeController = function () {

    // 制作一张空白画图区域,并绑定到id="myDiagramDiv"的dom节点上
    const $ = go.GraphObject.make

    // 视图
    const myDiagram = $(go.Diagram, "myDiagramDiv", {
        // 允许使用ctrl z, ctrl+y 再撤回
        "undoManager.isEnabled": true,
        // initialAutoScale: go.Diagram.Uniform, // 初始化视图时缩放到合适图表
        autoScale: go.Diagram.Uniform, // 始终缩放到适配图表大小。
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        // 布局树的另一种写法， 第一种见下方
        // layout: $(go.TreeLayout, {
        //     angle: 90, // 从上向下流动
        //     layerSpacing: 40
        // })
    })

    // myDiagram.nodeTemplate = $(go.Part, {
    //         // locationSpot: go.Spot.Center
    //     },
    //     new go.Binding('location', 'loc', go.Point.parse),
    //     $(go.TextBlock, {}, new go.Binding('text', 'key'))
    // )

    // myDiagram.model.nodeDataArray = [{
    //         key: "Alpha",
    //         loc: "0 0"
    //     },
    //     {
    //         key: "Beta",
    //         loc: "100 50"
    //     }
    // ];

    /* myDiagram.nodeTemplate =
        $(go.Part, // no links or grouping, so use the simpler Part class instead of Node
            {
                locationSpot: go.Spot.Center,
                locationObjectName: "SHAPE",
                layerName: "Background",
                mouseOver: function (e, obj) {
                    showPoint(obj.part.location);
                },
                click: function (e, obj) {
                    showPoint(obj.part.location);
                }
            },
            new go.Binding("location", "loc"),
            $(go.Shape, "PlusLine", {
                name: "SHAPE",
                width: 8,
                height: 8
            }),
            $(go.TextBlock, {
                    position: new go.Point(6, 6),
                    font: "8pt sans-serif"
                },
                new go.Binding("text", "loc"))
        );

    myDiagram.model.nodeDataArray = [{
            loc: "0 0"
        },
        {
            loc: "100 0"
        },
        {
            loc: "100 50"
        }
    ];

    function showPoint(loc) {
        var docloc = myDiagram.transformDocToView(loc);
        var elt = document.getElementById("Message1");
        elt.textContent = "Selected node location,\ndocument coordinates: " + loc.x.toFixed(2) + " " + loc.y.toFixed(2) +
            "\nview coordinates: " + docloc.x.toFixed(2) + " " + docloc.y.toFixed(2);
    } */

    // 布局树
    // myDiagram.layout = $(go.TreeLayout, {
    //     // angle: 90, // 从上向下流动
    //     layerSpacing: 40
    // })

    // 数据
    // let myModel = $(go.Model)

    // linkModel
    let myModel = $(go.GraphLinksModel)

    // treeModel
    // let myModel = $(go.TreeModel)

    myDiagram.nodeTemplate =
        $(go.Node, 'Vertical', {
                background: '#f2f2f2',
                locationSpot: go.Spot.Center
            },
            new go.Binding('location', 'loc'),
            $(go.TextBlock, 'default text',
                new go.Binding('text', 'key')
            )
        )


    // 数据集
    myModel.nodeDataArray = [{
        key: "Alpha",
        loc: "0 0"
    }, {
        key: "Beta",
        loc: "250 40"
    }, {
        key: "Gamma",
        loc: "100 0"
    }, {
        key: "Delta",
        loc: "75 50"
    }, {
        key: "Epsilon",
        loc: "150 30"
    }];

    /**
     * 节点间的连接: 仅限于GraphLinkModel
     */
    myModel.linkDataArray = [{
        from: 'Alpha',
        to: 'Gamma',
        // routing: go.Link.Orthogonal
    }, {
        from: 'Beta',
        to: 'Gamma',
        // routing: go.Link.Orthogonal
    }, {
        from: 'Beta',
        to: 'Delta'
    }]

    // 无指向的link方式
    myDiagram.linkTemplate =

        $(go.Link, {
                // routing: go.Link.Orthogonal,
                routing: go.Link.AvoidsNodes,
                curve: go.Link.JumpGap,
                // corner: 4
            },
            $(go.Shape, {
                isPanelMain: true,
                strokeWidth: 10,
                stroke: 'pink'
            }),
            // new go.Binding('routing'),
            $(go.Shape, {
                // strokeWidth: 2
                isPanelMain: true,
                stroke: 'red'
            }),

            // $(go.Shape, {
            //     toArrow: 'standard'
            // })
        )
    // $(go.Link,
    //     // 默认的连接
    //     $(go.Shape),
    //     // 默认连接加箭头
    //     $(go.Shape, {
    //         toArrow: 'OpenTriangle',
    //         fill: null
    //     })
    // )

    myDiagram.model = myModel

    // var tool = myDiagram.toolManager.linkingTool;

    // tool.startObject = 




    // node模板的定制: 有六个属性;
    // 1.属性TextBlock; 其中text属性和数据集nodeDataArray的指定key绑定,控制文本显示
    // 2: 设置pannel type; 控制一个节点中,文本与其他内容的排列方式
    // 3: 设置locationSpot等属性
    // 4: binding location
    // 5: 设置shape
    /* myDiagram.nodeTemplate =
        $(go.Node, "Vertical", // second argument of a Node/Panel can be a Panel type
            // set Node properties here
            { // the Node.location point will be at the center of each node
                locationSpot: go.Spot.Center
            },

            // 添加绑定
            // example Node binding sets Node.location to the value of Node.data.loc
            new go.Binding("location", "loc"),

            // this Shape will be vertically above the TextBlock
            // 添加样式与GraphObject的绑定, 可以和数据集的fig属性绑定,修改样式
            $(go.Shape,
                "RoundedRectangle", // string argument can name a predefined figure
                {
                    // set Shape properties here
                },
                // example Shape binding sets Shape.figure to the value of Node.data.fig
                new go.Binding("figure", "fig")
            ),

            $(go.TextBlock,
                "default text", // string argument can be initial text string
                {
                    // set TextBlock properties here
                },
                // example TextBlock binding sets TextBlock.text to the value of Node.data.key
                new go.Binding("text", "name"))
        ); */


    // 水平pannel type, 可在节点内插入图片，并设置图片样式；以及默认数据显示
    // myDiagram.nodeTemplate = $(go.Node,
    //     'Horizontal', {
    //         background: '#f2f2f2'
    //     },
    //     $(go.Picture, {
    //             background: 'red',
    //             margin: 10,
    //             width: 50,
    //             height: 50
    //         },
    //         new go.Binding('source')
    //     ),
    //     $(go.TextBlock, 'default text', {
    //         margin: 12,
    //         stroke: "white",
    //         font: "bold 16px sans-serif"
    //     }, new go.Binding('text', 'name'))
    // )

    // 连接模板 link template
    // myDiagram.linkTemplate = $(go.Link, {
    //     routing: go.Link.OrientMinus90,
    //     corner: 10
    // }, $(go.Shape, {
    //     strokeWidth: 3,
    //     stroke: '#555'
    // }))




    /* GraphObject是一个JavaScript对象，可以用与任何其他对象相同的方式构造和初始化。
     Node是一个GraphObject，它包含GraphObjects，如TextBlocks，Shapes，Pictures和Panels，
     可能包含更多GraphObjects。一个非常简单的Node可能包含Shape和TextBlock。 */


    /* 
    // 定制一个简单的node
     var node = new go.Node(go.Panel.Auto)
     var shape = new go.Shape()
     var textBlock = new go.TextBlock()

     shape.figure = 'RoundedRectangle'
     shape.fill = 'lightblue'
     node.add(shape)

     textBlock.text = 'hello'
     textBlock.margin = 10
     node.add(textBlock)

     myDiagram.add(node) */


    // 为diagram添加一个node
    const violentFill = $(go.Brush, 'Linear', {
        0.0: 'Violet',
        1.0: 'Lavender'
    })

    // myDiagram.add(
    //     $(go.Node, 'Auto',
    //         $(go.Shape, 'RoundedRectangle', {
    //             // fill: 'lightBlue'
    //             fill: violentFill
    //         }),
    //         $(go.TextBlock, 'world', {
    //             margin: 5
    //         })
    //     )
    // )

    /* myDiagram.add(
        $(go.Node, 'Auto',
            $(go.Shape, {
                fill: violentFill
            }),
            $(go.TextBlock, 'aaaaaaaaaaaaa', {
                margin: 5,
                maxLines: 1,
                width: 40,
                overflow: go.TextBlock.OverflowEllipsis,
                editable: true
            })
        ))
 */
    /* myDiagram.add(
        $(go.Part, go.Panel.Position, {
                background: 'lightgray'
            },
            $(go.TextBlock, 'default position', {
                background: 'lightgreen'
            }),
            $(go.TextBlock, "(100, 0)", {
                position: new go.Point(100, 0),
                background: "lightgreen"
            }),
        ),

    )
 */
    /* myDiagram.add(
        // all Parts are Panels
        $(go.Part, go.Panel.Position, // or "Position"
            {
                background: "lightgray"
            },
            $(go.TextBlock, "default, at (0,0)", {
                background: "lightgreen"
            }),
            $(go.TextBlock, "(100, 0)", {
                position: new go.Point(100, 0),
                background: "lightgreen"
            }),
            $(go.TextBlock, "(0, 100)", {
                position: new go.Point(0, 100),
                background: "lightgreen"
            }),
            $(go.TextBlock, "(55, 28)", {
                position: new go.Point(55, 28),
                background: "lightgreen"
            }),
            $(go.TextBlock, "(33, 70)", {
                position: new go.Point(33, 70),
                background: "lightgreen"
            }),
            $(go.TextBlock, "(100, 100)", {
                position: new go.Point(100, 100),
                background: "lightgreen"
            })
        )); */

    // myDiagram.add(
    // $(go.Part, 'position', {
    //     background: 'lightgray',
    // }, $(go.Shape, 'Rectangle', {
    //     width: 100,
    //     row: 4,
    //     column: 0,
    //     fill: 'red'
    // })),


    /* $(go.Part,
        $(go.Panel, 'Table', {
                defaultAlignment: go.Spot.Left
            },
            $(go.RowColumnDefinition, {
                column: 0,
                width: 200
            }),
            $(go.RowColumnDefinition, {
                column: 1,
                width: 15
            }),
            $(go.Shape, "Rectangle", {
                row: 0,
                column: 0,
                fill: "green",
                stretch: go.GraphObject.Fill
            }),
            $(go.TextBlock, {
                row: 0,
                column: 2,
                text: "stretch: Fill, no minSize, no maxSize"
            }),
            $(go.Shape, "Rectangle", {
                row: 1,
                column: 0,
                fill: "red",
                stretch: go.GraphObject.Fill,
                minSize: new go.Size(150, 10)
            }),
            $(go.TextBlock, {
                row: 1,
                column: 2,
                text: "stretch: Fill, min: 150x10"
            }),
            $(go.Shape, "Rectangle", {
                row: 2,
                column: 0,
                fill: "yellow",
                stretch: go.GraphObject.Fill,
                maxSize: new go.Size(50, 300)
            }),
            $(go.TextBlock, {
                row: 2,
                column: 2,
                text: "stretch: Fill, max: 50x300"
            }),
            $(go.Shape, "Rectangle", {
                row: 3,
                column: 0,
                fill: "red",
                stretch: go.GraphObject.Fill,
                minSize: new go.Size(150, 10),
                maxSize: new go.Size(50, 300)
            }),
            $(go.TextBlock, {
                row: 3,
                column: 2,
                text: "stretch: Fill, min: 150x10, max: 50x300"
            }),
            $(go.Shape, "Rectangle", {
                row: 4,
                column: 0,
                fill: "red",
                width: 100,
                stretch: go.GraphObject.Fill
            }),
            $(go.TextBlock, {
                row: 4,
                column: 2,
                text: "desired width & stretch: ignore stretch"
            })
        )) */

    // 将多个graphobject连接起来的方法原理： 
    /* 通过GraghLinksModel把nodeDataArry和linkDataArray连接。 通过binding将nodeTemplate和nodeDateArray绑定 */




    // myDiagram.model = myModel
}

export default homeController