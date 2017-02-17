/**
 * Module dependencies.
 */

var express = require('express')
,routes = require('./routes')
,cookieParser = require('cookie-parser')
,http = require('http')
,path = require('path')
,favicon = require('serve-favicon')
, fs = require('fs');

//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/Proxyme";
var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(expressSession);
var mongo = require("./routes/model");
var mongoNative = require("./routes/mongo");
var signup = require("./routes/signup");
var login = require("./routes/login");
var service = require("./routes/service");
var service1 = require("./routes/service1");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

app.use(expressSession({
	secret: 'cmpe273_teststring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));
app.use(app.router);

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());	
}
app.get('/', routes.index);
app.get('/logout', routes.logout);
app.post('/signUpSP',signup.addServiceProvider);
app.post('/signUpCustomer',signup.addCustomer);
app.post('/login',login.login);
app.get('/login1',routes.logout);

app.get('/getSignUpAsSP',signup.redirecttoSPSignup); 
app.get('/getSignUpAsCustomer',signup.redirecttoCustomerSignup); 
app.get('/getAdminLogin',signup.redirecttoAdminSignup); 
app.post('/adminLogin',login.redirecttoAdminLogin); 
app.post('/addService',service1.addService); 
app.post('/fetchService',service1.fetchService); 
app.get('/getPendingRequest',service1.getPendingRequest); 
app.post('/approveSP',service1.approveSP); 
app.post('/rejectSP',service1.rejectSP); 

//by bhavin
app.post('/fetchSPDetails',service.fetchSPDetails);
app.post('/showSPDetails',service.showSPDetails);
app.post('/fetchCommonGraphParameters',service.fetchCommonGraphParameters);
app.post('/fetchServiceWiseGraphParameters',service.fetchServiceWiseGraphParameters);
app.post('/requestSP',service.requestSP);
app.get('/viewRequestHistory',service.viewRequestHistory);
app.post('/addReview',service.addReview);
app.get('/viewCustomerRequests',service.viewCustomerRequests);
app.post('/approveRequest',service.approveRequest);


//app.post('signupCustomer',signup.addCustomer);
/*http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
*/

mongoNative.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});