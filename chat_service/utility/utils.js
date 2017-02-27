/**
 * Created by zmz0305 on 2/26/17.
 */

/**
 * construct response message object
 * @param status the status message
 * @param data the data message
 */
module.exports.resMsg = function (status, data) {
    return {status: status, data: data};
}