const pup = require("puppeteer")
let query = ["Sports","Technology","Politics"];
let map = {
    "All News" : 0,
    India:1,
    Business:2,
    Sports:3,
    World:4,
    Politics:5,
    Technology:6,
    Startup:7,
    Entertainment:8,
    Miscellaneous:9,
    Hatke:10,
    Science:11,
    Automobile:12
}

let browser;
async function main(){
     browser = await pup.launch(
        {
            headless: false,
            defaultViewport : false,
            args : ["--start-maximized"]
        }
    );
    let pages = await browser.pages();
     tab = pages[0];
    await tab.goto("https://inshorts.com/en/read");

    
    
    // console.log(li.length)
    for(let q of query){
        await tab.click(".c-hamburger.c-hamburger--htx");
        await tab.waitForSelector(".category-list a li",{visible :true})
        let li = await tab.$$(".category-list a li");
        await tab.waitFor(4000);
        let index = map[q];
        // console.log(index);
    
        await li[index].click();
        // await tab.evaluate(()=>document.querySelector('.category-list a li').click())
    
        
        await tab.waitForSelector(".news-card.z-depth-1",{visible :true})
        let newsprom = await tab.$$(".news-card.z-depth-1");
        let finalString ="";
        for(let i in newsprom){
            let headlineprom = await newsprom[i].$$("span[itemprop='headline']")
            // console.log(headlineprom.length)
            let headline = await tab.evaluate(function(ele){
                return ele.textContent;
            },headlineprom[0]);
            // console.log(headline);
            let articleprom = await newsprom[i].$$("div[itemprop='articleBody']")
            // console.log(articleprom.length)
            let article = await tab.evaluate(function(ele){
                return ele.textContent;
            },articleprom[0]);
            // console.log(article);
            let headingno = Number(i)+1;
            console.log(headingno);
             finalString = finalString+ "\n\nHeadline " + headingno  +", "+ headline + ".\n Brief Summary :  " + article;
            
            if(i == 1){
                break;
            }
        }
        
         whatsapp(finalString,q)
         await textToSpeech(finalString,q);
       
    }
    

    
}
async function textToSpeech(finalString,q){
    let newpage= await browser.newPage();
    await newpage.setDefaultNavigationTimeout(0); 
    await newpage.goto("https://www.naturalreaders.com/online/");
    

        await newpage.waitForSelector("#inputDiv");
        // let tbox = await tab.$$(".input-textbox")
        await newpage.click("#inputDiv");
        await newpage.keyboard.down('Control');
        await newpage.keyboard.press('A');
        await newpage.keyboard.up('Control');
        await newpage.keyboard.press('Backspace');
    //await page.keyboard.type('foo');
        let newString =  q + "\n" + finalString
        await newpage.type("#inputDiv",newString);
        await newpage.click("svg.icon-xl");
        setTimeout(function(){
            return newpage.close();
        },20000)
        // await newpage.waitForSelector(".circle.ng-star-inserted",{visible :false});
        
        
}
async function whatsapp(finalString,q){
    let newpage= await browser.newPage();
    // let newtab = newpage[0];
    await newpage.setDefaultNavigationTimeout(0); 
    await newpage.goto("https://web.whatsapp.com/");
    await newpage.waitFor(10000)
    await newpage.waitForSelector("._2_1wd.copyable-text.selectable-text",{visible:true});
    // await newtab.click(".SgIJV");
    await newpage.type("._2_1wd.copyable-text.selectable-text","daily")
    await newpage.keyboard.press("Enter")
    await newpage.waitForSelector("._1JAUF._2x4bz .OTBsx")
    let newString = "---- " + q + " ----\n" + finalString
    await newpage.type("._1JAUF._2x4bz .OTBsx",newString)
    await newpage.keyboard.press("Enter")
    await newpage.close();

}

main();