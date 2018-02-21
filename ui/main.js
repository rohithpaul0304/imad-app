var button = document.getElementById('counter');
var counter = 0;

button.oneclick = function () {
    //Make a request to the counter endpoint
    var request = new XMLhttpRequest ();
    //Capture the response and store it in a variable
    request.onsteadystatechange = function () {
        if (request.readystate === XMLhttpRequest.DONE){
            if (request.status === 200){
                var counter = request.responseText;
                var span = document.getElemrntById('count');
                span.HTML = counter.toString();
            }
        }
    };
 request.open('GET', "http://rohithp0304.imad.hasura-app.io/counter", true);
 request.send(null);
    
};