<template>
  <div class="channel_edit">
    <van-cell center :border='false'>
      <div slot="title" class="channel_title">我的频道</div>
      <van-button
        type='danger'
        plain
        round
        size='mini'
        @click="isEidtShow = !isEidtShow"
      >{{isEidtShow ? '完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter='10'>
      <van-grid-item
        class="grid_item"
        v-for="(channel, index) in userChannels"
        :key="index"
        :text='channel.name'
        :icon='isEidtShow ? "clear" : ""'
        :class="{'active': active == index}"
        @click="onUserChannelClick(index, channel)"
      />
    </van-grid>

    <van-cell center :border='false'>
      <div slot="title" class="channel_title">推荐频道</div>
    </van-cell>
    <van-grid :gutter='10'>
      <van-grid-item
        class="grid_item"
        v-for="(channel, index) in recommendChannel"
        :key="index"
        :text='channel.name'
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannels, deleteUserChannels } from '../api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'
export default {
  name: 'channelEdit',
  data () {
    return {
      allChannels: [],
      isEidtShow: false
    }
  },
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  created () {
    this.onloadAllChannel()
  },
  computed: {
    ...mapState(['user']),
    recommendChannel () {
      return this.allChannels.filter(channel => {
        return !this.userChannels.find(userChannel => {
          return userChannel.id === channel.id
        })
      })
    }
  },
  methods: {
    async onloadAllChannel () {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    async onAdd (channel) {
      this.userChannels.push(channel)
      if (this.user) {
        await addUserChannels({
          channels: [
            {
              id: channel.id,
              seq: this.userChannels.length
            }
          ]
        })
      } else {
        setItem('user-channels', this.userChannels)
      }
    },
    onUserChannelClick (index, channel) {
      if (this.isEidtShow && index !== 0) {
        this.deleteChannels(index, channel)
      } else {
        this.onEidtChannel(index)
      }
    },
    async deleteChannels (index, channel) {
      if (index <= this.active) {
        this.$emit('updateActive', index)
      }
      this.userChannels.splice(index, 1)
      if (this.user) {
        await deleteUserChannels(channel.id)
      } else {
        setItem('user-channels', this.userChannels)
      }
    },
    onEidtChannel (index) {
      if (!this.isEidtShow) {
        this.$emit('updateActive', index)
        this.$emit('closePup')
      } else {
        if (index <= this.active) {
          this.$emit('updateActive', this.active - 1)
        }
        this.userChannels.splice(index, 1)
      }
    }
  }
}
</script>

<style scoped lang='less'>
  .channel_edit{
    padding-top: 54px;
    .channel_title{
      font-size: 16px;
      color: #333;
    }
    .grid_item{
      /deep/ .van-grid-item__content{
        width: 80px;
        height: 43px;
        position: relative;
        padding: 0;
        text-align: center;
        line-height: 43px;
        background-color: #F4F5F6;
        /deep/ .van-grid-item__text{
          margin: 0;
          font-size: 14px;
          color: #333;
        }
        /deep/ .van-grid-item__icon{
          font-size: 20px;
          color: #ddd;
          position: absolute;
          top: -7px;
          right: -7px;
        }
      }
    }
    .active{
      /deep/ .van-grid-item__content .van-grid-item__text{
        color: red;
      }
    }
  }
</style>
