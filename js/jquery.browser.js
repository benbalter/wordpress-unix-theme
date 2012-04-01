/*!
jQuery Browser Plugin
	* Version 2.3
	* 2008-09-17 19:27:05
	* URL: http://jquery.thewikies.com/browser
	* Description: jQuery Browser Plugin extends browser detection capabilities and can assign browser selectors to CSS classes.
	* Author: Nate Cavanaugh, Minhchau Dang, & Jonathan Neal
	* Copyright: Copyright (c) 2008 Jonathan Neal under dual MIT/GPL license.
*/
(function(b){b.browserTest=function(c,e){var f=function(b,a){for(var d=0;d<a.length;d+=1)b=b.replace(a[d][0],a[d][1]);return b},g=function(c,a,d,e){a={name:f((a.exec©||["unknown","unknown"])[1],d)};a[a.name]=!0;a.version=(e.exec©||["X","X","X","X"])[3];a.name.match(/safari/)&&400<a.version&&(a.version="2.0");"presto"===a.name&&(a.version=9.27<b.browser.version?"futhark":"linear_b");a.versionNumber=parseFloat(a.version,10)||0;a.versionX="X"!==a.version?(a.version+"").substr(0,1):"X";a.className=
a.name+a.versionX;return a},c=(c.match(/Opera|Navigator|Minefield|KHTML|Chrome/)?f(c,[[/(Firefox|MSIE|KHTML,\slike\sGecko|Konqueror)/,""],["Chrome Safari","Chrome"],["KHTML","Konqueror"],["Minefield","Firefox"],["Navigator","Netscape"]]):c).toLowerCase();b.browser=b.extend(!e?b.browser:{},g(c,/(camino|chrome|firefox|netscape|konqueror|lynx|msie|opera|safari)/,[],/(camino|chrome|firefox|netscape|netscape6|opera|version|konqueror|lynx|msie|safari)(\/|\s)([a-z0-9\.\+]*?)(\;|dev|rel|\s|$)/));b.layout=
g(c,/(gecko|konqueror|msie|opera|webkit)/,[["konqueror","khtml"],["msie","trident"],["opera","presto"]],/(applewebkit|rv|konqueror|msie)(\:|\/|\s)([a-z0-9\.]*?)(\;|\)|\s)/);b.os={name:(/(win|mac|linux|sunos|solaris|iphone)/.exec(navigator.platform.toLowerCase())||["unknown"])[0].replace("sunos","solaris")};e||b("html").addClass([b.os.name,b.browser.name,b.browser.className,b.layout.name,b.layout.className].join(" "))};b.browserTest(navigator.userAgent)})(jQuery);