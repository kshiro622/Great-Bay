//npm packages
var mysql = require("mysql");
var inquirer = require("inquirer");

//database connection info
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "shiro210130",
    database: "greatbay_db"
});

//connects to database
connection.connect(function(err) {
    if (err) throw err;
});

//initializes app
initialize();

//FUNCTIONS
function initialize() {
    inquirer.prompt([{
        name: "action",
        message: "What would you like to do?",
        type: "list",
        choices: ["POST AN ITEM", "BID ON AN ITEM"]
    }]).then(function(answers) {
        if (answers.action === "POST AN ITEM") {
            postItem();
        } else if (answers.action === "BID ON AN ITEM") {
            bidOnItem();
        }
    });
}

function postItem() {
    inquirer.prompt([{
        name: "name",
        message: "Enter your name."
    }, {
        name: "item",
        message: "Enter item you are posting."
    }, {
        name: "bid",
        message: "Enter starting bid."
    }]).then(function(answers) {
        connection.query("INSERT INTO bids SET ?", {
            item: answers.item,
            bid: answers.bid,
            item_poster: answers.name
        }, function(err, res) {
            if (err) {
                throw err;
            } else {
                console.log("Your item has been posted.");
                initialize();
            }

        });
    });
}

function bidOnItem() {
    connection.query("SELECT item FROM bids", function(err, res) {
        if (err) throw err;
        var itemsArr = [];
        for (var i = 0; i < res.length; i++) {
            itemsArr.push(res[i].item);
        }
        inquirer.prompt([{
            name: "item",
            message: "Select an item to bid on.",
            type: "list",
            choices: itemsArr
        }]).then(function(answers) {
            var selectedItem = answers.item;
            inquirer.prompt([{
                name: "bidder",
                message: "Enter your name."
            }, {
                name: "bid",
                message: "Enter your bid."
            }]).then(function(answers) {
                connection.query("SELECT bid FROM bids WHERE item=\'" + selectedItem + "\'", function(err, res) {
                    if (err) throw err;
                    if (res[0].bid < answers.bid) {
                        connection.query("UPDATE bids SET ? WHERE ?", [{
                            high_bidder: answers.bidder,
                            bid: answers.bid
                        }, {
                            item: selectedItem
                        }], function(err, res) {
                            if (err) throw err;
                            console.log("Congrats, you are now the highest bidder for " + selectedItem + " with a bid of " + answers.bid);
                            initialize();
                        });
                    } else {
                        console.log("Sorry, that bid is not high enough.");
                        initialize();
                    }
                });
            });
        });
    });
}
