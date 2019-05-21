<style scoped>
wheelNone::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>

<template>
  <div>
    <div id="diagramDiv" class="wheelNone" @click="hide" :style="size"></div>
    <v-navigation-drawer
      flat
      class="elevation-4"
      style="border-radius:10px"
      right
      width="720"
      v-model="drawer"
      absolute
    >
      <v-toolbar flat dense>
        <v-btn icon @click.native="drawer = false">
          <v-icon>close</v-icon>
        </v-btn>
        <v-toolbar-title class="text-xs-center">{{deviceName}}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <model :drawer="!drawer" :id="deviceID"></model>
    </v-navigation-drawer>
    <cmd ref="cmd"></cmd>
  </div>
</template>

<script >
import Cmd from "../common/Cmd.vue";
import Model from "../model/Dialog.vue";
import icons from "./goIcon.js";
import go from "gojs";
export default {
  name: "ViewGraph",
  data() {
    return {
      deviceID: null,
      deviceName: null,
      // drawerWidth: 400,
      showYt: false,
      points: [],
      datas: {},
      id: null,
      $: null,
      myDiagram: null,
      showAction: false,
      drawer: false,
      timer: null,
      device: [],
      device1: []
    };
  },
  computed: {
    dark: function() {
      return this.$store.getters.getDark;
    },
    size() {
      var s = this.$store.getters.windowSize;
      return {
        width: "100%",
        height: s.y - 112 + "px"
      };
    }
  },
  methods: {
    openDialog(item, mode) {
      this.$store.commit("pin", true);
      this.$store.dispatch("appOpenDialog", {
        title: item ? item.name : "新建",
        path: item.path,
        id: item ? item.pt : "",
        mode: mode
      });
    },
    cmd(tag, item) {
      item.sid = this.sid;
      item.dev = this.dev;
      this.$refs.cmd.$emit("cmd", tag, item);
    },
    realTimeUpdates() {
      this.$axios
        .put("/api/realtimes", {
          data: this.points
        })
        .then(res => {
          for (var i = 0; i < this.points.length; i++) {
            this.datas[this.points[i]] = res.data[i];
          }
        });
    },
    updateModels() {
      this.myDiagram.nodes.each(node => {
        switch (node.category) {
          case "Number":
            if (node.part.data.pt) {
              this.myDiagram.model.set(
                node.part.data,
                "text",
                this.datas[node.part.data.pt]
              );
            }
            break;
          case "Model":
            if (
              this.datas[node.part.data.pt] == 0 ||
              this.datas[node.part.data.pt] == undefined
            ) {
              this.myDiagram.model.set(
                node.part.data,
                "color",
                node.part.data.stopColor
              );
              return;
            }
            this.myDiagram.model.set(
              node.part.data,
              "color",
              node.part.data.runColor
            );
            break;
        }
      });
    },
    update() {
      for (var i = 0; i < this.device[0].items.length; i++) {
        var v = Math.random() * 100;
        this.device[0].items[i].value = v.toFixed(2);
      }
      for (i = 0; i < this.device1[0].items.length; i++) {
        if (Math.random() * 10 > 1) {
          this.device1[0].items[i].value = "red";
        } else {
          this.device1[0].items[i].value = "green";
        }
      }
    },
    close() {
      this.drawer = false;
      this.showAction = false;
    },
    hide() {
      if (this.showAction == true) {
        this.showAction = false;
      }
    },
    load() {
      this.$axios.get("/api/graphs/" + this.id).then(res => {
        if (res.data.error) {
          return;
        }
        this.myDiagram.model = go.Model.fromJson(res.data.modelData);
        var nodeDataArray = this.myDiagram.model.nodeDataArray;
        var linkDataArray = this.myDiagram.model.linkDataArray;
        for (let i = 0; i < nodeDataArray.length; i++) {
          switch (nodeDataArray[i].category) {
            case "Number":
              if (nodeDataArray[i].pt == null) break;
              this.points.push(nodeDataArray[i].pt);
              this.datas[nodeDataArray[i].pt] = 0;
              break;
            case "Model":
              if (nodeDataArray[i].pt == null) break;
              this.points.push(nodeDataArray[i].pt);
              this.datas[nodeDataArray[i].pt] = 0;
              break;
          }
        }
        for (let i = 0; i < linkDataArray.length; i++) {
          if (linkDataArray[i].pt == null) continue;
          this.points.push(linkDataArray[i].pt);
          this.datas[linkDataArray[i].pt] = 0;
        }
        return;
      });
    },
    loop(down) {
      clearTimeout(this.timer);
      var diagram = this.myDiagram;
      this.timer = setTimeout(() => {
        // var oldskips = diagram.skipsUndoManager
        diagram.skipsUndoManager = true;
        diagram.links.each(link => {
          var shape = link.findObject("PIPE");
          if (shape == null) {
            return;
          }

          let val = this.datas[link.part.data.pt];

          var off = shape.strokeDashOffset;
          if (val > 0.00001) {
            off -= 3;
            this.myDiagram.model.set(
              link.part.data,
              "runColor",
              link.part.data.color
            );
          } else if (val < -0.00001) {
            off += 3;
            this.myDiagram.model.set(
              link.part.data,
              "runColor",
              link.part.data.color
            );
          } else {
            this.myDiagram.model.set(link.part.data, "runColor", "#9E9E9E");
          }

          // animate (move) the stroke dash
          shape.strokeDashOffset = off <= 0 ? 60 : off;
        });
        // diagram.skipsUndoManager = oldskips
        this.loop(down);
      }, 100);
    }
  },
  mounted() {
    this.timer = setInterval(this.update, 1100);
    this.id = this.$route.params.id;
    this.$ = go.GraphObject.make;
    var $ = this.$;
    // var showLinkLabel = this.showLinkLabel
    var myDiagram = $(
      go.Diagram,
      "diagramDiv", // create a Diagram for the DIV HTML element
      {
        initialAutoScale: go.Diagram.Uniform,
        allowSelect: false,
        isReadOnly: true,
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        "animationManager.isEnabled": false,
        initialContentAlignment: go.Spot.Center // center the content
      }
    );

    this.myDiagram = myDiagram;
    this.myDiagram.addDiagramListener("BackgroundSingleClicked", () => {
      this.drawer = false;
    });

    myDiagram.nodeTemplateMap.add(
      "Model",
      $(
        go.Node,
        "Spot",
        {
          locationSpot: go.Spot.Center,
          layerName: "Background",
          selectionAdorned: false,
          resizable: true,
          rotateObjectName: "icon",
          locationObjectName: "main"
        },
        new go.Binding("location", "pos", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),

        $(
          go.Panel,
          "Auto",
          $(
            go.Shape,
            "RoundedRectangle",
            {
              name: "main",
              stroke: null,
              strokeWidth: 0,
              fill: "rgba(158,158,158,0.2)"
            },
            new go.Binding("width", "iconSize").makeTwoWay(),
            new go.Binding("height", "iconSize").makeTwoWay()
          ),
          $(
            go.Shape,
            {
              angle: 0,
              name: "icon",
              width: 1,
              height: 1,
              stroke: "#9E9E9E",
              strokeWidth: 0.5,
              fill: "#9E9E9E"
            },
            new go.Binding("fill", "color"),
            new go.Binding("stroke", "color"),
            new go.Binding("angle"),
            new go.Binding("width", "svgSize"),
            new go.Binding("height", "svgSize"),
            new go.Binding("geometry", "icon", geoname => {
              var geo = icons[geoname];
              if (typeof geo === "string") {
                geo = icons[geoname] = go.Geometry.parse(geo, true);
              }
              return geo;
            })
          )
        )
      )
    );

    myDiagram.nodeTemplateMap.add(
      "Area",
      this.$(
        go.Node,
        "Vertical",
        {
          locationSpot: go.Spot.Center,
          layerName: "Background",
          selectionAdorned: false // 调节图形大小去边框
        },
        new go.Binding("location", "pos", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        this.$(
          go.Shape,
          {
            name: "SHAPE",
            strokeWidth: 1,
            stroke: "#9E9E9E",
            strokeMiterLimit: 5,
            strokeDashArray: [4, 4],
            width: 40,
            height: 40,
            figure: "RoundedRectangle",
            fill: "rgba(21,101,192,0.1)",
            opacity: this.dark ? 0.3 : 0.04
          },
          new go.Binding("strokeWidth", "strokeWidth"),
          new go.Binding("width", "width"),
          new go.Binding("height", "height"),
          new go.Binding("stroke", "stroke"),
          new go.Binding("fill", "stroke"),
          new go.Binding("strokeDashArray", "strokeDashArray")
        )
      )
    );

    myDiagram.nodeTemplateMap.add(
      "Click",
      this.$(
        go.Node,
        "Vertical",
        {
          locationSpot: go.Spot.Center,
          selectionAdorned: false // 调节图形大小去边框
        },
        new go.Binding("location", "pos", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        this.$(
          go.Shape,
          {
            name: "SHAPE",
            strokeWidth: 1,
            stroke: "#9E9E9E",
            strokeMiterLimit: 5,
            strokeDashArray: [4, 4],
            width: 40,
            height: 40,
            figure: "RoundedRectangle",
            fill: "rgba(21,101,192,0.1)"
          },
          // new go.Binding('strokeDashArray', 'strokeDashArray'),
          new go.Binding("width", "width"),
          new go.Binding("height", "height"),
          {
            click: (e, node) => {
              let delay = 50;
              if (this.drawer == true) {
                this.drawer = false;
                delay = 500;
              }
              if (node.part.data.tag == "device") {
                this.deviceID = node.part.data.pt;
              }
              setTimeout(() => {
                if (node.part.data.tag == "jump") {
                  this.openDialog(node.part.data, 2);
                }
                if (node.part.data.tag == "device") {
                  this.drawer = true;
                  this.deviceName = node.part.data.name;
                }
                if (node.part.data.tag == "point") {
                  let tag = null;
                  let item = {};
                  item.name = node.part.data.name;
                  let arr = node.part.data.pt.split(/[_: ]/);
                  item.id = Number(arr[3]);
                  item.dev = arr[2];
                  item.sid = arr[1];
                  switch (arr[0]) {
                    case "dt":
                      tag = "yt";
                      break;
                    case "dk":
                      tag = "yk";
                      break;
                    case "do":
                      tag = "sc";
                      break;
                  }
                  this.$refs.cmd.$emit("cmd", tag, item);
                }
              }, delay);
            },
            cursor: "pointer" //改变鼠标样式变成小手
          }
        )
      )
    );

    myDiagram.nodeTemplateMap.add(
      "Connect",
      this.$(
        go.Node,
        "Auto",
        {
          locationSpot: go.Spot.Center,
          selectionAdorned: false
        },
        new go.Binding("location", "pos", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        $(
          go.Panel,
          "Auto",
          this.$(go.Shape, "RoundedRectangle", {
            portId: "",
            fromLinkable: true,
            fromSpot: go.Spot.AllSides,
            toLinkable: true,
            toSpot: go.Spot.AllSides,
            name: "SHAPE",
            stroke: "rgba(160,160,160,0.3)",
            strokeWidth: 2,
            strokeMiterLimit: 5,
            width: 8,
            height: 8,
            fill: "rgba(160,160,160,0.6)"
          })
        )
      )
    );

    myDiagram.nodeTemplateMap.add(
      "Text",
      $(
        go.Node,
        "Auto", // the Shape will go around the TextBlock
        {
          locationSpot: go.Spot.Center,
          layerName: "Background",
          selectionAdorned: false
        },
        new go.Binding("location", "pos", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        $(
          go.TextBlock,
          {
            stroke: "grey",
            font: "bold 16pt helvetica, bold arial, sans-serif"
          },
          new go.Binding("text", "text"),
          new go.Binding("stroke", "stroke"),
          new go.Binding("font", "font")
        )
      )
    );

    myDiagram.nodeTemplateMap.add(
      "Number",
      $(
        go.Node,
        "Auto",
        {
          locationSpot: go.Spot.Center,
          layerName: "Background",
          selectionAdorned: false
        },
        new go.Binding("location", "pos", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        $(
          go.TextBlock,
          {
            stroke: "grey",
            font: "bold 16pt helvetica, bold arial, sans-serif"
          },
          new go.Binding("text", "text"),
          new go.Binding("stroke", "stroke"),
          new go.Binding("font", "font"),
          new go.Binding("pt", "pt")
        )
      )
    );

    myDiagram.linkTemplate = $(
      go.Link,
      {
        selectionAdorned: false,
        layerName: "Background",
        routing: go.Link.Orthogonal,
        corner: 10,
        curve: go.Link.JumpGap
      },
      new go.Binding("points").makeTwoWay(),
      $(
        go.Shape,
        {
          isPanelMain: true,
          stroke: "#9E9E9E",
          strokeWidth: 6
        },
        new go.Binding("strokeWidth", "strokeWidth"),
        new go.Binding("stroke", "runColor")
      ),
      $(go.Shape, {
        isPanelMain: true,
        stroke: "#E0E0E0",
        strokeWidth: 4,
        name: "PIPE",
        strokeDashArray: [12, 24]
      })
    );

    this.load();
    this.timer2 = setInterval(this.realTimeUpdates, 1200);
    this.timer3 = setInterval(this.updateModels, 1300);
    this.loop(1, true);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.timer2);
    clearInterval(this.timer3);
    this.myDiagram.clear();
  },
  components: {
    Cmd,
    Model
  }
};
</script>
