(function() {

    var app = window.app || {};
    
    app.Push = (function() {
		
        var init = function() {
            // initialize the Everlive API
            var el = app.everlive;
            
            // specify what push notification features we want
            // access to on the device as well as events
            var settings = {
              iOS: { badge: true, sound: true, alert: true },
              notificationCallbackIOS: function (e) {  
                   app.mobileApp.navigate("views/notifications.html");
              },
              notificationCallbackAndroid: function(e) {
                // this event gets fired for Android
              }
            };
            
            // re-registers a device with Everlive
            var reregister = function () {
              var currentDevice = el.push.currentDevice();
            
              // in case we are using the simulator, make a fake token
              if (!currentDevice.pushToken) {
                currentDevice.pushToken = "some token";
              }
            
              return el.push.currentDevice().register();
            };
            
            // add the device to Everlive
            var device = el.push.currentDevice();
            
            // enable notifications on the device 
            // this is what invokes the PushPlugin 
            device.enableNotifications(settings)
            .then(
              function () {
                // we have permission, register the device for notifications
                return device.getRegistration();    
              },
              function(err) {
                // DENIED for some reason
                console.log("Push notifications are not enabled " + err);
              })
            .then(
              function (e) {
                // this device is already registered - no need to do it again
                console.log("Device is already registered: " + JSON.stringify(e));
              },
              function (err) {
                // the device is registered, but it's been removed from Everlive
                // re-register it
                if (err.code === 801) {
                  reregister();
                }
                else {
                  console.log(JSON.stringify(err));
                }
              })
            .then(
              function (registration) {
                if (registration) {
                  // we have successfully registered and turned on push notifications
                  console.log("Successful registration");
                }
                // if there is an existing registration of the device the function will not receive 'registration' parameter
              },
              function (err) {
                console.log("ERROR! An error occured while checking device registration status: " + err.message);
              }
            );        
        };
        
        return {
            init: init,
            close: function() {
                app.mobileApp.navigate("#:back");
            }
        }
        
    }());
    
}());
