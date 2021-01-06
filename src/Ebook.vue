<template>
  <div class="container">
    <title-bar :menuShowToggle="menuShowToggle"></title-bar>

    <div class="wrap">
      <div id="read"></div>
      <div class="mask">
        <div class="left" @click="prevPage"></div>
        <div class="center" @click="toggleShow"></div>
        <div class="right" @click="nextPage"></div>
      </div>
    </div>
    <menu-bar
      @jumpTo="jumpTo"
      @settingSize="settingSize"
      @onProgressChange="onProgressChange"
      @setSelect="setSelect"
      :bookAvailable="bookAvailable"
      :themesList="themesList"
      :defaultThemes="defaultThemes"
      :menuShowToggle="menuShowToggle"
      :fontSizeList="fontSizeList"
      :defaultPoint="defaultPoint"
      :navigation="navigation"
      ref="menubar"
    ></menu-bar>
  </div>
</template>

<script>
import Epub from "epubjs";
import titleBar from "@/ebookcomponent/titleBar";
import menuBar from "@/ebookcomponent/menuBar";
global.ePub = Epub;
export default {
  name: "ebook",
  //电子书的渲染和解析
  components: {
    titleBar,
    menuBar,
  },
  data() {
    return {
      menuShowToggle: false,
      fontSizeList: [
        { fontSize: 12 },
        { fontSize: 14 },
        { fontSize: 16 },
        { fontSize: 18 },
        { fontSize: 20 },
        { fontSize: 22 },
        { fontSize: 24 },
      ],
      defaultPoint: 16,
      bookAvailable: false,

      themesList: [
        {
          name: "default",
          style: {
            body: {
              color: "#000",
              background: "#fff",
            },
          },
        },
        {
          name: "eye",
          style: {
            body: {
              color: "#000",
              background: "#ceeaba",
            },
          },
        },
        {
          name: "night",
          style: {
            body: {
              color: "#fff",
              background: "#000",
            },
          },
        },
        {
          name: "gold",
          style: {
            body: {
              color: "#000",
              background: "rgb(241,236,226)",
            },
          },
        },
      ],
      defaultThemes: 0,
      navigation: {},
    };
  },
  methods: {
    //根据链接跳转指定位置
    jumpTo(href) {
      this.rendition.display(href);
      this.hideTitleAndMenu();
    },
    hideTitleAndMenu() {
      this.menuShowToggle = false;
      this.$refs.menubar.hideSetting();
      this.$refs.menubar.hideContent();
    },
    //百分比定位函数
    onProgressChange(progress) {
      const percentage = progress / 100;
      const location =
        percentage > 0 ? this.locations.cfiFromPercentage(percentage) : 0;
      this.rendition.display(location);
    },
    setSelect(index) {
      this.themes.select(this.themesList[index].name);
      this.defaultThemes = index;
    },
    registerTheme() {
      this.themesList.forEach((theme) => {
        this.themes.register(theme.name, theme.style);
      });
    },
    settingSize(fontSize) {
      this.defaultPoint = fontSize;
      if (this.themes) {
        this.themes.fontSize(fontSize + "px");
      }
    },
    prevPage() {
      if (this.rendition) {
        this.rendition.prev();
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next();
      }
      console.log("sads");
    },
    showEpub() {
      //生成Book
      this.book = new Epub("/2018_Book_AgileProcessesInSoftwareEngine.epub");
      console.log(this.book);
      //生成Rendition
      this.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: window.innerHeight,
      });
      //通过rendition渲染电子书
      this.rendition.display();
      //获取Theme对象
      this.themes = this.rendition.themes;

      //this.themes.register(name,style)
      this.registerTheme();
      //this.themes.select(name)
      this.setSelect(this.defaultThemes);
      this.book.ready
        .then(() => {
          //生成目录
          this.navigation = this.book.navigation;
          //生成Locations对象
          return this.book.locations.generate();
        })
        .then((result) => {
          //保存locations对象
          this.locations = this.book.locations;
          // 标记电子书为解析完毕状态
          this.bookAvailable = true;
        });
    },
    toggleShow() {
      this.menuShowToggle = !this.menuShowToggle;
      if (!this.menuShowToggle) {
        //标题和菜单栏隐藏时
        this.$refs.menubar.hideSetting();
      }
    },
  },
  mounted() {
    this.showEpub();
  },
};
</script>

<style lang="scss" scoped>
@import "assets/styles/global";
.container {
  position: relative;
}

.mask {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  display: flex;
}
.left {
  flex: 0 0 px2rem(100);
}
.center {
  flex: 1;
}
.right {
  flex: 0 0 px2rem(100);
}
</style>
