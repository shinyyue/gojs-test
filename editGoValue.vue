<style scoped>
wheelNone::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>

<template>
  <div>
    <div class="wheelNone" id="diagramDiv" :style="size"></div>
    <v-toolbar dense raised flat absolute style="top:42px">
      <v-text-field v-model="text" full-width placeholder="名称" required></v-text-field>
      <v-switch class="mt-4" color="error" label="全局复制" v-model="copy"></v-switch>
      <v-menu z-index="1000" offset-y transition="slide-y-transition">
        <v-btn small slot="activator" outline color="error">删除</v-btn>
        <v-card width="200" style="border-radius:10px">
          <v-card-title>
            <span class="title">
              危险操作
              <v-icon color="error">warning</v-icon>
            </span>
          </v-card-title>
          <v-card-text>
            <span class="subheading">删除后该资源将无法恢复!是否继续操作?</span>
          </v-card-text>
          <v-card-actions>
            <v-btn small @click="clear" color="error" depressed>删除</v-btn>
            <v-btn small color="grey" depressed>取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-btn small @click="save" color="primary">保存</v-btn>
      <v-toolbar-side-icon class="ml-4" @click="tool=!tool"></v-toolbar-side-icon>
    </v-toolbar>
    <v-navigation-drawer
      right
      stateless
      scollable
      absolute
      mini-variant
      v-model="tool"
      hide-overlay
      style="border-radius:6px"
    >
      <v-toolbar dense flat>
        <v-toolbar-side-icon @click="tool=!tool"></v-toolbar-side-icon>
      </v-toolbar>
      <v-expansion-panel focusable flat v-model="panel">
        <v-expansion-panel-content expand-icon flat :key="item.id" v-for="item in modelOptions">
          <div slot="header">{{item.name}}</div>
          <div :id="item.id" :style="item.style"></div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-navigation-drawer>

    <v-bottom-sheet :value="showAction" persistent hide-overlay>
      <v-card tile style="border-radius:10px">
        <v-toolbar class="pt-2">
          <picker
            class="mx-1"
            v-show="showOption=='link'"
            txt="流向"
            :point.sync="linkPoint"
            :control="false"
            :adjust="false"
          ></picker>
          <v-text-field
            class="mx-1"
            v-show="!showOption=='number'||showOption=='text'"
            v-model="info"
            solo
            label="内容"
            required
          ></v-text-field>
          <picker
            class="mx-1"
            v-show="showOption=='number'||showOption=='graph'"
            txt="实时值"
            :point.sync="newPoint"
            :control="false"
            :adjust="false"
          ></picker>
          <color-picker
            class="mx-1"
            v-show="showOption=='graph'"
            :txt="showOption=='area'?'填充色':'运行色'"
            :picker.sync="runColor"
          ></color-picker>
          <color-picker
            class="mx-1"
            v-show="showOption=='graph'"
            txt="停止色"
            :picker.sync="stopColor"
          ></color-picker>
          <color-picker class="mx-1" v-show="showOption=='link'" txt="线色" :picker.sync="lineColor"></color-picker>
          <v-overflow-btn
            class="mx-1"
            v-show="showOption=='text'||showOption=='number'"
            v-model="textScale"
            :items="textScales"
            item-text="name"
            prefix="字体大小"
            solo
            return-object
          ></v-overflow-btn>
          <color-picker
            class="mx-1"
            v-show="showOption=='text'||showOption=='number'||showOption=='area'"
            txt="颜色"
            :picker.sync="textColor"
          ></color-picker>
          <v-slider
            thumb-color="red"
            :label="'尺寸 '+modelScale+'像素'"
            color="red"
            track-color="#9E9E9E"
            class="ml-4 mt-3"
            v-show="showOption=='graph'"
            v-model="modelScale"
            :min="20"
            :max="80"
            step="20"
          ></v-slider>
          <v-slider
            thumb-color="red"
            :label=" showOption=='area'?'线宽':'尺寸'"
            color="red"
            track-color="#9E9E9E"
            class="ml-4 mt-3"
            v-show="showOption=='link'||showOption=='area'"
            v-model="linkScale"
            :min="6"
            :max="15"
            step="3"
          ></v-slider>
          <v-switch
            class="ml-4 mt-3"
            color="primary"
            v-model="lineType"
            v-show="showOption=='area'"
            label="虚线/实线"
          ></v-switch>
          <v-spacer></v-spacer>
          <v-btn flat fab class="mb-3" @click="deleteGraph">
            <v-icon color="grey">delete</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-xs-center">
          <span class="title grey--text font-weight-light">「 元件编辑 」</span>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
    <v-bottom-sheet inset :value="showClick" persistent hide-overlay>
      <v-card tile style="border-radius:10px">
        <v-toolbar class="pt-2">
          <v-overflow-btn
            v-model="label"
            v-show="showOptionMode=='jump'"
            :items="labels"
            item-text="title"
            label="菜单"
            prefix="菜单"
            return-object
            solo
          ></v-overflow-btn>
          <v-overflow-btn
            class="mx-1"
            v-show="showOptionMode=='device'"
            v-model="newDevicePoint"
            :items="deviceDatas"
            item-text="name"
            label="设备"
            solo
            hide-no-data
            return-object
          ></v-overflow-btn>
          <picker
            class="mx-1"
            v-show="showOptionMode=='point'"
            txt="控制点"
            label="控制点"
            :point.sync="newPoint"
            :analog="false"
            :redio="false"
            :energy="false"
            :compute="false"
          ></picker>
          <v-overflow-btn
            class="mx-1"
            v-show="showOptionMode=='jump'"
            v-model="newJump"
            :items="jumpDatas"
            item-text="title"
            label="图形跳转"
            solo
            hide-no-data
            return-object
          ></v-overflow-btn>
          <v-radio-group class="mt-3 mx-3" v-model="selectType" row>
            <v-radio :key="0" label="设备配置" :value="0"></v-radio>
            <v-radio :key="1" label="控点配置" :value="1"></v-radio>
            <v-radio :key="2" label="跳转配置" :value="2"></v-radio>
          </v-radio-group>
          <v-btn flat fab class="mb-3" @click="deleteGraph">
            <v-icon color="grey">delete</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="text-xs-center">
          <span class="title grey--text font-weight-light">「 点击区编辑 」</span>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>

