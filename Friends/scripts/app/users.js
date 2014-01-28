/**
 * Users model
 */

var app = app || {};

app.Users = (function () {
    'use strict';
    
    var usersModel = (function () {
        
        var currentUser = kendo.observable({ data: null });
        var usersData = new kendo.data.DataSource({
            schema: {
                model: {
                    id: "Id"
                }
            }
        });
        
        // Retrieve current user and all users data from Everlive
        var loadUsers = function () {
            
            // Get the data about the currently logged in user
            return app.everlive.Users.currentUser()
            .then(function (data) {
                
                var currentUserData = data.result;
                currentUserData.PictureUrl = app.helper.resolveProfilePictureUrl(currentUserData.Picture);
                currentUser.set('data', currentUserData);
                
                // Get the data about all registered users
                return app.everlive.Users.get();
            })
            .then(function (data) {          
                $.each(data.result, function() {
                    this.PictureUrl = app.helper.resolveProfilePictureUrl(this.Picture);
                    this.isFrenemy = this.isFrenemy || false;
                });
                
                usersData.data(data.result);
				usersData.filter({ field: "isFrenemy", operator: "eq", value: false });
            })
            .then(null,
                  function (err) {
                      app.showError(err.message);
                  }
            );
        };
        
        var filter = function() {
            var exp = { field: "isFrenemy", operator: "eq", value: this.selectedIndex ? true : false };
            usersData.filter(exp);
        }
        
        var update = function(e) {
            var enemy = usersData.get(e.sender.element.data("id"));
            var user = currentUser.data.Id;
            
            var frenemies = app.everlive.data('Frenemies');
            
            var frenemy = frenemies.create({ "User": user.data.Id, "Enemy": enemy.Id },
				function(data) {
                    usersData.remove(enemy);
                },
				function(error) {
                    console.log(JSON.stringify(data));
                }
			);
        }
        
        return {
            load: loadUsers,
            users: function () {
                return usersData;
            },
            currentUser: currentUser,
            filter: filter,
            update: update
        };
        
    }());
    
    return usersModel;
    
}());
