exports.action = function(data, callback, config, SARAH){
// Recuperation de la config
	config = config.modules.transmission;
	if (!config.host){
		console.log("La variable host n'est pas configurée");
		return callback({'tts' : "La variable host n'est pas configurée"})};
	if (!config.port){
		console.log("La variable port n'est pas configurée");
		return callback({'tts' : "La variable port n'est pas configurée"})};

var Transmission = require('transmission')

var transmission = new Transmission({
    port : config.port,
    host : config.host
})
	if(typeof data.time === 'string' && data.transmission=='Pause_all'){
		var waitreprise =  function(msg){
		if (typeof data.perso === 'undefined'){
		SARAH.call('parle' , {'phrase' : 'Les '+data.time/(60*1000)+ ' minutes sont finies. J\'ai remis les toreints'});
		}
		transmission.get(function(err, result) {
        if (err) {
            throw err
        }
		result.torrents.forEach(function(torrent) {
			transmission.start(torrent.id,function(err, result) {})
        })
        })};
		transmission.get(function(err, result) {
        if (err) {
            throw err
        }
		result.torrents.forEach(function(torrent) {
			transmission.stop(torrent.id,function(err, result) {})
        })
        })
		setTimeout(function() {waitreprise('Fini')}, data.time);
		phrase="J'ai mis en pause les toreints pour "+data.time/(60*1000)+ " minutes"
		};
	if(data.transmission=='Pause_all' && typeof data.time === 'undefined'){
		transmission.get(function(err, result) {
        if (err) {
            throw err
        }
		result.torrents.forEach(function(torrent) {
			transmission.stop(torrent.id,function(err, result) {})
        })
        })
	phrase="J'ai arrété les toreints"
	};
	if(data.transmission=='Resume_all'){
		transmission.get(function(err, result) {
        if (err) {
            throw err
        }
		result.torrents.forEach(function(torrent) {
			transmission.start(torrent.id,function(err, result) {})
        })
        })
	phrase="J'ai remis les toreints"
	};
	if(data.transmission=='Del_finished'){
		var milliseconds = new Date().getTime();
		transmission.get(function(err, result) {
        if (err) {
            throw err
        }
		result.torrents.forEach(function(torrent) {
			if ((torrent.status==6 || torrent.status==5) && ((milliseconds/1000-torrent.addedDate)/86400)>2){
				transmission.remove(torrent.id,function(err, result) {})
				}
        })
		
		})
	phrase="J'ai supprimés les toreints terminés depuis plus de deux jours"
	};
callback({'tts': phrase});
};