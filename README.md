# Slack-InsultBot
Wee tiny bot to insult your coworkers, because it feels good to insult, right?

[![Slack Insult Bot](http://i.imgur.com/jfEi1ML.png)](https://youtu.be/TGQeHzxA-VU)


# How it works
- It sends the insults anonymously (unless you uncomment the logs, you won't know who insulted you)
- Works only in public channels
- no server required, get ready for AWS Lambda + AWS Gateway
- SLASH COMNAND is used to send the insult
- INCOMING WEBHOOK will receive it


# Setup
- in Slack Integration Services add new "Slash Commands", call it Insult or whatever you want, use POST method replace ```var slack_token = 'bla'```  in the insult.js
- in Slack Integration Services add new "Incoming Webhook", add replace ```var slack_path = '/services/bla/bla/bla'``` in the insult.js with it (exclude the domain)
- in AWS create new Lambda function and insults.js there (as a text)
- in AWS create new AWS Gateway with
-- add new resource (call it whatever you want)
-- add new POST method under then resource (this should be GET I know I know)
-- add new mapping template for "application/x-www-form-urlencoded" in integration request (see code below) into post method
-- click DEPLOY - use the URI AWS generates
- and this URL to slack SLASH COMMAND you created above




# AWS Gateway add application/x-www-form-urlencoded integration request

```
## convert HTML POST data or HTTP GET query string to JSON

## get the raw post data from the AWS built-in variable and give it a nicer name
#if ($context.httpMethod == "POST")
 #set($rawAPIData = $input.path('$'))
#elseif ($context.httpMethod == "GET")
 #set($rawAPIData = $input.params().querystring)
 #set($rawAPIData = $rawAPIData.toString())
 #set($rawAPIDataLength = $rawAPIData.length() - 1)
 #set($rawAPIData = $rawAPIData.substring(1, $rawAPIDataLength))
 #set($rawAPIData = $rawAPIData.replace(", ", "&"))
#else
 #set($rawAPIData = "")
#end

## first we get the number of "&" in the string, this tells us if there is more than one key value pair
#set($countAmpersands = $rawAPIData.length() - $rawAPIData.replace("&", "").length())

## if there are no "&" at all then we have only one key value pair.
## we append an ampersand to the string so that we can tokenise it the same way as multiple kv pairs.
## the "empty" kv pair to the right of the ampersand will be ignored anyway.
#if ($countAmpersands == 0)
 #set($rawPostData = $rawAPIData + "&")
#end

## now we tokenise using the ampersand(s)
#set($tokenisedAmpersand = $rawAPIData.split("&"))

## we set up a variable to hold the valid key value pairs
#set($tokenisedEquals = [])

## now we set up a loop to find the valid key value pairs, which must contain only one "="
#foreach( $kvPair in $tokenisedAmpersand )
 #set($countEquals = $kvPair.length() - $kvPair.replace("=", "").length())
 #if ($countEquals == 1)
  #set($kvTokenised = $kvPair.split("="))
  #if ($kvTokenised[0].length() > 0 && $kvTokenised.size() == 2)
    #if ($kvTokenised[0].length() > 0)
     ## we found a valid key value pair. add it to the list.
     #set($devNull = $tokenisedEquals.add($kvPair))
    #end
  #end    
 #end
#end

## next we set up our loop inside the output structure "{" and "}"
{
#foreach( $kvPair in $tokenisedEquals )
  ## finally we output the JSON for this pair and append a comma if this isn't the last pair
  #set($kvTokenised = $kvPair.split("="))
 "$util.urlDecode($kvTokenised[0])" : #if($kvTokenised[1].length() > 0)"$util.urlDecode($kvTokenised[1])"#{else}""#end#if( $foreach.hasNext ),#end
#end
}
```