<script>
function GuidedDraggingTool() {
  go.DraggingTool.call(this);

  // temporary parts for horizonal guidelines
  var $ = go.GraphObject.make;
  var partProperties = {
    layerName: "Tool",
    isInDocumentBounds: false
  };
  var shapeProperties = {
    stroke: "gray",
    isGeometryPositioned: true
  };
  /** @ignore */
  this.guidelineHtop = $(
    go.Part,
    partProperties,
    $(go.Shape, shapeProperties, {
      geometryString: "M0 0 100 0"
    })
  );
  /** @ignore */
  this.guidelineHbottom = $(
    go.Part,
    partProperties,
    $(go.Shape, shapeProperties, {
      geometryString: "M0 0 100 0"
    })
  );
  /** @ignore */
  this.guidelineHcenter = $(
    go.Part,
    partProperties,
    $(go.Shape, shapeProperties, {
      geometryString: "M0 0 100 0"
    })
  );
  // temporary parts for vertical guidelines
  /** @ignore */
  this.guidelineVleft = $(
    go.Part,
    partProperties,
    $(go.Shape, shapeProperties, {
      geometryString: "M0 0 0 100"
    })
  );
  /** @ignore */
  this.guidelineVright = $(
    go.Part,
    partProperties,
    $(go.Shape, shapeProperties, {
      geometryString: "M0 0 0 100"
    })
  );
  /** @ignore */
  this.guidelineVcenter = $(
    go.Part,
    partProperties,
    $(go.Shape, shapeProperties, {
      geometryString: "M0 0 0 100"
    })
  );

  // properties that the programmer can modify
  /** @type {number} */
  this._guidelineSnapDistance = 6;
  /** @type {boolean} */
  this._isGuidelineEnabled = true;
  /** @type {string} */
  this._horizontalGuidelineColor = "gray";
  /** @type {string} */
  this._verticalGuidelineColor = "gray";
  /** @type {string} */
  this._centerGuidelineColor = "gray";
  /** @type {number} */
  this._guidelineWidth = 1;
  /** @type {number} */
  this._searchDistance = 1000;
  /** @type {boolean} */
  this._isGuidelineSnapEnabled = true;
}
go.Diagram.inherit(GuidedDraggingTool, go.DraggingTool);

GuidedDraggingTool.prototype.clearGuidelines = function() {
  this.diagram.remove(this.guidelineHbottom);
  this.diagram.remove(this.guidelineHcenter);
  this.diagram.remove(this.guidelineHtop);
  this.diagram.remove(this.guidelineVleft);
  this.diagram.remove(this.guidelineVright);
  this.diagram.remove(this.guidelineVcenter);
};

GuidedDraggingTool.prototype.doDeactivate = function() {
  go.DraggingTool.prototype.doDeactivate.call(this);
  // clear any guidelines when dragging is done
  this.clearGuidelines();
};

GuidedDraggingTool.prototype.doDragOver = function() {
  // clear all existing guidelines in case either show... method decides to show a guideline
  this.clearGuidelines();

  // gets the selected part
  var partItr = (this.copiedParts || this.draggedParts).iterator;
  if (partItr.next()) {
    var part = partItr.key;

    this.showHorizontalMatches(part, this.isGuidelineEnabled, false);
    this.showVerticalMatches(part, this.isGuidelineEnabled, false);
  }
};

GuidedDraggingTool.prototype.doDropOnto = function() {
  this.clearGuidelines();
  // gets the selected (perhaps copied) Part
  var partItr = (this.copiedParts || this.draggedParts).iterator;
  if (partItr.next()) {
    var part = partItr.key;

    // snaps only when the mouse is released without shift modifier
    var e = this.diagram.lastInput;
    var snap = this.isGuidelineSnapEnabled && !e.shift;

    this.showHorizontalMatches(part, false, snap); // false means don't show guidelines
    this.showVerticalMatches(part, false, snap);
  }
};

GuidedDraggingTool.prototype.invalidateLinks = function(node) {
  if (node instanceof go.Node) node.invalidateConnectedLinks();
};

GuidedDraggingTool.prototype.showHorizontalMatches = function(
  part,
  guideline,
  snap
) {
  var partBounds = part.actualBounds;
  var p0 = partBounds.y;
  var p1 = partBounds.y + partBounds.height / 2;
  var p2 = partBounds.y + partBounds.height;

  var marginOfError = this.guidelineSnapDistance;
  var distance = this.searchDistance;
  // compares with parts within narrow vertical area
  var area = partBounds.copy();
  area.inflate(distance, marginOfError + 1);
  var otherParts = this.diagram.findObjectsIn(
    area,
    function(obj) {
      return obj.part;
    },
    function(part) {
      return (
        part instanceof go.Part &&
        !(part instanceof go.Link) &&
        part.isTopLevel &&
        !part.layer.isTemporary
      );
    },
    true
  );

  var bestDiff = marginOfError;
  var bestPart = null;
  var bestSpot;
  var bestOtherSpot;
  // horizontal line -- comparing y-values
  otherParts.each(function(other) {
    if (other === part) return; // ignore itself

    var otherBounds = other.actualBounds;
    var q0 = otherBounds.y;
    var q1 = otherBounds.y + otherBounds.height / 2;
    var q2 = otherBounds.y + otherBounds.height;

    // compare center with center of OTHER part
    if (Math.abs(p1 - q1) < bestDiff) {
      bestDiff = Math.abs(p1 - q1);
      bestPart = other;
      bestSpot = go.Spot.Center;
      bestOtherSpot = go.Spot.Center;
    }

    // compare top side with top and bottom sides of OTHER part
    if (Math.abs(p0 - q0) < bestDiff) {
      bestDiff = Math.abs(p0 - q0);
      bestPart = other;
      bestSpot = go.Spot.Top;
      bestOtherSpot = go.Spot.Top;
    } else if (Math.abs(p0 - q2) < bestDiff) {
      bestDiff = Math.abs(p0 - q2);
      bestPart = other;
      bestSpot = go.Spot.Top;
      bestOtherSpot = go.Spot.Bottom;
    }

    // compare bottom side with top and bottom sides of OTHER part
    if (Math.abs(p2 - q0) < bestDiff) {
      bestDiff = Math.abs(p2 - q0);
      bestPart = other;
      bestSpot = go.Spot.Bottom;
      bestOtherSpot = go.Spot.Top;
    } else if (Math.abs(p2 - q2) < bestDiff) {
      bestDiff = Math.abs(p2 - q2);
      bestPart = other;
      bestSpot = go.Spot.Bottom;
      bestOtherSpot = go.Spot.Bottom;
    }
  });

  if (bestPart !== null) {
    var bestBounds = bestPart.actualBounds;
    // line extends from x0 to x2
    var x0 = Math.min(partBounds.x, bestBounds.x) - 10;
    var x2 =
      Math.max(
        partBounds.x + partBounds.width,
        bestBounds.x + bestBounds.width
      ) + 10;
    // find bestPart's desired Y
    var bestPoint = new go.Point().setRectSpot(bestBounds, bestOtherSpot);
    if (bestSpot === go.Spot.Center) {
      if (snap) {
        // call Part.move in order to automatically move member Parts of Groups
        part.move(
          new go.Point(partBounds.x, bestPoint.y - partBounds.height / 2)
        );
        this.invalidateLinks(part);
      }
      if (guideline) {
        this.guidelineHcenter.position = new go.Point(x0, bestPoint.y);
        this.guidelineHcenter.elt(0).width = x2 - x0;
        this.diagram.add(this.guidelineHcenter);
      }
    } else if (bestSpot === go.Spot.Top) {
      if (snap) {
        part.move(new go.Point(partBounds.x, bestPoint.y));
        this.invalidateLinks(part);
      }
      if (guideline) {
        this.guidelineHtop.position = new go.Point(x0, bestPoint.y);
        this.guidelineHtop.elt(0).width = x2 - x0;
        this.diagram.add(this.guidelineHtop);
      }
    } else if (bestSpot === go.Spot.Bottom) {
      if (snap) {
        part.move(new go.Point(partBounds.x, bestPoint.y - partBounds.height));
        this.invalidateLinks(part);
      }
      if (guideline) {
        this.guidelineHbottom.position = new go.Point(x0, bestPoint.y);
        this.guidelineHbottom.elt(0).width = x2 - x0;
        this.diagram.add(this.guidelineHbottom);
      }
    }
  }
};

