(function() {
    
    var app = window.app || {};
    
    app.Frenemies = (function() {
        
        var users = new kendo.data.DataSource({
			type: 'everlive',
            transport: {
                typeName: 'Users'
            },
            schema: {
                parse: function(data) {
					$.each(data.Result, function() {
                        var currentUser = app.Users.currentUser.data;
                        this.PictureUrl = app.helper.resolveProfilePictureUrl(this.Picture);
                        this.IsFrenemy = $.inArray(this.Id, currentUser.Frenemies || {}) > -1;
					});  
                   
                    return data;
                },
                model: {
                    id: Everlive.idField
                }
            },
            filter: { field: "IsFrenemy", value: false }
        });
        
        var filter = function() {
            users.filter({ field: "IsFrenemy", operator: "eq", value: this.selectedIndex ? true : false });
        }
        
        var frenemize = function(e) {
            
            var user = users.get(app.Users.currentUser.data.Id);
            var frenemy = users.get(e.sender.element.data("id"));
            
            var frenemies = user.get("Frenemies") || [];
            var li = e.sender.element.closest("li");
            
            frenemies.push(frenemy.Id);
            
            user.set("Frenemies", frenemies);
            frenemy.set("IsFrenemy", true);
            
            kendo.fx(li).expand("vertical").reverse().then(function() {
            	users.sync();
            });
        };
        
        return {
            users: users,
            frenemize: frenemize,
            filter: filter
        }
        
    }());
    
}());