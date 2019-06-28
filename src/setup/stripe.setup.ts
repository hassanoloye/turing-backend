import {stripeApiKey} from "../config";
const stripe = require("stripe");

export default stripe(stripeApiKey)