/**
 * This finds parts that are aligned near the selected part along vertical lines. It compares the selected
 * part to all parts within a rectangle approximately twice the {@link #searchDistance} tall.
 * The guidelines appear when a part is aligned within a margin-of-error equal to {@link #guidelineSnapDistance}.
 * The parameters used for {@link #guidelineSnap} are also set here.
 * @this {GuidedDraggingTool}
 * @param {Part} part
 * @param {boolean} guideline if true, show guideline
 * @param {boolean} snap if true, don't show guidelines but just snap the part to where the guideline would be
 */
GuidedDraggingTool.prototype.showVerticalMatches = function(
  part,
  guideline,
  snap
) {
  var partBounds = part.actualBounds;
  var p0 = partBounds.x;
  var p1 = partBounds.x + partBounds.width / 2;
  var p2 = partBounds.x + partBounds.width;

  var marginOfError = this.guidelineSnapDistance;
  var distance = this.searchDistance;
  // compares with parts within narrow vertical area
  var area = partBounds.copy();
  area.inflate(marginOfError + 1, distance);
  var otherParts = this.diagram.findObjectsIn(
    area,
    function(obj) {
      return obj.part;
    },
    function(part) {
      return (
        part instanceof go.Part &&
        !(part instanceof go.Link) &&
        part.isTopLevel &&
        !part.layer.isTemporary
      );
    },
    true
  );

  var bestDiff = marginOfError;
  var bestPart = null;
  var bestSpot;
  var bestOtherSpot;
  // vertical line -- comparing x-values
  otherParts.each(function(other) {
    if (other === part) return; // ignore itself

    var otherBounds = other.actualBounds;
    var q0 = otherBounds.x;
    var q1 = otherBounds.x + otherBounds.width / 2;
    var q2 = otherBounds.x + otherBounds.width;

    // compare center with center of OTHER part
    if (Math.abs(p1 - q1) < bestDiff) {
      bestDiff = Math.abs(p1 - q1);
      bestPart = other;
      bestSpot = go.Spot.Center;
      bestOtherSpot = go.Spot.Center;
    }

    // compare left side with left and right sides of OTHER part
    if (Math.abs(p0 - q0) < bestDiff) {
      bestDiff = Math.abs(p0 - q0);
      bestPart = other;
      bestSpot = go.Spot.Left;
      bestOtherSpot = go.Spot.Left;
    } else if (Math.abs(p0 - q2) < bestDiff) {
      bestDiff = Math.abs(p0 - q2);
      bestPart = other;
      bestSpot = go.Spot.Left;
      bestOtherSpot = go.Spot.Right;
    }

    // compare right side with left and right sides of OTHER part
    if (Math.abs(p2 - q0) < bestDiff) {
      bestDiff = Math.abs(p2 - q0);
      bestPart = other;
      bestSpot = go.Spot.Right;
      bestOtherSpot = go.Spot.Left;
    } else if (Math.abs(p2 - q2) < bestDiff) {
      bestDiff = Math.abs(p2 - q2);
      bestPart = other;
      bestSpot = go.Spot.Right;
      bestOtherSpot = go.Spot.Right;
    }
  });

  if (bestPart !== null) {
    var bestBounds = bestPart.actualBounds;
    // line extends from y0 to y2
    var y0 = Math.min(partBounds.y, bestBounds.y) - 10;
    var y2 =
      Math.max(
        partBounds.y + partBounds.height,
        bestBounds.y + bestBounds.height
      ) + 10;
    // find bestPart's desired X
    var bestPoint = new go.Point().setRectSpot(bestBounds, bestOtherSpot);
    if (bestSpot === go.Spot.Center) {
      if (snap) {
        // call Part.move in order to automatically move member Parts of Groups
        part.move(
          new go.Point(bestPoint.x - partBounds.width / 2, partBounds.y)
        );
        this.invalidateLinks(part);
      }
      if (guideline) {
        this.guidelineVcenter.position = new go.Point(bestPoint.x, y0);
        this.guidelineVcenter.elt(0).height = y2 - y0;
        this.diagram.add(this.guidelineVcenter);
      }
    } else if (bestSpot === go.Spot.Left) {
      if (snap) {
        part.move(new go.Point(bestPoint.x, partBounds.y));
        this.invalidateLinks(part);
      }
      if (guideline) {
        this.guidelineVleft.position = new go.Point(bestPoint.x, y0);
        this.guidelineVleft.elt(0).height = y2 - y0;
        this.diagram.add(this.guidelineVleft);
      }
    } else if (bestSpot === go.Spot.Right) {
      if (snap) {
        part.move(new go.Point(bestPoint.x - partBounds.width, partBounds.y));
        this.invalidateLinks(part);
      }
      if (guideline) {
        this.guidelineVright.position = new go.Point(bestPoint.x, y0);
        this.guidelineVright.elt(0).height = y2 - y0;
        this.diagram.add(this.guidelineVright);
      }
    }
  }
};

/**
 * Gets or sets the margin of error for which guidelines show up.
 * The default value is 6.
 * Guidelines will show up when the aligned nods are ± 6px away from perfect alignment.
 * @name GuidedDraggingTool#guidelineSnapDistance
 * @function.
 * @return {number}
 */
Object.defineProperty(GuidedDraggingTool.prototype, "guidelineSnapDistance", {
  get: function() {
    return this._guidelineSnapDistance;
  },
  set: function(val) {
    if (typeof val !== "number" || isNaN(val) || val < 0)
      throw new Error(
        "new value for GuidedDraggingTool.guidelineSnapDistance must be a non-negative number."
      );
    if (this._guidelineSnapDistance !== val) {
      this._guidelineSnapDistance = val;
    }
  }
});

/**
 * Gets or sets whether the guidelines are enabled or disable.
 * The default value is true.
 * @name GuidedDraggingTool#isGuidelineEnabled
 * @function.
 * @return {boolean}
 */
Object.defineProperty(GuidedDraggingTool.prototype, "isGuidelineEnabled", {
  get: function() {
    return this._isGuidelineEnabled;
  },
  set: function(val) {
    if (typeof val !== "boolean")
      throw new Error(
        "new value for GuidedDraggingTool.isGuidelineEnabled must be a boolean value."
      );
    if (this._isGuidelineEnabled !== val) {
      this._isGuidelineEnabled = val;
    }
  }
});

/**
 * Gets or sets the color of horizontal guidelines.
 * The default value is "gray".
 * @name GuidedDraggingTool#horizontalGuidelineColor
 * @function.
 * @return {string}
 */
