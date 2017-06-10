var lutzReaderUrl = 'http://localhost:6001/url?url=' + location.href;

var generateTags = function(tags) {
    var htmlArray = ['<div>'];

    tags.forEach(function(el) {
       htmlArray.push('<span style="color: white;background:indigo; padding:10px; margin:5px; border-radius: 10px; display: inline-block; font-size: 25px;">')
       htmlArray.push(el.text);
       htmlArray.push('</span>');
    });

    htmlArray.push('</div>');

    return htmlArray;
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
        console.log('TAGS', tags);

        if(tags) {
            strArray = generateTags(tags);
            placeTags(strArray);

            console.log(strArray);
        }

})
.catch(function(err) {
    console.log('ERR', err);
});
