const Apify = require('apify');

Apify.main(async () => {
    // Get the queue and start with the first one
    const requestQueue = await Apify.openRequestQueue();
    //Puts RVA link in the queue
    await requestQueue.addRequest(new Apify.Request({url: 'https://www.visitrichmondva.com/event/'}));
    

    //makes a new PuppeteerCrawler Object
    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,

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
            //
            event.url = request.url;
            event.name = await page.$eval('div.inner h4', h4 => h4.innerText);
            

            // Find the link to the next page using Puppeteer functions.
            // let nextHref;
            // try {
            //     nextHref = await page.$eval('div.listingContainerFoot div.eventPagerBottom div.listFilters div.map-pager div.pagingFilterContainer div.listingPagerContainer a[class="nxt"]', el => el.href);
            //     // nextHref = await page.$eval('div.listingContainerFoot a[class="nxt"]', el => el.href);

            // } catch (err) {
            //     console.log(`${request.url} is the last page!`);
            //     return;
            // }

            // // Enqueue the link to the RequestQueue
            // await requestQueue.addRequest(new Apify.Request({ url: nextHref }));
        
          

            //target the li with the data-name:address
            
            //add more selectors here
            console.log(event);
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

