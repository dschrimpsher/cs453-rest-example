const soap = require('soap');
const url = 'http://soapapp:8000/SSNLookup?wsdl';


function getCustomer(xml) {
  return new Promise ((resolve, reject) => {
    soap.createClient(url, function (err, client) {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.log(client.describe());
      client.MyService.MyPort.SSNLookup(xml, function(err, result, rawResponse, soapHeader, rawRequest) {
        console.log('SOAP: ', result);
        return resolve(result)
      })
    });
  });
}

const getCustomerInfo =  async(customer) => {
  try {
    console.log(customer);
    const info = await getCustomer(customer);
    return info;
  } catch (error) {
    return error;
  }
}

module.exports = getCustomerInfo;
