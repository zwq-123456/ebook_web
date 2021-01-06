<template>
  <div class="menu-bar">
    <transition name="slide-up">
      <div
        class="menu-wrap"
        v-show="menuShowToggle"
        :class="{ 'hide-boxshadow': settingFontSize || !menuShowToggle }"
      >
        <div class="icon-wrap">
          <span class="iconfont icon-gongneng" @click="showsetting(3)"></span>
        </div>
        <div class="icon-wrap">
          <span class="iconfont icon-progress" @click="showsetting(2)"></span>
        </div>
        <div class="icon-wrap">
          <span class="iconfont icon-bright1" @click="showsetting(1)"></span>
        </div>
        <div class="icon-wrap">
          <span class="iconfont icon-a" @click="showsetting(0)">A</span>
        </div>
      </div>
    </transition>
    <transition name="slide-up">
      <div class="fontSizeBar" v-show="settingFontSize">
        <div class="setting-font-size" v-if="showTag === 0">
          <div
            class="preview"
            :style="{ fontSize: fontSizeList[0].fontSize + 'px' }"
          >
            A
          </div>
          <div class="slect">
            <div
              class="progerss"
              v-for="(item, index) in fontSizeList"
              :key="index"
              @click="setFontSize(item.fontSize)"
            >
              <div class="line"></div>
              <div class="wrap_point">
                <div class="point" v-show="defaultPoint === item.fontSize">
                  <div class="small_point"></div>
                </div>
              </div>
              <div class="line"></div>
            </div>
          </div>
          <div
            class="preview"
            :style="{
              fontSize: fontSizeList[fontSizeList.length - 1].fontSize + 'px',
            }"
          >
            A
          </div>
        </div>
        <div class="setting_theme" v-else-if="showTag === 1">
          <div
            class="setting-themes-item"
            v-for="(item, index) in themesList"
            :key="index"
            @click="setThemes(index)"
          >
            <div
              class="preview"
              :class="{ no_border: item.style.body.background != '#fff' }"
              :style="{ backgroundColor: item.style.body.background }"
            ></div>
            <div class="test" :class="{ select: index == defaultThemes }">
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="setting_progress" v-else-if="showTag === 2">
          <div class="progress_wrap">
            <input
              class="progress"
              type="range"
              max="100"
              min="0"
              step="1"
              @change="onProgressChange($event.target.value)"
              @input="onProgressInput($event.target.value)"
              :value="progress"
              :disabled="!bookAvailable"
              ref="progress"
            />
          </div>
          <div class="text-wrapper">
            <span>{{ bookAvailable ? progress + "%" : "加载中..." }}</span>
          </div>
        </div>
      </div>
    </transition>
    <content-view
      :ifShowContent="ifShowContent"
      v-show="ifShowContent"
      :navigation="navigation"
      :bookAvailable="bookAvailable"
      @jumpTo="jumpTo"
    ></content-view>
    <content-view
      :ifShowContent="ifShowContent"
      v-show="ifShowContent"
      :navigation="navigation"
      :bookAvailable="bookAvailable"
      @jumpTo="jumpTo"
    ></content-view>
    <transition name="fade">
      <div
        class="content-mask"
        v-show="ifShowContent"
        @click="hideContent"
      ></div>
    </transition>
  </div>
</template>
<script>
import ContentView from "@/ebookcomponent/contentView";
export default {
  components: {
    ContentView,
  },
  props: {
    menuShowToggle: Boolean,
    fontSizeList: Array,
    defaultPoint: Number,
    themesList: Array,
    defaultThemes: Number,
    bookAvailable: Boolean,
    navigation: Object,
  },
  data() {
    return {
      //设置字体，进度的值
      settingFontSize: false,
      showTag: 0,
      progress: 0,
      ifShowContent: false,
    };
  },
  methods: {
    // 隐藏目录
    hideContent() {
      this.ifShowContent = false;
    },
    // 跳转方法，调用父组件方法
    jumpTo(target) {
      this.$emit("jumpTo", target);
    },
    //拖动进度条触发事件
    onProgressInput(progress) {
      this.progress = progress;
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`;
    },
    //进度条松开，跳转指定得位置
    onProgressChange(progress) {
      this.$emit("onProgressChange", progress);
    },
    setThemes(index) {
      this.$emit("setSelect", index);
    },
    setFontSize(FontSize) {
      this.$emit("settingSize", FontSize);
    },
    showsetting(tag) {
      this.showTag = tag;
      if (this.showTag === 3) {
        this.settingFontSize = false;
        this.ifShowContent = true;
      } else {
        this.settingFontSize = true;
      }
    },
    hideSetting() {
      this.settingFontSize = false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/styles/global";

.menu-bar {
  .menu-wrap {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: px2rem(48);
    z-index: 101;
    display: flex;
    background-color: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    .icon-wrap {
      flex: 1;
      @include center;
    }
    &.hide-boxshadow {
      box-shadow: none;
    }
  }

  .fontSizeBar {
    position: absolute;
    bottom: px2rem(48);
    width: 100%;
    z-index: 101;
    height: px2rem(60);
    left: 0;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    background-color: white;
    .setting-font-size {
      display: flex;
      height: 100%;
      .preview {
        flex: 0 0 px2rem(40);

        @include center;
      }
      .slect {
        display: flex;
        flex: 1;
        .progerss {
          flex: 1;
          display: flex;
          align-items: center;
          &:first-child {
            .line {
              &:first-child {
                border-top: none;
              }
            }
          }
          &:last-child {
            .line {
              &:last-child {
                border-top: none;
              }
            }
          }
          .line {
            flex: 1;
            height: 0;
            border-top: px2rem(1) solid #ccc;
          }
          .wrap_point {
            position: relative;
            flex: 0 0 0;
            width: 0;
            height: px2rem(7);
            border-left: px2rem(1) solid #ccc;
            .point {
              position: absolute;
              width: px2rem(20);
              height: px2rem(20);
              border-radius: 50%;
              top: px2rem(-8);
              left: px2rem(-10);
              background-color: white;
              border: px2rem(1) solid #ccc;
              box-shadow: 0 px2rem(4) px2rem(4) rgba(0, 0, 0, 0.15);
              @include center;
              .small_point {
                width: px2rem(5);
                height: px2rem(5);
                border-radius: 50%;
                background-color: black;
              }
            }
          }
        }
      }
    }
    .setting_theme {
      display: flex;
      height: 100%;

      .setting-themes-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 5px;

        box-sizing: border-box;
        .preview {
          flex: 1;
          border: 1px solid #ccc;
          box-sizing: border-box;
          &.no_border {
            border: none;
          }
        }
        .test {
          flex: 0 0 px2rem(30);
          font-size: px2rem(16);
          color: #ccc;
          @include center;
          &.select {
            color: #333;
          }
        }
      }
    }
    .setting_progress {
      position: relative;
      width: 100%;
      height: 100%;
      .progress_wrap {
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 px2rem(30);
        box-sizing: border-box;
      }
      .progress {
        width: 100%;
        -webkit-appearance: none;
        height: px2rem(2);
        background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
        background-size: 0 100%;
        &:focus {
          outline: none;
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: px2rem(20);
          width: px2rem(20);
          border-radius: 50%;
          background-color: white;
          box-shadow: 0 4px 4px rgba(0, 0, 0, 0.15);
          border: px2rem(1) solid #ddd;
        }
      }
      .text-wrapper {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        color: #333;
        font-size: px2rem(12);
        text-align: center;
      }
    }
  }
  .content-mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
    display: flex;
    width: 100%;
    height: 100%;
    background: rgba(51, 51, 51, 0.8);
  }
}
</style>
