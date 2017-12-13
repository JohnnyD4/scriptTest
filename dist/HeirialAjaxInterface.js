class HeirialAjaxInterface {
    constructor(dependencies, options = {}) {
      this.navigator = options.navigator || window.navigator;
      this._allowBeacons = options.allowBeacons || false;
    }
  
    post(url, fields) {
      if (this._allowBeacons && this.navigator.sendBeacon) {
        this._sendBeacon(url, fields);
      } else if ('withCredentials' in new XMLHttpRequest()) {
        this._sendXHR(url, fields);
      } else if (typeof XDomainRequest !== 'undefined') {
        this._sendXDR(url, fields);
      }
  
      // failed
    }
  
    _sendBeacon(url, fields) {
      navigator.sendBeacon(url, JSON.stringify(fields));
    }
  
    _sendXHR(url, fields) {
      const xhr = new XMLHttpRequest();
  
      xhr.open('POST', url, true);
      xhr.send(JSON.stringify(fields));
    }
  
    _sendXDR(url, fields) {
      const xdr = new XDomainRequest();
  
      xdr.open('POST', url);
      xdr.onload = () => {};
      xdr.send(JSON.stringify(fields));
    }
  }
  
  module.exports = HeirialAjaxInterface;
  