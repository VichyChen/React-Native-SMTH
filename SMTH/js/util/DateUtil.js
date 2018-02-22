export default class DateUtil {
    static formatTimeStamp(timestamp) {
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var halfamonth = day * 15;
        var month = day * 30;
        var now = new Date().getTime();
        var diffValue = now - timestamp * 1000;

        if (diffValue < 0) { return; }
        var monthC = diffValue / month;
        var weekC = diffValue / (7 * day);
        var dayC = diffValue / day;
        var hourC = diffValue / hour;
        var minC = diffValue / minute;

        var dateTime = new Date(timestamp * 1000);
        var year = dateTime.getFullYear();
        var month = dateTime.getMonth() + 1;
        var day = dateTime.getDate();
        var hour = parseInt(dateTime.getHours()) < 10 ? '0' + dateTime.getHours() : dateTime.getHours();
        var minute = parseInt(dateTime.getMinutes()) < 10 ? '0' + dateTime.getMinutes() : dateTime.getMinutes();
        var second = parseInt(dateTime.getSeconds()) < 10 ? '0' + dateTime.getSeconds() : dateTime.getSeconds();
        if (dayC > 7) {
            result = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
        }
        else if (dayC >= 3) {
            // result = "" + parseInt(dayC) + "天前";
            result = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;            
        }
        else if (dayC >= 2) {
            result = "前天 " + hour + ':' + minute;
        }
        else if (dayC > 0 && day != (new Date().getDate())) {
            result = "昨天 " + hour + ':' + minute;
        }
        else if (hourC >= 1) {
            result = hour + ':' + minute;
        }
        else if (minC >= 1) {
            result = "" + parseInt(minC) + "分钟前";
        } 
        else {
            result = "刚刚";
        }

        return result;
    }

    static getDateString(timestamp) {
        var dateTime = new Date(timestamp * 1000);
        var year = dateTime.getFullYear();
        var month = dateTime.getMonth() + 1;
        var day = dateTime.getDate();
        var hour = dateTime.getHours();
        var minute = dateTime.getMinutes();
        var second = dateTime.getSeconds();
        result = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        
        return result;
    }
}
