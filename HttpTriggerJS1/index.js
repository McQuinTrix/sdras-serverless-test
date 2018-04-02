var stripe = require('stripe')('sk_test_g1iMYHtXXJDrupRQMyCrWhC7');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body 
        && req.body.stripeEmail
        && req.body.stripeToken 
        && req.body.stripeAmt) {

            stripe.customers
                .create({
                    
                    email: req.body.stripeEmail,
                    source: req.body.stripeToken
                }).then(customer => {
                    context.log('Starting the stripe charges');
                    stripe.charges.create({
                        amount: req.body.stripeAmt,
                        description: 'Sample Charge',
                        currency: 'usd',
                        customer: customer.id
                    });
                }).then(charge => {
                    context.log('finished the stripe charges');
                    context.res = {
                        body: 'This has been completed'
                    };
                    context.done();
                })
                .catch(err => {
                    context.log(err);
                    context.done();
                });
    }else {
        context.log(req.body);
        context.res = {
            status: 400,
            body: "We're missing something"
        };
        context.done();
    }
};