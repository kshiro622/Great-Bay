var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "shiro210130",
    database: "greatbay_db"
});

connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
});

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
            // bidOnItem();
            console.log("bid");
        } else {
            console.log("Please enter 'POST AN ITEM' or 'BID ON AN ITEM'.");
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
