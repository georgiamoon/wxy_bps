
(function () {

	var parser = new DOMParser();
	
	var zoneScenarios = {
		'sixZ': {
		    zoneNum: "six",
		    scenario: "gened",
		   	schoolKey: "1HIL5eYvKwic6bvOHM8StEhdH_PVmk2K2Op59lgc", 
     	    zoneKey: "1JouUBlL3ZlGC8TAsRXEPeqQyrmIMx3acgdO-Jo0"		   	
		}, 
		'nineZ': {
		   zoneNum: "nine",
		   scenario: "gened",
		   schoolKey: "1JeHVt0yTFcgjmTS5JPcfsybgfRxVSkn2xZhxRM0",
           zoneKey: "1gqE8zik8SGPUGo5TeVPrlPgD23ZrWwL6Q5bJfnU"
		   
		},
		'elevenZ': {
		   zoneNum: "eleven",
		   scenario: "gened",
		   schoolKey: "1g2WTYFk3vbYJ1d8_mMrcfWQRylLczT-wafYbnAY",
           zoneKey: "1i6CgHn4CNukzT_AcNJUoBcS7PgxWFE4kCQTPbU8"
		   	   
		},
		'ell': {
		   zoneNum: "NA",
		   scenario: "ell",
		   schoolKey: "1Aw_ciWLdLxeJOu3XiTCj0hkj_yps2BOXDZoEb40",
		   zoneKey: "1vHRlXwYLozifwaBgcXbnLd5d3Be4XT65NfWthX0"
		  
		},
		'sped': {
		   zoneNum: "NA",
		   scenario: "sped",
		   schoolKey: "1yb2F7iyZ-_DbKM8jcoR1MBzgd5V4vjAUBueH23A",
		   zoneKey: "1BLm4bd-ejBBT8PtOu9lanCjCIZcCCY_c14059mg"		  
		}  
    };
	
	// returns a tuple array of the latitude and longitude parsed from KML	
	var parsePointFromHtml = function() {
      	var item1 = parser.parseFromString(currentPoint, "text/xml");  	
      	var strdata = item1.firstChild.firstChild.firstChild.data;
      	return strdata.split(",");
	};
	
})();