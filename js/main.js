/**
 * Main map interaction code.
 */

google.load('visualization', '1', {'packages': ['table']});

var map;
var markers = [];
var infoWindow = new google.maps.InfoWindow();
var geocoder;
var marker;
var zoneLayer;
var zoneKey;
var bostonLayer;
var schoolLayerResults;
var schoolKey;
var scenario;
var zoneNum;
var gQueryUrl = 'http://www.google.com/fusiontables/gvizdata?tq=';

var basemap = [
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            { "visibility": "on" },
            {"saturation": -100},
            {"gamma": 0.50}
        ]
    }, {
        "featureType": "water",
        "stylers": [
            { "visibility": "simplified" },
            { "color": "#97d6f4" },
            { "saturation": -32 }
        ]
    }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            { "weight": 0.4 },
            { "color": "#ffffff" },
            { "visibility": "on" }
        ]
    }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            { "visibility": "simplified" }
        ]
    }
];

function initialize() {
    geocoder = new google.maps.Geocoder();
    var boston = new google.maps.LatLng(42.3200, -71.084);
    var BostonStyle = new google.maps.StyledMapType(basemap, {name: "Boston Public Schools"});

    var mapOptions = {
        center: boston,
        zoom: 12,
        mapTypeControlOptions: { mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'Boston Public Schools']}
    };

    map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
    map.mapTypes.set('Boston Public Schools', BostonStyle);
    map.setMapTypeId('Boston Public Schools');

    bostonLayer = new google.maps.FusionTablesLayer({
        suppressInfoWindows: true,
        query: {
            select: 'geometry',
            from: '1QjHRhjCLIEsmpN5ehmmtuFL7iokvbRVg2O6oOz4'
        },
        styles: [{
            polygonOptions: {
                fillColor:"#002f5a",
                fillOpacity: 0.1,
                strokeColor: "#002f5a",
                strokeOpacity: 0.3
            }
        }]
    });
    bostonLayer.setMap(map);
    console.log("boston boundaries");

}

