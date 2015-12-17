var https = require('https');
var slack_token = 'bla'
var slack_host = 'hooks.slack.com'
var slack_path = '/services/bla/bla/bla'



// Entrypoint for AWS Lambda
exports.handler = function(event, context) {

  var name = event.text ? event.text.trim() : null;

  // removing logging to keep the person anonymous
  // console.log('[INFO] ', JSON.stringify(event));

  // verify request came from slack - could also check that event.command === /insult
  if(event.token !== slack_token) {
    console.log('[ERROR]', 'Unauthorized request!');
    return context.fail('Unauthorized request. Check slackToken.');
  }


  // validate
  if(isBlank(name)) {
    console.log('[ERROR]','Cannot insult without name');
    return context.fail('Fecker, pick a name.');
  }

 // works only in public rooms
if(event.channel_name == 'privategroup') {
    console.log('[ERROR]','cannot push to private rooms');
    return context.fail('Sorry kid, the bot works only in public rooms. Grow your balls');
  }

  var message = JSON.stringify({ channel: '#' + event.channel_name, icon_emoji: ':poop:', username: 'Insult Bot', text: getInsult(name)});
  //console.log('[INFO]',message);
  sendWebhook(slack_host, slack_path, message);

};



function sendWebhook(host,path,message){

  var optionspost = {
    host: host,
    path: path,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }
  };

  var reqPost = https.request(optionspost, function(res) {
      console.log("statusCode: ", res.statusCode);
      if(res.statusCode !== 200) {
         return context.fail('Opppps something went wrong with webhoook post');
      }
  });

  reqPost.write(message);
  reqPost.end();

}


// should not be empty
function isBlank(str) {
    return (!str || 0 === str.length);
}


// here we go with insults
function getInsult(name) {

        var myArray =        [
                              "at least when I do a handstand my stomach does not hit me in the face.",
                              "you have something on your chin... no, the 3rd one down",
                              "how many times do I have to flush to get rid of you?",
                              "I bet your brain feels as good as new, seeing that you never use it.",
                              "I could eat a bowl of alphabet soup and shit out a smarter statement than that.",
                              "I do not exactly hate you, but if you were on fire and I had water, I would drink it.",
                              "I have neither the time nor the crayons to explain this to you.",
                              "I may love to shop but I am not buying your bullshit.",
                              "I was not born with enough middle fingers to let you know how I feel about you.",
                              "I would like to see things from your point of view but I cannot seem to get my head that far up my ass.",
                              "I would slap you, but shit stains.",
                              "I am no proctologist, but I know as asshole when I see one.",
                              "I am not saying I hate you, but I would unplug your life support to charge my phone.",
                              "if I wanted to kill myself I would climb your ego and jump to your IQ.",
                              "if I were to slap you, it would be considered animal abuse!",
                              "if laughter is the best medicine, your face must be curing the world.",
                              "if you are going to be two faced, at least make one of them pretty.",
                              "if you are gonna be a smartass, first you have to be smart. Otherwise you are just an ass.",
                              "is your ass jealous of the amount of shit that just came out of your mouth?",
                              "it looks like your face caught on fire and someone tried to put it out with a hammer.",
                              "it is better to let someone think you are an Idiot than to open your mouth and prove it.",
                              "I am jealous of all the people that have not met you!",
                              "maybe if you ate some of that makeup you could be pretty on the inside.",
                              "roses are red violets are blue, God made me pretty, what happened to you?",
                              "roses are red, violets are blue, I have 5 fingers, the 3rd ones for you.",
                              "ahut up, you will never be the man your mother is.",
                              "somewhere out there is a tree, tirelessly producing oxygen so you can breathe. I think you owe it an apology.",
                              "the last time I saw a face like yours I fed it a banana.",
                              "the only way you will ever get laid is if you crawl up a chicken ass and wait.",
                              "two wrongs do not make a right, take your parents as an example.",
                              "well I could agree with you, but then we would both be wrong.",
                              "what are you going to do for a face when the baboon wants his butt back?",
                              "yo are so ugly, when your mom dropped you off at school she got a fine for littering.",
                              "you bring everyone a lot of joy, when you leave the room.",
                              "you must have been born on a highway because that is where most accidents happen.",
                              "you should not play hide and seek, no one would look for you.",
                              "your birth certificate is an apology letter from the condom factory.",
                              "your family tree must be a cactus because everybody on it is a prick."
                              ]

        var rand = myArray[Math.floor(Math.random() * myArray.length)];
        var message = name + ', ' + rand;
        return message;
}