Object.defineProperty(
  GuidedDraggingTool.prototype,
  "horizontalGuidelineColor",
  {
    get: function() {
      return this._horizontalGuidelineColor;
    },
    set: function(val) {
      if (this._horizontalGuidelineColor !== val) {
        this._horizontalGuidelineColor = val;
        this.guidelineHbottom.elements.first().stroke = this._horizontalGuidelineColor;
        this.guidelineHtop.elements.first().stroke = this._horizontalGuidelineColor;
      }
    }
  }
);

/**
 * Gets or sets the color of vertical guidelines.
 * The default value is "gray".
 * @name GuidedDraggingTool#verticalGuidelineColor
 * @function.
 * @return {string}
 */
Object.defineProperty(GuidedDraggingTool.prototype, "verticalGuidelineColor", {
  get: function() {
    return this._verticalGuidelineColor;
  },
  set: function(val) {
    if (this._verticalGuidelineColor !== val) {
      this._verticalGuidelineColor = val;
      this.guidelineVleft.elements.first().stroke = this._verticalGuidelineColor;
      this.guidelineVright.elements.first().stroke = this._verticalGuidelineColor;
    }
  }
});

/**
 * Gets or sets the color of center guidelines.
 * The default value is "gray".
 * @name GuidedDraggingTool#centerGuidelineColor
 * @function.
 * @return {string}
 */
Object.defineProperty(GuidedDraggingTool.prototype, "centerGuidelineColor", {
  get: function() {
    return this._centerGuidelineColor;
  },
  set: function(val) {
    if (this._centerGuidelineColor !== val) {
      this._centerGuidelineColor = val;
      this.guidelineVcenter.elements.first().stroke = this._centerGuidelineColor;
      this.guidelineHcenter.elements.first().stroke = this._centerGuidelineColor;
    }
  }
});

/**
 * Gets or sets the width guidelines.
 * The default value is 1.
 * @name GuidedDraggingTool#guidelineWidth
 * @function.
 * @return {number}
 */
Object.defineProperty(GuidedDraggingTool.prototype, "guidelineWidth", {
  get: function() {
    return this._guidelineWidth;
  },
  set: function(val) {
    if (typeof val !== "number" || isNaN(val) || val < 0)
      throw new Error(
        "New value for GuidedDraggingTool.guidelineWidth must be a non-negative number."
      );
    if (this._guidelineWidth !== val) {
      this._guidelineWidth = val;
      this.guidelineVcenter.elements.first().strokeWidth = val;
      this.guidelineHcenter.elements.first().strokeWidth = val;
      this.guidelineVleft.elements.first().strokeWidth = val;
      this.guidelineVright.elements.first().strokeWidth = val;
      this.guidelineHbottom.elements.first().strokeWidth = val;
      this.guidelineHtop.elements.first().strokeWidth = val;
    }
  }
});
/**
 * Gets or sets the distance around the selected part to search for aligned parts.
 * The default value is 1000.
 * Set this to Infinity if you want to search the entire diagram no matter how far away.
 * @name GuidedDraggingTool#searchDistance
 * @function.
 * @return {number}
 */
Object.defineProperty(GuidedDraggingTool.prototype, "searchDistance", {
  get: function() {
    return this._searchDistance;
  },
  set: function(val) {
    if (typeof val !== "number" || isNaN(val) || val <= 0)
      throw new Error(
        "new value for GuidedDraggingTool.searchDistance must be a positive number."
      );
    if (this._searchDistance !== val) {
      this._searchDistance = val;
    }
  }
});

/**
 * Gets or sets whether snapping to guidelines is enabled.
 * The default value is true.
 * @name GuidedDraggingTool#isGuidelineSnapEnabled
 * @function.
 * @return {Boolean}
 */
Object.defineProperty(GuidedDraggingTool.prototype, "isGuidelineSnapEnabled", {
  get: function() {
    return this._isGuidelineSnapEnabled;
  },
  set: function(val) {
    if (typeof val !== "boolean")
      throw new Error(
        "new value for GuidedDraggingTool.isGuidelineSnapEnabled must be a boolean."
      );
    if (this._isGuidelineSnapEnabled !== val) {
      this._isGuidelineSnapEnabled = val;
    }
  }
});

