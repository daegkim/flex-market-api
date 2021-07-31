const callOptions = require('./call-options');
const axios = require('axios');

class AccountCaller {
  constructor() {

  }

  /**
   * 
   * @param {string} userId 
   * @param {string} userPwd 
   * @returns {{isSuccess: boolean, reason: string, userInfo: {userId: string, userName: string, point: number, favoriteProductId: number[]}}}
   */
  async login(userId, userPwd) {
    const result = {
      isSuccess: false,
      reason: 'Please contact the customer service center.',
      userInfo: null
    }

    try {
      const options = callOptions.accountApi.login(userId, userPwd);
      //await axios(options).data라고 했었는데 오류가 남.
      //변수에 promise를 await 받은 후 data를 뽑아내야 한다.
      const loginResult = await axios(options);
      const loginData = loginResult.data;
      Object.keys(result).forEach((key) => {
        result[key] = loginData[key];
      });
    }
    catch (err) {
      result.isSuccess = false;
      result.reason = 'Please contact the customer service center.';
      result.userInfo = null;
    }
    finally {
      return result;
      /*
      promise를 return 하지 않아도 자동으로 promise에 넣어져서 return된다.
      return new Promise((resolve, reject) => {
        resolve(result);
      });
      */
    }
  }

  /**
   * 
   * @param {string}} userId 
   * @param {{point: number}} changeData 
   * @returns {{isSuccess: boolean, reason: string, sessionId: number}}
   */
  async changePointWithTran(userId, changeData) {
    const result = {
      isSuccess: false,
      reason: 'Please contact the customer service center.',
      sessionId: -1
    }

    try {
      const options = callOptions.accountApi.changePoint(userId, changeData);
      const changeAccountResult = await axios(options)
      const changeAccountData = changeAccountResult.data;
      Object.keys(result).forEach((key) => {
        result[key] = changeAccountData[key];
      });
    }
    catch (err) {
      result.isSuccess = false;
      result.reason = 'Please contact the customer service center.';
      //sessionId는 그대로 유지.
    }
    finally {
      return result;
    }
  }

  /**
   * 
   * @param {string} userId 
   * @param {number} sessionId 
   * @returns {{isSuccess: boolean, reason: string}}
   */
  async commitTran(sessionId) {
    const result = {
      isSuccess: false,
      reason: 'Please contact the customer service center.',
    }

    try {
      const options = callOptions.accountApi.commit(sessionId);
      const commitAccountResult = await axios(options);
      const commitAccountData = commitAccountResult.data;
      Object.keys(result).forEach((key) => {
        result[key] = commitAccountData[key];
      });
    }
    catch (err) {
      result.isSuccess = false;
      result.reason = 'Please contact the customer service center.';
    }
    finally {
      return result;
    }
  }

  /**
   * 
   * @param {string} userId 
   * @param {number} sessionId 
   * @returns {{isSuccess: boolean, reason: string}}
   */
  async rollbackTran(sessionId) {
    const result = {
      isSuccess: false,
      reason: 'Please contact the customer service center.',
    }

    try {
      const options = callOptions.accountApi.rollback(sessionId);
      const rollbackAccountResult = await axios(options);
      const rollbackAccountData = rollbackAccountResult.data;
      Object.keys(result).forEach((key) => {
        result[key] = rollbackAccountData[key];
      });
    }
    catch (err) {
      result.isSuccess = false;
      result.reason = 'Please contact the customer service center.';
    }
    finally {
      return result;
    }
  }

  /**
   * 
   * @param {string} userId 
   * @returns {{isSuccess: boolean, reason: string, userInfo: {userId: string, userName: string, point: number, favoriteProductId: number[]}}}
   */
  async getUserInfo(userId) {
    const result = {
      isSuccess: false,
      reason: 'Please contact the customer service center.',
      userInfo: null
    }

    try {
      const options = callOptions.accountApi.getUserInfo(userId);
      const userInfoResult = await axios(options);
      const userInfoData = userInfoResult.data;
      Object.keys(result).forEach((key) => {
        result[key] = userInfoData[key];
      });
    }
    catch (err) {
      result.isSuccess = false;
      result.reason = 'Please contact the customer service center.';
      result.userInfo = null;
    }
    finally {
      return result;
    }
  }
}

class OrderCaller {
  constructor() {

  }

  /**
   * 
   * @param {string} userId 
   * @returns {{isSuccess: boolean, reason: string, orders: {orderProduct: {productId: number, quantity: number, pricePerPiece: number}[], orderDate: Date, orderId: number}[]}}
   */
  async getOrders(userId) {
    const result = {
      isSuccess: false,
      reason: 'Please contact the customer service center.',
      orders: null
    }

    try {
      const options = callOptions.orderApi.getOrders(userId);
      const ordersResult = await axios(options);
      const ordersData = ordersResult.data;
      Object.keys(result).forEach((key) => {
        result[key] = ordersData[key];
      });
    }
    catch (err) {
      result.isSuccess = false;
      result.reason = 'Please contact the customer service center.';
      result.orders = null;
    }
    finally {
      return result;
    }
  }

  /**
   * 
   * @param {string} userId 
   * @param {{productId: number, pricePerPiece: number, quantity: number}} orderProduct 
   * @returns {{isSuccess: boolean, reason: string, sessionId: number}}
   */
  async createOrderWithTran(userId, orderProduct) {
    const result = {
      isSuccess: false,
      reason: 'Please contact the customer service center.',
      sessionId: -1
    }

    try {
      const options = callOptions.orderApi.createOrder(userId, orderProduct);
      const createOrderResult = await axios(options);
      const createOrderData = createOrderResult.data;
      Object.keys(result).forEach((key) => {
        result[key] = createOrderData[key];
      });
    }
    catch (err) {
      result.isSuccess = false;
      result.reason = 'Please contact the customer service center.';
    }
    finally {
      return result;
    }
  }

  /**
 * 
 * @param {string} userId 
 * @param {number} sessionId 
 * @returns {{isSuccess: boolean, reason: string}}
 */
  async commitTran(sessionId) {
    const result = {
      isSuccess: false,
      reason: 'Please contact the customer service center.',
    }

    try {
      const options = callOptions.orderApi.commit(sessionId);
      const commitAccountResult = await axios(options);
      const commitAccountData = commitAccountResult.data;
      Object.keys(result).forEach((key) => {
        result[key] = commitAccountData[key];
      });
    }
    catch (err) {
      result.isSuccess = false;
      result.reason = 'Please contact the customer service center.';
    }
    finally {
      return result;
    }
  }

  /**
   * 
   * @param {string} userId 
   * @param {number} sessionId 
   * @returns {{isSuccess: boolean, reason: string}}
   */
  async rollbackTran(sessionId) {
    const result = {
      isSuccess: false,
      reason: 'Please contact the customer service center.',
    }

    try {
      const options = callOptions.orderApi.rollback(sessionId);
      const rollbackAccountResult = await axios(options);
      const rollbackAccountData = rollbackAccountResult.data;
      Object.keys(result).forEach((key) => {
        result[key] = rollbackAccountData[key];
      });
    }
    catch (err) {
      result.isSuccess = false;
      result.reason = 'Please contact the customer service center.';
    }
    finally {
      return result;
    }
  }
}

class FlexApiCaller {
  constructor() {
    this.accountCaller = new AccountCaller();
    this.orderCaller = new OrderCaller();
  }
}

module.exports = new FlexApiCaller();