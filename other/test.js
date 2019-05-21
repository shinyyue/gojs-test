// 演示画连接
/* diagram.nodeTemplate =
    $(go.Node, 'Auto',
        $(go.Shape, 'Rectangle', {
            width: 100,
            height: 100,
            fill: 'lightgray',
            // portId: 'A'
        }),
        $(go.TextBlock, new go.Binding('text', 'key')),
        $(go.Panel, 'Table',
            $(go.Panel, "Horizontal", {
                    column: 0,
                    row: 1
                },
                $(go.Shape, // the "A" port
                    {
                        width: 6,
                        height: 6,
                        portId: "A",
                        toSpot: go.Spot.Left,
                        toLinkable: true,
                        toMaxLinks: 1
                    }), // allow user-drawn links from here
                $(go.TextBlock, "A") // "A" port label
            ),
            $(go.Panel, "Horizontal", {
                    column: 0,
                    row: 2
                },
                $(go.Shape, // the "B" port
                    {
                        width: 6,
                        height: 6,
                        portId: "B",
                        toSpot: go.Spot.Left,
                        toLinkable: true,
                        toMaxLinks: 1
                    }), // allow user-drawn links from here
                $(go.TextBlock, "B") // "B" port label
            ),
            $(go.Panel, "Horizontal", {
                    column: 2,
                    row: 1,
                    rowSpan: 2
                },
                $(go.TextBlock, "Out"), // "Out" port label
                $(go.Shape, // the "Out" port
                    {
                        width: 6,
                        height: 6,
                        portId: "Out",
                        fromSpot: go.Spot.Right,
                        fromLinkable: true
                    }) // allow user-drawn links to here
            )
        )
    )

let nodeDataArray = [{
    key: 'aa'
}, {
    key: 'bb'
}, {
    key: 'cc'
}]

let linkDataArray = []

diagram.linkTemplate =
    $(go.Link, {
            routing: go.Link.Orthogonal
        },
        $(go.Shape)
    )

diagram.model =
    $(go.GraphLinksModel, {
        linkFromPortIdProperty: "fromPort", // required information:
        linkToPortIdProperty: "toPort", // identifies data property names
        nodeDataArray: [{
                key: "Add1"
            },
            {
                key: "Add2"
            },
            {
                key: "Subtract1"
            }
        ],
        linkDataArray: [
            // no predeclared links
        ]
    }); */

// diagram.model = new go.GraphLinksModel(nodeDataArray)

// 演示网格
/*     diagram.nodeTemplate =
        $(go.Node, 'Auto', {
                resizable: true
            },
            $(go.Shape, 'Rectangle', {
                fill: 'lightgray',
                width: 100,
                height: 100
            }),

            $(go.TextBlock, 'default', {
                    margin: 5
                },
                new go.Binding('text', 'key')
            )
        )

    let nodeDataArray = [{
        key: "Alpha"
    }, {
        key: "Beta"
    }, {
        key: "Gamma"
    }];
    diagram.model = new go.GraphLinksModel(nodeDataArray); */