import picker from "../common/Picker.vue";
import colorPicker from "../common/Color.vue";
import go from "gojs";
import icons from "./icons.js";
export default {
  name: "EditGraph",
  data() {
    return {
      lineType: false,
      label: null,
      labels: [],
      GuidedDraggingTool: GuidedDraggingTool,
      copy: false,
      type: false,
      linkPoint: null,
      panel: null,
      modelScale: 40,
      linkScale: 6,
      selectType: 0,
      jumpDatas: [],
      deviceDatas: [],
      newPoint: null,
      newDevicePoint: null,
      newJump: null,
      showOption: null,
      showOptionMode: "device",
      modelOptions: [
        {
          name: "功能",
          id: "fPaletteDiv",
          style: "width:100%;height:400px"
        },
        {
          name: "热力",
          id: "hPaletteDiv",
          style: "width:100%;height:400px"
        },
        {
          name: "电力",
          id: "ePaletteDiv",
          style: "width:100%;height:400px"
        }
      ],
      tab: null,
      textScale: null,
      textScales: [
        {
          name: "1号字体",
          scale: "bold 40px sans-serif"
        },
        {
          name: "2号字体",
          scale: "bold 32px sans-serif"
        },
        {
          name: "3号字体",
          scale: "bold 24px sans-serif"
        },
        {
          name: "4号字体",
          scale: "bold 18px sans-serif"
        },
        {
          name: "5号字体",
          scale: "bold 12px sans-serif"
        }
      ],
      textColor: null,
      lineColor: null,
      runColor: null,
      stopColor: null,
      info: null,
      nodePartData: null,
      showAction: false,
      showClick: false,
      id: null,
      text: "未命名系统图",
      e: {},
      obj: {},
      $: null,
      name: "",
      tool: false,
      edit: false,
      myDiagram: null,
      myPalette: {}
    };
  },
  computed: {
    size() {
      var s = this.$store.getters.windowSize;
      return {
        width: "100%",
        height: s.y - 156 + "px",
        "margin-top": "44px"
      };
    },
    cid: function() {
      return this.$store.getters.getID;
    },
    dark: function() {
      return this.$store.getters.getDark;
    }
  },
  watch: {
    lineType(val) {
      if (val == null) return;
      if (val == true) {
        this.myDiagram.model.set(this.nodePartData, "strokeDashArray", [0, 0]);
        this.myDiagram.model.set(this.nodePartData, "lineType", true);
        return;
      }
      this.myDiagram.model.set(this.nodePartData, "strokeDashArray", [4, 4]);
      this.myDiagram.model.set(this.nodePartData, "lineType", false);
    },
    label(val) {
      if (val == null) return;
      if (this.label != this.nodePartData.label) {
        this.newJump = null;
      }
      this.jumpDatas = this.subItems(val.path);
    },
    linkPoint(val) {
      if (val == null) return;
      this.myDiagram.model.set(this.nodePartData, "name", val.name);
      this.myDiagram.model.set(this.nodePartData, "pt", val.id);
    },
    panel(val) {
      if (val != null) {
        this.open(this.modelOptions[val].id);
      }
    },
    linkScale(newValue) {
      if (this.showAction == false) return;
      if (this.showOption == "area") {
        this.myDiagram.model.set(
          this.nodePartData,
          "strokeWidth",
          newValue / 3
        );
        return;
      }
      this.myDiagram.model.set(this.nodePartData, "strokeWidth", newValue);
    },
    modelScale(newValue) {
      if (this.showAction == false && this.showClick == false) return;
      this.myDiagram.model.set(this.nodePartData, "iconSize", newValue);
      this.myDiagram.model.set(this.nodePartData, "svgSize", newValue - 5);
    },
    selectType(newValue) {
      if (newValue == null) return;
      let tmp = null;
      if (this.nodePartData.tag == "device") tmp = 0;
      if (this.nodePartData.tag == "point") tmp = 1;
      if (this.nodePartData.tag == "jump") tmp = 2;
      if (newValue != tmp) {
        this.newJump = null;
        this.newPoint = null;
        this.newDevicePoint = null;
        this.label = null;
      }
      switch (newValue) {
        case 0:
          this.showOptionMode = "device";
          break;
        case 1:
          this.showOptionMode = "point";
          break;
        case 2:
          this.showOptionMode = "jump";
          break;
      }
    },
    newDevicePoint(newValue) {
      if (newValue == null) return;
      this.myDiagram.model.set(this.nodePartData, "tag", "device");
      this.myDiagram.model.set(this.nodePartData, "name", newValue.name);
      this.myDiagram.model.set(this.nodePartData, "pt", newValue.id);
    },
    newPoint(newValue) {
      if (newValue == null) return;
      this.myDiagram.model.set(this.nodePartData, "tag", "point");
      this.myDiagram.model.set(this.nodePartData, "name", newValue.name);
      this.myDiagram.model.set(this.nodePartData, "pt", newValue.id);
    },
    newJump(newValue) {
      if (newValue == null) return;
      this.myDiagram.model.set(this.nodePartData, "tag", "jump");
      this.myDiagram.model.set(this.nodePartData, "name", newValue.title);
      this.myDiagram.model.set(this.nodePartData, "pt", newValue.sid);
      this.myDiagram.model.set(this.nodePartData, "path", newValue.path);
      this.myDiagram.model.set(this.nodePartData, "label", this.label);
    },
    info(newValue) {
      if (newValue == null) return;
      this.myDiagram.model.set(this.nodePartData, "text", newValue);
    },
    textScale(newValue) {
      if (newValue == null) return;
      this.myDiagram.model.set(this.nodePartData, "textName", newValue.name);
      this.myDiagram.model.set(this.nodePartData, "font", newValue.scale);
    },
    textColor(newValue) {
      if (newValue == null) return;
      this.myDiagram.model.set(this.nodePartData, "stroke", newValue);
    },
    lineColor(newValue) {
      if (newValue == null) return;
      this.myDiagram.model.set(this.nodePartData, "color", newValue);
    },
    runColor(newColor) {
      if (newColor == null) return;
      this.myDiagram.model.set(this.nodePartData, "runColor", newColor);
    },
    stopColor(newColor) {
      if (newColor == null) return;
      this.myDiagram.model.set(this.nodePartData, "stopColor", newColor);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    if (!this.copy) {
      this.myDiagram.clear();
      this.myPalette = null;
    }
  },
  methods: {
    subItems(path) {
      let arr = this.$store.getters.getRelations.filter(card => {
        return card.type == path;
      });
      this.sortChinese(arr, "title");
      return arr;
    },
    clearData() {
      this.lineType = null;
      this.label = null;
      this.linkPoint = null;
      this.newPoint = null;
      this.newJump = null;
      this.newDevicePoint = null;
      this.showOption = null;
      this.modelScale = 40;
      this.selectType = 0;
      this.pointData = null;
      this.deviceData = null;
      this.textColor = null;
      this.textScale = null;
      this.runColor = null;
      this.stopColor = null;
      this.lineColor = null;
      this.linkScale = null;
      this.info = null;
    },
    showSmallPorts(node, show) {
      node.ports.each(port => {
        if (port.portId !== "") {
          // don't change the default port, which is the big shape
          port.fill = show ? "rgba(0,0,0,.3)" : null;
        }
      });
    },
    open(id) {
      if (this.myPalette[id]) return;
      setTimeout(() => {
        switch (id) {
          case "fPaletteDiv":
            this.$(
              go.Palette,
              id, // must name or refer to the DIV HTML element
              {
                // simplify the link template, just in this Palette
                linkTemplate: this.$(
                  go.Link,
                  {
                    // because the GridLayout.alignment is Location and the nodes have locationSpot == Spot.Center,
                    // to line up the Link in the same manner we have to pretend the Link has the same location spot
                    locationSpot: go.Spot.Center,
                    layerName: "Background",
                    selectionAdornmentTemplate: this.$(
                      go.Adornment,
                      "Link",
                      {
                        locationSpot: go.Spot.Center
                      },
                      this.$(go.Shape, {
                        isPanelMain: true,
                        fill: "#9E9E9E",
                        stroke: "#9E9E9E",
                        strokeWidth: 6
                      }),
                      this.$(
                        go.Shape, // the arrowhead
                        {
                          toArrow: "Standard",
                          stroke: "red"
                        }
                      )
                    )
                  },
                  {
                    routing: go.Link.AvoidsNodes,
                    curve: go.Link.JumpGap,
                    corner: 10,
                    toShortLength: 4
                  },
                  new go.Binding("points"),
                  this.$(
                    go.Shape, // the link path shape
                    {
                      isPanelMain: true,
                      stroke: "#9E9E9E",
                      strokeWidth: 2
                    }
                  ),
                  this.$(
                    go.Shape, // the arrowhead
                    {
                      toArrow: "Standard",
                      fill: "#9E9E9E",
                      stroke: "#9E9E9E"
                    }
                  )
                ),
                initialContentAlignment: go.Spot.Center,
                // "toolManager.mouseWheelBehavior": go.ToolManager.WheelNone, //鼠标滚轮事件禁止
                // initialDocumentSpot: go.Spot.TopCenter,
                // initialViewportSpot: go.Spot.TopCenter,
                // initialContentAlignment: go.Spot.Center,
                // initialAutoScale: go.Diagram.Uniform, // scale to show all of the contents
                nodeTemplateMap: this.myDiagram.nodeTemplateMap, // share the templates used by myDiagram
                // scrollsPageOnFocus: false,
                "animationManager.isEnabled": false,
                allowHorizontalScroll: false,
                allowVerticalScroll: true,
                model: new go.GraphLinksModel(
                  [
                    // specify the contents of the Palette
                    {
                      category: "Text",
                      stroke: "#9E9E9E",
                      text: "文字"
                    },
                    {
                      category: "Number",
                      stroke: "#9E9E9E",
                      text: 0.0
                    },
                    {
                      category: "Click",
                      color: "transparent",
                      width: 40,
                      height: 40
                    },
                    {
                      category: "Connect"
                    },
                    {
                      category: "Area",
                      strokeWidth: 5
                    }
                  ],
                  [
                    // the Palette also has a disconnected Link, which the user can drag-and-drop
                    {
                      points: new go.List(go.Point).addAll([
                        new go.Point(0, 0),
                        new go.Point(0, 30),
                        new go.Point(30, 30)
                      ])
                    }
                  ]
                )
              }
            );
            break;
          case "hPaletteDiv":
            this.$(
              go.Palette,
              id, // must name or refer to the DIV HTML element
              {
                // "toolManager.mouseWheelBehavior": go.ToolManager.WheelNone, //鼠标滚轮事件禁止
                initialContentAlignment: go.Spot.Center, // center the content
                // initialAutoScale: go.Diagram.Uniform, // scale to show all of the contents
                nodeTemplateMap: this.myDiagram.nodeTemplateMap, // share the templates used by myDiagrams
                // scrollsPageOnFocus: false,
                "animationManager.isEnabled": false,
                allowHorizontalScroll: false,
                allowVerticalScroll: true,
                model: new go.GraphLinksModel([
                  // specify the contents of the Palette
                  {
                    category: "Model",
                    icon: "diankongfa",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "jingshuiqi",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E",
                    angle: 180
                  },
                  {
                    category: "Model",
                    icon: "kongtiao",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "shoudongfa",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "shuibeng",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "shuibiao",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "shuiwei",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "shuixiang",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "wendu",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "yasuoji",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "guangreqi",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  }
                ])
              }
            );
            break;
          case "ePaletteDiv":
            this.$(
              go.Palette,
              id, // must name or refer to the DIV HTML element
              {
                // "toolManager.mouseWheelBehavior": go.ToolManager.WheelNone, //鼠标滚轮事件禁止
                initialContentAlignment: go.Spot.Center, // center the content
                // initialAutoScale: go.Diagram.Uniform, // scale to show all of the contents
                nodeTemplateMap: this.myDiagram.nodeTemplateMap, // share the templates used by myDiagram
                // scrollsPageOnFocus: false,
                "animationManager.isEnabled": false,
                allowHorizontalScroll: false,
                allowVerticalScroll: true,
                model: new go.GraphLinksModel([
                  // specify the contents of the Palette
                  {
                    category: "Model",
                    icon: "buchang",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "tongyongshebei",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "peidiangui",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "nibianqi",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "chongdianzhuang",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "dianchi",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "bianyaqi",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "daozha",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E",
                    angle: -90
                  },
                  {
                    category: "Model",
                    icon: "diangan",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "dianta",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "fengche",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "gaojing",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "biao",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "deng",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "guangfu",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "jianceqi",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "jingbao",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "jinggao",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "kaiguan",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "weixian",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "xiaodianxiang",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "yiqiyibiao",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E"
                  },
                  {
                    category: "Model",
                    icon: "chongdian",
                    svgSize: 32,
                    iconSize: 40,
                    runColor: "#F44336",
                    stopColor: "#9E9E9E",
                    angle: 180
                  }
                ])
              }
            );
            break;
        }

        this.myPalette[id] = id;
      }, 1);
    },
    confirm() {
      this.showAction = false;
      this.showClick = false;
      this.showOptionMode = "device";
      this.clearData();
    },
    deleteGraph() {
      if (this.showOption == "link") {
        this.myDiagram.model.removeLinkData(this.nodePartData);
      }
      this.myDiagram.model.removeNodeData(this.nodePartData);
      this.showAction = false;
      this.showClick = false;
      this.showOptionMode = "device";
      this.clearData();
    },
    clear() {
      if (this.edit) {
        this.$axios.delete("/api/graphs/" + this.id).then(() => {
          this.$store.commit("sendSnackbar", {
            text: "删除成功",
            color: "primary"
          });
          this.$store.dispatch("closeDialog");
        });
      }
      this.myDiagram.model = go.Model.fromJson({
        class: "go.GraphLinksModel",
        linkFromPortIdProperty: "fromPort",
        linkToPortIdProperty: "toPort",
        nodeDataArray: [],
        linkDataArray: []
      });
      this.showAction = false;
      this.text = null;
      this.edit = false;
    },
    save() {
      this.myDiagram.model.modelData.position = go.Point.stringify(
        this.myDiagram.position
      );
      var modelData = this.myDiagram.model.toJson();
      if (!this.edit) {
        this.$axios
          .post("/api/graphs", {
            name: this.text,
            cid: this.cid,
            modelData: modelData
          })
          .then(res => {
            if (res.data.error) {
              return;
            }
            this.id = res.data.id;
            this.edit = true;
            this.myDiagram.isModified = false;
            this.$store.commit("sendSnackbar", {
              text: "保存成功",
              color: "primary"
            });
          });
      } else {
        this.$axios
          .put("/api/graphs/" + this.id, {
            name: this.text,
            cid: "工程",
            modelData: modelData
          })
          .then(res => {
            if (res.data.error) {
              return;
            }
            this.myDiagram.isModified = false;
            this.$store.commit("sendSnackbar", {
              text: "保存成功",
              color: "primary"
            });
          });
      }
    },
    load() {
      if (!this.edit) return;
      this.$axios.get("/api/graphs/" + this.id).then(res => {
        if (res.data.error) {
          return;
        }
        this.myDiagram.model = go.Model.fromJson(res.data.modelData);
        this.myDiagram.model.class = "go.GraphLinksModel";
        this.myDiagram.model.linkFromPortIdProperty = "fromPort";
        this.myDiagram.model.linkToPortIdProperty = "toPort";
        var pos = this.myDiagram.model.modelData.position;
        if (pos) this.myDiagram.initialPosition = go.Point.parse(pos);
        this.text = res.data.name;
        return;
      });
      this.myDiagram.model = go.Model.fromJson({
        class: "go.GraphLinksModel",
        linkFromPortIdProperty: "fromPort",
        linkToPortIdProperty: "toPort",
        nodeDataArray: [],
        linkDataArray: []
      });
      this.text = null;
    },
    spotConverter(dir) {
      if (dir === "left") return go.Spot.LeftSide;
      if (dir === "right") return go.Spot.RightSide;
      if (dir === "top") return go.Spot.TopSide;
      if (dir === "bottom") return go.Spot.BottomSide;
      if (dir === "rightsingle") return go.Spot.Right;
    },
    makePort(name, spot, output, input) {
      // the port is basically just a small transparent square
      return this.$(go.Shape, "Circle", {
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
        cursor: "pointer" // show a different cursor to indicate potential link point
      });
    },
    infoString(obj) {
      var part = obj.part;
      if (part instanceof go.Adornment) part = part.adornedPart;
      var msg = "";
      if (part instanceof go.Link) {
        msg = "";
      } else if (part instanceof go.Node) {
        msg =
          part.data.text +
          ":\n\n" +
          part.data.id +
          ":\n\n" +
          part.data.description;
      }
      return msg;
    },
    sortChinese(arr, dataLeven) {
      // 参数：arr 排序的数组; dataLeven 数组内的需要比较的元素属性
      /* 获取数组元素内需要比较的值 */
      function getValue(option) {
        // 参数： option 数组元素
        if (!dataLeven) return option;
        var data = option;
        dataLeven.split(".").filter(function(item) {
          data = data[item];
        });
        return data + "";
      }
      arr.sort(function(item1, item2) {
        return getValue(item1).localeCompare(getValue(item2), "zh-CN");
      });
    }
  },
  mounted() {
    this.labels = this.$store.getters.getLabels;
    this.edit = this.$route.params.id ? true : false;
    this.id = this.$route.params.id;
    if (this.edit) {
      this.$axios
        .get("/api/relations", {
          params: {
            id: this.id,
            tag: "model"
          }
        })
        .then(res => {
          for (let val of res.data) {
            let ob = {};
            ob.id = val.sid;
            ob.name = val.title;
            this.deviceDatas.push(ob);
          }
          this.sortChinese(this.deviceDatas, "name");
        });
    }

    this.$ = go.GraphObject.make;
    var $ = this.$;
    var myDiagram = $(
      go.Diagram,
      "diagramDiv", // create a Diagram for the DIV HTML element
      {
        draggingTool: new GuidedDraggingTool(),
        grid: $(
          go.Panel,
          "Grid",
          $(go.Shape, "LineH", {
            stroke: "rgba(200,200,200,0.1)",
            strokeWidth: 0.5
          }),
          $(go.Shape, "LineH", {
            stroke: "rgba(200,200,200,0.5)",
            strokeWidth: 0.5,
            interval: 10
          }),
          $(go.Shape, "LineV", {
            stroke: "rgba(200,200,200,0.1)",
            strokeWidth: 0.5
          }),
          $(go.Shape, "LineV", {
            stroke: "rgba(200,200,200,0.5)",
            strokeWidth: 0.5,
            interval: 10
          })
        ),
        //折线连接节点配置的参数
        initialAutoScale: go.Diagram.Uniform,
        initialContentAlignment: go.Spot.Center, // center the content
        "draggingTool.isGridSnapEnabled": true,
        "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
        "linkingTool.isUnconnectedLinkValid": true,
        "linkingTool.portGravity": 20,
        "relinkingTool.isUnconnectedLinkValid": true,
        "relinkingTool.portGravity": 20,
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
          fill: "darkred",
          stroke: "tomato"
        }),

        "draggingTool.dragsLink": true,
        "rotatingTool.snapAngleMultiple": 90,
        "rotatingTool.snapAngleEpsilon": 45,
        "toolManager.hoverDelay": 10, // how quickly tooltips are shown
        // initialDocumentSpot: go.Spot.TopCenter,
        // initialViewportSpot: go.Spot.TopCenter,
        // initialContentAlignment: go.Spot.Center, // center the content
        allowDrop: true, // must be true to accept drops from the Palette
        // scrollsPageOnFocus: false,
        "animationManager.isEnabled": false,
        "undoManager.isEnabled": true // enable undo & redo
      }
    );

    this.myDiagram = myDiagram;

    this.myDiagram.addDiagramListener("SelectionMoved", () => {
      if (this.showAction) return;
      this.myDiagram.isModified = false;
    });

    this.myDiagram.addDiagramListener("Modified", () => {
      if (this.showAction) return;
      this.myDiagram.isModified = false;
    });

    this.myDiagram.addDiagramListener("BackgroundSingleClicked", () => {
      this.confirm();
    });

    myDiagram.nodeTemplateMap.add(
      "Model",
      $(
        go.Node,
        "Spot",
        {
          layerName: "Background",
          locationSpot: go.Spot.Center,
          locationObjectName: "main",
          rotatable: true,
          rotateObjectName: "icon"
        },
        new go.Binding("location", "pos", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),

        // The main element of the Spot panel is a vertical panel housing an optional icon,
        // plus a rectangle that acts as the port
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
            new go.Binding("angle").makeTwoWay(),
            new go.Binding("width", "svgSize").makeTwoWay(),
            new go.Binding("height", "svgSize").makeTwoWay(),
            new go.Binding("geometry", "icon", geoname => {
              var geo = icons[geoname];
              if (typeof geo === "string") {
                geo = icons[geoname] = go.Geometry.parse(geo, true);
              }
              return geo;
            })
          )
        ),
        {
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
        },
        this.makePort("T", go.Spot.Top, true, true),
        this.makePort("L", go.Spot.Left, true, true),
        this.makePort("R", go.Spot.Right, true, true),
        this.makePort("B", go.Spot.Bottom, true, true),
        {
          mouseEnter: (e, node) => {
            this.showSmallPorts(node, true);
          },
          mouseLeave: (e, node) => {
            this.showSmallPorts(node, false);
          }
        }
      )
    );

    myDiagram.nodeTemplateMap.add(
      "Area",
      this.$(
        go.Node,
        "Auto",
        {
          locationSpot: go.Spot.Center,
          selectionAdorned: false,
          layerName: "Background",
          //调节图形大小或旋转角度
          resizable: true,
          resizeCellSize: new go.Size(10, 10),
          resizeObjectName: "SHAPE"
        },
        new go.Binding("location", "pos", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        this.$(
          go.Shape,
          {
            name: "SHAPE",
            strokeWidth: 2,
            stroke: "#9E9E9E",
            strokeMiterLimit: 5,
            strokeDashArray: [4, 4],
            width: 40,
            height: 40,
            figure: "RoundedRectangle",
            fill: null
          },
          new go.Binding("strokeWidth", "strokeWidth").makeTwoWay(),
          new go.Binding("width", "width").makeTwoWay(),
          new go.Binding("height", "height").makeTwoWay(),
          new go.Binding("stroke", "stroke").makeTwoWay(),
          new go.Binding("strokeDashArray", "strokeDashArray").makeTwoWay(),
          {
            click: (e, node) => {
              let delay = 50;
              if (this.showAction == true || this.showClick == true) {
                this.confirm();
                delay = 500;
              }
              setTimeout(() => {
                this.nodePartData = node.part.data;
                this.lineType = this.nodePartData.lineType;
                this.textColor = this.nodePartData.stroke;
                this.linkScale = this.nodePartData.strokeWidth * 3;
                this.showOption = "area";
                this.showAction = true;
              }, delay);
            },
            cursor: "pointer" //改变鼠标样式变成小手
          }
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
          selectionAdorned: false,
          //调节图形大小或旋转角度
          resizable: true,
          resizeCellSize: new go.Size(10, 10),
          resizeObjectName: "SHAPE"
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
          new go.Binding("width", "width").makeTwoWay(),
          new go.Binding("height", "height").makeTwoWay(),
          new go.Binding("stroke", "stroke"),
          {
            click: (e, node) => {
              let delay = 50;
              if (this.showAction == true || this.showClick == true) {
                this.confirm();
                delay = 500;
              }
              setTimeout(() => {
                if (node.part.data.tag == "device") {
                  this.showOptionMode = "device";
                  this.selectType = 0;
                  let ob = {};
                  ob.name = node.part.data.name;
                  ob.id = node.part.data.pt;
                  this.newDevicePoint = ob;
                }
                if (node.part.data.tag == "point") {
                  this.showOptionMode = "point";
                  this.selectType = 1;
                  let ob = {};
                  ob.name = node.part.data.name;
                  ob.id = node.part.data.pt;
                  this.newPoint = ob;
                }
                if (node.part.data.tag == "jump") {
                  this.showOptionMode = "jump";
                  this.selectType = 2;
                  let ob = {};
                  this.label = node.part.data.label;
                  // console.log(this.label)
                  ob.title = node.part.data.name;
                  ob.sid = node.part.data.pt;
                  ob.path = node.part.data.path;
                  this.newJump = ob;
                }
                this.showOption = "click";
                this.nodePartData = node.part.data;
                this.showClick = true;
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
          locationObjectName: "main",
          // layerName: "Background",
          locationSpot: go.Spot.Center,
          selectionAdorned: false
        },
        new go.Binding("location", "pos", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        $(
          go.Panel,
          "Auto",
          this.$(go.Shape, "Circle", {
            strokeWidth: 1,
            stroke: "#9E9E9E",
            strokeMiterLimit: 5,
            width: 26,
            height: 26,
            strokeDashArray: [2, 2],
            fill: "rgba(158,158,158,0.4)"
          })
        ),
        $(
          go.Panel,
          "Auto",
          this.$(go.Shape, "Circle", {
            strokeWidth: 0,
            stroke: null,
            strokeMiterLimit: 5,
            width: 12,
            height: 12,
            fromLinkable: true,
            toLinkable: true,
            fill: "rgba(158,158,158,0.5)"
          }),
          this.makePort("T", go.Spot.Top, true, true),
          this.makePort("L", go.Spot.Left, true, true),
          this.makePort("R", go.Spot.Right, true, true),
          this.makePort("B", go.Spot.Bottom, true, true)
        ),
        {
          mouseEnter: (e, node) => {
            this.showSmallPorts(node, true);
          },
          mouseLeave: (e, node) => {
            this.showSmallPorts(node, false);
          }
        }
      )
    );

    myDiagram.nodeTemplateMap.add(
      "Text",
      $(
        go.Node,
        "Auto", // the Shape will go around the TextBlock
        {
          locationSpot: go.Spot.Center,
          layerName: "Background"
        },
        new go.Binding("location", "pos", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        $(
          go.Panel,
          "Position",
          $(
            go.TextBlock,
            {
              stroke: "#9E9E9E",
              font: "bold 16pt helvetica, bold arial, sans-serif"
            },
            new go.Binding("text", "text"),
            new go.Binding("stroke", "stroke"),
            new go.Binding("font", "font")
          )
        ),

        {
          click: (e, node) => {
            let delay = 50;
            if (this.showAction == true || this.showClick == true) {
              this.confirm();
              delay = 500;
            }
            setTimeout(() => {
              this.nodePartData = node.part.data;
              if (this.nodePartData.textName) {
                let ob = {};
                ob.scale = this.nodePartData.font;
                ob.name = this.nodePartData.textName;
                this.textScale = ob;
              }
              this.textColor = node.part.data.stroke;
              this.info = node.part.data.text;
              this.showOption = "text";
              this.showAction = true;
              // this.tool = false
            }, delay);
          },
          cursor: "pointer" //改变鼠标样式变成小手
        }
      )
    );

    myDiagram.nodeTemplateMap.add(
      "Number",
      $(
        go.Node,
        "Auto",
        {
          locationSpot: go.Spot.Center,
          layerName: "Background"
        },
        new go.Binding("location", "pos", go.Point.parse).makeTwoWay(
          go.Point.stringify
        ),
        $(
          go.Panel,
          "Position",

          $(
            go.TextBlock,
            {
              stroke: "#9E9E9E",
              font: "bold 24px sans-serif"
            },
            new go.Binding("text", "text"),
            new go.Binding("stroke", "stroke"),
            new go.Binding("font", "font"),
            new go.Binding("pt", "pt")
          ),

          {
            click: (e, node) => {
              let delay = 50;
              if (this.showAction == true || this.showClick == true) {
                this.confirm();
                delay = 500;
              }
              setTimeout(() => {
                this.nodePartData = node.part.data;
                if (this.nodePartData.textName) {
                  let ob = {};
                  ob.name = this.nodePartData.textName;
                  ob.scale = this.nodePartData.font;
                  this.textScale = ob;
                }
                if (this.nodePartData.pt && this.nodePartData.name) {
                  let ob = {};
                  ob.name = this.nodePartData.name;
                  ob.id = this.nodePartData.pt;
                  this.newPoint = ob;
                }
                this.textColor = node.part.data.stroke;
                this.showOption = "number";
                this.showAction = true;
                // this.tool = false
              }, delay);
            },
            cursor: "pointer" //改变鼠标样式变成小手
          }
        )
      )
    );

    myDiagram.linkTemplate = $(
      go.Link,
      {
        curve: go.Link.JumpGap,
        resegmentable: true,
        selectionAdorned: false,
        // toShortLength: 0,
        // fromShortLength: 0,
        layerName: "Background",
        routing: go.Link.AvoidsNodes,
        corner: 10,
        // fromSpot: go.Spot.AllSides,
        // toSpot: go.Spot.AllSides,
        relinkableFrom: true,
        relinkableTo: true,
        reshapable: true
      },
      new go.Binding("points").makeTwoWay(),
      // mark each Shape to get the link geometry with isPanelMain: true
      $(
        go.Shape,
        {
          isPanelMain: true,
          stroke: "#9E9E9E" /* blue*/,
          strokeWidth: 6
        },
        new go.Binding("strokeWidth", "strokeWidth"),
        new go.Binding("stroke", "color")
      ),
      $(go.Shape, {
        isPanelMain: true,
        stroke: "#E0E0E0",
        strokeWidth: 4,
        name: "PIPE",
        strokeDashArray: [12, 24]
      }),
      {
        click: (e, node) => {
          let delay = 50;
          if (this.showAction == true || this.showClick == true) {
            this.confirm();
            delay = 500;
          }
          setTimeout(() => {
            this.nodePartData = node.part.data;
            if (this.nodePartData.name) {
              let ob = {};
              ob.name = this.nodePartData.name;
              ob.id = this.nodePartData.pt;
              ob.direction = this.nodePartData.direction;
              this.linkPoint = ob;
            }
            this.linkScale = this.nodePartData.strokeWidth;
            this.lineColor = this.nodePartData.color;
            this.showOption = "link";
            this.showAction = true;
          }, delay);
        },
        cursor: "pointer" //改变鼠标样式变成小手
      },
      $(
        go.Shape, // the arrowhead
        {
          toArrow: "Standard",
          fill: "red",
          stroke: null
        }
      )
    );
    this.load();
    this.timer = setInterval(this.realTimeUpdates, 2000);
  },
  components: {
    colorPicker,
    picker
  }
};
</script>
