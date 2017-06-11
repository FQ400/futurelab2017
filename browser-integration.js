(function(){
var lutzReaderUrl = 'https://lutz-data-reader.eu-gb.mybluemix.net/url?url=' + location.href;

var lutzStyle = document.createElement('style');
lutzStyle.type = 'text/css';
lutzStyle.rel = 'stylesheet';
lutzStyle.id = 'kx-style-sheet';
document.head.appendChild(lutzStyle);

lutzStyle.sheet.insertRule(".lutz-like {background: green!important}",0);
lutzStyle.sheet.insertRule(".lutz-dislike {background: red!important}",1);

var generateTags = function(tags) {
    var htmlArray = ['<div style="height:400px; position:relative;">'];

    htmlArray.push('<iframe src="http://graphicornothing.com/lutz/" style="width:300px;height:400px; float:left;"></iframe>');
    htmlArray.push('<p style="font-size:30px; line-height: 40px;color: lightgrey; padding-bottom: 30px;">Nenne Lutz, welche Themen dich als nächstes interessieren:</p>');

    tags.forEach(function(el) {
       htmlArray.push('<span class="lutz-tag" data-state=0 style="color: white;background:lightgrey; padding:15px; margin:5px; border-radius: 10px; display: inline-block; font-size: 25px;">')
       htmlArray.push(el.text);
       htmlArray.push('</span>');
    });

    htmlArray.push('<a style="font-size:20px; color:blue; text-align:right; position:absolute; bottom: 0; right: 20px" href="http://lutzdata.eu-gb.mybluemix.net/lisa.html">Zur persönlichen Tag-Cloud</a>');
    htmlArray.push('</div>');


    return htmlArray;
};

var likeHandler = function(event) {
    var state = event.target.getAttribute('data-state');
    if (state == 0) {
        event.target.setAttribute('data-state', 1);
        event.target.setAttribute('class','lutz-like');
    } else if (state == 1) {
        event.target.setAttribute('data-state', 2);
        event.target.setAttribute('class','lutz-dislike');
    } else {
        event.target.setAttribute('data-state', 0);
        event.target.setAttribute('class','');
    }
};

function placeTags(strArray) {
    var footer = document.querySelector('.article-footer');
    var div = document.createElement('div');

    div.innerHTML = strArray.join('');
    document.querySelector('#article-body').insertBefore(div, footer);
}

var getTags = fetch(lutzReaderUrl, { method: 'get' });

getTags.then(function(resp) {
    return resp.json();
})
.then(function(tags){
        if(tags) {
            strArray = generateTags(tags);
            placeTags(strArray);

            var tagEls = Array.prototype.slice.call(document.querySelectorAll('.lutz-tag'));

            tagEls.forEach(function(el) {
                el.onclick = likeHandler;
            });
        }
})
.catch(function(err) {
    console.log('ERR', err);
});

})();
