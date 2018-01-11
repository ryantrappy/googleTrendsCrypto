const googleTrends = require('google-trends-api');
const request = require("request");

var yesterday = new Date(new Date().getTime() - ((6*24) * 60 * 60 * 1000));


// Get the coins
var getCoins = function() {

    var url = 'https://api.coinmarketcap.com/v1/ticker/';
    request(url, function(error, response, body){


        var processCoin = function(parsedBody, loc){

            // console.log(parsedBody);
            // console.log("The loc is " + loc);


            var optionsObject = {
                "keyword":[parsedBody[loc].name, parsedBody[loc].symbol],
                "startTime": yesterday,
                "endTime": new Date(),
                "granularTimeResolution" : true
            };


            googleTrends.interestOverTime(optionsObject)
                .then(function(results){
                    // console.log(JSON.parse(results));
                    //console.log(results);

                    //Each value is results.default.timelineData[i].value

                    var valueArray = [];
                    var parsedData = JSON.parse(results);

                    for(var i=0; i<parsedData.default.timelineData.length; i++){
                        valueArray.push(parsedData.default.timelineData[i])
                    }
                    isDataSignificant(valueArray, optionsObject.keyword[0]);
                })
                .catch(function(err){
                    console.error('Oh no there was an error', err);
                });
        };





        // console.log(JSON.parse(body));
        var parsedBody = JSON.parse(body);

        for(var j=0; j<parsedBody.length; j++){
            (function(e){
                setTimeout(function() {
                    processCoin(parsedBody, e)
                }, 500*j)
            })(j)

        }

    })

};
getCoins();

var isDataSignificant = function(data, coin){
  //Takes in array of data objects and figures out if the data is significant based on rules programmed here
  var ratioOfLastTwoDays = data[data.length-1].value[0]/data[data.length-2].value[0];
  // console.log("the ratio was " + ratioOfLastTwoDays);
    if(ratioOfLastTwoDays > 1.20){
      console.log("data was significant for " + coin);
  }
};



