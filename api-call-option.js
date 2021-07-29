module.exports = {
  accountApi: {
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
    commit: function (userId, sessionId) {
      var result = {
        method: 'post',
        url: 'http://localhost:3100/commit_session',
        data: {
          userId: userId,
          sessionId: sessionId
        }
      };

      return result;
    },
    rollback: function (userId, sessionId) {
      var result = {
        method: 'post',
        url: 'http://localhost:3100/rollback_session',
        data: {
          userId: userId,
          sessionId: sessionId
        }
      };

      return result;
    }
  }
}