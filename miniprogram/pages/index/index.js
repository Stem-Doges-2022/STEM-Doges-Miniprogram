const db = wx.cloud.database();
const app = getApp();

// miniprogram/pages/index/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    showAddUser:false,
    showAdminVerification:false,
    totalRanking:{},
    admin:false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.updateLeaderboard();
  },

  hidePopup(event){
    this.setData({
      showAddUser:false,
      showAdminVerification:false
    })
  },

  openAddUser(event){
    if (this.data.admin){
      this.setData({
        showAddUser:true
      })
    }else{
      this.setData({
        showAdminVerification:true
      })
    }
  },

  removePerson(event){
    let that = this;
    let n = event.currentTarget.dataset.num;
    let ppl = this.data.totalRanking;
    db.collection('userInfo').doc(ppl[n]._id)
    .remove()
    .then(res=>{
      that.updateLeaderboard();
    })
  },

  addPerson(event){
    let that =this;
    let name =  event.detail.value.name;
    let time =  parseFloat(event.detail.value.runTime);
    db.collection('userInfo')
    .add({
      data: {
        name:name,
        runTime: time
      }
    })
    .then(res=>{
      that.updateLeaderboard();
    })

    this.setData({
      showingPopup: false,
      showPopup:[]
    })
  },

  verifyAdmin(event){
    
    let code =  event.detail.value.code;
    let that =this;
    db.collection('settings').get({
      success: function(res) {
        if (code == res.data[0].password){
          that.setData({
            admin:true
          })
        }
      }
    })
   

    this.setData({
      showAdminVerification:false
    })
  },


  updateLeaderboard(){
    let that = this;
    let people = [];
    db.collection('userInfo').count({
      success: function(res) {
        for (let i=0 ; i<res.total; i+=20){
          db.collection('userInfo').get({
            success: function(res) {
              people = people.concat(res.data);
              people.sort((a,b) => a.runTime - b.runTime);
              that.setData({
                totalRanking:people
              })
            }
          })
        }
      }
    })
    

    
    
  },

})