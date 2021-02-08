<template>
  <div id="voyager-page"></div>
</template>

<script>
export default {
  name: "Voyager",
  created() {},
  mounted() {
    var element = document.getElementById("voyager");
    if (!element) location.reload();
    else document.getElementById("voyager-page").appendChild(element);
  }
};
</script>

<style>
.field-name,
.field-type {
  font-family: helvetica;
}
#voyager-page {
  height: 100% !important;
  width: 100% !important;
  position: absolute !important;
}

#voyager {
  height: 100% !important;
  width: 100% !important;
  position: absolute !important;
}

.doc-navigation {
  display: none;
}

.description-box.-no-description {
  display: none;
}

.doc-panel *:not(span):not(svg) {
  background: unset;
  background-color: var(--venue-light) !important;
}

.doc-panel {
  z-index: 2;
  width: 100% !important;
  min-width: 100% !important;
  max-height: 16rem !important;
}
.viewport {
  position: absolute;
  width: 100% !important;
  height: 100% !important;
}
.graphql-voyager button {
  margin-left: 0.5rem;
}

text.field-type.type-link {
  padding-right: 0.5rem !important;
  display: inline-block !important;
  fill: var(--venue-blue) !important;
  box-sizing: unset !important;
  margin: 0;
}

a.type-name {
  color: var(--venue-blue) !important;
}
a.type-name::after {
  background: var(--venue-blue) !important;
}

.setting-other-options span {
  color: var(--venue-blue);
}
button.eye-button span svg path:nth-of-type(2),
.type-link {
  fill: var(--venue-blue) !important;
}

.type-title polygon {
  fill: var(--venue-blue) !important;
  stroke: var(--venue-blue) !important;
}

g.node.type {
  width: 30rem !important;
}
.node.selected polygon,
.edge.highlighted,
.edge.highlighted polygon,
.edge.highlighted path:not(.hover-path),
.edge:hover path:not(.hover-path),
.edge.hovered path:not(.hover-path) {
  stroke: var(--venue-blue) !important;
}
.type-doc .scroll-area {
  padding-top: 0rem;
}
.menu-content {
  z-index: 999;
}
</style>
