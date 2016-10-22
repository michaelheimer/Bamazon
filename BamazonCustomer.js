// Home work # 12 Bamazon


var inquirer = require('inquirer');
var mysql 	 = require('mysql');
var figlet   = require('figlet');
var Table    = require('cli-table2');

var conn = mysql.createConnection(
{
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'depaul',
	database: 'bamazon' 
});
 
console.log("-----------------------------------------------------------------------------------------------------------");

figlet('Welcome to Bamazon', function(err, data) 
{
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});
console.log("-----------------------------------------------------------------------------------------------------------");


conn.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + conn.threadId);
})


 function buyAgain()
 {
    inquirer.prompt([
    {
            message: 'Would you like to make another purchase?',
            type: 'confirm',
            name: 'buyMore'
    }]).then(function(answers) 
    {
            if (answers.buyMore) 
            {
                start();
            } else 
            {
            	conn.end()
                process.exit();
            }
    });
};

function start()
{
  conn.query('SELECT * FROM products', function(err, res) 
  {
     if (err) throw err;
     var table2 = new Table(
     {
       head: ['ItemID', 'Product', 'Price'] , colWidths: [10, 80, 20]
     });
   
     for(var i =0; i < res.length; i++)
     {
       table2.push([res[i].ItemID, res[i].ProductName,'$ ' + res[i].price]);
     }
    console.log(table2.toString());
    
     inquirer.prompt([
	  {
	    name: "id",
	    message: "What is ID of the product you would like to purchase?"
	   },
	   {
	    name: "quanity",
	    message: "How may would you like to buy?"
	    }, ]).then(function(answers)
	    { 

	    	if(res[answers.id].StockQuantity >= answers.quanity)
	    	{    
           console.log('your total cost is $ ' +(answers.quanity * res[answers.id].price));
               // update table ******
           conn.query("UPDATE products SET ? WHERE ?", [
           {
            StockQuantity: (answers.quanity - res[answers.id].StockQuantity)
           }, 
           {
             ItemID :res[answers.id].ItemID  
           }], function(err, res) {console.log(err)});

           buyAgain();      
	    	}
	    	else
	    	{
	    		console.log("sorry, we only have " + res[answers.id].StockQuantity);
          buyAgain();
	    	}
	    	
	    })
  });
}
start();