function clearOverlays() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function codeAddress() {

    var address = document.getElementById('address').value;

    if (!address || address === "") {
        alert("Please enter your home address.");
        return;
    }

    if (markers.length > 0) {
        clearOverlays();
    }

    /*
     SCENARIO - 6
     schools: 1MGOu4r5WXL_r9iBtlJxZNVq_KHC4LmG__Fn40qM
     zone: 1JouUBlL3ZlGC8TAsRXEPeqQyrmIMx3acgdO-Jo0

     SCENARIO - 9
     schools: 1DBL_nl9hmygd_CkKTR4S44KlYU4AOsLlUxt72eY
     zone:1gqE8zik8SGPUGo5TeVPrlPgD23ZrWwL6Q5bJfnU

     SCENARIO - 11
     schools: 1r0MxyLEGJTGANkmpD3hZWJLpvTidrYkwVDVISjw
     zone: 1i6CgHn4CNukzT_AcNJUoBcS7PgxWFE4kCQTPbU8

     ell
     schools: 1Wxlq5oKcKWt5HdlZMnaSc5SbXc_rEz3Abyz7eEQ
     zone: 1vHRlXwYLozifwaBgcXbnLd5d3Be4XT65NfWthX0

     sped
     schools: 1L890nKUe8-INk4FnG8C1-kH_9tfS4OylLG7vRYc
     zone: 1BLm4bd-ejBBT8PtOu9lanCjCIZcCCY_c14059mg

     middle school
     schools:
     	MS: 1EhwdUlpyI0IzKS6uQLq7r0ONEkgJs9fzALudOM4
		MS-Citywide: 1KVj8USZ-lR06Yd-KWBSO5lBSypO-aEjpkCVtPvE
     zone: 18bfX8IzK9VEjRU1Qm66mvRoMJtNcuIvPXPAYSpE

     citywide schools
     1U4deSKE-VyXpNwjpsIyCKaemTJaqJXfvszT7Bq8

     charter schools
     13vio8J9tcoSzNfLil8R8pymcL5TZ-1sJuvLhz9c
     */
     
    if (document.getElementById('ell').checked) {
        zoneNum = "NA";
        scenario = "ell";
        schoolKey = "1Wxlq5oKcKWt5HdlZMnaSc5SbXc_rEz3Abyz7eEQ";
        zoneKey = "1vHRlXwYLozifwaBgcXbnLd5d3Be4XT65NfWthX0";

    } else if(document.getElementById('sped').checked) {
        zoneNum = "NA";
        scenario = "sped";
        schoolKey = "1L890nKUe8-INk4FnG8C1-kH_9tfS4OylLG7vRYc";
        zoneKey = "1BLm4bd-ejBBT8PtOu9lanCjCIZcCCY_c14059mg";

    } else if (document.getElementById('sixZ').checked) {
        zoneNum = "six";
        scenario = "gened";
        schoolKey = "1MGOu4r5WXL_r9iBtlJxZNVq_KHC4LmG__Fn40qM";
        zoneKey = "1JouUBlL3ZlGC8TAsRXEPeqQyrmIMx3acgdO-Jo0";

    } else if (document.getElementById('nineZ').checked) {
        zoneNum = "nine";
        scenario = "gened";
        schoolKey = "1DBL_nl9hmygd_CkKTR4S44KlYU4AOsLlUxt72eY";
        zoneKey = "1gqE8zik8SGPUGo5TeVPrlPgD23ZrWwL6Q5bJfnU";

    } else if (document.getElementById('elevenZ').checked) {
        zoneNum = "eleven";
        scenario = "gened";
        schoolKey = "1r0MxyLEGJTGANkmpD3hZWJLpvTidrYkwVDVISjw";
        zoneKey = "1i6CgHn4CNukzT_AcNJUoBcS7PgxWFE4kCQTPbU8";
    } else if (document.getElementById('msz').checked) {
        zoneNum = "NA";
        scenario = "msz";
        schoolKey = "1EhwdUlpyI0IzKS6uQLq7r0ONEkgJs9fzALudOM4";
        zoneKey = "18bfX8IzK9VEjRU1Qm66mvRoMJtNcuIvPXPAYSpE";
    }

    console.log("scenario = " + scenario + ", zones = " + zoneNum);

    // bounding box around the city
    var bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(42.231, -71.244),
        new google.maps.LatLng(42.402, -70.953));

    geocoder.geocode( {'address': address, 'bounds':bounds}, function(results, status) {
        console.log("geocoding response = "+ results);

        if (status === google.maps.GeocoderStatus.OK) {
            var addrLatLng = results[0].geometry.location;
            queryForZone(addrLatLng);

            if (marker) {
                marker.setMap(null);
                marker = null;
            }

            if (marker == null || marker === undefined) {
                map.setCenter(addrLatLng);
                map.setZoom(13);
                marker = new google.maps.Marker({
                    map: map,
                    position: addrLatLng
                });
            }

        } else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
            alert('The address "' + address + '" could not be found.');
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

// unset the zone, query & school layers
function clearMapLayers() {
    if (bostonLayer) {
        bostonLayer.setMap(null);
        bostonLayer = null;
        console.log("Initial Boston Layer cleared")
    }

    if (schoolLayerResults) {
        schoolLayerResults.setMap(null);
        schoolLayerResults = null;
        console.log("School Layer Results cleared");
    }

    if (zoneLayer) {
        zoneLayer.setMap(null);
        zoneLayer = null;
        console.log("Zone Layer cleared");
    }
}

function queryForZone(addrLatLng) {
    clearMapLayers();
    var zoneQueryResult;

    var zoneQuery = 'select Zone from ' + zoneKey
        + ' where ST_INTERSECTS(geometry, CIRCLE( LATLNG('
        + addrLatLng.Xa + ', ' + addrLatLng.Ya + '), 1))';

    var query = new google.visualization.Query(gQueryUrl + encodeURIComponent(zoneQuery));

    query.send(function getZoneData(response){
        var dt = response.getDataTable();
        
        if (dt.getNumberOfRows() === 0) {
            console.log("Zone data returned 0 results!");    
        }
        //console.log("DT: " + dt);
        //console.log("DT: " + JSON.stringify(dt));

        for (var i = 0; i < dt.getNumberOfRows(); i++) {
            zoneQueryResult = dt.getValue(i, 0);
            console.log("zoneResult = "+ zoneQueryResult);
            queryForSchool(addrLatLng, zoneQueryResult);
            
            var where = "Zone = " + zoneQueryResult;
			console.log("zoneWhere = " + where);
		
		    zoneLayer = new google.maps.FusionTablesLayer({
		        suppressInfoWindows: true,
		        query: {
		            select: 'geometry',
		            from: zoneKey
		        },
		        styles: [
		        {
		            polygonOptions: {
		                fillColor: "#d5d4a6",
		                fillOpacity: 0.1
		            }
		        },{
		            where: where,
		            polygonOptions: {
		                fillColor: "#facf8d",
		                fillOpacity: 0.3,
		                strokeColor: "#facf8d",
		                strokeOpacity: 0.8,
		                strokeWeight: 3
		            }
		        }]
		    });
		    zoneLayer.setMap(map);
		    console.log("zone layer set");
        }
    });


} // end queryForZone

function queryForSchool(addrLatLng, zoneQueryResult) {

    var whereClause = 'WHERE Zone = ' + zoneQueryResult;
    var whereClauseIntersect = 'WHERE ST_INTERSECTS(geometry, CIRCLE( LATLNG('
        + addrLatLng.Xa + ', ' + addrLatLng.Ya + '), 1200))';

    var charterQuery = 'select geometry, SCHOOL_NAM, SCH_ID, GRADE_SPAN, FEEDS_INTO, SCHOOL_PRO ' +
        'from 13vio8J9tcoSzNfLil8R8pymcL5TZ-1sJuvLhz9c';
    var citywideQuery = 'select geometry, SCHOOL_NAM, SCH_ID, GRADE_SPAN, FEEDS_INTO, SCHOOL_PRO ' +
        'from 1U4deSKE-VyXpNwjpsIyCKaemTJaqJXfvszT7Bq8';

    var query3 = new google.visualization.Query(gQueryUrl + encodeURIComponent(charterQuery));
    var query4 = new google.visualization.Query(gQueryUrl + encodeURIComponent(citywideQuery));

    if (scenario === 'ell' || scenario === 'sped') {
        var schoolQueryZone =
            'select geometry, SCHOOL_NAM, SCH_ID, GRADE_SPAN, FEEDS_INTO, SCHOOL_PRO from '
                + schoolKey + ' ' + whereClause;
        console.log(schoolQueryZone);

        var query = new google.visualization.Query(gQueryUrl + encodeURIComponent(schoolQueryZone));

        query.send(queryType1);
        query3.send(queryType3);
        query4.send(queryType4);

    } else if (scenario === 'msz') {
        var schoolQueryZone =
            'select geometry, SCHOOL_NAM, SCH_ID, GRADE_SPAN, FEEDS_INTO, SCHOOL_PRO from '
                + schoolKey + ' ' + whereClause;
        console.log(schoolQueryZone);

        var query = new google.visualization.Query(gQueryUrl + encodeURIComponent(schoolQueryZone));

        query.send(queryType1);
        
        var MSCitywideQuery = 'select geometry, SCHOOL_NAM, SCH_ID, GRADE_SPAN, FEEDS_INTO, SCHOOL_PRO ' +
        'from 1KVj8USZ-lR06Yd-KWBSO5lBSypO-aEjpkCVtPvE';
        var query5 = new google.visualization.Query(gQueryUrl + encodeURIComponent(MSCitywideQuery));
        query5.send(queryType5);

    }
     else {  // General Education

        var schoolQueryZone =
            'select geometry, SCHOOL_NAM, SCH_ID, GRADE_SPAN, FEEDS_INTO, SCHOOL_PRO from '
                + schoolKey + ' ' + whereClause;
        console.log(schoolQueryZone);

        var query = new google.visualization.Query(gQueryUrl + encodeURIComponent(schoolQueryZone));


        var schoolQueryIntersect =
            'select geometry, SCHOOL_NAM, SCH_ID, GRADE_SPAN, FEEDS_INTO, SCHOOL_PRO from '
                + schoolKey + ' ' + whereClauseIntersect;
        console.log(schoolQueryIntersect);

        var query2 = new google.visualization.Query(gQueryUrl + encodeURIComponent(schoolQueryIntersect));

        query.send(queryType1);
        query2.send(queryType2);
        query3.send(queryType3);
        query4.send(queryType4);
    }

    //setZoneLayerOnMap(zoneKey, zoneQueryResult);
}

function queryType1(response) {
    getSchoolData(response, "zone");
}

function queryType2(response) {
    getSchoolData(response, "intersect");
}

function queryType3(response) {
    getSchoolData(response, "charter");
}

function queryType4(response) {
    getSchoolData(response, "citywide");
}

function queryType5(response) {
    getSchoolData(response, "mszcitywide");
}

function getSchoolData(response, queryType) {
    var dt = response.getDataTable();
    //console.log("DT: " + dt);
    //console.log("DT: " + JSON.stringify(dt));

    var side_html = '<table style="border-collapse: collapse" border="1" \
                       cellpadding="5"> \
                       <thead> \
                         <tr style="background-color:#e0e0e0"> \
                           <th>School Name</th> \
                           <th>Grades</th> \
                         </tr> \
                       </thead> \
                       <tbody>';

    for (var i = 0; i < dt.getNumberOfRows(); i++) {
        //console.log("dt.get(i) = " + dt.getValue(i,0));

        var currentPoint = dt.getValue(i, 0);
        var latlng;

        for (var j = 0; j < currentPoint.length; j++) {
            var parser = new DOMParser();
            var item1 = parser.parseFromString(currentPoint, "text/xml");

            var strdata = item1.firstChild.firstChild.firstChild.data;
            var point = strdata.split(",");

            latlng = new google.maps.LatLng(point[1], point[0]);

        }

        var lat = latlng.Xa;
        var lng = latlng.Ya;
        var name = dt.getValue(i, 1);
        var id = dt.getValue(i, 2);
        var grades = dt.getValue(i, 3);
        var feeder = dt.getValue(i, 4);
        var link = dt.getValue(i, 5);

        var pt = new google.maps.LatLng(lat, lng);

        var html = "<strong>" + name + "</strong><br/><br/>" +
            grades+ "<br/><em>Feeds Into: </em>" +
            feeder+ "<br/>" +
            "<a href=" + link + " target=\"_blank\">"+link+ "</a>";

        /*side_html += '<tr> \
         <td><a href="javascript:myclick(' + i + ')">' + name + '</a></td> \
         <td>' + grades + '</td> \
         </tr>';*/


        createMarker(pt, html, queryType, id, name);

    }

    side_html += '</tbody></table>';

    document.getElementById("side_bar").innerHTML = side_html;
}


function createMarker(point, info, queryType, id, name) {

    var iconSize = new google.maps.Size(20, 34);
    var iconOrigin = new google.maps.Point(0, 0);
    var iconAnchor = new google.maps.Point(10, 34);
    var iconShape = [8, 33, 4, 15, 1, 15, 0, 12, 0, 5, 6, 0, 12, 0, 19, 14, 15, 15, 10, 33];

    var iconURL;

    if (queryType === 'zone' || queryType === 'msz') {
        iconURL = 'icons/Zone_schoolicon.png';
    } else if (queryType === 'intersect'){
        iconURL = 'icons/Walkzone_schoolicon.png';
    } else if (queryType === 'citywide'|| queryType === 'mszcitywide'){
        iconURL = 'icons/Citywide_schoolicon.png';
    } else if (queryType === 'charter'){
        iconURL = 'icons/Charter1_schoolicon.png';
    }

    var myIcon = new google.maps.MarkerImage(iconURL, iconSize, iconOrigin, iconAnchor);

    var markerShape = {
        coord: iconShape,
        type: 'poly'
    };

    var markerOpts = {
        id: id,
        cursor: name,
        position: point,
        //map: map,
        icon: myIcon,
        shape: markerShape
    };

    var schoolMarker = new google.maps.Marker(markerOpts);
    schoolMarker._queryType = queryType;

    //TO DO
    //search markers to see if the id already exists
    //display order - citywide, charter, walk zone, zone
    //citywide & charter will be from their own files and shouldn't be an issue
    // walk zone should be shown as walk zone, rather than zone if it is also a zone school
    var oldMarker = getMarkerById(id);
    if (oldMarker) {
        if (oldMarker._queryType === "zone" && schoolMarker._queryType === "intersect") {
            replaceMarker(oldMarker, schoolMarker);
            schoolMarker.setMap(map);
            oldMarker.setMap(null);
        }
    } else {
        addMarker(schoolMarker);
        schoolMarker.setMap(map);
    }

    google.maps.event.addListener(schoolMarker, 'click', function() {
        infoWindow.close();
        infoWindow.setContent(info);
        infoWindow.open(map, schoolMarker);
    });
}

function myclick(num) {
    google.maps.event.trigger(markers[num], "click");
    map.setCenter(markers[num].position);
}

function getMarkerById(id) {
    return searchArray(markers, "id", id, false);
}

function replaceMarker(oldMarker, newMarker) {
    var index = markers.indexOf(oldMarker);
    if (index >= 0) {
        markers.splice(index, 1, newMarker);
    }
}

function addMarker(marker) {
    if (!markers) {
        return;
    }

    markers.push(marker);
    markers.sort(
        function sorter(a, b)  {
            if (a.id > b.id)  {
                return 1;
            } else if (a.id < b.id) {
                return -1;
            } else {
                return 0;
            }
        }
    );

}

// binary search by property on an array of objects with support for case sensitivity
function searchArray(arr, property, item, case_insensitive) {
    if (typeof(arr) === 'undefined' || !arr.length) return null;

    var high = arr.length - 1;
    var low = 0,
        finalIndex = -1;

    case_insensitive = (typeof(case_insensitive) === 'undefined' || case_insensitive) ? true : false;
    item = (case_insensitive) ? item.toLowerCase() : item;

    while (low <= high && finalIndex == -1) {
        mid = parseInt((low + high) / 2);
        element = (case_insensitive) ? arr[mid][property].toLowerCase() : arr[mid][property];
        if (element > item) {
            high = mid - 1;
        } else if (element < item) {
            low = mid + 1;
        } else {
            finalIndex = mid;
        }
    }

    return (finalIndex >= 0) ? arr[finalIndex] : null;
}

