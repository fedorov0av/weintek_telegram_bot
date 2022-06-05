// library for implementing telegram bot under hmi weintek
class TelegramBot {
    constructor(token) {
        this.token = token;
        // Создаем utf-8 декодер
        this.decoder = new TextDecoder('utf-8');
        // Создаем экземпляр curl Easy
        this.curl = new net.Curl.Easy();
        this.curl.setOpt(net.Curl.Easy.option.SSL_VERIFYPEER, false);
        // This is a GET request
        this.responseData = "";
        this.curl.setOpt(net.Curl.Easy.option.HTTPGET, true);
        this.url = `https://api.telegram.org/bot${this.token}`;
        this.curl.setOpt(net.Curl.Easy.option.WRITEFUNCTION, function (buf) {
            this.resp = this.decoder.decode(buf);
            this.responseData += this.resp;
            });
        // To run the request, we use Multi to do this.
        // First, create a multi instance
        this.multi = new net.Curl.Multi();
        // Then setup the event callback
        this.multi.onMessage((easyHandle, result) => {
            this.error = net.Curl.Easy.strError(result);
            this.responseCode = easyHandle.getInfo(net.Curl.info.RESPONSE_CODE);
            // responseData is written by WRITEFUNCTION
            console.log(this.error, this.responseCode, this.responseData);
            this.multi.removeHandle(easyHandle);
            });
    }
    message(message, chatid){
        // Заполняем url
        this.final_url = `${this.url}/sendmessage?chat_id=${chatid}&text=${message}`;
        this.curl.setOpt(net.Curl.Easy.option.URL, this.final_url);
        // Выполняем запрос
        this.multi.addHandle(this.curl);
    }
  }