var mongoose = require('mongoose')
,	Schema = mongoose.Schema;

var uristring = "mongodb://localhost:27017/Proxyme";
mongoose.connect(uristring,function(){
	console.log('Connected to mongo at: ' + uristring);
		
});

var serviceProviderSchema = new mongoose.Schema({
	  name: String,
	  password:String,
	  email:String,
	  contactNo:Number,
	  street:String,
	  city:String,						
	  state:String,
	  country:String,
	  zipCode:Number,
	  category:String,
	  experience:Number,
	  approved:Number,
	  reviews:[],
	  services: [{
		  serviceid: String,
		  servicetype: String,
		  skills: String,
		  description: String
	    }],
	    search: [{
			  date: Date,
			  count:Number
		            
		        }],
		image:String
		    
	    
	},
	{
		versionKey: false
	});




var userSchema = new mongoose.Schema({
	  name: String,
	  password:String,
	  email:String,
	  contactNo:Number,
	  street:String,
	  city:String,						
	  state:String,
	  country:String,
	  zipcode:Number,
	  category:String,
	  fieldOfInterest:String,
	  image:String
	},
	{
		versionKey: false
	});

var adminSchema = new mongoose.Schema({
	  name: String,
	  password:String,
	  email:String
	},
	{
		versionKey: false
	});

var serviceRequestSchema = new mongoose.Schema({
	  sp_id: mongoose.Schema.Types.ObjectId,
	  customer_id: mongoose.Schema.Types.ObjectId,
	  mou_customer:String,
	  mou_sp:String,
	  status:String,
	  rating:Number,
	  comment:String
	  
	  
	},
	{
		versionKey: false
	});




//Model Creation
var Users = mongoose.model('users', userSchema);
var ServiceProviders = mongoose.model('serviceproviders', serviceProviderSchema);
var Admins = mongoose.model('admins', adminSchema);
var ServiceRequests = mongoose.model('servicerequests', serviceRequestSchema);


//Availability to the entire application
module.exports = {
		Users: Users,
		ServiceProviders: ServiceProviders,
		Admins: Admins,
		ServiceRequests: ServiceRequests
	};