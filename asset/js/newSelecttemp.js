$(function () {

    // -------------GETTING API DATA AND SHOWING IN PAGE----------------

    // defaultData function shows default data in page
    // showData function shows special data in element with showWeather id
    // cityResFunc function compares city with database and returns id if it exist
    // convertTempUnit function changes the value of temperature in celsius or fahrenheit

    var cityName;
    var country;
    var apiKey = "56a027d8c33f3becc2c2b5d414e72c35";
    var defaultId = 118743;


    // --- defaultData
    function defaultData(id) {
        $.ajax({
            type: "GET",
            url: "https://api.openweathermap.org/data/2.5/weather?id=" + id + "&appid=" + apiKey
        }).done(showData);
    }
    defaultData(defaultId);


    //--- showData
    function showData(myRes) {
        if (myRes.cod == 200) {
            $("#show").removeAttr("disabled");
            var temp = Number(myRes.main.temp);
            temp += -273.15;
            temp = temp.toFixed(0);

            $("#cityName").html(myRes.name + "," + myRes.sys.country);
            $("#description").html(myRes.weather[0].description);
            $("#weatherIcon").attr('src', `http://openweathermap.org/img/w/${myRes.weather[0].icon}.png`);
            $("#weatherIcon").attr('alt', 'weatherIcon');
            $("#temp_api").html(`${temp}°C`);
            $("#sel").val("celsius");

            // fill table cells
            $("#wind").html(`${myRes.wind.speed} m/s`);
            $("#pressure").html(`${myRes.main.pressure} hpa`);
            $("#humidity").html(`${myRes.main.humidity} %`);

            $("#defaultInfo").css("display", "flex");
        }

        convertTempUnit(myRes);
    }

    // --- search desire city
    $("#show").click(function () {
        var cityVal = $("#city").val();
        cityName = cityVal.charAt(0).toUpperCase() + cityVal.slice(1);
        $("#city").val(cityName);
        country = $("#country").val();

        //in first click the button get disable
        $(this).attr("disabled", "disabled");

        $.ajax({
            url: "asset/js/city.list.json"
        }).done(cityResFunc);
    });

    // --- cityResFunc
    function cityResFunc(cityRes) {
        $.each(cityRes, function (i, item) {
            if (item.name == cityName) {
                var cityId = item.id;

                $.ajax({
                        type: "GET",
                        url: "https://api.openweathermap.org/data/2.5/weather?id=" + cityId + "&appid=" + apiKey
                    })
                    .done(showData);
            }
        });
    }


    // --- convertTempUnit
    function convertTempUnit(myRes) {
        $("#sel").change(function () {
            temp = (myRes.main.temp - 273.15).toFixed(0);
            if ($(this).val() == 'celsius') {
                $('#temp_api').html(temp + "°C");
            } else {
                $('#temp_api').html((temp * 1.8 + 32).toFixed(0) + "°F");
            }
        });
    }

});