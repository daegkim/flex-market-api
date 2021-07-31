module.exports = {
  accountApi: {
    getUserInfo: function (userId) {
      var result = {
        method: 'post',
        url: 'http://localhost:3100/userInfo',
        data: {
          userId: userId
        }
      };

      return result;
    },
    login: function (userId, userPwd) {
      var result = {
        method: 'post',
        url: 'http://localhost:3100/login',
        data: {
          userId: userId,
          userPwd: userPwd
        }
      };

      return result;
    },
    changePoint: function (userId, changeData) {
      var result = {
        method: 'post',
        url: 'http://localhost:3100/change_point',
        data: {
          userId: userId,
          changeData: changeData
        }
      };

      return result;
    },
    commit: function (sessionId) {
      var result = {
        method: 'post',
        url: 'http://localhost:3100/commit_session',
        data: {
          sessionId: sessionId
        }
      };

      return result;
    },
    rollback: function (sessionId) {
      var result = {
        method: 'post',
        url: 'http://localhost:3100/rollback_session',
        data: {
          sessionId: sessionId
        }
      };

      return result;
    }
  },
  orderApi: {
    getOrders: function (userId) {
      var result = {
        method: 'post',
        url: 'http://localhost:3200/orders',
        data: {
          userId: userId
        }
      };

      return result;
    },
    createOrder: function (userId, orderProduct) {
      var result = {
        method: 'post',
        url: 'http://localhost:3200/create_order',
        data: {
          userId: userId,
          orderProduct: orderProduct
        }
      };

      return result;
    },
    commit: function (sessionId) {
      var result = {
        method: 'post',
        url: 'http://localhost:3200/commit_session',
        data: {
          sessionId: sessionId
        }
      };

      return result;
    },
    rollback: function (sessionId) {
      var result = {
        method: 'post',
        url: 'http://localhost:3200/rollback_session',
        data: {
          sessionId: sessionId
        }
      };

      return result;
    }
  }
}