const Apify = require('apify');

Apify.main(async () => {
    // Get the queue and start with the first one
    const requestQueue = await Apify.openRequestQueue();
    //Puts RVA link in the queue
    await requestQueue.addRequest(new Apify.Request({url: 'https://www.visitrichmondva.com/event/'}));
    

    //makes a new PuppeteerCrawler Object
    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,
        maxRequestsPerCrawl: 2,

        handlePageFunction: async ({ page, request }) => {
            let event = {
                url: null,
                name: null,
                address: null,
                dates: null,
                reccurence: null,
                venue: null,
                phone: null,
                time: null,
                price: null,
                website: null,
            }

            //trying out a forEach here

              // A function to be evaluated by Puppeteer within the browser context.
              const pageFunction = ($posts) => {
                const data = [];

                // We're trying to get the title of each event on the main page.
                $posts.forEach(($post) => {
                    data.push({
                        title: $post.querySelector('div.inner h4').innerText,
                      
                    });
                });
                console.log("First: " + data);

                return data;
            };
            const data = await page.$$eval('div.inner h4', pageFunction);
            console.log("Second: " + data);

            await Apify.pushData(data);



            //add a forEach here?
            event.url = request.url;
            event.name = await page.$eval('div.inner h4', h4 => h4.innerText);
            
            //add more selectors here
            console.log(event);

              // Find the link to the next page using Puppeteer functions.
              let nextHref;
              try {
                  nextHref = await page.$eval('.nxt', el => el.href);
                  console.log("The url will now be: " + nextHref)
              } catch (err) {
                  console.log(`${request.url} is the last page!`);
                  return;
              }
  
              // Enqueue the link to the RequestQueue
              await requestQueue.addRequest(new Apify.Request({ url: nextHref }));
        },
        

        


        //If fail 4 times, then execute this:
        handleFailedRequestFunction: async ({ request }) => {
            console.log(`Request ${request.url} failed 4 times`);
        },
        
    });
    
   
    



    //Run crawler.
    await crawler.run();


});



//class .nxt is what we are looking for when wanting to 

